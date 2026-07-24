import { useIconRegistry } from './icon-registry.js';

const DUOTONE_STYLE = `
  [data-duotone="secondary"] {
    fill: var(--sp-icon-secondary-color, currentColor);
    opacity: var(--sp-icon-secondary-opacity, 0.2);
    stroke: none;
  }
`;

export interface IconProps {
  /** Name of the icon to render. Must be registered in the icon registry. */
  name: string;
  /** Width and height in pixels. Defaults to 16. */
  size?: number;
  /** Accessible label. When provided, sets role="img" and aria-label. */
  ariaLabel?: string;
  /** Additional CSS class name(s). */
  className?: string;
  /** Inline style overrides. */
  style?: React.CSSProperties;
}

/**
 * Renders an SVG icon from the icon registry.
 *
 * Duotone icons support CSS custom properties:
 * - `--sp-icon-secondary-color` (default: `currentColor`)
 * - `--sp-icon-secondary-opacity` (default: `0.2`)
 *
 * @example
 * ```tsx
 * <Icon name="check" size={20} ariaLabel="Done" />
 * ```
 */
export function Icon({ name, size = 16, ariaLabel, className, style }: IconProps) {
  const registry = useIconRegistry();
  const svg = registry.get(name);

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: size,
    height: size,
    fill: 'currentColor',
    ...style,
  };

  const accessibilityProps =
    ariaLabel
      ? { role: 'img' as const, 'aria-label': ariaLabel }
      : { role: 'img' as const, 'aria-hidden': true };

  if (!svg) {
    return (
      <span
        {...accessibilityProps}
        className={className}
        style={containerStyle}
      />
    );
  }

  return (
    <span
      {...accessibilityProps}
      className={className}
      style={containerStyle}
      dangerouslySetInnerHTML={{
        __html: `<style>${DUOTONE_STYLE}</style>${svg}`,
      }}
    />
  );
}
