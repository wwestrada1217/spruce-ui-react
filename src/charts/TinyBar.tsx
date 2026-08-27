/* eslint-disable react-hooks/refs -- the shared tiny-chart hook intentionally returns its host ref. */
import './VisualizationCharts.css';
import { useMemo, type CSSProperties } from 'react';
import { linearScale } from './scales.js';
import { clamp, normalizeTinyValues, resolveThresholdColor } from './tiny-utils.js';
import {
  TINY_NEGATIVE_COLOR,
  TINY_POSITIVE_COLOR,
  TINY_TRACK_COLOR,
  type TinyBarChartConfig,
  type TinyDatum,
  type TinyValues,
} from './tiny-types.js';
import { tinyStyle, useTinyChart } from './TinyChartBase.js';

export interface TinyBarProps {
  data?: TinyValues;
  config?: TinyBarChartConfig;
  className?: string;
  style?: CSSProperties;
}

const DEFAULTS = {
  orientation: 'vertical' as const,
  cornerRadius: 1,
  scaleTo: 'zero' as const,
  colorMode: 'single' as const,
  positiveColor: TINY_POSITIVE_COLOR,
  negativeColor: TINY_NEGATIVE_COLOR,
  highlight: 'none' as const,
  dimOpacity: 0.3,
  showTrack: false,
  showBaseline: true,
};

export function TinyBar({ data = [], config: inputConfig, className, style }: TinyBarProps) {
  const items = useMemo(() => normalizeTinyValues(data), [data]);
  const context = useTinyChart(inputConfig, 'Bar chart', items);
  const config = { ...DEFAULTS, ...inputConfig };
  const vertical = config.orientation === 'vertical';
  const domain = useMemo<[number, number]>(() => {
    if (!items.length) return [0, 1];
    const values = items.map((item) => item.value);
    let lo = config.scaleTo === 'zero' ? Math.min(0, Math.min(...values)) : Math.min(...values);
    let hi = config.scaleTo === 'zero' ? Math.max(0, Math.max(...values)) : Math.max(...values);
    if (config.min !== undefined) lo = config.min;
    if (config.max !== undefined) hi = config.max;
    if (hi - lo < Number.EPSILON) hi = lo + 1;
    return [lo, hi];
  }, [config.max, config.min, config.scaleTo, items]);
  const across = vertical ? context.width : context.height;
  const along = vertical ? context.height : context.width;
  const gap = config.gap ?? context.sizeSpec.gap;
  const thickness = config.barThickness ?? Math.max(1, (across - gap * (items.length - 1)) / Math.max(1, items.length));
  const scale = vertical ? linearScale(domain, [along, 0]) : linearScale(domain, [0, along]);
  const zero = clamp(scale(clamp(0, domain[0], domain[1])), 0, along);
  const values = items.map((item) => item.value);
  const highlighted = config.highlight === 'none' ? null : new Set(config.highlight === 'first' ? [0] : config.highlight === 'last' ? [items.length - 1] : config.highlight === 'min' ? [values.indexOf(Math.min(...values))] : config.highlight === 'max' ? [values.indexOf(Math.max(...values))] : [values.indexOf(Math.min(...values)), values.indexOf(Math.max(...values))]);
  const colorFor = (item: TinyDatum, index: number) => {
    if (item.color) return item.color;
    if (config.colorMode === 'series') return context.seriesColor(index);
    if (config.colorMode === 'sign') return item.value >= 0 ? config.positiveColor : config.negativeColor;
    if (config.colorMode === 'threshold') return resolveThresholdColor(item.value, config.thresholds, config.color ?? context.seriesColor(0));
    return config.color ?? context.seriesColor(0);
  };
  const bars = items.map((item, index) => {
    const offset = index * (thickness + gap);
    const position = clamp(scale(item.value), 0, along);
    let start = Math.min(position, zero);
    let length = Math.abs(position - zero);
    if (item.value !== 0 && length < 1) { length = 1; start = item.value >= 0 ? zero - 1 : zero; }
    start = clamp(start, 0, Math.max(0, along - length));
    return {
      index,
      x: vertical ? offset : start,
      y: vertical ? start : offset,
      width: vertical ? thickness : length,
      height: vertical ? length : thickness,
      trackX: vertical ? offset : 0,
      trackY: vertical ? 0 : offset,
      trackWidth: vertical ? thickness : context.width,
      trackHeight: vertical ? context.height : thickness,
      color: colorFor(item, index),
      opacity: !highlighted || highlighted.has(index) ? 1 : config.dimOpacity,
      tooltip: context.tooltipText(item.label, item.value),
    };
  });
  const svgStyle = { ...tinyStyle(context), ...style };
  return <div ref={context.hostRef} className={`${context.chartClassName}${className ? ` ${className}` : ''}`} style={svgStyle}>
    <svg className="sp-tiny__svg" width={context.width} height={context.height} viewBox={`0 0 ${context.width} ${context.height}`} {...context.svgProps}>
      {config.showTrack && <g aria-hidden="true">{bars.map((bar) => <rect key={`track-${bar.index}`} x={bar.trackX} y={bar.trackY} width={bar.trackWidth} height={bar.trackHeight} rx={config.cornerRadius} fill={TINY_TRACK_COLOR} />)}</g>}
      <g className={context.config.animate ? (vertical ? 'sp-tiny__grow' : 'sp-tiny__grow-x') : undefined} style={{ '--sp-tiny-origin': vertical ? `0 ${zero}px` : `${zero}px 0` } as CSSProperties}>
        {bars.map((bar) => <rect key={bar.index} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx={config.cornerRadius} fill={bar.color} fillOpacity={bar.opacity}>{context.config.showTooltip && <title>{bar.tooltip}</title>}</rect>)}
      </g>
      {config.showBaseline && domain[0] < 0 && domain[1] > 0 && <line x1={vertical ? 0 : zero} y1={vertical ? zero : 0} x2={vertical ? context.width : zero} y2={vertical ? zero : context.height} stroke={TINY_TRACK_COLOR} strokeWidth="1" aria-hidden="true" />}
    </svg>
  </div>;
}

export const TinyBarChart = TinyBar;
export type TinyBarChartProps = TinyBarProps;
