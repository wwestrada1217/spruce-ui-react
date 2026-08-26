import type { SpDecorativeBackground } from './Motif.js';

export function resolveDecorativeBackground(
  flat: SpDecorativeBackground,
  object?: SpDecorativeBackground,
): SpDecorativeBackground | undefined {
  const merged = Object.fromEntries(
    Object.entries({ ...object, ...flat }).filter(([, value]) => value !== undefined && value !== ''),
  ) as SpDecorativeBackground;
  return merged.motif || merged.icon || merged.svg ? merged : undefined;
}
