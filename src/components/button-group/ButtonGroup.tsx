import './ButtonGroup.css';
import { Children, cloneElement, isValidElement, useCallback, useState, type MouseEvent, type ReactNode } from 'react';
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from '../button/Button.js';
import { Icon } from '../../icons/Icon.js';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupToggleMode = 'none' | 'single' | 'multiple';
export type ButtonGroupVariant = ButtonVariant;
export type ButtonGroupSize = ButtonSize;

export interface ButtonGroupItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonGroupProps {
  items?: ButtonGroupItem[];
  children?: ReactNode;
  orientation?: ButtonGroupOrientation;
  toggleMode?: ButtonGroupToggleMode;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  onValueChange?: (value: string[]) => void;
  onItemClick?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  ariaLabel?: string;
  className?: string;
}

type GroupButtonProps = ButtonProps & { value?: string | number };

function normalizeValue(value: string | number | undefined): string | undefined {
  return value == null ? undefined : String(value);
}

export function ButtonGroup({
  items = [],
  children,
  orientation = 'horizontal',
  toggleMode = 'none',
  value: controlledValue,
  defaultValue = [],
  onChange,
  onValueChange,
  onItemClick,
  variant = 'outline',
  size = 'md',
  ariaLabel,
  className = '',
}: ButtonGroupProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue);
  const selected = controlledValue ?? uncontrolledValue;

  const handleClick = useCallback((itemValue: string | undefined, event: MouseEvent<HTMLButtonElement>, disabled = false, itemHandler?: ButtonGroupItem['onClick']) => {
    itemHandler?.(event);
    if (disabled || !itemValue) return;
    onItemClick?.(itemValue, event);
    if (toggleMode === 'none') return;
    const next = toggleMode === 'single'
      ? (selected.includes(itemValue) ? [] : [itemValue])
      : selected.includes(itemValue) ? selected.filter((entry) => entry !== itemValue) : [...selected, itemValue];
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
    onValueChange?.(next);
  }, [isControlled, onChange, onItemClick, onValueChange, selected, toggleMode]);

  const rootClasses = ['sp-button-group', orientation === 'vertical' && 'sp-button-group--vertical', className].filter(Boolean).join(' ');
  const childNodes = children != null ? Children.toArray(children) : null;
  const renderedItems = items.map((item) => {
    const active = toggleMode !== 'none' && selected.includes(item.value);
    return (
      <Button
        key={item.value}
        variant={variant}
        size={size}
        disabled={item.disabled}
        active={active}
        aria-pressed={toggleMode !== 'none' ? active : undefined}
        onClick={(event) => handleClick(item.value, event, item.disabled, item.onClick)}
        iconLeft={item.icon}
      >
        {item.label}
      </Button>
    );
  });
  const renderedChildren = childNodes?.map((child, index) => {
    if (!isValidElement<GroupButtonProps>(child)) return child;
    const itemValue = normalizeValue(child.props.value);
    const active = toggleMode !== 'none' && itemValue != null && selected.includes(itemValue);
    const originalOnClick = child.props.onClick;
    return cloneElement(child, {
      key: child.key ?? `group-child-${index}`,
      variant: child.props.variant ?? variant,
      size: child.props.size ?? size,
      active,
      'aria-pressed': toggleMode !== 'none' ? active : child.props['aria-pressed'],
      onClick: (event: MouseEvent<HTMLButtonElement>) => handleClick(itemValue, event, child.props.disabled, originalOnClick),
    });
  });

  return (
    <div className={rootClasses} role="group" aria-label={ariaLabel} data-orientation={orientation}>
      {renderedChildren ?? renderedItems}
    </div>
  );
}

export interface ButtonGroupButtonProps extends ButtonProps { value: string; }

export function ButtonGroupButton(props: ButtonGroupButtonProps) {
  return <Button {...props} />;
}

export function ButtonGroupItemIcon({ name, size = 16 }: { name: string; size?: number }) {
  return <Icon name={name} size={size} aria-hidden="true" />;
}
