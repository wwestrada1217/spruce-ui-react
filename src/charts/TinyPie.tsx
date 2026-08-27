/* eslint-disable react-hooks/immutability -- angle is local geometry state used while deriving slice geometry. */
import './VisualizationCharts.css';
import { useMemo, type CSSProperties } from 'react';
import { normalizeTinyValues, piePath, sortTinyData, sumValues } from './tiny-utils.js';
import type { TinyPieChartConfig, TinyValues } from './tiny-types.js';
import { tinyStyle, useTinyChart } from './TinyChartBase.js';

export interface TinyPieProps {
  data?: TinyValues;
  config?: TinyPieChartConfig;
  className?: string;
  style?: CSSProperties;
}

export function TinyPie({ data = [], config: inputConfig, className, style }: TinyPieProps) {
  const config = { startAngle: 0, padAngle: 0, sort: 'none' as const, strokeWidth: 0, showShare: true, ...inputConfig };
  const items = useMemo(() => sortTinyData(normalizeTinyValues(data).filter((datum) => datum.value > 0), config.sort), [config.sort, data]);
  const context = useTinyChart(inputConfig, 'Pie chart', items);
  const diameter = config.diameter ?? config.height ?? context.sizeSpec.diameter;
  const total = sumValues(items);
  let angle = config.startAngle;
  const slices = items.map((item, index) => {
    const sweep = total > 0 ? item.value / total * 360 : 0;
    const pad = items.length > 1 ? config.padAngle : 0;
    const start = angle + pad / 2;
    const end = angle + sweep - pad / 2;
    angle += sweep;
    return { item, index, path: piePath(diameter / 2, diameter / 2, Math.max(1, diameter / 2 - config.strokeWidth / 2), start, Math.max(start, end)), color: item.color ?? context.seriesColor(index), tooltip: context.tooltipText(item.label, item.value, config.showShare ? context.formatShare(item.value, total) : undefined) };
  });
  return <div ref={context.hostRef} className={`${context.chartClassName}${className ? ` ${className}` : ''}`} style={{ ...tinyStyle(context), ...style }}>
    <svg className="sp-tiny__svg" width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`} {...context.svgProps}>
      <g className={context.config.animate ? 'sp-tiny__fade' : undefined}>
        {slices.map((slice) => <path key={slice.index} d={slice.path} fill={slice.color} stroke={config.strokeColor ?? 'var(--sp-surface-0, #fff)'} strokeWidth={config.strokeWidth}>{context.config.showTooltip && <title>{slice.tooltip}</title>}</path>)}
      </g>
    </svg>
  </div>;
}

export const TinyPieChart = TinyPie;
export type TinyPieChartProps = TinyPieProps;
