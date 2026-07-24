import './List.css';
import { type ReactNode, type KeyboardEvent, type CSSProperties } from 'react';

/* ── Public types ──────────────────────────────────────────────────────── */

export type ListSize = 'sm' | 'md' | 'lg';
export type ListVariant = 'default' | 'bordered' | 'striped';

/* ── ListItemLine ──────────────────────────────────────────────────────── */

export interface ListItemLineProps {
  /** Render in smaller, muted text for secondary information. */
  secondary?: boolean;
  /** Truncate overflowing text with an ellipsis. */
  ellipsis?: boolean;
  children?: ReactNode;
}

export function ListItemLine({
  secondary = false,
  ellipsis = false,
  children,
}: ListItemLineProps) {
  const cls = [
    'sp-list-item-line',
    secondary ? 'sp-list-item-line--secondary' : '',
    ellipsis ? 'sp-list-item-line--ellipsis' : '',
  ].filter(Boolean).join(' ');

  return <span className={cls}>{children}</span>;
}

/* ── ListItem ──────────────────────────────────────────────────────────── */

export interface ListItemProps {
  /** Highlight the item as active (subtle background). */
  active?: boolean;
  /** Highlight the item with a left accent border. */
  selected?: boolean;
  /** Disable interaction and dim the item. */
  disabled?: boolean;
  /** Enable hover effects and keyboard activation. */
  interactive?: boolean;
  /** Apply unread styling (bold text, tinted background). */
  unread?: boolean;
  /** Left-side content such as avatars, icons, or checkboxes. */
  leading?: ReactNode;
  /** Right-side content such as badges, buttons, or timestamps. */
  trailing?: ReactNode;
  /** Main body content. */
  children?: ReactNode;
  /** Emitted on click or Enter/Space key when not disabled. */
  onClick?: () => void;
}

export function ListItem({
  active = false,
  selected = false,
  disabled = false,
  interactive = true,
  unread = false,
  leading,
  trailing,
  children,
  onClick,
}: ListItemProps) {
  function handleClick() {
    if (!disabled) onClick?.();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      handleClick();
    }
    if (e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  const cls = [
    'sp-list-item',
    active ? 'sp-list-item--active' : '',
    selected ? 'sp-list-item--selected' : '',
    disabled ? 'sp-list-item--disabled' : '',
    interactive ? 'sp-list-item--interactive' : '',
    unread ? 'sp-list-item--unread' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      role="listitem"
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {leading && <div className="sp-list-item__leading">{leading}</div>}
      <div className="sp-list-item__body">{children}</div>
      {trailing && <div className="sp-list-item__trailing">{trailing}</div>}
    </div>
  );
}

/* ── List ──────────────────────────────────────────────────────────────── */

export interface ListProps {
  /** Controls spacing and font size of list items. */
  size?: ListSize;
  /** Visual style of the list container. */
  variant?: ListVariant;
  /** Accessible label applied to the list element. */
  ariaLabel?: string;
  /** Inline styles passed to the root element. */
  style?: CSSProperties;
  /** Extra CSS class name. */
  className?: string;
  children?: ReactNode;
}

export function List({
  size = 'md',
  variant = 'default',
  ariaLabel,
  style,
  className,
  children,
}: ListProps) {
  const cls = [
    'sp-list',
    variant === 'bordered' ? 'sp-list--bordered' : '',
    variant === 'striped' ? 'sp-list--striped' : '',
    size === 'sm' ? 'sp-list--sm' : '',
    size === 'lg' ? 'sp-list--lg' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} role="list" aria-label={ariaLabel} style={style}>
      {children}
    </div>
  );
}
