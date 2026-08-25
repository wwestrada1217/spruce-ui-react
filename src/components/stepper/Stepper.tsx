import './Stepper.css';
import { useCallback, useState, type KeyboardEvent } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface StepItem {
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep?: number;
  defaultActiveStep?: number;
  orientation?: 'horizontal' | 'vertical';
  linear?: boolean;
  ariaLabel?: string;
  onStepChange?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, activeStep: controlledStep, defaultActiveStep = 0, orientation = 'horizontal', linear = false, ariaLabel, onStepChange, className = '' }: StepperProps) {
  const { t } = useI18n();
  const [uncontrolledStep, setUncontrolledStep] = useState(defaultActiveStep);
  const activeStep = controlledStep ?? uncontrolledStep;
  const isVertical = orientation === 'vertical';
  const enabledIndices = steps.map((step, index) => isStepDisabled(index, step, activeStep, linear) ? -1 : index).filter((index) => index >= 0);

  const selectStep = useCallback((index: number) => {
    const step = steps[index];
    if (!step || isStepDisabled(index, step, activeStep, linear)) return;
    if (controlledStep === undefined) setUncontrolledStep(index);
    onStepChange?.(index);
  }, [activeStep, controlledStep, linear, onStepChange, steps]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'tab') return;
    const current = Number(target.dataset.stepIndex);
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const previousKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    let nextIndex = -1;
    if (event.key === nextKey || (!isVertical && event.key === 'ArrowLeft' && false)) {
      const position = enabledIndices.indexOf(current);
      nextIndex = enabledIndices[(position + 1 + enabledIndices.length) % enabledIndices.length] ?? -1;
    } else if (event.key === previousKey) {
      const position = enabledIndices.indexOf(current);
      nextIndex = enabledIndices[(position - 1 + enabledIndices.length) % enabledIndices.length] ?? -1;
    } else if (event.key === 'Home') nextIndex = enabledIndices[0] ?? -1;
    else if (event.key === 'End') nextIndex = enabledIndices.at(-1) ?? -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    selectStep(nextIndex);
    event.currentTarget.querySelector<HTMLElement>(`[data-step-index="${nextIndex}"]`)?.focus();
  };

  return (
    <div className={['sp-stepper', isVertical && 'sp-stepper--vertical', className].filter(Boolean).join(' ')} role="tablist" aria-label={ariaLabel ?? t('progress')} aria-orientation={orientation} onKeyDown={onKeyDown}>
      {steps.map((step, index) => {
        const state = index < activeStep ? 'completed' : index === activeStep ? 'active' : 'upcoming';
        const disabled = isStepDisabled(index, step, activeStep, linear);
        const isLast = index === steps.length - 1;
        return (
          <button
            key={`${step.label}-${index}`}
            type="button"
            role="tab"
            className={['sp-step', state === 'active' && 'sp-step--active', state === 'completed' && 'sp-step--completed', disabled && 'sp-step--disabled', isVertical && 'sp-step--vertical'].filter(Boolean).join(' ')}
            disabled={disabled}
            aria-selected={state === 'active'}
            aria-disabled={disabled || undefined}
            data-step-index={index}
            tabIndex={index === activeStep ? 0 : -1}
            onClick={() => selectStep(index)}
          >
            <span className="sp-step__indicator">
              {state === 'completed' ? <Icon name={step.icon ?? 'check'} size={16} ariaLabel={t('done')} /> : step.icon ? <Icon name={step.icon} size={16} aria-hidden="true" /> : <span className="sp-step__number">{index + 1}</span>}
            </span>
            <span className="sp-step__content"><span className="sp-step__label">{step.label}</span>{step.description && <span className="sp-step__desc">{step.description}</span>}</span>
            {!isLast && <span className="sp-step__connector" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

function isStepDisabled(index: number, step: StepItem, activeStep: number, linear: boolean): boolean {
  return Boolean(step.disabled || (linear && index > activeStep));
}
