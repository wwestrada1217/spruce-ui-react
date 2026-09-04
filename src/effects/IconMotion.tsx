import './IconMotion.css';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../icons/Icon.js';

export type IconMotionType = 'bounce' | 'spin' | 'spin-continuous' | 'pulse' | 'wiggle' | 'rotate-90' | 'rotate-180' | 'slide-right' | 'slide-left' | 'slide-up' | 'slide-down' | 'float' | 'pop';
export type IconSwapTransition = 'crossfade' | 'flip' | 'rotate' | 'slide-up' | 'scale';
export type IconMotionTrigger = 'hover' | 'active' | 'always';

export interface IconMotionProps {
  children?: ReactNode;
  enabled?: boolean;
  spIconMotion?: boolean;
  iconMotion?: IconMotionType;
  swapIcon?: string | null;
  swapTransition?: IconSwapTransition;
  motionTrigger?: IconMotionTrigger;
  motionDuration?: number;
  className?: string;
  style?: CSSProperties;
}

export function IconMotion({ children, enabled, spIconMotion, iconMotion = 'bounce', swapIcon, swapTransition = 'crossfade', motionTrigger = 'hover', motionDuration = 300, className = '', style }: IconMotionProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(motionTrigger === 'always');
  const isEnabled = spIconMotion ?? enabled ?? true;

  useEffect(() => {
    const target = hostRef.current?.querySelector<HTMLElement>('.sp-icon, svg');
    if (!target) return;
    target.classList.add('sp-icon-motion-target');
    return () => target.classList.remove('sp-icon-motion-target');
  }, [children]);

  return (
    <span
      ref={hostRef}
      className={['sp-icon-motion-host', isEnabled && `sp-icon-motion--${iconMotion}`, isEnabled && active && 'sp-icon-motion-host--active', isEnabled && swapIcon && 'sp-icon-motion-host--swap', !isEnabled && 'sp-icon-motion-host--disabled', className].filter(Boolean).join(' ')}
      style={{ ...style, '--sp-icon-motion-duration': `${Math.max(1, motionDuration)}ms` } as CSSProperties}
      onMouseEnter={() => { if (isEnabled && motionTrigger === 'hover') setActive(true); }}
      onMouseLeave={() => { if (motionTrigger === 'hover') setActive(false); }}
      onFocus={() => { if (isEnabled && motionTrigger === 'hover') setActive(true); }}
      onBlur={() => { if (motionTrigger === 'hover') setActive(false); }}
      onMouseDown={() => { if (isEnabled && motionTrigger === 'active') setActive(true); }}
      onMouseUp={() => { if (motionTrigger === 'active') setActive(false); }}
    >
      {children}
      {isEnabled && swapIcon && (
        <span className={['sp-icon-swap-layer', `sp-icon-swap-layer--${swapTransition}`].join(' ')} aria-hidden="true">
          <Icon name={swapIcon} size={16} />
        </span>
      )}
    </span>
  );
}
