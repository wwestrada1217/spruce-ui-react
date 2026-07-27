import './Marquee.css';
import type { ReactNode } from 'react';

export interface MarqueeProps {
  children?: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  style,
}: MarqueeProps) {
  const classes = [
    'sp-marquee',
    direction === 'right' && 'sp-marquee--right',
    pauseOnHover && 'sp-marquee--pause-hover',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      <div
        className="sp-marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="sp-marquee-content">{children}</div>
        <div className="sp-marquee-content" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
