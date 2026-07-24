/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Popover.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  computePosition,
  getScrollParents,
  onClickOutside,
  type Placement,
} from '../../utils/positioning.js';

export type PopoverTriggerType = 'click' | 'hover';

export interface PopoverProps {
  /** The element that opens the popover when interacted with. */
  trigger: ReactNode;
  /** Content rendered inside the popover panel. */
  children: ReactNode;
  /** Preferred placement relative to the trigger. */
  placement?: Placement;
  /** How the popover is opened — `'click'` (default) or `'hover'`. */
  triggerType?: PopoverTriggerType;
  /** Gap in pixels between the trigger and the panel. */
  offset?: number;
  /** Show a directional arrow on the panel. */
  arrow?: boolean;
  /** Close the popover when clicking outside. */
  dismissOnClickOutside?: boolean;
  /** Extra CSS class applied to the panel element. */
  panelClassName?: string;
  /** Override the panel's default padding (CSS value, e.g. `'0'`). */
  padding?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Delay in ms before opening on hover. */
  hoverDelay?: number;
  /** Delay in ms before closing on hover-out. */
  hoverCloseDelay?: number;
}

/**
 * A floating panel anchored to a trigger element.
 *
 * @example
 * ```tsx
 * <Popover trigger={<Button>More info</Button>} placement="bottom">
 *   <p>Details go here.</p>
 * </Popover>
 * ```
 */
export function Popover({
  trigger,
  children,
  placement = 'bottom',
  triggerType = 'click',
  offset = 6,
  arrow = false,
  dismissOnClickOutside = true,
  panelClassName = '',
  padding,
  open: controlledOpen,
  onOpenChange,
  hoverDelay = 200,
  hoverCloseDelay = 150,
}: PopoverProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [arrowSide, setArrowSide] = useState('bottom');
  const [ready, setReady] = useState(false);
  const rafId = useRef(0);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? (controlledOpen ?? false) : internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const effectiveOffset = arrow ? Math.max(offset, 8) : offset;
    const result = computePosition(anchor, panel, placement, effectiveOffset);
    setCoords({ top: result.top, left: result.left });
    setArrowSide(result.placement.split('-')[0]);
    setReady(true);
  }, [arrow, offset, placement]);

  // Position floating panel after open
  useEffect(() => {
    if (!isOpen) {
      setReady(false);
      return;
    }
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [isOpen, reposition]);

  // Re-position on scroll
  useEffect(() => {
    if (!isOpen) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const scrollables = getScrollParents(anchor);
    const onScroll = () => {
      rafId.current = requestAnimationFrame(reposition);
    };
    scrollables.forEach((el) => el.addEventListener('scroll', onScroll, { passive: true }));
    return () => {
      scrollables.forEach((el) => el.removeEventListener('scroll', onScroll));
      cancelAnimationFrame(rafId.current);
    };
  }, [isOpen, reposition]);

  // Click-outside to dismiss
  useEffect(() => {
    if (!isOpen || !dismissOnClickOutside) return;
    const els = [anchorRef.current, panelRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, () => setOpen(false));
  }, [isOpen, dismissOnClickOutside, setOpen]);

  // Hover timers cleanup
  useEffect(
    () => () => {
      if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    },
    [],
  );

  function clearHoverTimers() {
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
  }

  function handleTriggerClick() {
    if (triggerType === 'click') setOpen(!isOpen);
  }

  function handleMouseEnter() {
    if (triggerType !== 'hover') return;
    clearHoverTimers();
    hoverOpenTimer.current = setTimeout(() => setOpen(true), hoverDelay);
  }

  function handleMouseLeave() {
    if (triggerType !== 'hover') return;
    clearHoverTimers();
    hoverCloseTimer.current = setTimeout(() => setOpen(false), hoverCloseDelay);
  }

  const panelClasses = ['sp-popover-panel', panelClassName].filter(Boolean).join(' ');

  return (
    <>
      <div
        ref={anchorRef}
        className="sp-popover-anchor"
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 999,
              opacity: ready ? 1 : 0,
            }}
            onMouseEnter={triggerType === 'hover' ? handleMouseEnter : undefined}
            onMouseLeave={triggerType === 'hover' ? handleMouseLeave : undefined}
          >
            {arrow && (
              <div
                className="sp-popover-arrow"
                data-popover-side={arrowSide}
                aria-hidden
              />
            )}
            <div
              ref={panelRef}
              className={panelClasses}
              style={padding != null ? { padding } : undefined}
            >
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
