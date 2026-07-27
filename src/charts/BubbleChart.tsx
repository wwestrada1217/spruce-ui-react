import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartTooltipData } from './types.js';

export interface BubblePoint {
  x: number;
  y: number;
  r: number;
  label?: string;
}

export interface BubbleSeries {
  name: string;
  data: BubblePoint[];
  color?: string;
}

export interface BubbleChartProps {
  series: BubbleSeries[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function BubbleChart({
  series = [],
  title,
  subtitle,
  height = 320,
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: BubbleChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  const allPoints = series.flatMap((s) => s.data);

  if (series.length === 0 || allPoints.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const minX = Math.min(...allPoints.map((p) => p.x));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));
  const maxY = Math.max(...allPoints.map((p) => p.y));
  const maxR = Math.max(...allPoints.map((p) => p.r), 1);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const legendItems: LegendItem[] = series.map((s, idx) => ({
    label: s.name,
    color: s.color || colorScheme[idx % colorScheme.length],
  }));

  const yTicks = [minY, minY + rangeY * 0.33, minY + rangeY * 0.66, maxY];
  const xTicks = [minX, minX + rangeX * 0.33, minX + rangeX * 0.66, maxX];

  return (
    <ChartContainer
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
        {/* Y Axis Gridlines */}
        {showGrid &&
          yTicks.map((val, idx) => {
            const y = padding.top + graphHeight - ((val - minY) / rangeY) * graphHeight;
            return (
              <line
                key={idx}
                x1={padding.left}
                y1={y}
                x2={padding.left + graphWidth}
                y2={y}
                className="sp-chart-gridline"
              />
            );
          })}

        {/* Y Axis Labels */}
        {yTicks.map((val, idx) => {
          const y = padding.top + graphHeight - ((val - minY) / rangeY) * graphHeight;
          return (
            <text key={idx} x={padding.left - 10} y={y + 4} textAnchor="end" className="sp-chart-axis-label">
              {Math.round(val)}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {xTicks.map((val, idx) => {
          const x = padding.left + ((val - minX) / rangeX) * graphWidth;
          return (
            <text key={idx} x={x} y={padding.top + graphHeight + 20} textAnchor="middle" className="sp-chart-axis-label">
              {Math.round(val)}
            </text>
          );
        })}

        {/* Axis Lines */}
        <line
          x1={padding.left}
          y1={padding.top + graphHeight}
          x2={padding.left + graphWidth}
          y2={padding.top + graphHeight}
          className="sp-chart-axis-line"
        />

        {/* Render Bubbles */}
        {series.map((s, seriesIdx) => {
          const color = s.color || colorScheme[seriesIdx % colorScheme.length];
          return s.data.map((pt, ptIdx) => {
            const cx = padding.left + ((pt.x - minX) / rangeX) * graphWidth;
            const cy = padding.top + graphHeight - ((pt.y - minY) / rangeY) * graphHeight;
            const r = Math.max(6, (pt.r / maxR) * 24);

            return (
              <circle
                key={`${seriesIdx}-${ptIdx}`}
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                fillOpacity={0.6}
                stroke={color}
                strokeWidth={1.5}
                style={{ transition: 'transform 0.15s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const relX = (cx / svgWidth) * containerRect.width;
                    const relY = (cy / svgHeight) * containerRect.height;
                    setTooltip({
                      label: pt.label || `(X: ${pt.x}, Y: ${pt.y})`,
                      seriesName: s.name,
                      value: `R: ${pt.r}`,
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
      </svg>
    </ChartContainer>
  );
}
