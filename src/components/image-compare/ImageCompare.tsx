import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Icon } from '../../icons/Icon';
import './ImageCompare.css';

export type ImageCompareOrientation = 'horizontal' | 'vertical';

export interface ImageCompareProps {
  /** Source URL of the "before" image (left / top) */
  beforeSrc: string;
  /** Source URL of the "after" image (right / bottom) */
  afterSrc: string;
  /** Label for the before image */
  beforeLabel?: string;
  /** Label for the after image */
  afterLabel?: string;
  /** Show before/after labels */
  showLabels?: boolean;
  /** Slider orientation */
  orientation?: ImageCompareOrientation;
  /** Initial slider position (0-100) */
  initialPosition?: number;
  /** Accessible label */
  ariaLabel?: string;
  /** Additional CSS class */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export function ImageCompare({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  showLabels = true,
  orientation = 'horizontal',
  initialPosition = 50,
  ariaLabel = 'Image comparison',
  className = '',
  style,
}: ImageCompareProps) {
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const clipPath = useMemo(() => {
    if (orientation === 'vertical') {
      return `inset(0 0 ${100 - position}% 0)`;
    }
    return `inset(0 ${100 - position}% 0 0)`;
  }, [position, orientation]);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let pct: number;
      if (orientation === 'vertical') {
        pct = ((event.clientY - rect.top) / rect.height) * 100;
      } else {
        pct = ((event.clientX - rect.left) / rect.width) * 100;
      }
      setPosition(Math.max(0, Math.min(100, pct)));
    },
    [orientation],
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      draggingRef.current = true;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    },
    [onPointerMove, onPointerUp],
  );

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  const onKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      const step = event.shiftKey ? 10 : 1;
      const isHorizontal = orientation === 'horizontal';

      if (
        (isHorizontal && event.key === 'ArrowLeft') ||
        (!isHorizontal && event.key === 'ArrowUp')
      ) {
        event.preventDefault();
        setPosition((p) => Math.max(0, p - step));
      } else if (
        (isHorizontal && event.key === 'ArrowRight') ||
        (!isHorizontal && event.key === 'ArrowDown')
      ) {
        event.preventDefault();
        setPosition((p) => Math.min(100, p + step));
      } else if (event.key === 'Home') {
        event.preventDefault();
        setPosition(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setPosition(100);
      }
    },
    [orientation],
  );

  const isVertical = orientation === 'vertical';
  const rootClasses = [
    'sp-image-compare',
    isVertical && 'sp-image-compare--vertical',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClasses}
      role="img"
      aria-label={ariaLabel}
      style={style}
    >
      {/* After (bottom layer -- full) */}
      <img
        className="sp-image-compare__after"
        src={afterSrc}
        alt={afterLabel}
        draggable={false}
      />

      {/* Before (top layer -- clipped) */}
      <div className="sp-image-compare__before" style={{ clipPath }}>
        <img src={beforeSrc} alt={beforeLabel} draggable={false} />
      </div>

      {/* Labels */}
      {showLabels && (
        <>
          <span className="sp-image-compare__label sp-image-compare__label--before">
            {beforeLabel}
          </span>
          <span className="sp-image-compare__label sp-image-compare__label--after">
            {afterLabel}
          </span>
        </>
      )}

      {/* Slider handle */}
      <div
        className="sp-image-compare__slider"
        style={
          isVertical
            ? { top: `${position}%` }
            : { left: `${position}%` }
        }
        onPointerDown={onPointerDown}
        role="slider"
        aria-label="Image comparison slider"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={onKeydown}
      >
        <div className="sp-image-compare__handle">
          {isVertical ? (
            <>
              <Icon name="chevron-up" size={14} />
              <Icon name="chevron-down" size={14} />
            </>
          ) : (
            <>
              <Icon name="chevrons-left" size={14} />
              <Icon name="chevrons-right" size={14} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
