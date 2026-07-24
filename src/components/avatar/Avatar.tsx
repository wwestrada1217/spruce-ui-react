import './Avatar.css';
import type { HTMLAttributes } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL — when provided, renders an `<img>` instead of initials. */
  src?: string;
  /** Alt text for the avatar image. */
  alt?: string;
  /** Full name used to derive initials when no `src` is provided. */
  name?: string;
  /** Avatar size. */
  size?: AvatarSize;
  /** Avatar shape. */
  shape?: AvatarShape;
  /** Optional online/offline/busy status badge. */
  status?: AvatarStatus | null;
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

/**
 * Displays a user avatar from an image or computed initials.
 *
 * @example
 * ```tsx
 * <Avatar name="Jane Doe" size="md" status="online" />
 * <Avatar src="/avatars/jane.jpg" alt="Jane" size="lg" />
 * ```
 */
export function Avatar({
  src = '',
  alt = '',
  name = '',
  size = 'md',
  shape = 'circle',
  status = null,
  className = '',
  ...props
}: AvatarProps) {
  const classes = [
    'sp-avatar',
    `sp-avatar--${size}`,
    shape === 'square' && 'sp-avatar--square',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {src ? (
        <img className="sp-avatar__img" src={src} alt={alt} />
      ) : (
        <span className="sp-avatar__initials">{getInitials(name)}</span>
      )}
      {status && (
        <span
          className={`sp-avatar__status sp-avatar__status--${status}`}
          aria-label={status}
        />
      )}
    </span>
  );
}
