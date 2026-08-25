/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Tooltip.css';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../i18n/i18n-context.js';
import { computePosition, type Placement } from '../../utils/positioning.js';

interface TooltipGroupContextValue {
  getDelay: (fallback: number) => number;
  notifyEnter: () => void;
  markShown: (id: string, hide: () => void) => void;
}

const TooltipGroupContext = createContext<TooltipGroupContextValue | null>(null);

export interface TooltipGroupProps {
  children: ReactNode;
  /** Cold-start delay before the first tooltip appears. */
  initialDelay?: number;
  /** How long the group remains warm after the pointer/focus leaves. */
  gracePeriod?: number;
  className?: string;
}

/** Makes related tooltips warm after the first one, matching Angular's group behavior. */
export function TooltipGroup({
  children,
  initialDelay = 600,
  gracePeriod = 300,
  className = '',
}: TooltipGroupProps) {
  const warm = useRef(false);
  const current = useRef<{ id: string; hide: () => void } | null>(null);
  const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearGrace = () => {
    if (graceTimer.current) clearTimeout(graceTimer.current);
    graceTimer.current = null;
  };
  const value: TooltipGroupContextValue = {
    getDelay: (fallback) => (warm.current ? 0 : Math.max(0, Math.max(initialDelay, fallback))),
    notifyEnter: () => clearGrace(),
    markShown: (id, hide) => {
      clearGrace();
      if (current.current && current.current.id !== id) current.current.hide();
      current.current = { id, hide };
      warm.current = true;
    },
  };

  useEffect(() => () => {
    clearGrace();
    current.current?.hide();
  }, []);

  const notifyGroupLeft = () => {
    clearGrace();
    graceTimer.current = setTimeout(() => {
      warm.current = false;
      current.current = null;
    }, gracePeriod);
  };

  return (
    <TooltipGroupContext.Provider value={value}>
      <div
        className={className}
        onMouseEnter={value.notifyEnter}
        onMouseLeave={notifyGroupLeft}
        onFocusCapture={value.notifyEnter}
        onBlurCapture={(event) => {
          const related = event.relatedTarget;
          if (!(related instanceof Node) || !event.currentTarget.contains(related)) notifyGroupLeft();
        }}
      >
        {children}
      </div>
    </TooltipGroupContext.Provider>
  );
}

export interface TooltipProps {
  content: string;
  placement?: Placement;
  offset?: number;
  arrow?: boolean;
  className?: string;
  /** Initial hover/focus delay in milliseconds. */
  delay?: number;
  children: ReactNode;
}

let tooltipId = 0;

/** A localized, accessible tooltip shown from hover or keyboard focus. */
export function Tooltip({
  content,
  placement = 'top',
  offset = 6,
  arrow = false,
  className = '',
  delay = 200,
  children,
}: TooltipProps) {
  const { isRtl } = useI18n();
  const group = useContext(TooltipGroupContext);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const generatedId = useId();
  const tooltipElementIdRef = useRef<string | null>(null);
  if (!tooltipElementIdRef.current) {
    tooltipElementIdRef.current = `sp-tooltip-${++tooltipId}-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  }
  const tooltipElementId = tooltipElementIdRef.current as string;
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const [activePlacement, setActivePlacement] = useState<Placement>(placement);
  const [ready, setReady] = useState(false);

  const isDisabled = () => {
    const host = anchorRef.current?.firstElementChild;
    return host instanceof HTMLElement && (host.hasAttribute('disabled') || host.getAttribute('aria-disabled') === 'true');
  };

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setOpen(false);
    setReady(false);
  }, []);

  const show = () => {
    if (!content || isDisabled()) return;
    group?.notifyEnter();
    if (timerRef.current) clearTimeout(timerRef.current);
    const wait = group?.getDelay(delay) ?? delay;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setOpen(true);
      setReady(false);
      group?.markShown(tooltipElementId, hide);
    }, Math.max(0, wait));
  };

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatRef.current;
    if (!anchor || !floating) return;
    const result = computePosition(anchor, floating, placement, arrow ? Math.max(offset, 8) : offset, undefined, isRtl ? 'rtl' : 'ltr');
    setCoords({ top: result.top, left: result.left });
    setActivePlacement(result.placement);
    setReady(true);
  }, [arrow, isRtl, offset, placement]);

  useEffect(() => {
    if (!open) return;
    rafRef.current = requestAnimationFrame(reposition);
    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(reposition);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open, reposition]);

  useEffect(() => {
    const trigger = anchorRef.current?.firstElementChild;
    if (!(trigger instanceof HTMLElement)) return;
    if (open) trigger.setAttribute('aria-describedby', tooltipElementId);
    else if (trigger.getAttribute('aria-describedby') === tooltipElementId) trigger.removeAttribute('aria-describedby');
    return () => {
      if (trigger.getAttribute('aria-describedby') === tooltipElementId) trigger.removeAttribute('aria-describedby');
    };
  }, [open, tooltipElementId]);

  useEffect(() => () => hide(), [hide]);

  const side = activePlacement.split('-')[0];
  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    const related = event.relatedTarget;
    if (!(related instanceof Node) || !anchorRef.current?.contains(related)) hide();
  };
  const handleMouseLeave = () => hide();

  return (
    <>
      <span
        ref={anchorRef}
        style={{ display: 'inline-flex', verticalAlign: 'middle' }}
        onMouseEnter={show}
        onMouseLeave={handleMouseLeave}
        onFocus={show}
        onBlur={handleBlur}
      >
        {children}
      </span>
      {open && createPortal(
        <div
          ref={floatRef}
          id={tooltipElementId}
          className={['sp-tooltip', arrow && `sp-tooltip--${side}`, arrow && 'sp-tooltip--arrow', className].filter(Boolean).join(' ')}
          role="tooltip"
          style={{ position: 'fixed', top: coords.top, left: coords.left, opacity: ready ? 1 : 0 }}
        >
          {content}
          {arrow && <span className="sp-tooltip__arrow" aria-hidden="true" />}
        </div>,
        document.body,
      )}
    </>
  );
}
