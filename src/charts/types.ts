/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { CSSProperties, ReactNode } from 'react';

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartThemeColors {
  titleColor: string;
  subtitleColor: string;
  axisText: string;
  axisLine: string;
  gridLine: string;
  valueLabel: string;
  axisLabel: string;
  legendText: string;
  tooltipBg: string;
  tooltipText: string;
  tooltipBorder: string;
}

export interface ChartZoomState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface ChartTooltipItem {
  label: string;
  value: number | string;
  color?: string;
  seriesName?: string;
}

export interface ChartTooltipConfig {
  /** Render a tooltip when a chart datum is hovered. Defaults to true. */
  enabled?: boolean;
  /** Format a value before it is displayed in the default tooltip. */
  formatValue?: (value: number | string, item: ChartTooltipItem) => string;
  /** Replace the default tooltip content. */
  render?: (item: ChartTooltipItem) => ReactNode;
}

export interface CoreChartConfig {
  /** Fixed SVG width in px. `0` fills the measured container. */
  width?: number;
  /** Chart height in px or any CSS length. */
  height?: number | string;
  /** Margins around the plot area. */
  margin?: Partial<ChartMargin>;
  /** Automatically measure the chart wrapper with ResizeObserver. */
  responsive?: boolean;
  /** Chart title and subtitle. Top-level props remain supported for compatibility. */
  title?: string;
  subtitle?: string;
  showGrid?: boolean;
  /** Enable chart entry animations. */
  animate?: boolean;
  animationDuration?: number;
  colorScheme?: string[];
  /** A key in the shared chart palette registry, including `harmony`. */
  palette?: string;
  showTooltip?: boolean;
  tooltip?: ChartTooltipConfig;
  showAxes?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  interactiveLegend?: boolean;
  zoomEnabled?: boolean;
  panEnabled?: boolean;
  minZoom?: number;
  maxZoom?: number;
  /** Common axis and mark options accepted by chart-specific Angular configs. */
  orientation?: 'vertical' | 'horizontal';
  curve?: 'linear' | 'monotone' | 'step' | 'cardinal';
  showDots?: boolean;
  showValues?: boolean;
  valueFormat?: 'compact' | 'full' | 'percent' | 'none';
  dotRadius?: number;
  strokeWidth?: number;
  cornerRadius?: number;
  padding?: number;
  innerPadding?: number;
  fillOpacity?: number;
  xLabel?: string;
  yLabel?: string;
  categories?: string[];
  /** Shared reference-line shape used by line-like charts. */
  referenceLines?: Array<{ value: number; label?: string; color?: string; dashArray?: string; strokeWidth?: number }>;
  /** Optional named axis labels for multi-axis chart variants. */
  yLeftLabel?: string;
  yRightLabel?: string;
  /** Chart-specific Angular config extensions remain forward-compatible. */
  [key: string]: unknown;
}

export const DEFAULT_CHART_CONFIG: Required<CoreChartConfig> = {
  width: 0,
  height: 400,
  margin: { top: 40, right: 24, bottom: 48, left: 56 },
  responsive: true,
  title: '',
  subtitle: '',
  showGrid: true,
  animate: true,
  animationDuration: 600,
  colorScheme: [],
  palette: '',
  showTooltip: true,
  tooltip: {},
  showAxes: true,
  showLegend: true,
  showLabels: true,
  interactiveLegend: false,
  zoomEnabled: false,
  panEnabled: true,
  minZoom: 1,
  maxZoom: 10,
  orientation: 'vertical',
  curve: 'linear',
  showDots: true,
  showValues: true,
  valueFormat: 'compact',
  dotRadius: 4,
  strokeWidth: 2,
  cornerRadius: 4,
  padding: 0.25,
  innerPadding: 0.1,
  fillOpacity: 0.2,
  xLabel: '',
  yLabel: '',
  categories: [],
  referenceLines: [],
  yLeftLabel: '',
  yRightLabel: '',
};

export interface ChartCallbackEvent {
  originalEvent: Event;
  chartId: string;
}

export interface ChartLegendEvent extends ChartCallbackEvent {
  label: string;
  hidden: boolean;
}

export interface ChartTooltipEvent extends ChartCallbackEvent {
  tooltip: ChartTooltipData | null;
}

export interface ChartPointEvent extends ChartCallbackEvent {
  label?: string;
  seriesName?: string;
  value?: number | string;
  index?: number;
}

export interface ChartCommonProps {
  /** Angular-compatible shared configuration object. */
  config?: CoreChartConfig;
  /** Accessible name for the chart region. */
  ariaLabel?: string;
  onLegendClick?: (event: ChartLegendEvent) => void;
  onSeriesVisibilityChange?: (hiddenSeries: string[]) => void;
  onZoomChange?: (zoom: ChartZoomState) => void;
  onZoomReset?: (event: ChartCallbackEvent) => void;
  onTooltipChange?: (event: ChartTooltipEvent) => void;
  onDataPointClick?: (event: ChartPointEvent) => void;
  onDataPointHover?: (event: ChartPointEvent) => void;
  style?: CSSProperties;
  className?: string;
}

export interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
  [key: string]: unknown;
}

export interface ChartSeries {
  name: string;
  data: number[] | ChartDataItem[];
  color?: string;
}

export type ChartLegendPosition = 'top' | 'bottom' | 'left' | 'right';

export interface ChartTooltipData {
  label: string;
  value: number | string;
  color?: string;
  seriesName?: string;
  x?: number;
  y?: number;
  items?: ChartTooltipItem[];
}

export const DEFAULT_CHART_COLORS = [
  '#0f766e', // Spruce Teal
  '#0284c7', // Sky Blue
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#dc2626', // Red
  '#16a34a', // Emerald
  '#ea580c', // Orange
  '#2563eb', // Indigo
];
