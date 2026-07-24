import './Empty.css'
import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon.js'

export type EmptySize = 'sm' | 'md' | 'lg'

export interface EmptyProps {
  icon?: string | null
  title?: string | null
  description?: string | null
  size?: EmptySize
  bordered?: boolean
  children?: ReactNode
  className?: string
}

function iconSize(size: EmptySize): number {
  switch (size) {
    case 'sm': return 18
    case 'lg': return 32
    default: return 24
  }
}

export function Empty({
  icon = null,
  title = null,
  description = null,
  size = 'md',
  bordered = false,
  children,
  className = '',
}: EmptyProps) {
  const classes = [
    'sp-empty',
    size !== 'md' && `sp-empty--${size}`,
    bordered && 'sp-empty--bordered',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} role="status">
      {icon && (
        <div className="sp-empty__icon">
          <Icon name={icon} size={iconSize(size)} />
        </div>
      )}
      {title && <p className="sp-empty__title">{title}</p>}
      {description && <p className="sp-empty__desc">{description}</p>}
      {children}
    </div>
  )
}
