import './Glow.css';
import type { ReactNode } from 'react';

export interface GlowProps {
  children?: ReactNode;
  color?: string;
  blur?: number;
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Glow({
  children,
  color = 'rgba(15, 118, 110, 0.4)',
  blur = 16,
  pulse = true,
  className = '',
  style,
}: GlowProps) {
  const classes = [
    'sp-glow',
    pulse && 'sp-glow--pulse',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{
        boxShadow: `0 0 ${blur}px ${color}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
