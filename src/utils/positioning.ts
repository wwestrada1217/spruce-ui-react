/**
 * Shared smart-positioning utility for dropdowns, popovers, and tooltips.
 *
 * Calculates the best position for a floating element relative to an anchor,
 * flipping to the opposite side when the preferred position would be clipped
 * by the viewport.
 */

export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface PositionResult {
  top: number;
  left: number;
  placement: Placement;
}

const DEFAULT_OFFSET = 4;

export function computePosition(
  anchor: HTMLElement,
  floating: HTMLElement,
  preferred: Placement,
  offset: number = DEFAULT_OFFSET,
): PositionResult {
  const anchorRect = anchor.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const fw = floatingRect.width;
  const fh = floatingRect.height;

  const attempts = getFlipOrder(preferred);

  for (const placement of attempts) {
    const pos = calcPosition(anchorRect, fw, fh, placement, offset);
    if (fitsViewport(pos, fw, fh, vw, vh)) {
      return { ...pos, placement };
    }
  }

  // Fallback: clamp to viewport with preferred placement
  const pos = calcPosition(anchorRect, fw, fh, preferred, offset);
  return {
    top: clamp(pos.top, 0, vh - fh),
    left: clamp(pos.left, 0, vw - fw),
    placement: preferred,
  };
}

function calcPosition(
  a: DOMRect, fw: number, fh: number, placement: Placement, offset: number,
): { top: number; left: number } {
  const [side, align] = splitPlacement(placement);

  let top = 0;
  let left = 0;

  switch (side) {
    case 'bottom': top = a.bottom + offset; break;
    case 'top':    top = a.top - fh - offset; break;
    case 'left':   left = a.left - fw - offset; break;
    case 'right':  left = a.right + offset; break;
  }

  if (side === 'top' || side === 'bottom') {
    switch (align) {
      case 'start': left = a.left; break;
      case 'end':   left = a.right - fw; break;
      default:      left = a.left + (a.width - fw) / 2; break;
    }
  }

  if (side === 'left' || side === 'right') {
    switch (align) {
      case 'start': top = a.top; break;
      case 'end':   top = a.bottom - fh; break;
      default:      top = a.top + (a.height - fh) / 2; break;
    }
  }

  return { top, left };
}

function splitPlacement(p: Placement): [string, string] {
  const parts = p.split('-');
  return [parts[0], parts[1] ?? 'center'];
}

function fitsViewport(
  pos: { top: number; left: number }, fw: number, fh: number, vw: number, vh: number,
): boolean {
  return pos.top >= 0 && pos.left >= 0 && pos.top + fh <= vh && pos.left + fw <= vw;
}

function getFlipOrder(preferred: Placement): Placement[] {
  const [side, align] = splitPlacement(preferred);
  const opposite: Record<string, string> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  const flippedSide = opposite[side];
  const suffix = align === 'center' ? '' : `-${align}`;

  return [
    preferred,
    `${flippedSide}${suffix}` as Placement,
    `${side}-start` as Placement,
    `${side}-end` as Placement,
    `${flippedSide}-start` as Placement,
    `${flippedSide}-end` as Placement,
  ];
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Returns the opposite side for arrow positioning. */
export function getOppositeSide(placement: Placement): string {
  const side = placement.split('-')[0];
  const opp: Record<string, string> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  return opp[side] ?? side;
}

/**
 * Walks up the DOM from `el` and returns every scrollable ancestor.
 */
export function getScrollParents(el: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let current = el.parentElement;
  while (current) {
    const { overflow, overflowX, overflowY } = getComputedStyle(current);
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      parents.push(current);
    }
    current = current.parentElement;
  }
  return parents;
}

/**
 * Registers a click-outside listener. Returns a cleanup function.
 * Checks if the click is outside ALL provided elements.
 */
export function onClickOutside(
  elements: HTMLElement | HTMLElement[],
  callback: () => void,
): () => void {
  const els = Array.isArray(elements) ? elements : [elements];
  const handler = (e: MouseEvent) => {
    if (!els.some(el => el.contains(e.target as Node))) {
      callback();
    }
  };
  // Delay to avoid capturing the opening click
  const id = setTimeout(() => document.addEventListener('click', handler, true), 0);
  return () => {
    clearTimeout(id);
    document.removeEventListener('click', handler, true);
  };
}
