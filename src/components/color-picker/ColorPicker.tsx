import './ColorPicker.css';
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { Popover } from '../popover/Popover.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export interface ColorPickerColor {
  label: string;
  value: string;
}

export interface ColorPickerHandle {
  toggle(): void;
  openPanel(): void;
  close(): void;
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  icon?: string | null;
  colors?: readonly ColorPickerColor[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  error?: string;
  hint?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS: readonly ColorPickerColor[] = [
  { label: 'Black', value: '#000000' },
  { label: 'Dark Gray', value: '#434343' },
  { label: 'Gray', value: '#666666' },
  { label: 'Light Gray', value: '#999999' },
  { label: 'Red', value: '#e53935' },
  { label: 'Orange', value: '#fb8c00' },
  { label: 'Yellow', value: '#fdd835' },
  { label: 'Green', value: '#43a047' },
  { label: 'Teal', value: '#00897b' },
  { label: 'Blue', value: '#1e88e5' },
  { label: 'Purple', value: '#8e24aa' },
  { label: 'Pink', value: '#d81b60' },
  { label: 'Brown', value: '#6d4c41' },
  { label: 'White', value: '#ffffff' },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function focusOption(
  options: readonly ColorPickerColor[],
  refs: React.MutableRefObject<Array<HTMLButtonElement | null>>,
  index: number,
): void {
  const next = Math.max(0, Math.min(options.length - 1, index));
  refs.current[next]?.focus();
}

export const ColorPicker = forwardRef<ColorPickerHandle, ColorPickerProps>(function ColorPicker(
  {
    value,
    defaultValue = '#111827',
    onChange,
    label,
    icon = 'palette',
    colors = DEFAULT_COLORS,
    open,
    onOpenChange,
    disabled = false,
    readOnly = false,
    hidden = false,
    error,
    hint,
    errors,
    invalid,
    required = false,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    className = '',
    style,
  },
  ref: Ref<ColorPickerHandle>,
) {
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const [nativeOpen, setNativeOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const selectedValue = value ?? internalValue;
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const labelText = label || field?.label || t('color');
  const errorId = `sp-color-picker-${instanceId}-error`;
  const hintId = `sp-color-picker-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy ||
    (errorMessage ? errorId : hint || field?.hint ? hintId : undefined);

  const setOpenState = useCallback((next: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (open === undefined) setInternalOpen(next);
    if (!next) setNativeOpen(false);
    onOpenChange?.(next);
  }, [effectiveDisabled, effectiveReadOnly, onOpenChange, open]);

  const emitValue = useCallback((next: string) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  }, [onChange, value]);

  const selectColor = useCallback((next: string) => {
    emitValue(next);
    setOpenState(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [emitValue, setOpenState]);

  const openNativePicker = useCallback(() => {
    setNativeOpen(true);
    requestAnimationFrame(() => {
      nativeInputRef.current?.focus();
      nativeInputRef.current?.click();
    });
  }, []);

  useImperativeHandle(ref, () => ({
    toggle: () => setOpenState(!isOpen),
    openPanel: () => setOpenState(true),
    close: () => setOpenState(false),
  }), [isOpen, setOpenState]);

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(colors, optionRefs, (index + 1) % colors.length);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(colors, optionRefs, (index - 1 + colors.length) % colors.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusOption(colors, optionRefs, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusOption(colors, optionRefs, colors.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpenState(false);
      triggerRef.current?.focus();
    }
  }

  if (hidden || field?.hidden) return null;
  const rootClasses = [
    'sp-color-picker',
    isOpen && 'sp-color-picker--open',
    effectiveDisabled && 'sp-color-picker--disabled',
    effectiveReadOnly && 'sp-color-picker--readonly',
    hasError && 'sp-color-picker--error',
    className,
  ].filter(Boolean).join(' ');
  const triggerLabel = ariaLabel || labelText;

  return (
    <div className={rootClasses} style={style} dir={direction}>
      <Popover
        open={isOpen}
        onOpenChange={setOpenState}
        placement="bottom-start"
        offset={4}
        padding="0"
        panelClassName="sp-color-picker__popover-panel"
        trigger={
          <button
            ref={triggerRef}
            className="sp-color-picker__trigger"
            type="button"
            aria-label={triggerLabel}
            title={triggerLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-labelledby={ariaLabelledBy || undefined}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            aria-required={required || field?.required || undefined}
            aria-disabled={effectiveDisabled || undefined}
            disabled={effectiveDisabled}
          >
            {icon && <Icon name={icon} size={14} aria-hidden="true" />}
            <span className="sp-color-picker__swatch" style={{ background: selectedValue }} aria-hidden="true" />
          </button>
        }
      >
        <div className="sp-color-picker__panel" role="dialog" aria-label={labelText}>
          <div
            className="sp-color-picker__grid"
            role="listbox"
            aria-label={`${labelText} ${t('options').toLowerCase()}`}
            aria-orientation="horizontal"
          >
            {colors.map((color, index) => {
              const active = normalize(selectedValue) === normalize(color.value);
              return (
                <button
                  key={`${color.value}-${index}`}
                  ref={(element) => { optionRefs.current[index] = element; }}
                  className={['sp-color-picker__option', active && 'sp-color-picker__option--active'].filter(Boolean).join(' ')}
                  type="button"
                  role="option"
                  aria-label={color.label}
                  aria-selected={active}
                  disabled={effectiveDisabled || effectiveReadOnly}
                  style={{ '--sp-color-picker-option-color': color.value } as CSSProperties}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                  onClick={() => selectColor(color.value)}
                >
                  <span className="sp-color-picker__option-swatch" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <button
            className="sp-color-picker__custom"
            type="button"
            disabled={effectiveDisabled || effectiveReadOnly}
            onClick={openNativePicker}
          >
            {t('custom')}
          </button>
          {nativeOpen && (
            <input
              ref={nativeInputRef}
              className="sp-color-picker__native"
              type="color"
              aria-label={`${labelText} ${t('custom').toLowerCase()}`}
              value={selectedValue}
              onChange={(event) => emitValue(event.target.value)}
            />
          )}
        </div>
      </Popover>
      {errorMessage && <p className="sp-color-picker__error" id={errorId} role="alert">{errorMessage}</p>}
      {hint && !errorMessage && <p className="sp-color-picker__hint" id={hintId}>{hint}</p>}
    </div>
  );
});

