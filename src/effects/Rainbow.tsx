import './Rainbow.css';
import type { ReactNode } from 'react';

export interface RainbowProps {
  children?: ReactNode;
  animated?: boolean;
  borderWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Rainbow({
  children,
  animated = true,
  borderWidth = 2,
  className = '',
  style,
}: RainbowProps) {
  const classes = [
    'sp-rainbow',
    animated && 'sp-rainbow--animated',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ padding: borderWidth, ...style }}>
      <div className="sp-rainbow-inner">{children}</div>
    </div>
  );
}
