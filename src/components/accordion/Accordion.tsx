import './Accordion.css';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type AccordionVariant = 'contained' | 'separated' | 'flush';
export type AccordionSize = 'sm' | 'md' | 'lg';
export type AccordionIndicator = 'chevron' | 'plus' | 'none';
export type AccordionIndicatorPosition = 'start' | 'end';
export type AccordionTriggerMode = 'row' | 'indicator';

export interface AccordionToggleEvent {
  value: string;
  open: boolean;
}

export interface AccordionHandle {
  isOpen: (value: string) => boolean;
  setOpen: (value: string, open: boolean) => void;
  toggle: (value: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

interface AccordionContextValue {
  multiple: boolean;
  collapsible: boolean;
  disabled: boolean;
  variant: AccordionVariant;
  size: AccordionSize;
  indicator: AccordionIndicator;
  indicatorPosition: AccordionIndicatorPosition;
  headingLevel: number;
  lazy: boolean;
  findable: boolean;
  openItems: Set<string>;
  registeredItems: string[];
  register: (id: string, defaultOpen: boolean) => void;
  unregister: (id: string) => void;
  toggle: (id: string) => void;
  setOpen: (id: string, open: boolean) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  multiple?: boolean;
  collapsible?: boolean;
  variant?: AccordionVariant;
  size?: AccordionSize;
  indicator?: AccordionIndicator;
  indicatorPosition?: AccordionIndicatorPosition;
  disabled?: boolean;
  headingLevel?: number;
  lazy?: boolean;
  findable?: boolean;
  allToggle?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  onChange?: (value: string[]) => void;
  onItemToggle?: (event: AccordionToggleEvent) => void;
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
}

export const Accordion = forwardRef(function Accordion({
  multiple = false,
  collapsible = true,
  variant = 'contained',
  size = 'md',
  indicator = 'chevron',
  indicatorPosition = 'end',
  disabled = false,
  headingLevel = 3,
  lazy = false,
  findable = true,
  allToggle = false,
  value,
  defaultValue = [],
  onValueChange,
  onChange,
  onItemToggle,
  ariaLabel,
  children,
  className = '',
}: AccordionProps, ref: ForwardedRef<AccordionHandle>) {
  const { t } = useI18n();
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const [registeredItems, setRegisteredItems] = useState<string[]>([]);
  const isControlled = value !== undefined;
  const openItems = useMemo(
    () => new Set(isControlled ? value : internalValue),
    [internalValue, isControlled, value],
  );
  const clampedHeadingLevel = Math.min(6, Math.max(1, Math.round(headingLevel)));

  const publish = useCallback((next: string[]) => {
    const normalized = multiple ? next : next.slice(0, 1);
    if (!isControlled) setInternalValue(normalized);
    onValueChange?.(normalized);
    onChange?.(normalized);
  }, [isControlled, multiple, onChange, onValueChange]);

  const setOpen = useCallback((id: string, open: boolean) => {
    if (disabled) return;
    const currentlyOpen = openItems.has(id);
    if (currentlyOpen === open) return;
    if (!open && !collapsible && !multiple) return;
    const next = new Set(openItems);
    if (open) {
      if (!multiple) next.clear();
      next.add(id);
    } else {
      next.delete(id);
    }
    publish([...next]);
    onItemToggle?.({ value: id, open });
  }, [collapsible, disabled, multiple, onItemToggle, openItems, publish]);

  const toggle = useCallback((id: string) => setOpen(id, !openItems.has(id)), [openItems, setOpen]);
  const register = useCallback((id: string, defaultOpen: boolean) => {
    setRegisteredItems((items) => items.includes(id) ? items : [...items, id]);
    if (defaultOpen && !isControlled && !openItems.has(id)) {
      publish(multiple ? [...internalValue, id] : [id]);
    }
  }, [internalValue, isControlled, multiple, openItems, publish]);
  const unregister = useCallback((id: string) => {
    setRegisteredItems((items) => items.filter((item) => item !== id));
  }, []);

  const context = useMemo<AccordionContextValue>(() => ({
    multiple,
    collapsible,
    disabled,
    variant,
    size,
    indicator,
    indicatorPosition,
    headingLevel: clampedHeadingLevel,
    lazy,
    findable,
    openItems,
    registeredItems,
    register,
    unregister,
    toggle,
    setOpen,
  }), [clampedHeadingLevel, collapsible, disabled, findable, indicator, indicatorPosition, lazy, multiple, openItems, register, registeredItems, setOpen, size, toggle, unregister, variant]);

  const allOpen = registeredItems.length > 0 && registeredItems.every((id) => openItems.has(id));
  const expandAll = useCallback(() => {
    if (!multiple) return;
    publish([...registeredItems]);
  }, [multiple, publish, registeredItems]);
  const collapseAll = useCallback(() => publish([]), [publish]);
  const toggleAll = () => {
    if (allOpen) collapseAll();
    else expandAll();
  };

  useImperativeHandle(ref, () => ({
    isOpen: (id) => openItems.has(id),
    setOpen,
    toggle,
    expandAll,
    collapseAll,
  }), [collapseAll, expandAll, openItems, setOpen, toggle]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches('[data-sp-accordion-trigger]')) return;
    const triggers = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-sp-accordion-trigger]:not([disabled])')];
    const index = triggers.indexOf(target as HTMLButtonElement);
    if (index < 0) return;
    const nextIndex = event.key === 'ArrowDown' ? (index + 1) % triggers.length
      : event.key === 'ArrowUp' ? (index - 1 + triggers.length) % triggers.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? triggers.length - 1 : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    triggers[nextIndex]?.focus();
  };

  return (
    <AccordionContext.Provider value={context}>
      <div
        className={['sp-accordion', `sp-accordion--${variant}`, `sp-accordion--${size}`, className].filter(Boolean).join(' ')}
        role="region"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
      >
        {allToggle && multiple && registeredItems.length > 0 && (
          <div className="sp-accordion__bar">
            <button className="sp-accordion__all" type="button" onClick={toggleAll} disabled={disabled}>
              {allOpen ? t('collapseAll') : t('expandAll')}
            </button>
          </div>
        )}
        <div className="sp-accordion__items">{children}</div>
      </div>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps {
  value?: string;
  header?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  icon?: string | null;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  indicator?: AccordionIndicator;
  indicatorPosition?: AccordionIndicatorPosition;
  trigger?: AccordionTriggerMode;
  triggerMode?: AccordionTriggerMode;
  lazy?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function AccordionItem({
  value: valueProp,
  header,
  label,
  description,
  icon = null,
  open: controlledOpen,
  defaultOpen = false,
  disabled = false,
  indicator: indicatorProp,
  indicatorPosition: indicatorPositionProp,
  trigger,
  triggerMode,
  lazy: lazyProp,
  actions,
  children,
  className = '',
  onOpenChange,
}: AccordionItemProps) {
  const itemId = useId();
  const ctx = useContext(AccordionContext);
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  }, [ctx]);
  const { t } = useI18n();
  const value = valueProp ?? itemId;
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const [hasBeenOpen, setHasBeenOpen] = useState(defaultOpen || controlledOpen === true);
  const isOpen = controlledOpen ?? (ctx ? ctx.openItems.has(value) : localOpen);
  const isDisabled = disabled || Boolean(ctx?.disabled);
  const indicator = indicatorProp ?? ctx?.indicator ?? 'chevron';
  const indicatorPosition = indicatorPositionProp ?? ctx?.indicatorPosition ?? 'end';
  const triggerModeValue = triggerMode ?? trigger ?? 'row';
  const lazy = lazyProp ?? ctx?.lazy ?? false;
  const headingLevel = ctx?.headingLevel ?? 3;
  const findable = ctx?.findable ?? true;
  const headingId = `${itemId}-heading`;
  const panelId = `${itemId}-panel`;
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentCtx = ctxRef.current;
    if (!currentCtx) return;
    currentCtx.register(value, defaultOpen || controlledOpen === true);
    return () => currentCtx.unregister(value);
  }, [controlledOpen, defaultOpen, value]);

