/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Rating.css';
import { useState, useMemo, useCallback } from 'react';

export type RatingSize = 'sm' | 'md' | 'lg';
export type RatingShape = 'star' | 'heart' | 'circle' | 'diamond';

const SHAPE_PATHS: Record<RatingShape, string> = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  circle: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  diamond: 'M12 2L22 12L12 22L2 12Z',
};

export interface RatingProps {
  /** Current rating value. */
  value?: number;
  /** Maximum rating (number of items). */
  max?: number;
  /** Visual size of each rating item. */
  size?: RatingSize;
  /** Shape of each rating item. */
  shape?: RatingShape;
  /** Makes the rating display-only. */
  readonly?: boolean;
  /** Disables all interaction and dims the component. */
  disabled?: boolean;
  /** Allow half-step ratings (0.5 increments). */
  allowHalf?: boolean;
  /** Custom fill color for rated items. Accepts any valid CSS color value. */
  color?: string;
  /** Called when the value changes. */
  onValueChange?: (value: number) => void;
  /** Accessible label for the slider region. */
  ariaLabel?: string;
  /** Additional CSS class name(s). */
  className?: string;
}

export function Rating({
  value = 0,
  max = 5,
  size = 'md',
  shape = 'star',
  readonly: isReadonly = false,
  disabled = false,
  allowHalf = false,
  color = '',
  onValueChange,
  ariaLabel = 'Rating',
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const stars = useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max],
  );

  const shapePath = SHAPE_PATHS[shape];
  const fillColor = color || 'var(--sp-warning, #f59e0b)';
  const outlineColor = color || 'var(--sp-border-strong, rgba(0, 0, 0, 0.25))';

  const getFraction = useCallback(
    (index: number): number => {
      const display = hoverValue ?? value;
      if (display >= index) return 1;
      if (allowHalf && display >= index - 0.5) return 0.5;
      return 0;
    },
    [hoverValue, value, allowHalf],
  );

  const onItemMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>, index: number) => {
      if (isReadonly || disabled) return;
      if (!allowHalf) {
        setHoverValue(index);
        return;
      }
      const el = event.currentTarget;
      const { left, width } = el.getBoundingClientRect();
      setHoverValue(event.clientX - left < width / 2 ? index - 0.5 : index);
    },
    [isReadonly, disabled, allowHalf],
  );

  const onItemClick = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>, index: number) => {
      if (isReadonly || disabled) return;
      let next: number;
      if (allowHalf) {
        const el = event.currentTarget;
        const { left, width } = el.getBoundingClientRect();
        next = event.clientX - left < width / 2 ? index - 0.5 : index;
      } else {
        next = index;
      }
      // Click the same value again -> clear the rating
      onValueChange?.(value === next ? 0 : next);
    },
    [isReadonly, disabled, allowHalf, value, onValueChange],
  );

  const onKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isReadonly || disabled) return;
      const step = allowHalf ? 0.5 : 1;
      let next = value;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          next = Math.min(max, next + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          next = Math.max(0, next - step);
          break;
        case 'Home':
          event.preventDefault();
          next = 0;
          break;
        case 'End':
          event.preventDefault();
          next = max;
          break;
        default:
          return;
      }

      onValueChange?.(next);
    },
    [isReadonly, disabled, allowHalf, value, max, onValueChange],
  );

  const classes = [
    'sp-rating',
    size === 'sm' && 'sp-rating--sm',
    size === 'lg' && 'sp-rating--lg',
    isReadonly && 'sp-rating--readonly',
    disabled && 'sp-rating--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      aria-readonly={isReadonly || undefined}
      tabIndex={isReadonly || disabled ? -1 : 0}
      onKeyDown={onKeydown}
      onMouseLeave={() => setHoverValue(null)}
    >
      {stars.map((i) => (
        <span
          key={i}
          className="sp-rating__item"
          title={`${i} out of ${max}`}
          onMouseMove={(e) => onItemMouseMove(e, i)}
          onClick={(e) => onItemClick(e, i)}
        >
          {/* Outline (empty) shape */}
          <svg
            className="sp-rating__svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d={shapePath}
              fill="none"
              stroke={outlineColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Filled shape, width % controls fill amount */}
          <span
            className="sp-rating__fill"
            style={{ width: `${getFraction(i) * 100}%` }}
          >
            <svg
              className="sp-rating__svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d={shapePath} fill={fillColor} stroke="none" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
