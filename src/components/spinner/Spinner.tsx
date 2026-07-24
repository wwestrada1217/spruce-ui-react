import './Spinner.css'

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

export interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label = '', className = '' }: SpinnerProps) {
  const classes = [
    'sp-spinner',
    `sp-spinner--${size}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={classes} role="status" aria-label={label || 'Loading'}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="sp-spinner__track" cx="12" cy="12" r="10" strokeWidth="3" />
        <path className="sp-spinner__arc" d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <span className="sp-spinner__label">{label}</span>}
    </span>
  )
}
