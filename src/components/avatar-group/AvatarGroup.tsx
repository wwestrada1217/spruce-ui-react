import './AvatarGroup.css';
import { Avatar, type AvatarSize } from '../avatar/Avatar.js';

export interface AvatarGroupItem {
  name?: string;
  src?: string;
  alt?: string;
}

export interface AvatarGroupProps {
  /** Array of avatar data objects. */
  items: AvatarGroupItem[];
  /** Maximum number of avatars to show before the overflow badge. */
  max?: number;
  /** Size applied to all avatars and the overflow badge. */
  size?: AvatarSize;
  /** Negative overlap spacing in px between avatars. */
  spacing?: number;
  /** When `true`, the first avatar stacks on top. */
  invertStack?: boolean;
  /** Border color around each avatar (CSS color). Defaults to surface background. */
  borderColor?: string;
  /** Additional CSS class. */
  className?: string;
}

/**
 * Displays a row of overlapping avatars with an overflow count badge.
 *
 * @example
 * ```tsx
 * <AvatarGroup
 *   items={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]}
 *   max={2}
 *   size="sm"
 * />
 * ```
 */
export function AvatarGroup({
  items,
  max = 5,
  size = 'md',
  spacing = 8,
  invertStack = false,
  borderColor = '',
  className = '',
}: AvatarGroupProps) {
  const visibleItems = items.slice(0, max);
  const overflowCount = Math.max(0, items.length - max);

  const groupStyle: React.CSSProperties = {
    ['--sp-avatar-spacing' as string]: `${spacing}px`,
    ...(borderColor ? { ['--sp-avatar-group-border' as string]: borderColor } : {}),
  };

  return (
    <div
      className={['sp-avatar-group', className].filter(Boolean).join(' ')}
      style={groupStyle}
    >
      {visibleItems.map((item, i) => (
        <Avatar
          key={i}
          src={item.src ?? ''}
          name={item.name ?? ''}
          alt={item.alt ?? item.name ?? ''}
          size={size}
          style={{ zIndex: invertStack ? visibleItems.length - i : i + 1 }}
        />
      ))}
      {overflowCount > 0 && (
        <span
          className={[
            'sp-avatar-group__overflow',
            `sp-avatar-group__overflow--${size}`,
          ].join(' ')}
          style={{ zIndex: visibleItems.length + 1 }}
          aria-label={`${overflowCount} more`}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}
