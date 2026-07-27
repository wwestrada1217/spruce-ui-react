import './Shine.css';
import type { ReactNode } from 'react';

export interface ShineProps {
  children?: ReactNode;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Shine({
  children,
  active = true,
  className = '',
  style,
}: ShineProps) {
  const classes = [
    'sp-shine',
    active && 'sp-shine--active',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
