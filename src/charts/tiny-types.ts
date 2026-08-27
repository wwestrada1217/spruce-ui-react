/** Data and configuration types for the glyph-sized tiny chart family. */

export interface TinyDatum {
  label?: string;
  value: number;
  color?: string;
}

export interface TinySeries {
  label?: string;
  values: number[];
  color?: string;
}

export interface TinyStack {
  label?: string;
  segments: Array<number | TinyDatum>;
}

export type TinyValues = Array<number | TinyDatum>;
export type TinyChartSize = 'xs' | 'sm' | 'md' | 'lg';
export type TinyValueFormat = 'compact' | 'full';
export type TinyHighlight = 'none' | 'first' | 'last' | 'min' | 'max' | 'extremes';
export type TinyColorMode = 'single' | 'series' | 'sign' | 'threshold';
export type TinyScaleTo = 'zero' | 'extent';

export interface TinyThreshold {
  value: number;
  color: string;
}

export interface TinySizeSpec {
  height: number;
  width: number;
  diameter: number;
  gap: number;
  strokeWidth: number;
  dotRadius: number;
}

export const TINY_SIZE_SPECS: Record<TinyChartSize, TinySizeSpec> = {
  xs: { height: 14, width: 48, diameter: 14, gap: 1, strokeWidth: 1, dotRadius: 1.5 },
  sm: { height: 20, width: 64, diameter: 20, gap: 1.5, strokeWidth: 1.25, dotRadius: 2 },
  md: { height: 32, width: 96, diameter: 32, gap: 2, strokeWidth: 1.5, dotRadius: 2.5 },
  lg: { height: 48, width: 128, diameter: 48, gap: 3, strokeWidth: 2, dotRadius: 3 },
};

export const TINY_SERIES_COLORS: readonly string[] = [
  'var(--sp-chart-series-1, #6366f1)',
  'var(--sp-chart-series-2, #f59e0b)',
  'var(--sp-chart-series-3, #10b981)',
  'var(--sp-chart-series-4, #ef4444)',
  'var(--sp-chart-series-5, #3b82f6)',
  'var(--sp-chart-series-6, #8b5cf6)',
  'var(--sp-chart-series-7, #ec4899)',
  'var(--sp-chart-series-8, #14b8a6)',
];

export const TINY_POSITIVE_COLOR = 'var(--sp-success, #16a34a)';
export const TINY_NEGATIVE_COLOR = 'var(--sp-danger, #dc2626)';
export const TINY_TRACK_COLOR = 'var(--sp-surface-200, #e2e8f0)';
export const TINY_TEXT_COLOR = 'var(--sp-text-color, #1e293b)';
export const TINY_MUTED_COLOR = 'var(--sp-text-subtle, #64748b)';

export interface TinyChartConfig {
  width?: number;
  height?: number;
  size?: TinyChartSize;
  color?: string;
  colors?: string[];
  palette?: string;
  showTooltip?: boolean;
  valueFormat?: TinyValueFormat;
  valuePrefix?: string;
  valueSuffix?: string;
  ariaLabel?: string;
  decorative?: boolean;
  inline?: boolean;
  animate?: boolean;
  animationDuration?: number;
}

export interface TinyBarChartConfig extends TinyChartConfig {
  orientation?: 'vertical' | 'horizontal';
  barThickness?: number;
  gap?: number;
  cornerRadius?: number;
  scaleTo?: TinyScaleTo;
  min?: number;
  max?: number;
  colorMode?: TinyColorMode;
  positiveColor?: string;
  negativeColor?: string;
  thresholds?: TinyThreshold[];
  highlight?: TinyHighlight;
  dimOpacity?: number;
  showTrack?: boolean;
  showBaseline?: boolean;
}

export interface TinyLineChartConfig extends TinyChartConfig {
  curve?: 'linear' | 'monotone' | 'step';
  strokeWidth?: number;
  area?: boolean;
  areaOpacity?: number;
  showEndDot?: boolean;
  showMinMax?: boolean;
  dotRadius?: number;
  scaleTo?: TinyScaleTo;
  min?: number;
  max?: number;
  referenceLine?: number;
  referenceLineColor?: string;
  colorMode?: 'series' | 'single' | 'trend';
  positiveColor?: string;
  negativeColor?: string;
}

export interface TinyPieChartConfig extends TinyChartConfig {
  diameter?: number;
  startAngle?: number;
  padAngle?: number;
  sort?: 'none' | 'asc' | 'desc';
  strokeWidth?: number;
  strokeColor?: string;
  showShare?: boolean;
}

export interface TinyDonutChartConfig extends TinyChartConfig {
  diameter?: number;
  thickness?: number;
  startAngle?: number;
  padAngle?: number;
  sort?: 'none' | 'asc' | 'desc';
  roundCaps?: boolean;
  showTrack?: boolean;
  trackColor?: string;
  total?: number;
  centerText?: string;
  showCenterValue?: boolean;
  centerTextSize?: number;
  centerTextColor?: string;
  showShare?: boolean;
}

export interface TinyStackedChartConfig extends TinyChartConfig {
  orientation?: 'vertical' | 'horizontal';
  normalize?: boolean;
  stackThickness?: number;
  gap?: number;
  segmentGap?: number;
  cornerRadius?: number;
  max?: number;
  showTrack?: boolean;
  trackColor?: string;
  showShare?: boolean;
}
