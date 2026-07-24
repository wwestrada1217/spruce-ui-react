/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Timeline.css'
import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon.js'

export interface TimelineProps {
  children?: ReactNode
  className?: string
}

export function Timeline({ children, className = '' }: TimelineProps) {
  return (
    <div className={['sp-timeline', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export type TimelineItemColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

export interface TimelineItemProps {
  icon?: string | null
  color?: TimelineItemColor
  dotSize?: number
  children?: ReactNode
  className?: string
}

export function TimelineItem({
  icon = null,
  color = 'primary',
  dotSize = 10,
  children,
  className = '',
}: TimelineItemProps) {
  return (
    <div className={['sp-timeline-item', className].filter(Boolean).join(' ')}>
      <div className="sp-timeline-item__indicator">
        <div
          className={`sp-timeline-item__dot sp-timeline-item__dot--${color}`}
          style={{ width: dotSize, height: dotSize }}
        >
          {icon && <Icon name={icon} size={dotSize - 4} />}
        </div>
        <div className="sp-timeline-item__line" />
      </div>
      <div className="sp-timeline-item__content">
        {children}
      </div>
    </div>
  )
}