  useEffect(() => {
    // Preserve lazy content after an externally controlled item has opened once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setHasBeenOpen(true);
  }, [isOpen]);

  const setItemOpen = useCallback((next: boolean) => {
    if (isDisabled) return;
    if (!ctx) {
      if (controlledOpen === undefined) setLocalOpen(next);
      onOpenChange?.(next);
      return;
    }
    ctx.setOpen(value, next);
    onOpenChange?.(next);
  }, [controlledOpen, ctx, isDisabled, onOpenChange, value]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (findable && !isOpen) body.setAttribute('hidden', 'until-found');
    else if (isOpen) body.removeAttribute('hidden');
    const beforeMatch = () => setItemOpen(true);
    body.addEventListener('beforematch', beforeMatch);
    return () => body.removeEventListener('beforematch', beforeMatch);
  }, [findable, isOpen, setItemOpen]);

  function handleRowClick(event: MouseEvent<HTMLDivElement>) {
    if (isDisabled) return;
    const target = event.target as HTMLElement;
    if (target.closest('.sp-accordion-item__actions')) return;
    const interactive = target.closest(
      'button, a, input, select, textarea, label, summary, [role="button"], [role="menuitem"], [contenteditable="true"]',
    );
    if (interactive && !interactive.hasAttribute('data-sp-accordion-trigger')) return;
    setItemOpen(!isOpen);
  }

  const displayHeader = header ?? label;
  const bodyShouldRender = !lazy || hasBeenOpen || isOpen;
  const indicatorVisual = indicator !== 'none' && (
    <span className="sp-accordion-item__indicator" aria-hidden="true">
      <Icon name={indicator === 'plus' ? (isOpen ? 'minus' : 'plus') : 'chevron-down'} size={16} />
    </span>
  );
  const indicatorButton = indicator !== 'none' && (
    <button
      type="button"
      className="sp-accordion-item__indicator"
      aria-label={isOpen ? t('collapse') : t('expand')}
      aria-expanded={isOpen}
      aria-controls={panelId}
      data-sp-accordion-trigger="true"
      disabled={isDisabled}
      tabIndex={triggerModeValue === 'row' ? -1 : undefined}
    >
      <Icon name={indicator === 'plus' ? (isOpen ? 'minus' : 'plus') : 'chevron-down'} size={16} aria-hidden="true" />
    </button>
  );

  const title = (
    <span className="sp-accordion-item__title-wrap">
      <span className="sp-accordion-item__title-line">
        {icon && <Icon className="sp-accordion-item__icon" name={icon} size={16} aria-hidden="true" />}
        <span id={triggerModeValue === 'indicator' ? headingId : undefined} className="sp-accordion-item__title">{displayHeader}</span>
      </span>
      {description && <span className="sp-accordion-item__description">{description}</span>}
    </span>
  );

  return (
    <div className={['sp-accordion-item', isOpen && 'sp-accordion-item--open', isDisabled && 'sp-accordion-item--disabled', className].filter(Boolean).join(' ')}>
      <div
        role="heading"
        aria-level={headingLevel}
        className={['sp-accordion-item__header', `sp-accordion-item__header--${indicatorPosition}`, triggerModeValue === 'indicator' && 'sp-accordion-item__header--free'].filter(Boolean).join(' ')}
        onClick={handleRowClick}
      >
        {indicatorPosition === 'start' && (triggerModeValue === 'indicator' ? indicatorButton : indicatorVisual)}
        {triggerModeValue === 'row' ? (
          <button
            id={headingId}
            className="sp-accordion-item__trigger"
            type="button"
            disabled={isDisabled}
            aria-expanded={isOpen}
            aria-controls={panelId}
            data-sp-accordion-trigger="true"
          >
            {title}
          </button>
        ) : title}
        {actions && <div className="sp-accordion-item__actions" onClick={(event) => event.stopPropagation()}>{actions}</div>}
        {indicatorPosition === 'end' && (triggerModeValue === 'indicator' ? indicatorButton : indicatorVisual)}
      </div>
      {bodyShouldRender && (
        <div
          ref={bodyRef}
          id={panelId}
          className="sp-accordion-item__body"
          role="region"
          aria-labelledby={headingId}
          aria-hidden={!isOpen}
          inert={!isOpen ? true : undefined}
          hidden={!isOpen && !findable}
          data-findable={findable ? 'true' : undefined}
        >
          <div className="sp-accordion-item__body-inner">{children}</div>
        </div>
      )}
    </div>
  );
}
