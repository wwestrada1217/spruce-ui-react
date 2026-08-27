/* eslint-disable react-hooks/refs */
/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 */

import './ChartContainer.css';
import { useMemo, type CSSProperties, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import { useI18n } from '../i18n/i18n-context.js';
import { ChartKernelProvider, useChartKernel, type ChartKernelOptions } from './ChartKernel.js';
import type {
  ChartCallbackEvent,
  ChartLegendEvent,
  ChartPointEvent,
  ChartThemeColors,
  ChartTooltipData,
  ChartTooltipEvent,
  ChartTooltipItem,
  ChartZoomState,
  CoreChartConfig,
  ChartLegendPosition,
} from './types.js';

export interface LegendItem {
  label: string;
  color: string;
  value?: number | string;
  id?: string;
}

export interface ChartContainerProps extends ChartKernelOptions {
  title?: string;
  subtitle?: string;
  legend?: LegendItem[];
  legendPosition?: ChartLegendPosition;
  tooltip?: ChartTooltipData | null;
  height?: number | string;
  showLegend?: boolean;
  interactiveLegend?: boolean;
  hiddenSeries?: readonly string[];
  onLegendClick?: (event: ChartLegendEvent) => void;
  onSeriesVisibilityChange?: (hiddenSeries: string[]) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  chartType?: string;
}

function Tooltip({ tooltip, config, themeColors }: { tooltip: ChartTooltipData; config: Required<CoreChartConfig>; themeColors: ChartThemeColors }) {
  const item: ChartTooltipItem = { label: tooltip.label, value: tooltip.value, color: tooltip.color, seriesName: tooltip.seriesName };
  if (config.tooltip?.render) {
    return <div className="sp-chart-tooltip" role="tooltip" aria-live="polite" style={{ left: `${tooltip.x ?? 0}px`, top: `${tooltip.y ?? 0}px`, background: themeColors.tooltipBg, color: themeColors.tooltipText, borderColor: themeColors.tooltipBorder }}>{config.tooltip.render(item)}</div>;
  }
  const value = config.tooltip?.formatValue ? config.tooltip.formatValue(item.value, item) : item.value;
  return (
    <div className="sp-chart-tooltip" role="tooltip" aria-live="polite" style={{ left: `${tooltip.x ?? 0}px`, top: `${tooltip.y ?? 0}px`, background: themeColors.tooltipBg, color: themeColors.tooltipText, borderColor: themeColors.tooltipBorder }}>
      {tooltip.seriesName && <div className="sp-chart-tooltip-header">{tooltip.label}</div>}
      <div className="sp-chart-tooltip-body">
        {tooltip.color && <span className="sp-chart-tooltip-badge" style={{ backgroundColor: tooltip.color }} />}
        <span>{tooltip.seriesName ? `${tooltip.seriesName}: ` : `${tooltip.label}: `}<strong>{value}</strong></span>
      </div>
      {tooltip.items?.map((entry) => <div className="sp-chart-tooltip-body" key={`${entry.seriesName ?? ''}-${entry.label}`}><span className="sp-chart-tooltip-badge" style={{ backgroundColor: entry.color }} /><span>{entry.seriesName ? `${entry.seriesName}: ` : `${entry.label}: `}<strong>{config.tooltip?.formatValue ? config.tooltip.formatValue(entry.value, entry) : entry.value}</strong></span></div>)}
    </div>
  );
}

export function ChartContainer({
  title,
  subtitle,
  legend,
  legendPosition = 'top',
  tooltip: externalTooltip,
  height = 400,
  config: inputConfig,
  showLegend = true,
  interactiveLegend,
  hiddenSeries: controlledHiddenSeries,
  onLegendClick,
  onSeriesVisibilityChange,
  className,
  style,
  chartType,
  children,
  ...callbackOptions
}: ChartContainerProps) {
  const { t } = useI18n();
  const config = useMemo<CoreChartConfig>(() => ({
    ...inputConfig,
    height: inputConfig?.height ?? height,
    title: inputConfig?.title ?? title,
    subtitle: inputConfig?.subtitle ?? subtitle,
    showLegend: inputConfig?.showLegend ?? showLegend,
    interactiveLegend: inputConfig?.interactiveLegend ?? interactiveLegend ?? false,
  }), [height, inputConfig, interactiveLegend, showLegend, subtitle, title]);
  const kernel = useChartKernel({ ...callbackOptions, config });
  const resolvedConfig = kernel.config;
  const isInteractive = resolvedConfig.interactiveLegend === true && Boolean(legend?.length);
  const isControlled = controlledHiddenSeries !== undefined;
  const visibleHiddenSeries = isControlled ? new Set(controlledHiddenSeries) : kernel.hiddenSeries;
  const rootStyle = {
    ...style,
    width: resolvedConfig.width && resolvedConfig.width > 0 ? `${resolvedConfig.width}px` : style?.width,
    '--sp-chart-title-color': kernel.themeColors.titleColor,
    '--sp-chart-subtitle-color': kernel.themeColors.subtitleColor,
    '--sp-chart-axis-text': kernel.themeColors.axisText,
    '--sp-chart-axis-line': kernel.themeColors.axisLine,
    '--sp-chart-grid-line': kernel.themeColors.gridLine,
    '--sp-chart-value-label': kernel.themeColors.valueLabel,
    '--sp-chart-axis-label': kernel.themeColors.axisLabel,
    '--sp-chart-legend-text': kernel.themeColors.legendText,
    '--sp-chart-tooltip-bg': kernel.themeColors.tooltipBg,
    '--sp-chart-tooltip-text': kernel.themeColors.tooltipText,
    '--sp-chart-tooltip-border': kernel.themeColors.tooltipBorder,
    '--sp-chart-animation-duration': `${resolvedConfig.animationDuration}ms`,
  } as CSSProperties;
  const rootCls = ['sp-chart-container', className].filter(Boolean).join(' ');
  const accessibleName = callbackOptions.ariaLabel ?? title ?? chartType ?? t('chart');
  const activeTooltip = resolvedConfig.showTooltip && resolvedConfig.tooltip?.enabled !== false ? externalTooltip ?? kernel.tooltip : null;

  const handleLegendClick = (event: ReactMouseEvent<HTMLButtonElement>, item: LegendItem) => {
    if (!isInteractive) return;
    const key = item.id ?? item.label;
    const hidden = !visibleHiddenSeries.has(key);
    if (!isControlled) kernel.toggleSeries(key);
    const next = new Set(visibleHiddenSeries);
    if (hidden) next.add(key); else next.delete(key);
    onSeriesVisibilityChange?.([...next]);
    onLegendClick?.({ originalEvent: event.nativeEvent, chartId: kernel.chartId, label: key, hidden });
  };

  const renderLegend = () => {
    if (!legend || legend.length === 0 || resolvedConfig.showLegend === false) return null;
    return <div className={`sp-chart-legend sp-chart-legend--${legendPosition}`} role="list" aria-label={`${accessibleName} legend`}>
        {legend.map((item, legendIndex) => {
        const key = item.id ?? item.label;
        const hidden = visibleHiddenSeries.has(key);
          return isInteractive ? (
          <div role="listitem" key={key}>
            <button type="button" className={`sp-chart-legend-item${hidden ? ' sp-chart-legend-item--hidden' : ''}`} aria-pressed={!hidden} onClick={(event) => handleLegendClick(event, item)} data-series-name={key} data-series-index={legendIndex}>
              <span className="sp-chart-legend-dot" style={{ backgroundColor: item.color }} aria-hidden="true" /><span>{item.label}</span>{item.value !== undefined && <span className="sp-chart-legend-value">{item.value}</span>}
            </button>
          </div>
        ) : <div key={key} className="sp-chart-legend-item" role="listitem" data-series-name={key} data-series-index={legendIndex}><span className="sp-chart-legend-dot" style={{ backgroundColor: item.color }} aria-hidden="true" /><span>{item.label}</span>{item.value !== undefined && <span className="sp-chart-legend-value">{item.value}</span>}</div>;
        })}
    </div>;
  };

  const handleChartClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const point = (event.target as Element).closest<HTMLElement>('[data-chart-point]');
    if (!point || !callbackOptions.onDataPointClick) return;
    callbackOptions.onDataPointClick({ originalEvent: event.nativeEvent, chartId: kernel.chartId, label: point.dataset.label, seriesName: point.dataset.seriesName, value: readPointValue(point.dataset.value), index: readPointIndex(point.dataset.index) });
  };

  const handleChartHover = (event: ReactMouseEvent<HTMLDivElement>) => {
    const point = (event.target as Element).closest<HTMLElement>('[data-chart-point]');
    if (!point) return;
    kernel.showTooltip(event, { label: point.dataset.label ?? '', seriesName: point.dataset.seriesName, value: point.dataset.value ?? '', color: point.dataset.color });
    callbackOptions.onDataPointHover?.({ originalEvent: event.nativeEvent, chartId: kernel.chartId, label: point.dataset.label, seriesName: point.dataset.seriesName, value: readPointValue(point.dataset.value), index: readPointIndex(point.dataset.index) });
  };

  function readPointValue(value: string | undefined): number | string | undefined {
    if (value === undefined || value.trim() === '') return value;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : value;
  }

  function readPointIndex(value: string | undefined): number | undefined {
    if (value === undefined || value.trim() === '') return undefined;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  const handleChartMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest<HTMLElement>('[data-chart-point]')) kernel.moveTooltip(event);
  };

  const hiddenSeriesIndexes = legend?.map((item, index) => visibleHiddenSeries.has(item.id ?? item.label) ? String(index) : '').filter(Boolean).join(' ');

  return <ChartKernelProvider value={kernel}>
    <div ref={kernel.rootRef} className={rootCls} style={rootStyle} role="figure" aria-label={accessibleName} data-chart-id={kernel.chartId} data-chart-width={kernel.width} data-chart-height={kernel.height} data-show-axes={resolvedConfig.showAxes === false ? 'false' : 'true'} data-show-labels={resolvedConfig.showLabels === false ? 'false' : 'true'} data-theme-revision={resolvedConfig.palette === 'harmony' ? kernel.palette.join('|') : undefined} data-hidden-series-indexes={hiddenSeriesIndexes || undefined} data-zoomed={kernel.isZoomed ? 'true' : 'false'}>
      {(title || subtitle || resolvedConfig.title || resolvedConfig.subtitle) && <div className="sp-chart-header">{(title ?? resolvedConfig.title) && <h3 className="sp-chart-title">{title ?? resolvedConfig.title}</h3>}{(subtitle ?? resolvedConfig.subtitle) && <p className="sp-chart-subtitle">{subtitle ?? resolvedConfig.subtitle}</p>}</div>}
      {legendPosition === 'top' && renderLegend()}
      {resolvedConfig.zoomEnabled && <div className="sp-chart-toolbar" role="toolbar" aria-label={`${accessibleName} controls`}>{kernel.isZoomed && <button type="button" className="sp-chart-reset" onClick={(event) => kernel.resetZoom(event.nativeEvent)}>{t('resetZoomAndPan')}</button>}</div>}
      <div className="sp-chart-body" style={{ height: typeof resolvedConfig.height === 'number' ? `${resolvedConfig.height}px` : resolvedConfig.height }} tabIndex={resolvedConfig.zoomEnabled ? 0 : undefined} aria-label={resolvedConfig.zoomEnabled ? `${accessibleName} zoom and pan surface` : undefined} onWheel={kernel.onWheel} onMouseDown={kernel.onMouseDown} onPointerDown={kernel.onPointerDown} onClick={handleChartClick} onMouseOver={handleChartHover} onMouseMove={handleChartMove} onMouseLeave={(event) => kernel.hideTooltip(event.nativeEvent)}>
        <div className={`sp-chart-content${resolvedConfig.animate ? ' sp-chart-content--animated' : ''}`} style={kernel.zoomTransform}>{children}</div>
        {activeTooltip && <Tooltip tooltip={activeTooltip} config={kernel.config} themeColors={kernel.themeColors} />}
      </div>
      {legendPosition === 'bottom' && renderLegend()}
    </div>
  </ChartKernelProvider>;
}

export type { ChartCallbackEvent, ChartPointEvent, ChartThemeColors, ChartTooltipEvent, ChartZoomState };
