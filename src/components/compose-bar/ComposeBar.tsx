import './ComposeBar.css';
import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

export type ComposeBarSize = 'sm' | 'md' | 'lg';
export type ComposeBarShape = 'pill' | 'rounded';

export interface ComposeBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Content placed before the main input/editor. */
  leading?: ReactNode;
  /** Main input, textarea, or editor content. */
  children?: ReactNode;
  /** Actions placed after the main input/editor. */
  trailing?: ReactNode;
  size?: ComposeBarSize;
  shape?: ComposeBarShape;
  style?: CSSProperties;
}

/** A tokenized three-slot shell for chat, REST, and command composers. */
export function ComposeBar({
  leading,
  children,
  trailing,
  size = 'md',
  shape = 'pill',
  className = '',
  style,
  onFocusCapture,
  onBlurCapture,
  ...rest
}: ComposeBarProps) {
  const { direction } = useI18n();
  const [focused, setFocused] = useState(false);
  const classes = [
    'sp-compose-bar',
    `sp-compose-bar--${size}`,
    `sp-compose-bar--${shape}`,
    focused && 'sp-compose-bar--focused',
    className,
  ].filter(Boolean).join(' ');

  function handleFocus(event: React.FocusEvent<HTMLDivElement>): void {
    setFocused(true);
    onFocusCapture?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>): void {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setFocused(false);
    onBlurCapture?.(event);
  }

  return (
    <div
      {...rest}
      className={classes}
      style={style}
      dir={direction}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <div className="sp-compose-bar__leading">{leading}</div>
      <div className="sp-compose-bar__body">{children}</div>
      <div className="sp-compose-bar__trailing">{trailing}</div>
    </div>
  );
}

export type SpComposeBarProps = ComposeBarProps;
export type SpComposeBarSize = ComposeBarSize;
export type SpComposeBarShape = ComposeBarShape;
