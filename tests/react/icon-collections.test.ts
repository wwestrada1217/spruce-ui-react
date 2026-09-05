import { describe, expect, it } from 'vitest';
import {
  ACTION_ICONS,
  CONTENT_ICONS,
  DATA_ICONS,
  DEVELOPMENT_ICONS,
  DUOTONE_ICONS,
  EDITOR_ICONS,
  FLAG_ICONS,
  GENERAL_ICONS,
  LAYOUT_ICONS,
  NAVIGATION_ICONS,
  SOCIAL_ICONS,
  STATUS_ICONS,
} from '../../src/index.js';

const COLLECTION_COUNTS = {
  action: [ACTION_ICONS, 46],
  content: [CONTENT_ICONS, 21],
  data: [DATA_ICONS, 18],
  development: [DEVELOPMENT_ICONS, 30],
  duotone: [DUOTONE_ICONS, 10],
  editor: [EDITOR_ICONS, 20],
  general: [GENERAL_ICONS, 89],
  layout: [LAYOUT_ICONS, 22],
  navigation: [NAVIGATION_ICONS, 34],
  social: [SOCIAL_ICONS, 19],
  status: [STATUS_ICONS, 18],
} as const;

describe('icon collections', () => {
  it('keeps the shared Angular collection counts aligned', () => {
    for (const [collection, expectedCount] of Object.values(COLLECTION_COUNTS)) {
      expect(collection).toHaveLength(expectedCount);
      expect(new Set(collection.map(([name]) => name)).size).toBe(expectedCount);
    }
  });

  it('ships the complete opt-in flag collection', () => {
    expect(Object.keys(FLAG_ICONS)).toHaveLength(200);
    expect(FLAG_ICONS['flag-us']).toContain('<svg');
    expect(FLAG_ICONS['flag-ph']).toContain('<svg');
  });
});
