/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './ProgressBar.css'

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ProgressBarSize = 'sm' | 'md' | 'lg'

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
  className?: string
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
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const trackClass = [
    'sp-progress__track',
    size !== 'md' && `sp-progress__track--${size}`,
  ].filter(Boolean).join(' ')

  const fillClass = [
    'sp-progress__fill',
    `sp-progress__fill--${variant}`,
    striped && 'sp-progress__fill--striped',
    animated && 'sp-progress__fill--animated',
    indeterminate && 'sp-progress__fill--indeterminate',
  ].filter(Boolean).join(' ')

  const fillStyle = indeterminate
    ? undefined
    : { width: `${percentage}%` }

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
      <div
        className={trackClass}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className={fillClass} style={fillStyle} />
      </div>
    </div>
  )
}
