import './VisualizationCharts.css';
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { useI18n } from '../i18n/i18n-context.js';
import { CHART_PALETTES, HARMONY_PALETTE } from './colors.js';
import {
  TINY_SERIES_COLORS,
  TINY_SIZE_SPECS,
  type TinyChartConfig,
  type TinyChartSize,
  type TinyDatum,
  type TinyValueFormat,
} from './tiny-types.js';

export const TINY_BASE_DEFAULTS = {
  size: 'sm' as TinyChartSize,
  showTooltip: true,
  valueFormat: 'compact' as TinyValueFormat,
  valuePrefix: '',
  valueSuffix: '',
  decorative: false,
  inline: false,
  animate: false,
  animationDuration: 400,
};

export interface TinyChartContext {
  hostRef: RefObject<HTMLDivElement | null>;
  config: TinyChartConfig & typeof TINY_BASE_DEFAULTS;
  sizeSpec: (typeof TINY_SIZE_SPECS)[TinyChartSize];
  width: number;
  height: number;
  palette: readonly string[];
  svgProps: { role: 'img' | 'presentation'; 'aria-label'?: string; 'aria-hidden'?: 'true' };
  chartClassName: string;
  seriesColor: (index: number) => string;
  formatValue: (value: number) => string;
  formatShare: (value: number, total: number) => string;
  tooltipText: (label: string | undefined, value: number, share?: string) => string;
  uid: string;
}

export function useTinyChart<TConfig extends TinyChartConfig>(
  inputConfig: TConfig | undefined,
  chartType: string,
  summaryData: TinyDatum[],
): TinyChartContext {
  const i18n = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  const config = useMemo(() => ({ ...TINY_BASE_DEFAULTS, ...inputConfig }), [inputConfig]);
  const sizeSpec = TINY_SIZE_SPECS[config.size] ?? TINY_SIZE_SPECS.sm;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (config.width !== 0 || !hostRef.current) return undefined;
    const element = hostRef.current;
    const update = () => setContainerWidth(element.getBoundingClientRect().width || element.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver((entries) => setContainerWidth(entries[0]?.contentRect.width ?? 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, [config.width]);

  const width = config.width === undefined ? sizeSpec.width : config.width > 0 ? config.width : containerWidth || sizeSpec.width;
  const height = config.height ?? sizeSpec.height;
  const palette = useMemo<readonly string[]>(() => {
    if (config.color) return [config.color];
    if (config.colors?.length) return config.colors;
    if (config.palette && config.palette !== HARMONY_PALETTE && CHART_PALETTES[config.palette]) return CHART_PALETTES[config.palette].colors;
    return TINY_SERIES_COLORS;
  }, [config.color, config.colors, config.palette]);
  const formatValue = (value: number) => {
    const text = config.valueFormat === 'full'
      ? i18n.formatNumber(value, { maximumFractionDigits: 2 })
      : i18n.formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 });
    return `${config.valuePrefix}${text}${config.valueSuffix}`;
  };
  const formatShare = (value: number, total: number) => total ? i18n.formatNumber(value / total, { style: 'percent', maximumFractionDigits: 1 }) : '';
  const tooltipText = (label: string | undefined, value: number, share?: string) => {
    const text = `${formatValue(value)}${share ? ` (${share})` : ''}`;
    return label ? `${label}: ${text}` : text;
  };
  const values = summaryData.length <= 12
    ? summaryData.map((datum) => datum.label ? `${datum.label}: ${formatValue(datum.value)}` : formatValue(datum.value))
    : [`${i18n.t('min')}: ${formatValue(Math.min(...summaryData.map((datum) => datum.value)))}`, `${i18n.t('max')}: ${formatValue(Math.max(...summaryData.map((datum) => datum.value)))}`, `${i18n.t('chartLatest')}: ${formatValue(summaryData.at(-1)?.value ?? 0)}`];
  const generatedLabel = values.length ? `${chartType}: ${values.join(', ')}` : chartType;
  const svgProps = config.decorative
    ? { role: 'presentation' as const, 'aria-hidden': 'true' as const }
    : { role: 'img' as const, 'aria-label': config.ariaLabel || generatedLabel };

  return {
    hostRef,
    config,
    sizeSpec,
    width,
    height,
    palette,
    svgProps,
    chartClassName: `sp-tiny${config.inline ? ' sp-tiny--inline' : ''}`,
    seriesColor: (index) => palette[((index % palette.length) + palette.length) % palette.length],
    formatValue,
    formatShare,
    tooltipText,
    uid,
  };
}

export function tinyStyle(context: TinyChartContext): CSSProperties {
  return {
    '--sp-tiny-duration': `${context.config.animationDuration}ms`,
  } as CSSProperties;
}
