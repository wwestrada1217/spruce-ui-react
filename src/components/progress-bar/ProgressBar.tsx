/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './ProgressBar.css';

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressSegmentShape = 'bar' | 'tick' | 'pill';

export interface ProgressBarProps {
  value?: number
  max?: number
  variant?: ProgressBarVariant
  size?: ProgressBarSize
  showValue?: boolean
  label?: string
  striped?: boolean
  animated?: boolean
  indeterminate?: boolean
  segments?: number;
  segmentShape?: ProgressSegmentShape;
  segmentGap?: number;
  className?: string;
}

export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  label = '',
  striped = false,
  animated = false,
  indeterminate = false,
  segments = 0,
  segmentShape = 'bar',
  segmentGap,
  className = '',
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const effectiveSegments = segments > 0 ? Math.floor(segments) : segmentShape !== 'bar' ? 24 : 0;
  const filledSegments = Math.round((percentage / 100) * effectiveSegments);

  const trackClass = [
    'sp-progress__track',
    size !== 'md' && `sp-progress__track--${size}`,
  ].filter(Boolean).join(' ');

  const fillClass = [
    'sp-progress__fill',
    `sp-progress__fill--${variant}`,
    striped && 'sp-progress__fill--striped',
    animated && 'sp-progress__fill--animated',
    indeterminate && 'sp-progress__fill--indeterminate',
  ].filter(Boolean).join(' ');

  const fillStyle = indeterminate ? undefined : { width: `${percentage}%` };

  const segmentClass = [
    'sp-progress__segments',
    size !== 'md' && `sp-progress__segments--${size}`,
    segmentShape !== 'bar' && `sp-progress__segments--${segmentShape}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={['sp-progress', className].filter(Boolean).join(' ')}>
      {(label || (showValue && !indeterminate)) && (
        <div className="sp-progress__header">
          {label && <span className="sp-progress__label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="sp-progress__value">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      {effectiveSegments > 0 ? (
        <div
          className={segmentClass}
          style={segmentGap === undefined ? undefined : { gap: `${segmentGap}px` }}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || undefined}
        >
          {Array.from({ length: effectiveSegments }, (_, index) => {
            const filled = !indeterminate && index < filledSegments;
            const classes = [
              'sp-progress__segment',
              `sp-progress__segment--${variant}`,
              filled && 'sp-progress__segment--filled',
              indeterminate && 'sp-progress__segment--indeterminate',
              striped && filled && 'sp-progress__segment--striped',
              animated && striped && filled && 'sp-progress__segment--animated',
            ].filter(Boolean).join(' ');
            return <div key={index} className={classes} style={indeterminate ? { animationDelay: `${index * 50}ms` } : undefined} />;
          })}
        </div>
      ) : (
        <div
          className={trackClass}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || undefined}
        >
          <div className={fillClass} style={fillStyle} />
        </div>
      )}
    </div>
  );
}
