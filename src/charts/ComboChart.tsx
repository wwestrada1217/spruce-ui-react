import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { DEFAULT_CHART_COLORS, type ChartCommonProps, type ChartTooltipData } from './types.js';

export interface ComboSeries {
  name: string;
  type: 'bar' | 'line';
  data: number[];
  color?: string;
  yAxisIndex?: 0 | 1;
}

export interface ComboChartProps extends ChartCommonProps {
  series: ComboSeries[];
  categories: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function ComboChart({
  series = [],
  categories = [],
  title,
  subtitle,
  height = 320,
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
  ...commonProps
}: ComboChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const resolvedShowGrid = commonProps.config?.showGrid ?? showGrid;

  if (series.length === 0 || categories.length === 0) {
    return (
      <ChartContainer {...commonProps} title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const barSeries = series.filter((s) => s.type === 'bar');
  const lineSeries = series.filter((s) => s.type === 'line');

  const barValues = barSeries.flatMap((s) => s.data);
  const lineValues = lineSeries.flatMap((s) => s.data);

  const maxBar = Math.max(...barValues, 1);
  const maxLine = Math.max(...lineValues, 1);

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 50, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const groupWidth = graphWidth / categories.length;

  const yTicksLeft = [0, Math.round(maxBar * 0.33), Math.round(maxBar * 0.66), maxBar];
  const yTicksRight = [0, Math.round(maxLine * 0.33), Math.round(maxLine * 0.66), maxLine];

  const legendItems: LegendItem[] = series.map((s, idx) => ({
    label: s.name,
    color: s.color || palette[idx % palette.length],
  }));

  return (
    <ChartContainer
      {...commonProps}
      title={title}
      subtitle={subtitle}
      legend={showLegend ? legendItems : undefined}
      tooltip={tooltip}
      height={height}
      className={className}
      style={style}
    >
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y Axis Left Gridlines & Labels */}
        {resolvedShowGrid &&
          yTicksLeft.map((val, idx) => {
            const y = padding.top + graphHeight - (val / maxBar) * graphHeight;
            return (
              <line key={idx} x1={padding.left} y1={y} x2={padding.left + graphWidth} y2={y} className="sp-chart-gridline" />
            );
          })}

        {yTicksLeft.map((val, idx) => {
          const y = padding.top + graphHeight - (val / maxBar) * graphHeight;
          return (
            <text key={idx} x={padding.left - 10} y={y + 4} textAnchor="end" className="sp-chart-axis-label">
              {val}
            </text>
          );
        })}

        {/* Y Axis Right Labels */}
        {yTicksRight.map((val, idx) => {
          const y = padding.top + graphHeight - (val / maxLine) * graphHeight;
          return (
            <text key={idx} x={padding.left + graphWidth + 10} y={y + 4} textAnchor="start" className="sp-chart-axis-label">
              {val}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {categories.map((cat, idx) => {
          const x = padding.left + idx * groupWidth + groupWidth / 2;
          return (
            <text key={idx} x={x} y={padding.top + graphHeight + 20} textAnchor="middle" className="sp-chart-axis-label">
              {cat}
            </text>
          );
        })}

        {/* Render Bar Series */}
        {barSeries.map((s, seriesIdx) => {
          const color = s.color || palette[seriesIdx % palette.length];
          const singleBarW = (groupWidth * 0.6) / barSeries.length;

          return s.data.map((val, catIdx) => {
            const barH = (val / maxBar) * graphHeight;
            const y = padding.top + graphHeight - barH;
            const x =
              padding.left + catIdx * groupWidth + groupWidth * 0.2 + seriesIdx * singleBarW;

            return (
              <rect
                key={`${seriesIdx}-${catIdx}`}
                data-chart-series-index={seriesIdx}
                data-chart-point
                data-index={catIdx}
                data-label={categories[catIdx]}
                data-series-name={s.name}
                data-value={val}
                x={x}
                y={y}
                width={Math.max(2, singleBarW - 2)}
                height={Math.max(2, barH)}
                rx={2}
                fill={color}
                fillOpacity={0.85}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const relX = ((x + singleBarW / 2) / svgWidth) * containerRect.width;
                    const relY = (y / svgHeight) * containerRect.height;
                    setTooltip({
                      label: categories[catIdx],
                      seriesName: s.name,
                      value: val,
                      color,
                      x: relX,
                      y: relY,
                    });
                  }
                }}
              />
            );
          });
        })}

        {/* Render Line Series */}
        {lineSeries.map((s, seriesIdx) => {
          const color = s.color || palette[(barSeries.length + seriesIdx) % palette.length];
          const pts = s.data.map((val, catIdx) => {
            const x = padding.left + catIdx * groupWidth + groupWidth / 2;
            const y = padding.top + graphHeight - (val / maxLine) * graphHeight;
            return { x, y, val, catIdx };
          });

          const pathD = pts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

          return (
            <g key={seriesIdx} data-chart-series-index={seriesIdx}>
              <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} />
              {pts.map((p, catIdx) => (
                <circle
                  key={catIdx}
                  data-chart-point
                  data-index={catIdx}
                  data-label={categories[catIdx]}
                  data-series-name={s.name}
                  data-value={p.val}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (containerRect) {
                      const relX = (p.x / svgWidth) * containerRect.width;
                      const relY = (p.y / svgHeight) * containerRect.height;
                      setTooltip({
                        label: categories[catIdx],
                        seriesName: s.name,
                        value: p.val,
                        color,
                        x: relX,
                        y: relY,
                      });
                    }
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
