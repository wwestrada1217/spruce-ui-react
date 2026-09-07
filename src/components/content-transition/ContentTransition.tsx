import './ContentTransition.css';
import { useImperativeHandle, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react';

export type ContentTransitionType = 'flip-horizontal' | 'flip-vertical' | 'crossfade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom';
export type ContentTransitionTrigger = 'hover' | 'click' | 'focus' | 'manual';

export interface ContentTransitionRenderContext {
  active: boolean;
  showFront: () => void;
  showBack: () => void;
  toggle: () => void;
}

export interface ContentTransitionHandle {
  showFront: () => void;
  showBack: () => void;
  toggle: () => void;
}

export interface ContentTransitionProps {
  front?: ReactNode | ((context: ContentTransitionRenderContext) => ReactNode);
  back?: ReactNode | ((context: ContentTransitionRenderContext) => ReactNode);
  transitionType?: ContentTransitionType;
  type?: ContentTransitionType;
  trigger?: ContentTransitionTrigger;
  transitionTrigger?: ContentTransitionTrigger;
  active?: boolean;
  defaultActive?: boolean;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onActiveChange?: (active: boolean) => void;
  onFlippedChange?: (flipped: boolean) => void;
  duration?: number;
  perspective?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<ContentTransitionHandle>;
}

function renderFace(content: ContentTransitionProps['front'], context: ContentTransitionRenderContext): ReactNode {
  return typeof content === 'function' ? content(context) : content;
}

export function ContentTransition({
  front, back, transitionType, type, trigger, transitionTrigger, active, defaultActive,
  flipped, defaultFlipped = false, onActiveChange, onFlippedChange, duration = 500,
  perspective = 1000, disabled = false, ariaLabel, className = '', style, ref,
}: ContentTransitionProps) {
  const resolvedType = transitionType ?? type ?? 'flip-horizontal';
  const resolvedTrigger = transitionTrigger ?? trigger ?? 'hover';
  const controlledValue = active ?? flipped;
  const [internalActive, setInternalActive] = useState(defaultActive ?? defaultFlipped);
  const isActive = controlledValue ?? internalActive;
  function setActive(next: boolean) {
    if (disabled || next === isActive) return;
    if (controlledValue === undefined) setInternalActive(next);
    onActiveChange?.(next);
    onFlippedChange?.(next);
  }
  const context: ContentTransitionRenderContext = {
    active: isActive,
    showFront: () => setActive(false),
    showBack: () => setActive(true),
    toggle: () => setActive(!isActive),
  };
  useImperativeHandle(ref, () => context);
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((resolvedTrigger === 'click' || resolvedTrigger === 'focus') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); setActive(!isActive);
    }
  }
  const isThreeDimensional = resolvedType.startsWith('flip-');
  const clipped = resolvedType.startsWith('slide-') || resolvedType === 'zoom';
  const rootStyle = { ...style, '--sp-transition-duration': `${duration}ms`, '--sp-transition-perspective': `${perspective}px` } as CSSProperties;
  return <div className={['sp-content-transition', `sp-transition--${resolvedType}`, isActive && 'sp-content-transition--active', isThreeDimensional && 'sp-content-transition--3d', clipped && 'sp-content-transition--clipped', disabled && 'sp-content-transition--disabled', className].filter(Boolean).join(' ')} style={rootStyle} tabIndex={resolvedTrigger === 'click' || resolvedTrigger === 'focus' ? 0 : undefined} role={resolvedTrigger === 'click' ? 'button' : undefined} aria-label={ariaLabel} aria-pressed={resolvedTrigger === 'click' ? isActive : undefined} aria-disabled={disabled || undefined} onKeyDown={onKeyDown} onClick={() => { if (resolvedTrigger === 'click') setActive(!isActive); }} onMouseEnter={() => { if (resolvedTrigger === 'hover' && !window.matchMedia?.('(pointer: coarse)').matches) setActive(true); }} onMouseLeave={() => { if (resolvedTrigger === 'hover') setActive(false); }} onFocus={() => { if (resolvedTrigger === 'focus') setActive(true); }} onBlur={(event) => { if (resolvedTrigger === 'focus' && !event.currentTarget.contains(event.relatedTarget)) setActive(false); }}>
    <div className="sp-transition-face sp-transition-face--front" aria-hidden={isActive} inert={isActive ? true : undefined}>{renderFace(front, context)}</div>
    <div className="sp-transition-face sp-transition-face--back" aria-hidden={!isActive} inert={!isActive ? true : undefined}>{renderFace(back, context)}</div>
  </div>;
}

export interface FlipCardProps extends Omit<ContentTransitionProps, 'type'> {
  width?: string | number;
  height?: string | number;
}

export function FlipCard({ width, height, className = '', style, ...props }: FlipCardProps) {
  const sizing = { ...(width !== undefined ? { width } : {}), ...(height !== undefined ? { height } : {}) };
  return <ContentTransition {...props} className={['sp-flip-card', className].filter(Boolean).join(' ')} style={{ ...style, ...sizing }} />;
}
