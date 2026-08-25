import './Spinner.css';
import { type CSSProperties, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpinnerVariant =
  | 'ring'
  | 'arc'
  | 'dashed-ring'
  | 'chasing-dots'
  | 'three-dots'
  | 'pulse-dot'
  | 'ripple'
  | 'wave-bars'
  | 'bars'
  | 'bouncing-dots'
  | 'orbiting-dots'
  | 'concentric-rings'
  | 'fading-lines'
  | 'rotating-squares'
  | 'grid-cube';

export type SpinnerColorVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'white';

export interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  colorVariant?: SpinnerColorVariant;
  color?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

function dots(className: string, count: number): ReactNode {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <span key={index} />)}
    </div>
  );
}

function renderGraphic(variant: SpinnerVariant): ReactNode {
  switch (variant) {
    case 'ring':
      return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="sp-spinner__track" cx="12" cy="12" r="10" strokeWidth="3" /><path className="sp-spinner__arc" d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" strokeLinecap="round" /></svg>;
    case 'arc':
      return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path className="sp-spinner__arc" d="M12 2a10 10 0 0 1 9.5 6.8" strokeWidth="3" strokeLinecap="round" /></svg>;
    case 'dashed-ring':
      return <svg viewBox="0 0 24 24" fill="none" className="sp-spinner__svg--dashed" aria-hidden="true"><circle className="sp-spinner__arc" cx="12" cy="12" r="10" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" /></svg>;
    case 'chasing-dots':
      return dots('sp-spinner__chase', 6);
    case 'three-dots':
      return dots('sp-spinner__three-dots', 3);
    case 'pulse-dot':
      return <div className="sp-spinner__pulse" aria-hidden="true"><span className="sp-spinner__pulse-core" /><span className="sp-spinner__pulse-ring" /></div>;
    case 'ripple':
      return <div className="sp-spinner__ripple" aria-hidden="true"><span /><span /></div>;
    case 'wave-bars':
      return dots('sp-spinner__wave-bars', 5);
    case 'bars':
      return dots('sp-spinner__equalizer', 4);
    case 'bouncing-dots':
      return dots('sp-spinner__bouncing-dots', 3);
    case 'orbiting-dots':
      return <div className="sp-spinner__orbit" aria-hidden="true"><span className="sp-spinner__orbit-center" /><span className="sp-spinner__orbit-satellite" /></div>;
    case 'concentric-rings':
      return <div className="sp-spinner__concentric" aria-hidden="true"><span className="sp-spinner__ring-outer" /><span className="sp-spinner__ring-inner" /></div>;
    case 'fading-lines':
      return dots('sp-spinner__fading-lines', 12);
    case 'rotating-squares':
      return <div className="sp-spinner__rotating-squares" aria-hidden="true"><span /><span /></div>;
    case 'grid-cube':
      return dots('sp-spinner__grid-cube', 9);
  }
}

export function Spinner({
  variant = 'ring',
  size = 'md',
  colorVariant = 'primary',
  color,
  label = '',
  ariaLabel,
  className = '',
}: SpinnerProps) {
  const { t } = useI18n();
  const style = color ? ({ '--sp-spinner-color-custom': color } as CSSProperties) : undefined;
  const classes = [
    'sp-spinner',
    `sp-spinner--${size}`,
    `sp-spinner--color-${colorVariant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} role="status" aria-label={ariaLabel ?? (label || t('loading'))} style={style}>
      <span className={`sp-spinner__graphic sp-spinner__graphic--${variant}`} aria-hidden="true">
        {renderGraphic(variant)}
      </span>
      {label && <span className="sp-spinner__label">{label}</span>}
    </span>
  );
}
