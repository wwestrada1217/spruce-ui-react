/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SP_I18N_DEFAULT_LABELS, type SpI18nLabels } from './labels.js';
import { findSpruceLocale, type SpDirection } from './locales/index.js';

export type SpI18nLabelKey = keyof SpI18nLabels;
export type SpI18nLabelParams = Record<string, string | number>;

export interface SpI18nConfig {
  locale: string;
  direction: SpDirection;
  labels: SpI18nLabels;
  firstDayOfWeek: number;
  dateFormatOptions: Intl.DateTimeFormatOptions;
  shortDateFormatOptions: Intl.DateTimeFormatOptions;
  syncDocument: boolean;
}

export type SpI18nConfigInput = Partial<
  Omit<SpI18nConfig, 'labels'> & {
    labels: Partial<SpI18nLabels>;
  }
>;

export const SP_I18N_DEFAULT_CONFIG: SpI18nConfig = {
  locale: 'en-US',
  direction: 'ltr',
  labels: SP_I18N_DEFAULT_LABELS,
  firstDayOfWeek: 0,
  dateFormatOptions: { month: 'short', day: 'numeric', year: 'numeric' },
  shortDateFormatOptions: { month: 'short', day: 'numeric' },
  syncDocument: true,
};

function mergeConfig(
  base: SpI18nConfig,
  input: SpI18nConfigInput,
  labelOverrides: Partial<SpI18nLabels>,
): SpI18nConfig {
  const localeChanged = input.locale !== undefined && input.locale !== base.locale;
  const pack = localeChanged ? findSpruceLocale(input.locale) : findSpruceLocale(base.locale);
  const packLabels = pack?.labels ?? {};

  return {
    locale: input.locale ?? base.locale,
    direction: input.direction ?? (pack && localeChanged ? pack.direction : base.direction),
    firstDayOfWeek:
      input.firstDayOfWeek ?? (pack && localeChanged ? pack.firstDayOfWeek : base.firstDayOfWeek),
    dateFormatOptions: input.dateFormatOptions ?? base.dateFormatOptions,
    shortDateFormatOptions: input.shortDateFormatOptions ?? base.shortDateFormatOptions,
    syncDocument: input.syncDocument ?? base.syncDocument,
    labels: {
      ...SP_I18N_DEFAULT_LABELS,
      ...(localeChanged ? packLabels : base.labels),
      ...labelOverrides,
      ...input.labels,
    },
  };
}

function initialConfig(input: SpI18nConfigInput): SpI18nConfig {
  const locale = input.locale ?? SP_I18N_DEFAULT_CONFIG.locale;
  return mergeConfig(
    SP_I18N_DEFAULT_CONFIG,
    { ...input, locale },
    input.labels ?? {},
  );
}

