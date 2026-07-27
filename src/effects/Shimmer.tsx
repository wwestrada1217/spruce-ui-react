import './Shimmer.css';
import type { ReactNode } from 'react';

export interface ShimmerProps {
  children?: ReactNode;
  active?: boolean;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function Shimmer({
  children,
  active = true,
  width,
  height,
  borderRadius,
  className = '',
  style,
}: ShimmerProps) {
  const isSkeleton = !children;

  const classes = [
    'sp-shimmer',
    active && 'sp-shimmer--active',
    isSkeleton && 'sp-shimmer--skeleton',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
  };

  return (
    <div className={classes} style={customStyle}>
      {children}
    </div>
  );
}
