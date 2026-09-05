import { useId } from 'react'
import type { CSSProperties } from 'react'
import './Illustration.css'
import type { IllustrationDefinition } from './illustration-definition.js'

export type IllustrationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number | string

export interface IllustrationProps {
  illustration?: IllustrationDefinition | string | null
  name?: string | null
  illustrations?: Readonly<Record<string, IllustrationDefinition>>
  size?: IllustrationSize
  width?: number | string | null
  height?: number | string | null
  ariaLabel?: string
  ariaHidden?: boolean | null
  showBadge?: boolean
  monochrome?: boolean | string
  monochromatic?: boolean | string
  color?: string | null
  className?: string
}

const SIZE_PRESETS: Record<string, { width: string; height: string }> = {
  xs: { width: '120px', height: 'auto' },
  sm: { width: '180px', height: 'auto' },
  md: { width: '260px', height: 'auto' },
  lg: { width: '360px', height: 'auto' },
  xl: { width: '480px', height: 'auto' },
  '2xl': { width: '600px', height: 'auto' },
  full: { width: '100%', height: 'auto' },
}

function dimension(value: number | string | null | undefined, fallback: string): string {
  if (value === null || value === undefined) return fallback
  return typeof value === 'number' ? `${value}px` : value
}

function resolvedTint(color: string | null | undefined, monochrome: boolean | string, monochromatic: boolean | string): string | null {
  const candidate = color ?? (typeof monochrome === 'string' ? monochrome : typeof monochromatic === 'string' ? monochromatic : null)
  if (!candidate || candidate === 'true' || candidate === 'false') return null
  return candidate === 'primary' ? 'var(--sp-primary)' : candidate
}

function tintedSvg(svg: string, tint: string, filterId: string): string {
  const filter = `<filter id="${filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%"><feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" in="SourceGraphic" result="gray"/><feFlood style="flood-color: ${tint};" flood-color="${tint}" result="color"/><feBlend in="color" in2="gray" mode="color" result="blended"/><feComposite in="blended" in2="SourceAlpha" operator="in"/></filter>`
  const withDefs = svg.includes('<defs>') ? svg.replace('<defs>', `<defs>${filter}`) : svg.replace(/<svg([^>]*)>/, `<svg$1><defs>${filter}</defs>`)
  return withDefs.replace(/<svg([^>]*)>/, `<svg$1 filter="url(#${filterId})">`)
}

export function Illustration({ illustration = null, name = null, illustrations, size = 'md', width = null, height = null, ariaLabel = '', ariaHidden = null, showBadge = true, monochrome = false, monochromatic = false, color = null, className = '' }: IllustrationProps) {
  const filterId = `sp-ill-filter-${useId().replace(/:/g, '')}`
  const item = typeof illustration === 'object' && illustration !== null
    ? illustration
    : illustration ?? (name && illustrations ? illustrations[name] ?? null : null)
  const svg = typeof item === 'string' ? item : item?.svg ?? ''
  const label = ariaLabel || (ariaHidden === false && typeof item === 'object' && item ? item.title : '')
  const isTinted = resolvedTint(color, monochrome, monochromatic) !== null
  const isMonochrome = isTinted || monochrome === true || monochromatic === true || (typeof monochrome === 'string' && monochrome !== 'false') || (typeof monochromatic === 'string' && monochromatic !== 'false')
  const preset = typeof size === 'string' ? SIZE_PRESETS[size] : undefined
  const style: CSSProperties & { '--sp-ill-color'?: string } = {
    width: dimension(width, typeof size === 'number' ? `${size}px` : preset?.width ?? size),
    height: dimension(height, typeof size === 'number' ? `${Math.round(size * 0.75)}px` : preset?.height ?? 'auto'),
    '--sp-ill-color': resolvedTint(color, monochrome, monochromatic) ?? undefined,
  }
  const classes = ['sp-illustration', !showBadge && 'sp-illustration--hide-badge', isMonochrome && 'sp-illustration--monochrome', isTinted && 'sp-illustration--tinted', className].filter(Boolean).join(' ')
  const markup = isTinted && svg ? tintedSvg(svg, resolvedTint(color, monochrome, monochromatic) ?? 'var(--sp-primary)', filterId) : svg

  return <span className={classes} style={style} role={label ? 'img' : 'presentation'} aria-label={label || undefined} aria-hidden={ariaHidden === true || (!label && ariaHidden !== false) ? true : undefined} data-illustration={typeof item === 'object' && item ? item.name : name ?? undefined} dangerouslySetInnerHTML={{ __html: markup }} />
}
