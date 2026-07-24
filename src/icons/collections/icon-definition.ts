/**
 * A tree-shakeable icon definition: a [name, svg] tuple.
 *
 * Individual icons are exported as `IconDefinition` constants.
 * Bundlers can drop any icon that is never referenced.
 */
export type IconDefinition = readonly [name: string, svg: string];

/**
 * Convert one or more `IconDefinition` tuples into the
 * `Record<string, string>` expected by `SpruceProvider`.
 *
 * @example
 * // Pick individual icons
 * <SpruceProvider icons={iconSet(iconCheck, iconX, iconChevronDown)}>
 *
 * // Use an entire collection
 * <SpruceProvider icons={iconSet(...NAVIGATION_ICONS)}>
 *
 * // Mix collections and individual icons
 * <SpruceProvider icons={iconSet(...NAVIGATION_ICONS, ...ACTION_ICONS, iconStar)}>
 */
export function iconSet(...defs: IconDefinition[]): Record<string, string> {
  return Object.fromEntries(defs);
}
