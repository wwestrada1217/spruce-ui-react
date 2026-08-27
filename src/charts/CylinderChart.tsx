import './VisualizationCharts.css';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { formatCompact, formatNumber, generateTicks } from './axis.js';
import { linearScale, niceLinearDomain } from './scales.js';
import type { ChartCommonProps, ChartDataItem, CoreChartConfig } from './types.js';

export interface CylinderChartConfig extends CoreChartConfig {
  orientation?: 'vertical' | 'horizontal';
  perspectiveRatio?: number;
  barPadding?: number;
  showValues?: boolean;
  valueFormat?: 'compact' | 'full' | 'none';
  xLabel?: string;
  yLabel?: string;
  targetLine?: number;
  targetLineLabel?: string;
}

export interface CylinderChartProps extends ChartCommonProps {
  data: ChartDataItem[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  colorScheme?: string[];
}

const DEFAULTS = { orientation: 'vertical' as const, perspectiveRatio: 0.3, barPadding: 0.3, showValues: true, valueFormat: 'compact' as const };

export function CylinderChart({ data, title, subtitle, height = 320, colorScheme, ...commonProps }: CylinderChartProps) {
  const config = { ...DEFAULTS, ...(commonProps.config as CylinderChartConfig | undefined) };
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const horizontal = config.orientation === 'horizontal';
  const width = 600;
  const chartHeight = typeof height === 'number' ? height : 320;
  const margin = { top: 28, right: horizontal ? 26 : 42, bottom: horizontal ? 28 : 52, left: horizontal ? 82 : 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const maxValue = Math.max(1, ...data.map((item) => item.value));
  const domain = niceLinearDomain([0, maxValue * 1.1], 5);
  const scale = horizontal ? linearScale(domain, [0, innerWidth]) : linearScale(domain, [innerHeight, 0]);
  const ticks = generateTicks(domain[0], domain[1], 5).filter((value) => value >= domain[0] && value <= domain[1]);
  const gap = innerWidth * (config.barPadding ?? 0.3) / Math.max(1, data.length + 1);
  const band = (innerWidth - gap * (data.length + 1)) / Math.max(1, data.length);
  const persp = Math.max(0.1, Math.min(0.7, config.perspectiveRatio ?? 0.3));
  const valueLabel = (value: number) => config.valueFormat === 'none' ? '' : config.valueFormat === 'full' ? formatNumber(value) : formatCompact(value);
  const target = config.targetLine === undefined ? null : scale(config.targetLine);

  return <ChartContainer {...commonProps} config={config} title={title} subtitle={subtitle} height={height} chartType="Cylinder chart" className={commonProps.className} style={commonProps.style}>
    <svg className="sp-chart-svg sp-visualization-chart__svg" viewBox={`0 0 ${width} ${chartHeight}`} role="img" aria-label={commonProps.ariaLabel ?? title ?? 'Cylinder chart'}>
      <g transform={`translate(${margin.left} ${margin.top})`}>
        {!horizontal && config.showGrid !== false && ticks.map((tick) => { const y = scale(tick); return <line key={tick} className="sp-visualization-chart__grid-line" x1="0" x2={innerWidth} y1={y} y2={y} />; })}
        {config.showAxes !== false && <>
          <line x1="0" y1={horizontal ? 0 : innerHeight} x2={horizontal ? innerWidth : 0} y2={horizontal ? 0 : innerHeight} stroke="var(--sp-chart-axis-line, var(--sp-border-strong, #cbd5e1))" />
          {!horizontal && ticks.map((tick) => <text key={`y-${tick}`} className="sp-visualization-chart__axis-text" x="-8" y={scale(tick)} textAnchor="end" dominantBaseline="middle">{formatCompact(tick)}</text>)}
          {horizontal && ticks.map((tick) => <text key={`x-${tick}`} className="sp-visualization-chart__axis-text" x={scale(tick)} y={innerHeight + 20} textAnchor="middle">{formatCompact(tick)}</text>)}
          {data.map((item, index) => <text key={`label-${item.label}-${index}`} className="sp-visualization-chart__axis-text" x={horizontal ? -10 : gap + index * (band + gap) + band / 2} y={horizontal ? index * (Math.max(18, innerHeight / data.length)) + 12 : innerHeight + 20} textAnchor={horizontal ? 'end' : 'middle'}>{item.label}</text>)}
          {config.xLabel && <text className="sp-visualization-chart__axis-label" x={innerWidth / 2} y={innerHeight + 42} textAnchor="middle">{config.xLabel}</text>}
          {config.yLabel && <text className="sp-visualization-chart__axis-label" transform="rotate(-90)" x={-innerHeight / 2} y={-44} textAnchor="middle">{config.yLabel}</text>}
        </>}
        {target !== null && <><line className="sp-visualization-chart__target" x1={horizontal ? target : 0} x2={horizontal ? target : innerWidth} y1={horizontal ? 0 : target} y2={horizontal ? innerHeight : target} /><text className="sp-visualization-chart__axis-text" x={horizontal ? target + 4 : innerWidth + 4} y={horizontal ? -4 : target} dominantBaseline="middle">{config.targetLineLabel ?? 'Target'}</text></>}
        {data.map((item, index) => {
          const color = item.color ?? palette[index % palette.length];
          if (horizontal) {
            const row = Math.max(18, innerHeight / Math.max(1, data.length));
            const cy = row * index + row / 2;
            const length = Math.max(0, scale(item.value));
            const rx = Math.max(3, row * 0.28);
            const ry = Math.max(2, rx * persp);
            return <g key={`${item.label}-${index}`} className="sp-visualization-chart__interactive" data-chart-point data-index={index} data-label={item.label} data-value={item.value} data-color={color}>
              <path d={`M0 ${cy - rx} H${length} V${cy + rx} H0 Z`} fill={color} fillOpacity="0.88" />
              <ellipse cx={length} cy={cy} rx={ry} ry={rx} fill={color} opacity="0.95" />
              {config.showValues && <text className="sp-visualization-chart__label" x={length + 8} y={cy} dominantBaseline="middle">{valueLabel(item.value)}</text>}
            </g>;
          }
          const cx = gap + index * (band + gap) + band / 2;
          const y = scale(item.value);
          const rx = Math.max(3, band / 2);
          const ry = Math.max(2, rx * persp);
          return <g key={`${item.label}-${index}`} className="sp-visualization-chart__interactive" data-chart-point data-index={index} data-label={item.label} data-value={item.value} data-color={color}>
            <path d={`M${cx - rx} ${y} L${cx - rx} ${innerHeight} A${rx} ${ry} 0 0 0 ${cx + rx} ${innerHeight} L${cx + rx} ${y} A${rx} ${ry} 0 0 0 ${cx - rx} ${y} Z`} fill={color} fillOpacity="0.88" />
            <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={color} />
            {config.showValues && <text className="sp-visualization-chart__label" x={cx} y={y - ry - 6} textAnchor="middle">{valueLabel(item.value)}</text>}
          </g>;
        })}
      </g>
    </svg>
  </ChartContainer>;
}
