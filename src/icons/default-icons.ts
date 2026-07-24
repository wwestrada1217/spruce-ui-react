import type { IconDefinition } from './collections/icon-definition.js';
import { iconSet } from './collections/icon-definition.js';
import { NAVIGATION_ICONS } from './collections/navigation.js';
import { ACTION_ICONS } from './collections/action.js';
import { STATUS_ICONS } from './collections/status.js';
import { SOCIAL_ICONS } from './collections/social.js';
import { CONTENT_ICONS } from './collections/content.js';
import { EDITOR_ICONS } from './collections/editor.js';
import { LAYOUT_ICONS } from './collections/layout.js';
import { DATA_ICONS } from './collections/data.js';
import { DEVELOPMENT_ICONS } from './collections/development.js';
import { GENERAL_ICONS } from './collections/general.js';
import { DUOTONE_ICONS } from './collections/duotone.js';

export const ALL_DEFAULT_ICONS: readonly IconDefinition[] = [
  ...NAVIGATION_ICONS,
  ...ACTION_ICONS,
  ...STATUS_ICONS,
  ...SOCIAL_ICONS,
  ...CONTENT_ICONS,
  ...EDITOR_ICONS,
  ...LAYOUT_ICONS,
  ...DATA_ICONS,
  ...DEVELOPMENT_ICONS,
  ...GENERAL_ICONS,
  ...DUOTONE_ICONS,
];

export const DEFAULT_ICONS: Record<string, string> = iconSet(...ALL_DEFAULT_ICONS);
