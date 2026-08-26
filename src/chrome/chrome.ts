/** Shared surface chrome values used by cards, panels, editors, and data surfaces. */
export type Chrome = 'default' | 'outlined' | 'filled' | 'elevated' | 'ghost' | 'flush';
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type Border = 'default' | 'none' | 'subtle' | 'strong';
export type Elevation = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inner';

/** Angular parity aliases retained for consumers migrating from Spruce Angular. */
export type SpChrome = Chrome;
export type SpRadius = Radius;
export type SpBorder = Border;
export type SpElevation = Elevation;

export interface SurfaceChromeProps {
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  elevation?: Elevation;
}

export function surfaceChromeClasses({ chrome, radius, border, elevation }: SurfaceChromeProps): string[] {
  return [
    chrome && `sp-chrome--${chrome}`,
    radius && `sp-radius--${radius}`,
    border && `sp-border--${border}`,
    elevation && `sp-elevation--${elevation}`,
  ].filter((value): value is string => Boolean(value));
}

