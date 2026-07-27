import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { type ChartTooltipData } from './types.js';

export interface HeatmapItem {
  x: string;
  y: string;
  value: number;
}

export interface HeatmapChartProps {
  data: HeatmapItem[];
  xCategories: string[];
  yCategories: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  baseColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function HeatmapChart({
  data = [],
  xCategories = [],
  yCategories = [],
  title,
  subtitle,
  height = 320,
  baseColor = '#0f766e',
  className,
  style,
}: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  if (data.length === 0 || xCategories.length === 0 || yCategories.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const cellWidth = graphWidth / xCategories.length;
  const cellHeight = graphHeight / yCategories.length;

  const valueMap = new Map<string, number>();
  data.forEach((item) => {
    valueMap.set(`${item.x}:${item.y}`, item.value);
  });

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
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
        {/* Y Axis Labels */}
        {yCategories.map((yCat, yIdx) => {
          const y = padding.top + yIdx * cellHeight + cellHeight / 2 + 4;
          return (
            <text key={yIdx} x={padding.left - 10} y={y} textAnchor="end" className="sp-chart-axis-label">
              {yCat}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {xCategories.map((xCat, xIdx) => {
          const x = padding.left + xIdx * cellWidth + cellWidth / 2;
          return (
            <text key={xIdx} x={x} y={padding.top + graphHeight + 20} textAnchor="middle" className="sp-chart-axis-label">
              {xCat}
            </text>
          );
        })}

        {/* Heatmap Grid Cells */}
        {yCategories.map((yCat, yIdx) => {
          return xCategories.map((xCat, xIdx) => {
            const val = valueMap.get(`${xCat}:${yCat}`) ?? 0;
            const norm = (val - minVal) / range;
            const opacity = 0.15 + norm * 0.85;

            const rectX = padding.left + xIdx * cellWidth;
            const rectY = padding.top + yIdx * cellHeight;

            return (
              <g key={`${xIdx}-${yIdx}`}>
                <rect
                  x={rectX + 2}
                  y={rectY + 2}
                  width={Math.max(0, cellWidth - 4)}
                  height={Math.max(0, cellHeight - 4)}
                  rx={4}
                  fill={baseColor}
                  fillOpacity={opacity}
                  stroke={baseColor}
                  strokeWidth={1}
                  style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                  onMouseEnter={(e) => {
                    const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (containerRect) {
                      const relX = ((rectX + cellWidth / 2) / svgWidth) * containerRect.width;
                      const relY = ((rectY + cellHeight / 2) / svgHeight) * containerRect.height;
                      setTooltip({
                        label: `${xCat} / ${yCat}`,
                        value: val,
                        color: baseColor,
                        x: relX,
                        y: relY,
                      });
                    }
                  }}
                />
                <text
                  x={rectX + cellWidth / 2}
                  y={rectY + cellHeight / 2 + 4}
                  textAnchor="middle"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fill: opacity > 0.6 ? '#ffffff' : 'var(--sp-text-default)',
                    pointerEvents: 'none',
                  }}
                >
                  {val}
                </text>
              </g>
            );
          });
        })}
      </svg>
    </ChartContainer>
  );
}
