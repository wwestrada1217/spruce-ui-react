import './Thermometer.css';
import type { CSSProperties } from 'react';
import { useReducedMotion } from './effect-utils.js';

export type ThermometerSize = 'sm' | 'md' | 'lg' | 'xl' | number;
export type TemperatureUnit = '°C' | '°F';

export interface ThermometerProps {
  /** Temperature value. */
  temperature?: number;
  /** Minimum scale bound. */
  minTemp?: number;
  /** Maximum scale bound. */
  maxTemp?: number;
  /** Temperature unit. */
  unit?: TemperatureUnit;
  /** Custom liquid color override. */
  color?: string | null;
  /** Size preset or pixel width. */
  size?: ThermometerSize;
  /** Show scale tick marks. */
  showTicks?: boolean;
  /** Show numeric temperature label. */
  showLabel?: boolean;
  /** Accessible name for the thermometer. */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const SIZE_MAP: Record<string, number> = { sm: 32, md: 48, lg: 64, xl: 96 };

export function Thermometer({
  temperature = 25,
  minTemp = -20,
  maxTemp = 50,
  unit = '°C',
  color = null,
  size = 'md',
  showTicks = true,
  showLabel = true,
  ariaLabel,
  className = '',
  style,
}: ThermometerProps) {
  const reducedMotion = useReducedMotion();
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] ?? 48;
  const ratio = maxTemp === minTemp
    ? temperature >= maxTemp ? 1 : 0
    : (Math.min(maxTemp, Math.max(minTemp, temperature)) - minTemp) / (maxTemp - minTemp);
  const fluidY = 72 - ratio * 52;
  const fluidHeight = Math.max(6, ratio * 52 + 10);
  const computedColor = color || (temperature <= 0
    ? '#38bdf8'
    : temperature <= 18
      ? '#14b8a6'
      : temperature <= 30
        ? '#10b981'
        : temperature <= 40
          ? '#f97316'
          : '#ef4444');
  const isHot = temperature > 40;
  const classes = ['sp-thermometer', reducedMotion && 'sp-thermometer--reduced-motion', className]
    .filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ ...style, width: pixelSize * (showLabel ? 2.4 : 1) }}
      role="img"
      aria-label={ariaLabel ?? `Thermometer: ${Math.round(temperature)}${unit}`}
    >
      <div className="sp-thermometer-wrapper">
        <svg
          width={pixelSize}
          height={pixelSize * 2.2}
          viewBox="0 0 48 106"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sp-thermometer-svg"
          aria-hidden="true"
        >
          <rect x="18" y="10" width="12" height="64" rx="6" fill="var(--sp-surface-100, #f1f5f9)" stroke="var(--sp-border-strong, #cbd5e1)" strokeWidth="2.5" />
          <circle cx="24" cy="82" r="14" fill="var(--sp-surface-100, #f1f5f9)" stroke="var(--sp-border-strong, #cbd5e1)" strokeWidth="2.5" />
          {showTicks && <>
            <line x1="33" y1="20" x2="39" y2="20" stroke="var(--sp-text-muted)" strokeWidth="1.5" />
            <line x1="33" y1="32" x2="37" y2="32" stroke="var(--sp-text-muted)" strokeWidth="1.2" />
            <line x1="33" y1="44" x2="39" y2="44" stroke="var(--sp-text-muted)" strokeWidth="1.5" />
            <line x1="33" y1="56" x2="37" y2="56" stroke="var(--sp-text-muted)" strokeWidth="1.2" />
            <line x1="33" y1="68" x2="39" y2="68" stroke="var(--sp-text-muted)" strokeWidth="1.5" />
          </>}
          <rect x="20.5" y={fluidY} width="7" height={fluidHeight} rx="3.5" fill={computedColor} className="sp-fluid-column" />
          <circle cx="24" cy="82" r="11.5" fill={computedColor} className={isHot ? 'sp-bulb-pulse' : undefined} />
          <path d="M 20.5 16 V 68 M 16 80 C 15 76 18 72 20.5 70" stroke="rgb(255 255 255 / 55%)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {showLabel && (
          <div className="sp-thermometer-label">
            <span className="sp-thermometer-val" style={{ color: computedColor }}>{Math.round(temperature)}{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
}
