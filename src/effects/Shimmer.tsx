import './Shimmer.css';
import type { CSSProperties, ReactNode } from 'react';

export type ShimmerDirection = 'left-right' | 'right-left' | 'top-bottom' | 'diagonal';

export interface ShimmerProps {
  children?: ReactNode;
  /** Enable or disable the shimmer effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spShimmer?: boolean;
  /** Duration of one shimmer sweep in milliseconds. */
  shimmerDuration?: number;
  /** Direction of the shimmer sweep. */
  shimmerDirection?: ShimmerDirection;
  /** Highlight color for the shimmer band. */
  shimmerColor?: string;
  /** Render the host as a content-hiding skeleton. */
  shimmerSkeleton?: boolean;
  /** Backwards-compatible shorthand for enabled. */
  active?: boolean;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

const DIRECTION_DEGREES: Record<ShimmerDirection, string> = {
  'left-right': '90deg',
  'right-left': '270deg',
  'top-bottom': '180deg',
  diagonal: '135deg',
};

export function Shimmer({
  children,
  enabled,
  spShimmer,
  shimmerDuration = 1500,
  shimmerDirection = 'left-right',
  shimmerColor = 'rgba(255, 255, 255, 0.4)',
  shimmerSkeleton,
  active,
  width,
  height,
  borderRadius,
  'aria-label': ariaLabel,
  className = '',
  style,
}: ShimmerProps) {
  const isActive = spShimmer ?? enabled ?? active ?? true;
  const isSkeleton = shimmerSkeleton ?? children == null;
  const classes = [
    'sp-shimmer',
    isActive && 'sp-shimmer--active',
    isActive && isSkeleton && 'sp-shimmer--skeleton',
    className,
  ].filter(Boolean).join(' ');
  const customStyle = {
    ...style,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
    '--sp-shimmer-color': shimmerColor,
    '--sp-shimmer-deg': DIRECTION_DEGREES[shimmerDirection],
    '--sp-shimmer-duration': `${Math.max(1, shimmerDuration)}ms`,
  } as CSSProperties;

  return (
    <div
      className={classes}
      style={customStyle}
      role={ariaLabel ? 'status' : undefined}
      aria-busy={isActive && isSkeleton ? true : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
