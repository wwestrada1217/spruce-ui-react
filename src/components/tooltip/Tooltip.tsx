import './Tooltip.css';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { computePosition, type Placement } from '../../utils/positioning.js';

export interface TooltipProps {
  /** Text content displayed in the tooltip. */
  content: string;
  /** Preferred placement relative to the anchor element. */
  placement?: Placement;
  /** Gap in pixels between the anchor and the floating tooltip. */
  offset?: number;
  /** Show a small directional arrow. */
  arrow?: boolean;
  /** Additional CSS class applied to the tooltip bubble. */
  className?: string;
  /** The element that triggers the tooltip on hover/focus. */
  children: ReactNode;
}

/**
 * Wraps any element and shows a floating text label on hover or focus.
 *
 * @example
 * ```tsx
 * <Tooltip content="Save changes" placement="top">
 *   <Button>Save</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  placement = 'top',
  offset = 6,
  arrow = false,
  className = '',
  children,
}: TooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const [activePlacement, setActivePlacement] = useState<Placement>(placement);
  const [ready, setReady] = useState(false);
  const rafId = useRef(0);

  useEffect(() => {
    setActivePlacement(placement);
  }, [placement]);

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }

    rafId.current = requestAnimationFrame(() => {
      const anchor = anchorRef.current;
      const float = floatRef.current;
      if (!anchor || !float) return;
      const effectiveOffset = arrow ? Math.max(offset, 8) : offset;
      const result = computePosition(anchor, float, placement, effectiveOffset);
      setCoords({ top: result.top, left: result.left });
      setActivePlacement(result.placement);
      setReady(true);
    });

    return () => cancelAnimationFrame(rafId.current);
  }, [open, arrow, offset, placement]);

  function show() {
    if (!content) return;
    setOpen(true);
    setReady(false);
  }

  function hide() {
    cancelAnimationFrame(rafId.current);
    setOpen(false);
    setReady(false);
  }

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  const side = activePlacement.split('-')[0];

  return (
    <>
      <span
        ref={anchorRef}
        style={{ display: 'inline-flex', verticalAlign: 'middle' }}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <div
            ref={floatRef}
            className={[
              'sp-tooltip',
              arrow && `sp-tooltip--${side}`,
              arrow && 'sp-tooltip--arrow',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              opacity: ready ? 1 : 0,
            }}
          >
            {content}
            {arrow && <span className="sp-tooltip__arrow" aria-hidden />}
          </div>,
          document.body,
        )}
    </>
  );
}
