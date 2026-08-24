import { SP_I18N_DEFAULT_LABELS, type SpI18nLabels } from '../labels.js';
import { SP_I18N_LABELS_AR } from './ar.js';
import { SP_I18N_LABELS_DE_DE } from './de-DE.js';
import { SP_I18N_LABELS_EN_GB } from './en-GB.js';
import { SP_I18N_LABELS_ES_ES } from './es-ES.js';
import { SP_I18N_LABELS_FIL_PH } from './fil-PH.js';
import { SP_I18N_LABELS_FR_FR } from './fr-FR.js';
import { SP_I18N_LABELS_HI_IN } from './hi-IN.js';
import { SP_I18N_LABELS_IT_IT } from './it-IT.js';
import { SP_I18N_LABELS_JA_JP } from './ja-JP.js';
import { SP_I18N_LABELS_KO_KR } from './ko-KR.js';
import { SP_I18N_LABELS_NL_NL } from './nl-NL.js';
import { SP_I18N_LABELS_PT_BR } from './pt-BR.js';
import { SP_I18N_LABELS_ZH_CN } from './zh-CN.js';
import { SP_I18N_LABELS_ZH_TW } from './zh-TW.js';

export type SpDirection = 'ltr' | 'rtl';

/** A locale shipped with Spruce. */
export interface SpI18nLocale {
  /** BCP 47 language tag used for Intl formatting and the document lang attribute. */
  readonly code: string;
  /** English name for locale pickers. */
  readonly label: string;
  /** Name written in its own language. */
  readonly nativeLabel: string;
  /** Writing direction for the locale. */
  readonly direction: SpDirection;
  /** 0 for Sunday through 6 for Saturday. */
  readonly firstDayOfWeek: number;
  /** Component labels. Unspecified keys fall back to American English. */
  readonly labels: Partial<SpI18nLabels>;
}

export const SP_I18N_LOCALES: readonly SpI18nLocale[] = [
  {
    code: 'en-US',
    label: 'English (United States)',
    nativeLabel: 'English (United States)',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_DEFAULT_LABELS,
  },
  {
    code: 'en-GB',
    label: 'English (United Kingdom)',
    nativeLabel: 'English (United Kingdom)',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_EN_GB,
  },
  {
    code: 'fr-FR',
    label: 'French (France)',
    nativeLabel: 'Français (France)',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_FR_FR,
  },
  {
    code: 'es-ES',
    label: 'Spanish (Spain)',
    nativeLabel: 'Español (España)',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_ES_ES,
  },
  {
    code: 'fil-PH',
    label: 'Filipino (Philippines)',
    nativeLabel: 'Filipino (Pilipinas)',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_LABELS_FIL_PH,
  },
  {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    direction: 'rtl',
    firstDayOfWeek: 6,
    labels: SP_I18N_LABELS_AR,
  },
  {
    code: 'de-DE',
    label: 'German (Germany)',
    nativeLabel: 'Deutsch (Deutschland)',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_DE_DE,
  },
  {
    code: 'nl-NL',
    label: 'Dutch (Netherlands)',
    nativeLabel: 'Nederlands (Nederland)',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_NL_NL,
  },
  {
    code: 'it-IT',
    label: 'Italian (Italy)',
    nativeLabel: 'Italiano (Italia)',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_IT_IT,
  },
  {
    code: 'pt-BR',
    label: 'Portuguese (Brazil)',
    nativeLabel: 'Português (Brasil)',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_LABELS_PT_BR,
  },
  {
    code: 'ko-KR',
    label: 'Korean (South Korea)',
    nativeLabel: '한국어 (대한민국)',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_LABELS_KO_KR,
  },
  {
    code: 'hi-IN',
    label: 'Hindi (India)',
    nativeLabel: 'हिन्दी (भारत)',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_LABELS_HI_IN,
  },
  {
    code: 'ja-JP',
    label: 'Japanese (Japan)',
    nativeLabel: '日本語 (日本)',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_LABELS_JA_JP,
  },
  {
    code: 'zh-CN',
    label: 'Chinese (Simplified)',
    nativeLabel: '简体中文（中国）',
    direction: 'ltr',
    firstDayOfWeek: 1,
    labels: SP_I18N_LABELS_ZH_CN,
  },
  {
    code: 'zh-TW',
    label: 'Chinese (Traditional)',
    nativeLabel: '繁體中文（台灣）',
    direction: 'ltr',
    firstDayOfWeek: 0,
    labels: SP_I18N_LABELS_ZH_TW,
  },
] as const;

/** Resolve an exact pack, then the first shipped pack for its base language. */
export function findSpruceLocale(code: string | undefined): SpI18nLocale | undefined {
  if (!code) return undefined;

  const normalized = code.toLowerCase();
  const exact = SP_I18N_LOCALES.find((locale) => locale.code.toLowerCase() === normalized);
  if (exact) return exact;

  const language = normalized.split('-')[0];
  return SP_I18N_LOCALES.find((locale) => locale.code.toLowerCase().split('-')[0] === language);
}

export { SP_I18N_LABELS_AR } from './ar.js';
export { SP_I18N_LABELS_DE_DE } from './de-DE.js';
export { SP_I18N_LABELS_EN_GB } from './en-GB.js';
export { SP_I18N_LABELS_ES_ES } from './es-ES.js';
export { SP_I18N_LABELS_FIL_PH } from './fil-PH.js';
export { SP_I18N_LABELS_FR_FR } from './fr-FR.js';
export { SP_I18N_LABELS_HI_IN } from './hi-IN.js';
export { SP_I18N_LABELS_IT_IT } from './it-IT.js';
export { SP_I18N_LABELS_JA_JP } from './ja-JP.js';
export { SP_I18N_LABELS_KO_KR } from './ko-KR.js';
export { SP_I18N_LABELS_NL_NL } from './nl-NL.js';
export { SP_I18N_LABELS_PT_BR } from './pt-BR.js';
export { SP_I18N_LABELS_ZH_CN } from './zh-CN.js';
export { SP_I18N_LABELS_ZH_TW } from './zh-TW.js';
