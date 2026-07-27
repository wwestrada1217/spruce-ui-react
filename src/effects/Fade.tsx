import './Fade.css';
import type { ReactNode } from 'react';

export interface FadeProps {
  children?: ReactNode;
  visible?: boolean;
  duration?: number;
  direction?: 'none' | 'up' | 'down' | 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export function Fade({
  children,
  visible = true,
  duration = 300,
  direction = 'none',
  className = '',
  style,
}: FadeProps) {
  const classes = [
    'sp-fade',
    visible ? 'sp-fade--in' : 'sp-fade--out',
    direction !== 'none' && `sp-fade--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{
        transitionDuration: `${duration}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
