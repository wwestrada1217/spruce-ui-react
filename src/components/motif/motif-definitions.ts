import {
  CIRCLE_MOTIFS,
  DOT_MOTIFS,
  FRAME_MOTIFS,
  GEOMETRIC_MOTIFS,
  GRID_MOTIFS,
  LINE_MOTIFS,
  ORGANIC_MOTIFS,
} from './collections/index.js';
import type { SpBuiltInMotif, SpMotifDefinition } from './collections/motif-definition.js';

export type {
  SpBuiltInMotif,
  SpBuiltInMotifDefinition,
  SpMotifAppearance,
  SpMotifDefinition,
  SpMotifName,
} from './collections/motif-definition.js';

export {
  CIRCLE_MOTIFS,
  DOT_MOTIFS,
  FRAME_MOTIFS,
  GEOMETRIC_MOTIFS,
  GRID_MOTIFS,
  LINE_MOTIFS,
  ORGANIC_MOTIFS,
} from './collections/index.js';

/** Every individual motif definition, re-exported for direct registration. */
export * from './collections/index.js';

export const SP_BUILT_IN_MOTIFS: readonly SpMotifDefinition[] = [
  ...GEOMETRIC_MOTIFS,
  ...CIRCLE_MOTIFS,
  ...GRID_MOTIFS,
  ...DOT_MOTIFS,
  ...LINE_MOTIFS,
  ...ORGANIC_MOTIFS,
  ...FRAME_MOTIFS,
];

export const SP_BUILT_IN_MOTIF_NAMES: readonly SpBuiltInMotif[] = SP_BUILT_IN_MOTIFS.map(
  (motif) => motif.name,
) as readonly SpBuiltInMotif[];
