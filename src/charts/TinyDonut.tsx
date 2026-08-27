/* eslint-disable react-hooks/immutability -- angle is local geometry state used while deriving ring geometry. */
import './VisualizationCharts.css';
import { useMemo, type CSSProperties } from 'react';
import { arcStrokePath, clamp, normalizeTinyValues, sortTinyData, sumValues } from './tiny-utils.js';
import { TINY_TEXT_COLOR, TINY_TRACK_COLOR, type TinyDonutChartConfig, type TinyValues } from './tiny-types.js';
import { tinyStyle, useTinyChart } from './TinyChartBase.js';

export interface TinyDonutProps {
  data?: TinyValues;
  config?: TinyDonutChartConfig;
  className?: string;
  style?: CSSProperties;
}

export function TinyDonut({ data = [], config: inputConfig, className, style }: TinyDonutProps) {
  const config = { startAngle: 0, padAngle: 0, sort: 'none' as const, roundCaps: false, showShare: true, showCenterValue: false, ...inputConfig };
  const items = useMemo(() => sortTinyData(normalizeTinyValues(data).filter((datum) => datum.value > 0), config.sort), [config.sort, data]);
  const context = useTinyChart(inputConfig, 'Donut chart', items);
  const diameter = config.diameter ?? config.height ?? context.sizeSpec.diameter;
  const center = diameter / 2;
  const thickness = clamp(config.thickness ?? diameter * 0.3, 1, diameter / 2);
  const radius = Math.max(0.5, (diameter - thickness) / 2);
  const filled = sumValues(items);
  const denominator = config.total !== undefined && config.total > 0 ? config.total : filled;
  let angle = config.startAngle;
  const arcs = items.map((item, index) => {
    const sweep = clamp(denominator > 0 ? item.value / denominator * 360 : 0, 0, 360);
    const pad = items.length > 1 ? config.padAngle : 0;
    const start = angle + pad / 2;
    const end = angle + sweep - pad / 2;
    angle += sweep;
    return { item, index, path: arcStrokePath(center, center, radius, start, Math.max(start, end)), color: item.color ?? context.seriesColor(index), tooltip: context.tooltipText(item.label, item.value, config.showShare ? context.formatShare(item.value, denominator) : undefined) };
  });
  const isProgress = config.total !== undefined && config.total > 0;
  const centerText = config.centerText ?? (config.showCenterValue ? (isProgress ? context.formatShare(filled, denominator) : context.formatValue(filled)) : undefined);
  return <div ref={context.hostRef} className={`${context.chartClassName}${className ? ` ${className}` : ''}`} style={{ ...tinyStyle(context), ...style }}>
    <svg className="sp-tiny__svg" width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`} {...context.svgProps}>
      {(config.showTrack ?? isProgress) && <circle cx={center} cy={center} r={radius} fill="none" stroke={config.trackColor ?? TINY_TRACK_COLOR} strokeWidth={thickness} aria-hidden="true" />}
      <g className={context.config.animate ? 'sp-tiny__fade' : undefined}>
        {arcs.map((arc) => <path key={arc.index} d={arc.path} fill="none" stroke={arc.color} strokeWidth={thickness} strokeLinecap={config.roundCaps ? 'round' : 'butt'}>{context.config.showTooltip && <title>{arc.tooltip}</title>}</path>)}
      </g>
      {centerText && <text className="sp-tiny-donut__center" x={center} y={center} fontSize={config.centerTextSize ?? Math.max(8, Math.round(diameter * 0.3))} fill={config.centerTextColor ?? TINY_TEXT_COLOR} textAnchor="middle" dominantBaseline="central" aria-hidden="true">{centerText}</text>}
    </svg>
  </div>;
}

export const TinyDonutChart = TinyDonut;
export type TinyDonutChartProps = TinyDonutProps;
