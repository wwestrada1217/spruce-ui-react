/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './StatCard.css'
import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon.js'

export type StatCardVariant = 'flat' | 'icon' | 'trend'
export type StatCardTrend = 'up' | 'down' | 'neutral'
export type StatCardIconColor = 'blue' | 'green' | 'amber' | 'red' | 'purple'

const ICON_COLORS: Record<StatCardIconColor, [string, string]> = {
  blue:   ['var(--sp-primary-subtle, rgba(37,99,235,.1))',   'var(--sp-primary, #2563eb)'],
  green:  ['rgba(16,185,129,.1)',  '#10b981'],
  amber:  ['rgba(245,158,11,.1)',  '#f59e0b'],
  red:    ['rgba(239,68,68,.1)',   '#ef4444'],
  purple: ['rgba(139,92,246,.1)', '#8b5cf6'],
}

function trendIcon(trend: StatCardTrend): string {
  switch (trend) {
    case 'up':   return 'trending-up'
    case 'down': return 'trending-down'
    default:     return 'minus'
  }
}

export interface StatCardProps {
  label?: string
  value?: string
  change?: string
  trend?: StatCardTrend
  variant?: StatCardVariant
  icon?: string | null
  iconColor?: StatCardIconColor
  children?: ReactNode
  className?: string
}

export function StatCard({
  label = '',
  value = '',
  change = '',
  trend = 'neutral',
  variant = 'flat',
  icon = null,
  iconColor = 'blue',
  children,
  className = '',
}: StatCardProps) {
  const [iconBg, iconFg] = ICON_COLORS[iconColor] ?? ICON_COLORS.blue

  const cardClass = [
    'sp-stat-card',
    `sp-stat-card--${variant}`,
    className,
  ].filter(Boolean).join(' ')

  const changeClass = [
    'sp-stat-card__change',
    trend === 'up' && 'sp-stat-card__change--up',
    trend === 'down' && 'sp-stat-card__change--down',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      {variant === 'icon' && (
        <div
          className="sp-stat-card__icon"
          style={{ background: iconBg, color: iconFg }}
        >
          <Icon name={icon ?? 'bar-chart-2'} size={20} />
        </div>
      )}

      <div className="sp-stat-card__body">
        {variant === 'trend' ? (
          <>
            <div className="sp-stat-card__top">
              <span className="sp-stat-card__label">{label}</span>
              {change && (
                <span className={changeClass}>
                  <Icon name={trendIcon(trend)} size={11} />
                  {change}
                </span>
              )}
            </div>
            <span className="sp-stat-card__value">{value}</span>
          </>
        ) : (
          <>
            <span className="sp-stat-card__label">{label}</span>
            <span className="sp-stat-card__value">{value}</span>
            {change && (
              <span className={changeClass}>
                <Icon name={trendIcon(trend)} size={11} />
                {change}
              </span>
            )}
          </>
        )}
      </div>

      {variant === 'trend' && (
        <div className="sp-stat-card__chart">{children}</div>
      )}
    </div>
  )
}
