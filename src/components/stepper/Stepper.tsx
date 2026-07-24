import './Stepper.css'
import { Icon } from '../../icons/Icon.js'

export interface StepItem {
  label: string
  description?: string
  icon?: string
  disabled?: boolean
}

export interface StepperProps {
  steps: StepItem[]
  activeStep?: number
  orientation?: 'horizontal' | 'vertical'
  linear?: boolean
  onStepChange?: (index: number) => void
  className?: string
}

export function Stepper({
  steps,
  activeStep = 0,
  orientation = 'horizontal',
  linear = false,
  onStepChange,
  className = '',
}: StepperProps) {
  const isVertical = orientation === 'vertical'

  const rootClass = [
    'sp-stepper',
    isVertical && 'sp-stepper--vertical',
    className,
  ].filter(Boolean).join(' ')

  function handleStepClick(index: number, step: StepItem) {
    if (step.disabled) return
    if (linear && index > activeStep) return
    onStepChange?.(index)
  }

  function getStepState(index: number): 'completed' | 'active' | 'upcoming' {
    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'upcoming'
  }

  function isStepDisabled(index: number, step: StepItem): boolean {
    if (step.disabled) return true
    if (linear && index > activeStep) return true
    return false
  }

  return (
    <div className={rootClass} role="list">
      {steps.map((step, index) => {
        const state = getStepState(index)
        const disabled = isStepDisabled(index, step)
        const isLast = index === steps.length - 1

        const stepClass = [
          'sp-step',
          state === 'active' && 'sp-step--active',
          state === 'completed' && 'sp-step--completed',
          disabled && 'sp-step--disabled',
          isVertical && 'sp-step--vertical',
        ].filter(Boolean).join(' ')

        return (
          <button
            key={index}
            type="button"
            role="listitem"
            className={stepClass}
            disabled={disabled}
            aria-current={state === 'active' ? 'step' : undefined}
            onClick={() => handleStepClick(index, step)}
          >
            <span className="sp-step__indicator">
              {state === 'completed' ? (
                <Icon name={step.icon ?? 'check'} size={16} ariaLabel="Completed" />
              ) : (
                <span className="sp-step__number">{index + 1}</span>
              )}
            </span>

            <span className="sp-step__content">
              <span className="sp-step__label">{step.label}</span>
              {step.description && (
                <span className="sp-step__desc">{step.description}</span>
              )}
            </span>

            {!isLast && <span className="sp-step__connector" />}
          </button>
        )
      })}
    </div>
  )
}
