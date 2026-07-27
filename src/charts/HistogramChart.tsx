import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { type ChartTooltipData } from './types.js';

export interface HistogramBin {
  x0: number;
  x1: number;
  count: number;
}

export interface HistogramChartProps {
  data: HistogramBin[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  showGrid?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function HistogramChart({
  data = [],
  title,
  subtitle,
  height = 320,
  showGrid = true,
  color = '#0f766e',
  className,
  style,
}: HistogramChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  if (data.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const binWidth = graphWidth / data.length;

  const yTicks = [0, Math.round(maxCount * 0.33), Math.round(maxCount * 0.66), maxCount];

  return (
    <ChartContainer title={title} subtitle={subtitle} tooltip={tooltip} height={height} className={className} style={style}>
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y Axis Gridlines */}
        {showGrid &&
          yTicks.map((val, idx) => {
            const y = padding.top + graphHeight - (val / maxCount) * graphHeight;
            return (
              <line key={idx} x1={padding.left} y1={y} x2={padding.left + graphWidth} y2={y} className="sp-chart-gridline" />
            );
          })}

        {/* Y Axis Labels */}
        {yTicks.map((val, idx) => {
          const y = padding.top + graphHeight - (val / maxCount) * graphHeight;
          return (
            <text key={idx} x={padding.left - 10} y={y + 4} textAnchor="end" className="sp-chart-axis-label">
              {val}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {data.map((bin, idx) => {
          const x = padding.left + idx * binWidth + binWidth / 2;
          return (
            <text key={idx} x={x} y={padding.top + graphHeight + 20} textAnchor="middle" className="sp-chart-axis-label">
              {bin.x0}-{bin.x1}
            </text>
          );
        })}

        {/* Axis Line */}
        <line
          x1={padding.left}
          y1={padding.top + graphHeight}
          x2={padding.left + graphWidth}
          y2={padding.top + graphHeight}
          className="sp-chart-axis-line"
        />

        {/* Render Histogram Bars */}
        {data.map((bin, idx) => {
          const barH = (bin.count / maxCount) * graphHeight;
          const y = padding.top + graphHeight - barH;
          const x = padding.left + idx * binWidth + 1;
          const actualW = Math.max(2, binWidth - 2);

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={actualW}
              height={Math.max(2, barH)}
              fill={color}
              fillOpacity={0.85}
              stroke={color}
              strokeWidth={1}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
              onMouseEnter={(e) => {
                const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                if (containerRect) {
                  const relX = ((x + actualW / 2) / svgWidth) * containerRect.width;
                  const relY = (y / svgHeight) * containerRect.height;
                  setTooltip({
                    label: `Range [${bin.x0} - ${bin.x1}]`,
                    value: `Count: ${bin.count}`,
                    color,
                    x: relX,
                    y: relY,
                  });
                }
              }}
            />
          );
        })}
      </svg>
    </ChartContainer>
  );
}
