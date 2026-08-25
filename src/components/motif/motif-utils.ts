import type { SpDecorativeBackground } from './Motif.js';

export function resolveDecorativeBackground(
  flat: SpDecorativeBackground,
  object?: SpDecorativeBackground,
): SpDecorativeBackground | undefined {
  const merged = { ...object, ...flat };
  return merged.motif || merged.icon || merged.svg ? merged : undefined;
}