function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const trimmed = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T00:00:00`)
    : new Date(trimmed);
}

/** Apply the i18n document contract for applications that opt into synchronization. */
export function applyI18nToDocument(
  target: Pick<Document, 'documentElement'>,
  config: Pick<SpI18nConfig, 'locale' | 'direction'>,
): void {
  target.documentElement.lang = config.locale;
  target.documentElement.dir = config.direction;
}

export interface SpruceI18nContextValue extends SpI18nConfig {
  locale: string;
  direction: SpDirection;
  isRtl: boolean;
  labels: SpI18nLabels;
  monthNames: string[];
  monthLabels: string[];
  dayLabels: string[];
  setConfig: (config: SpI18nConfigInput) => void;
  setLocale: (locale: string, direction?: SpDirection) => void;
  setLabels: (labels: Partial<SpI18nLabels>) => void;
  t: (key: SpI18nLabelKey, params?: SpI18nLabelParams) => string;
  formatDate: (value: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (value: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatMonthYear: (month: number, year: number) => string;
  formatDayLabel: (day: number, month: number, year: number) => string;
  formatRange: (start: string | Date, end: string | Date) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  leadingBlankDays: (year: number, month: number) => number;
  pageInfo: (page: number, totalPages: number) => string;
  rangeInfo: (start: number, end: number, total: number) => string;
}

export interface SpruceI18nProviderProps extends SpI18nConfigInput {
  children: ReactNode;
}

function buildMonthNames(locale: string, month: 'short' | 'long'): string[] {
  return Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { month }).format(new Date(2024, index, 1)),
  );
}

function buildDayLabels(locale: string, firstDay: number): string[] {
  return Array.from({ length: 7 }, (_, index) => {
    const day = (firstDay + index) % 7;
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
      new Date(2024, 0, day + 7),
    );
  });
}

const DefaultI18nContext = createContext<SpruceI18nContextValue | null>(null);

export function SpruceI18nProvider({ children, ...input }: SpruceI18nProviderProps) {
  const [config, setConfigState] = useState<SpI18nConfig>(() => initialConfig(input));
  const [labelOverrides, setLabelOverrides] = useState<Partial<SpI18nLabels>>(
    () => input.labels ?? {},
  );

  const setConfig = useCallback((next: SpI18nConfigInput) => {
    setLabelOverrides((current) => ({ ...current, ...next.labels }));
    setConfigState((current) =>
      mergeConfig(current, next, { ...labelOverrides, ...next.labels }),
    );
  }, [labelOverrides]);

  const setLocale = useCallback(
    (locale: string, direction?: SpDirection) =>
      setConfig({ locale, ...(direction ? { direction } : {}) }),
    [setConfig],
  );

  const setLabels = useCallback((labels: Partial<SpI18nLabels>) => setConfig({ labels }), [setConfig]);

  useEffect(() => {
    if (!config.syncDocument || typeof document === 'undefined') return;
    applyI18nToDocument(document, config);
  }, [config]);

  const monthNames = useMemo(() => buildMonthNames(config.locale, 'long'), [config.locale]);
  const monthLabels = useMemo(() => buildMonthNames(config.locale, 'short'), [config.locale]);
  const dayLabels = useMemo(
    () => buildDayLabels(config.locale, config.firstDayOfWeek),
    [config.firstDayOfWeek, config.locale],
  );

  const value = useMemo<SpruceI18nContextValue>(() => {
    const t = (key: SpI18nLabelKey, params?: SpI18nLabelParams): string => {
      const label = config.labels[key];
      if (!params) return label;
      return label.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      );
    };
    const formatDate = (
      date: string | Date,
      options = config.dateFormatOptions,
    ): string => new Intl.DateTimeFormat(config.locale, options).format(parseDate(date));
    const formatTime = (
      date: Date,
      options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' },
    ): string => new Intl.DateTimeFormat(config.locale, options).format(date);
    const formatMonthYear = (month: number, year: number): string =>
      new Intl.DateTimeFormat(config.locale, { month: 'long', year: 'numeric' }).format(
        new Date(year, month, 1),
      );
    const formatDayLabel = (day: number, month: number, year: number): string =>
      new Intl.DateTimeFormat(config.locale, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(year, month, day));
    const formatRange = (start: string | Date, end: string | Date): string =>
      `${formatDate(start, config.shortDateFormatOptions)} - ${formatDate(end, config.shortDateFormatOptions)}`;
    const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string =>
      new Intl.NumberFormat(config.locale, options).format(number);
    const leadingBlankDays = (year: number, month: number): number => {
      const weekday = new Date(year, month, 1).getDay();
      return (weekday - config.firstDayOfWeek + 7) % 7;
    };

    return {
      ...config,
      isRtl: config.direction === 'rtl',
      monthNames,
      monthLabels,
      dayLabels,
      setConfig,
      setLocale,
      setLabels,
      t,
      formatDate,
      formatTime,
      formatMonthYear,
      formatDayLabel,
      formatRange,
      formatNumber,
      leadingBlankDays,
      pageInfo: (page, totalPages) => `${t('page')} ${page} ${t('of')} ${totalPages}`,
      rangeInfo: (start, end, total) => `${start}-${end} ${t('of')} ${total}`,
    };
  }, [config, dayLabels, monthLabels, monthNames, setConfig, setLabels, setLocale]);

  return <DefaultI18nContext.Provider value={value}>{children}</DefaultI18nContext.Provider>;
}

/** Read Spruce's shared locale, labels, formatting, and direction state. */
export function useI18n(): SpruceI18nContextValue {
  const context = useContext(DefaultI18nContext);
  // Components remain usable without a root provider while preserving the same API.
  const fallback = useMemo(() => {
    const fallback = initialConfig({});
    const t = (key: SpI18nLabelKey, params?: SpI18nLabelParams) => {
      const label = fallback.labels[key];
      return params
        ? label.replace(/\{(\w+)\}/g, (match, name: string) =>
            name in params ? String(params[name]) : match,
          )
        : label;
    };
    return {
      ...fallback,
      isRtl: false,
      monthNames: buildMonthNames(fallback.locale, 'long'),
      monthLabels: buildMonthNames(fallback.locale, 'short'),
      dayLabels: buildDayLabels(fallback.locale, fallback.firstDayOfWeek),
      setConfig: () => undefined,
      setLocale: () => undefined,
      setLabels: () => undefined,
      t,
      formatDate: (value: string | Date, options = fallback.dateFormatOptions) =>
        new Intl.DateTimeFormat(fallback.locale, options).format(parseDate(value)),
      formatTime: (
        value: Date,
        options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' },
      ) =>
        new Intl.DateTimeFormat(fallback.locale, options).format(value),
      formatMonthYear: (month: number, year: number) =>
        new Intl.DateTimeFormat(fallback.locale, { month: 'long', year: 'numeric' }).format(
          new Date(year, month, 1),
        ),
      formatDayLabel: (day: number, month: number, year: number) =>
        new Intl.DateTimeFormat(fallback.locale, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(year, month, day)),
      formatRange: (start: string | Date, end: string | Date) =>
        `${new Intl.DateTimeFormat(fallback.locale, fallback.shortDateFormatOptions).format(parseDate(start))} - ${new Intl.DateTimeFormat(fallback.locale, fallback.shortDateFormatOptions).format(parseDate(end))}`,
      formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
        new Intl.NumberFormat(fallback.locale, options).format(value),
      leadingBlankDays: (year: number, month: number) =>
        (new Date(year, month, 1).getDay() - fallback.firstDayOfWeek + 7) % 7,
      pageInfo: (page: number, totalPages: number) => `${t('page')} ${page} ${t('of')} ${totalPages}`,
      rangeInfo: (start: number, end: number, total: number) => `${start}-${end} ${t('of')} ${total}`,
    };
  }, []);

  return context ?? fallback;
}

/** Alias matching the service name used by the Angular package. */
export const useSpruceI18n = useI18n;
