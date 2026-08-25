import './CircularProgress.css';
import { type CSSProperties, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

export type CircularProgressVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: CircularProgressSize;
  diameter?: number;
  strokeWidth?: number;
  variant?: CircularProgressVariant;
  color?: string;
  indeterminate?: boolean;
  showTrack?: boolean;
  rounded?: boolean;
  showValue?: boolean;
  valueFormat?: string;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
}

const SIZE_MAP: Record<CircularProgressSize, { diameter: number; strokeWidth: number }> = {
  xs: { diameter: 24, strokeWidth: 3 },
  sm: { diameter: 36, strokeWidth: 3.5 },
  md: { diameter: 48, strokeWidth: 4 },
  lg: { diameter: 64, strokeWidth: 5 },
  xl: { diameter: 96, strokeWidth: 6 },
};

function formatValue(value: number, format: string, locale: string): string {
  const match = /^(\d+)\.(\d+)-(\d+)$/.exec(format);
  if (!match) return new Intl.NumberFormat(locale).format(value);
  return new Intl.NumberFormat(locale, {
    minimumIntegerDigits: Number(match[1]),
    minimumFractionDigits: Number(match[2]),
    maximumFractionDigits: Number(match[3]),
  }).format(value);
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 'md',
  diameter,
  strokeWidth,
  variant = 'primary',
  color,
  indeterminate = false,
  showTrack = true,
  rounded = true,
  showValue = false,
  valueFormat = '1.0-0',
  ariaLabel,
  className = '',
  children,
}: CircularProgressProps) {
  const { t, locale } = useI18n();
  const preset = SIZE_MAP[size];
  const pixelDiameter = diameter !== undefined && diameter > 0 ? diameter : preset.diameter;
  const stroke = strokeWidth !== undefined && strokeWidth > 0 ? strokeWidth : preset.strokeWidth;
  const center = pixelDiameter / 2;
  const radius = Math.max(0, (pixelDiameter - stroke) / 2);
  const circumference = 2 * Math.PI * radius;
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const dashOffset = indeterminate ? 0 : circumference * (1 - percentage / 100);
  const style = color ? ({ '--sp-circular-progress-color-custom': color } as CSSProperties) : undefined;
  const classes = [
    'sp-circular-progress',
    `sp-circular-progress--${variant}`,
    indeterminate && 'sp-circular-progress--indeterminate',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel ?? t('circularProgress')}
      style={{ ...style, width: pixelDiameter, height: pixelDiameter }}
    >
      <svg className="sp-circular-progress__svg" viewBox={`0 0 ${pixelDiameter} ${pixelDiameter}`} aria-hidden="true">
        {showTrack && <circle className="sp-circular-progress__track" cx={center} cy={center} r={radius} strokeWidth={stroke} />}
        <circle
          className="sp-circular-progress__fill"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap={rounded ? 'round' : 'butt'}
        />
      </svg>
      <div className="sp-circular-progress__center">
        {children ?? (showValue && !indeterminate ? (
          <span className="sp-circular-progress__value">{formatValue(percentage, valueFormat, locale)}%</span>
        ) : null)}
      </div>
    </div>
  );
}
