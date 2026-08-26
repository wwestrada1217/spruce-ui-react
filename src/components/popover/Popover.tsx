/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Popover.css';
import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  isValidElement,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../i18n/i18n-context.js';
import {
  computePosition,
  getScrollParents,
  modalBoundary,
  onEscapeCapture,
  type Placement,
  type PositionAnchor,
} from '../../utils/positioning.js';

export type PopoverTriggerType = 'click' | 'hover';

interface OpenPopoverEntry {
  containsTarget: (target: Node | null) => boolean;
}

const openPopovers: OpenPopoverEntry[] = [];

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: Placement;
  triggerType?: PopoverTriggerType;
  offset?: number;
  arrow?: boolean;
  showArrow?: boolean;
  constrainToModal?: boolean;
  dismissOnScroll?: boolean;
  anchorRect?: DOMRectReadOnly | null;
  dismissOnClickOutside?: boolean;
  panelClassName?: string;
  padding?: string;
  panelAriaLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hoverDelay?: number;
  hoverCloseDelay?: number;
  className?: string;
}

interface PopoverTriggerProps {
  'aria-expanded'?: boolean;
  'aria-haspopup'?: string;
}

/** A smart-positioned, controlled-friendly floating panel. */
export function Popover({
  trigger,
  children,
  placement = 'bottom',
  triggerType = 'click',
  offset = 6,
  arrow = false,
  showArrow,
  constrainToModal = true,
  dismissOnScroll = true,
  anchorRect = null,
  dismissOnClickOutside = true,
  panelClassName = '',
  padding,
  panelAriaLabel = 'Popover',
  open: controlledOpen,
  onOpenChange,
  hoverDelay = 200,
  hoverCloseDelay = 150,
  className = '',
}: PopoverProps) {
  const { isRtl } = useI18n();
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);
  const popoverId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [activePlacement, setActivePlacement] = useState<Placement>(placement);
  const [arrowPos, setArrowPos] = useState<{ axis: 'x' | 'y'; px: number } | null>(null);
  const [ready, setReady] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen ?? false : internalOpen;
  const hasArrow = showArrow ?? arrow;

  const setOpen = useCallback(
    (next: boolean) => {
      if (next) setReady(false);
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const clearHoverTimers = useCallback(() => {
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverOpenTimer.current = null;
    hoverCloseTimer.current = null;
  }, []);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const boundary = constrainToModal ? modalBoundary(anchor) : undefined;
    const result = computePosition(
      anchorRect ?? (anchor as PositionAnchor),
      panel,
      placement,
      hasArrow ? Math.max(offset, 8) : offset,
      boundary,
      isRtl ? 'rtl' : 'ltr',
    );
    setCoords({ top: result.top, left: result.left });
    setActivePlacement(result.placement);
    if (hasArrow) {
      const anchorBounds = anchor.getBoundingClientRect();
      const panelBounds = panel.getBoundingClientRect();
      const side = result.placement.split('-')[0];
      if (side === 'top' || side === 'bottom') {
        const raw = anchorBounds.left + anchorBounds.width / 2 - result.left - 5;
        const max = Math.max(10, panelBounds.width - 20);
        setArrowPos({ axis: 'x', px: Math.max(10, Math.min(max, raw)) });
      } else {
        const raw = anchorBounds.top + anchorBounds.height / 2 - result.top - 5;
        const max = Math.max(10, panelBounds.height - 20);
        setArrowPos({ axis: 'y', px: Math.max(10, Math.min(max, raw)) });
      }
    } else {
      setArrowPos(null);
    }
    setReady(true);
  }, [anchorRect, constrainToModal, hasArrow, isRtl, offset, placement]);

  useEffect(() => {
    if (!isOpen) {
      const frame = requestAnimationFrame(() => setReady(false));
      return () => cancelAnimationFrame(frame);
    }
    rafId.current = requestAnimationFrame(reposition);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [isOpen, reposition]);

  useEffect(() => {
    if (!isOpen) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const onScroll = () => {
      if (dismissOnScroll) setOpen(false);
      else {
        if (rafId.current !== null) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(reposition);
      }
    };
    const parents = getScrollParents(anchor);
    parents.forEach((parent) => parent.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      parents.forEach((parent) => parent.removeEventListener('scroll', onScroll));
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissOnScroll, isOpen, reposition, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const entry: OpenPopoverEntry = {
      containsTarget: (target) =>
        !!target && (!!anchorRef.current?.contains(target) || !!panelRef.current?.contains(target)),
    };
    openPopovers.push(entry);
    const closeIfOutside = (event: MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (!dismissOnClickOutside || entry.containsTarget(target)) return;
      const index = openPopovers.indexOf(entry);
      for (let i = index + 1; i < openPopovers.length; i += 1) {
        if (openPopovers[i].containsTarget(target)) return;
      }
      setOpen(false);
    };
    const timer = window.setTimeout(() => document.addEventListener('click', closeIfOutside, true), 0);
    const removeEscape = onEscapeCapture((event) => {
      if (openPopovers[openPopovers.length - 1] !== entry) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', closeIfOutside, true);
      removeEscape();
      const index = openPopovers.indexOf(entry);
      if (index !== -1) openPopovers.splice(index, 1);
    };
  }, [dismissOnClickOutside, isOpen, setOpen]);

  useEffect(() => () => clearHoverTimers(), [clearHoverTimers]);

  const scheduleOpen = () => {
    if (triggerType !== 'hover') return;
    clearHoverTimers();
    hoverOpenTimer.current = setTimeout(() => setOpen(true), hoverDelay);
  };

  const scheduleClose = (event?: FocusEvent<HTMLDivElement>) => {
    if (triggerType !== 'hover') return;
    const related = event?.relatedTarget;
    if (related instanceof Node && (anchorRef.current?.contains(related) || panelRef.current?.contains(related))) return;
    clearHoverTimers();
    hoverCloseTimer.current = setTimeout(() => setOpen(false), hoverCloseDelay);
  };

  const side = activePlacement.split('-')[0];
  const renderedTrigger = isValidElement<PopoverTriggerProps>(trigger)
    ? cloneElement(trigger as ReactElement<PopoverTriggerProps>, {
      'aria-expanded': isOpen,
      'aria-haspopup': trigger.props['aria-haspopup'] ?? 'dialog',
    })
    : trigger;
  const arrowStyle = arrowPos?.axis === 'x'
    ? { left: arrowPos.px }
    : arrowPos?.axis === 'y'
      ? { top: arrowPos.px }
      : undefined;

  return (
    <>
      <div
        ref={anchorRef}
        className={['sp-popover-anchor', className].filter(Boolean).join(' ')}
        data-sp-overlay-anchor={popoverId}
        aria-haspopup="dialog"
        onClick={() => triggerType === 'click' && setOpen(!isOpen)}
        onMouseEnter={scheduleOpen}
        onMouseLeave={() => scheduleClose()}
        onFocusCapture={scheduleOpen}
        onBlurCapture={scheduleClose}
      >
        {renderedTrigger}
      </div>
      {isOpen && createPortal(
        <div
          className="sp-popover-outer"
          data-sp-overlay-owner={popoverId}
          data-sp-overlay-interactive="true"
          style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 1100, visibility: ready || isOpen ? 'visible' : 'hidden' }}
          onMouseEnter={triggerType === 'hover' ? scheduleOpen : undefined}
          onMouseLeave={triggerType === 'hover' ? () => scheduleClose() : undefined}
          onFocusCapture={triggerType === 'hover' ? scheduleOpen : undefined}
          onBlurCapture={triggerType === 'hover' ? scheduleClose : undefined}
        >
          {hasArrow && <div className="sp-popover-arrow" data-popover-side={side} style={arrowStyle} aria-hidden="true" />}
          <div
            ref={panelRef}
            className={['sp-popover-panel', hasArrow && 'sp-popover-panel--has-arrow', panelClassName].filter(Boolean).join(' ')}
            style={padding != null ? { padding } : undefined}
            role="dialog"
            aria-label={panelAriaLabel}
          >
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
