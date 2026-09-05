/**
 * Tree-shakeable illustration definition and collection utilities.
 */

export type IllustrationCategory =
  | 'status'
  | 'hr'
  | 'payroll'
  | 'finance'
  | 'technology'
  | 'inventory'
  | 'project-management'
  | 'helpdesk'
  | 'security'
  | 'document'
  | 'people'
  | 'sales-marketing'
  | 'telecommunications'
  | 'transportation'
  | 'shipping'
  | 'construction'
  | 'agriculture'
  | 'petro-fuel'
  | 'education'
  | 'healthcare'
  | 'science'
  | 'pet-care'
  | 'jobs-labor'
  | 'robotics';

export interface IllustrationDefinition {
  /** Unique kebab-case identifier, e.g. 'not-found', 'employee-onboarding' */
  readonly name: string;
  /** Human-readable title, e.g. 'Page Not Found', 'Employee Onboarding' */
  readonly title: string;
  /** High-level category grouping */
  readonly category: IllustrationCategory;
  /** Searchable tags and descriptive keywords */
  readonly tags?: readonly string[];
  /** SVG viewBox coordinate system (typically '0 0 320 240') */
  readonly viewBox?: string;
  /** Complete standalone SVG markup string */
  readonly svg: string;
}

/**
 * Convert individual illustration definitions or illustration arrays into a
 * name-indexed record for registry registration.
 */
export function illustrationSet(
  ...defs: (IllustrationDefinition | readonly IllustrationDefinition[])[]
): Record<string, IllustrationDefinition> {
  const result: Record<string, IllustrationDefinition> = {};
  for (const item of defs) {
    if (Array.isArray(item)) {
      for (const def of item) {
        result[def.name] = def;
      }
    } else if (item && typeof item === 'object' && 'name' in item) {
      result[item.name] = item;
    }
  }
  return result;
}
