/* eslint-disable react-hooks/refs -- the shared tiny-chart hook intentionally returns its host ref. */
import './VisualizationCharts.css';
import { useMemo, type CSSProperties } from 'react';
import { linearScale } from './scales.js';
import { closeToFloor, normalizeTinyValues, tinyLinePath, type TinyPoint } from './tiny-utils.js';
import {
  TINY_MUTED_COLOR,
  TINY_NEGATIVE_COLOR,
  TINY_POSITIVE_COLOR,
  type TinyDatum,
  type TinyLineChartConfig,
  type TinySeries,
  type TinyValues,
} from './tiny-types.js';
import { tinyStyle, useTinyChart } from './TinyChartBase.js';

export interface TinyLineProps {
  data?: TinyValues | TinySeries[];
  config?: TinyLineChartConfig;
  className?: string;
  style?: CSSProperties;
}

const DEFAULTS = {
  curve: 'monotone' as const,
  area: false,
  areaOpacity: 0.16,
  showEndDot: false,
  showMinMax: false,
  scaleTo: 'extent' as const,
  colorMode: 'series' as const,
  positiveColor: TINY_POSITIVE_COLOR,
  negativeColor: TINY_NEGATIVE_COLOR,
};

interface LineSource { label?: string; color?: string; points: TinyDatum[] }

export function TinyLine({ data = [], config: inputConfig, className, style }: TinyLineProps) {
  const config = { ...DEFAULTS, ...inputConfig };
  const sources = useMemo<LineSource[]>(() => {
    const raw = data as Array<number | TinyDatum | TinySeries>;
    if (!raw.length) return [];
    const first = raw[0];
    if (typeof first === 'object' && first !== null && 'values' in first) {
      return (raw as TinySeries[]).filter((series) => series.values.length).map((series) => ({ label: series.label, color: series.color, points: normalizeTinyValues(series.values) }));
    }
    const points = normalizeTinyValues(raw as TinyValues);
    return points.length ? [{ points }] : [];
  }, [data]);
  const summary = useMemo(() => sources.length === 1 ? sources[0].points : sources.map((source) => ({ label: source.label, value: source.points.at(-1)?.value ?? 0 })), [sources]);
  const context = useTinyChart(inputConfig, 'Line chart', summary);
  const values = sources.flatMap((source) => source.points.map((point) => point.value));
  const domain = useMemo<[number, number]>(() => {
    if (!values.length) return [0, 1];
    let lo = Math.min(...values);
    let hi = Math.max(...values);
    if (config.scaleTo === 'zero') { lo = Math.min(0, lo); hi = Math.max(0, hi); }
    if (config.referenceLine !== undefined) { lo = Math.min(lo, config.referenceLine); hi = Math.max(hi, config.referenceLine); }
    if (config.min !== undefined) lo = config.min;
    if (config.max !== undefined) hi = config.max;
    if (hi - lo < Number.EPSILON) { lo -= 0.5; hi += 0.5; }
    return [lo, hi];
  }, [config.max, config.min, config.referenceLine, config.scaleTo, values]);
  const inset = Math.max(config.strokeWidth ?? context.sizeSpec.strokeWidth / 2, config.dotRadius ?? context.sizeSpec.dotRadius, 0.5);
  const scale = linearScale(domain, [context.height - inset, inset]);
  const lines = sources.map((source, sourceIndex) => {
    const points: TinyPoint[] = source.points.map((point, index) => ({
      x: sources.length === 1 && source.points.length === 1 ? context.width / 2 : index * ((context.width - inset * 2) / Math.max(1, source.points.length - 1)) + inset,
      y: scale(point.value), value: point.value, label: point.label,
    }));
    const color = source.color ?? (config.colorMode === 'single' ? (config.color ?? context.seriesColor(0)) : config.colorMode === 'trend' ? ((points.at(-1)?.value ?? 0) >= (points[0]?.value ?? 0) ? config.positiveColor : config.negativeColor) : context.seriesColor(sourceIndex));
    const path = tinyLinePath(points, config.curve);
    const minPoint = points[values.indexOf(Math.min(...values))] ?? points.reduce((a, b) => a.value < b.value ? a : b, points[0]);
    const maxPoint = points[values.indexOf(Math.max(...values))] ?? points.reduce((a, b) => a.value > b.value ? a : b, points[0]);
    return { points, color, path, areaPath: config.area ? closeToFloor(path, points, context.height - inset) : '', minPoint: points.reduce((a, b) => a.value < b.value ? a : b, points[0]), maxPoint: points.reduce((a, b) => a.value > b.value ? a : b, points[0]), endPoint: points.at(-1), minPointGlobal: minPoint, maxPointGlobal: maxPoint };
  });
  const referenceY = config.referenceLine === undefined ? null : scale(config.referenceLine);
  const svgStyle = { ...tinyStyle(context), ...style };
  return <div ref={context.hostRef} className={`${context.chartClassName}${className ? ` ${className}` : ''}`} style={svgStyle}>
    <svg className="sp-tiny__svg" width={context.width} height={context.height} viewBox={`0 0 ${context.width} ${context.height}`} {...context.svgProps}>
      {referenceY !== null && <line x1="0" y1={referenceY} x2={context.width} y2={referenceY} stroke={config.referenceLineColor ?? TINY_MUTED_COLOR} strokeWidth="1" strokeDasharray="2 2" aria-hidden="true" />}
      {lines.map((line, index) => <g key={index}>
        {line.areaPath && <path className={context.config.animate ? 'sp-tiny__fade' : undefined} d={line.areaPath} fill={line.color} fillOpacity={config.areaOpacity} stroke="none" />}
        <path className={context.config.animate ? 'sp-tiny__draw' : undefined} style={{ '--sp-tiny-length': Math.max(1, context.width * 1.2) } as CSSProperties} d={line.path} stroke={line.color} strokeWidth={config.strokeWidth ?? context.sizeSpec.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {config.showMinMax && <><circle cx={line.minPoint.x} cy={line.minPoint.y} r={config.dotRadius ?? context.sizeSpec.dotRadius} fill={config.negativeColor}><title>{context.tooltipText(line.minPoint.label, line.minPoint.value)}</title></circle><circle cx={line.maxPoint.x} cy={line.maxPoint.y} r={config.dotRadius ?? context.sizeSpec.dotRadius} fill={config.positiveColor}><title>{context.tooltipText(line.maxPoint.label, line.maxPoint.value)}</title></circle></>}
        {config.showEndDot && line.endPoint && <circle cx={line.endPoint.x} cy={line.endPoint.y} r={config.dotRadius ?? context.sizeSpec.dotRadius} fill={line.color}><title>{context.tooltipText(line.endPoint.label, line.endPoint.value)}</title></circle>}
      </g>)}
    </svg>
  </div>;
}

export const TinyLineChart = TinyLine;
export type TinyLineChartProps = TinyLineProps;
