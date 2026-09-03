import './Marquee.css';
import type { CSSProperties, ReactNode } from 'react';

export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

export interface MarqueeProps {
  children?: ReactNode;
  /** Direction of scroll. */
  direction?: MarqueeDirection;
  /** Duration of one complete loop in seconds. */
  speed?: number;
  /** Gap between repeated content in pixels. */
  gap?: number;
  /** Pause animation while the pointer is over the marquee. */
  pauseOnHover?: boolean;
  /** Accessible label for the scrolling region. */
  ariaLabel?: string;
  /** Optional explicit duplicate for content that cannot be rendered twice. */
  duplicate?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Marquee({
  children,
  direction = 'left',
  speed = 20,
  gap = 24,
  pauseOnHover = true,
  ariaLabel = 'Scrolling content',
  duplicate,
  className = '',
  style,
}: MarqueeProps) {
  const isVertical = direction === 'up' || direction === 'down';
  const classes = [
    'sp-marquee',
    isVertical && 'sp-marquee--vertical',
    pauseOnHover && 'sp-marquee--paused',
    className,
  ].filter(Boolean).join(' ');
  const trackStyle = {
    '--sp-marquee-duration': `${Math.max(0.01, speed)}s`,
    '--sp-marquee-gap': `${Math.max(0, gap)}px`,
  } as CSSProperties;

  return (
    <div
      className={classes}
      style={style}
      role="marquee"
      aria-label={ariaLabel || 'Scrolling content'}
    >
      <div className={`sp-marquee__track sp-marquee-track sp-marquee__track--${direction}`} style={trackStyle}>
        <div className="sp-marquee__content sp-marquee-content">{children}</div>
        <div className="sp-marquee__content sp-marquee-content" aria-hidden="true" inert>
          {duplicate ?? children}
        </div>
      </div>
    </div>
  );
}
