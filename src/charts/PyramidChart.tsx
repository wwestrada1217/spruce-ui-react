import './VisualizationCharts.css';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { formatCompact, formatNumber } from './axis.js';
import type { ChartCommonProps, CoreChartConfig } from './types.js';

export interface PyramidDatum { label: string; value: number; color?: string }
export interface PyramidChartConfig extends CoreChartConfig { showValues?: boolean; valueFormat?: 'compact' | 'full' | 'none'; showPercentage?: boolean; labelPosition?: 'outside' | 'inside' }
export interface PyramidChartProps extends ChartCommonProps { data: PyramidDatum[]; title?: string; subtitle?: string; height?: number | string; colorScheme?: string[] }

export function PyramidChart({ data, title, subtitle, height = 320, colorScheme, ...commonProps }: PyramidChartProps) {
  const config = { showValues: true, valueFormat: 'compact' as const, showPercentage: true, labelPosition: 'outside' as const, ...(commonProps.config as PyramidChartConfig | undefined) };
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const width = 600;
  const chartHeight = typeof height === 'number' ? height : 320;
  const outside = config.labelPosition === 'outside';
  const margin = outside ? { top: 12, right: 128, bottom: 12, left: 148 } : { top: 12, right: 24, bottom: 12, left: 24 };
  const innerWidth = width - margin.left - margin.right;
  const bandHeight = Math.max(30, (chartHeight - margin.top - margin.bottom) / Math.max(1, data.length));
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  return <ChartContainer {...commonProps} config={config} title={title} subtitle={subtitle} height={height} chartType="Pyramid chart">
    <svg className="sp-chart-svg sp-visualization-chart__svg" viewBox={`0 0 ${width} ${chartHeight}`} role="img" aria-label={commonProps.ariaLabel ?? title ?? 'Pyramid chart'}>
      <g transform={`translate(${margin.left} ${margin.top})`}>
        {data.map((item, index) => {
          const y = index * bandHeight;
          const topWidth = index === 0 ? 8 : innerWidth * index / Math.max(1, data.length);
          const bottomWidth = innerWidth * (index + 1) / Math.max(1, data.length);
          const center = innerWidth / 2;
          const percentage = item.value / total * 100;
          const raw = config.valueFormat === 'none' ? '' : config.valueFormat === 'full' ? formatNumber(item.value) : formatCompact(item.value);
          const value = `${raw}${config.showPercentage && raw ? ` (${percentage.toFixed(0)}%)` : ''}`;
          const color = item.color ?? palette[index % palette.length];
          return <g key={`${item.label}-${index}`}>
            <path className="sp-visualization-chart__interactive" data-chart-point data-index={index} data-label={item.label} data-value={item.value} data-color={color} d={`M${center - topWidth / 2} ${y} L${center + topWidth / 2} ${y} L${center + bottomWidth / 2} ${y + bandHeight} L${center - bottomWidth / 2} ${y + bandHeight} Z`} fill={color} />
            {outside ? <><text className="sp-visualization-chart__axis-text" x={-12} y={y + bandHeight / 2} textAnchor="end" dominantBaseline="middle">{item.label}</text>{config.showValues && <text className="sp-visualization-chart__label" x={innerWidth + 12} y={y + bandHeight / 2} dominantBaseline="middle">{value}</text>}</> : <>{(innerWidth * (index + 0.5) / Math.max(1, data.length) > 72) && <text x={center} y={y + bandHeight / 2 - (config.showValues ? 7 : 0)} textAnchor="middle" dominantBaseline="middle" fill="var(--sp-text-inverse, #fff)" fontSize="12" fontWeight="600">{item.label}</text>}{config.showValues && <text x={center} y={y + bandHeight / 2 + 9} textAnchor="middle" dominantBaseline="middle" fill="var(--sp-text-inverse, #fff)" fontSize="10">{value}</text>}</>}
          </g>;
        })}
      </g>
    </svg>
  </ChartContainer>;
}
