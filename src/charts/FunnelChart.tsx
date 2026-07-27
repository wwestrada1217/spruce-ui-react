import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartDataItem, type ChartTooltipData } from './types.js';

export interface FunnelChartProps {
  data: ChartDataItem[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function FunnelChart({
  data = [],
  title,
  subtitle,
  height = 320,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: FunnelChartProps) {
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

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 120, bottom: 20, left: 120 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const stageHeight = graphHeight / data.length;

  return (
    <ChartContainer title={title} subtitle={subtitle} tooltip={tooltip} height={height} className={className} style={style}>
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setTooltip(null)}
      >
        {data.map((item, idx) => {
          const nextItem = data[idx + 1];
          const topRatio = item.value / maxVal;
          const bottomRatio = nextItem ? nextItem.value / maxVal : topRatio * 0.7;

          const topW = graphWidth * topRatio;
          const bottomW = graphWidth * bottomRatio;

          const yTop = padding.top + idx * stageHeight;
          const yBottom = yTop + stageHeight - 4;

          const xTopLeft = padding.left + (graphWidth - topW) / 2;
          const xTopRight = xTopLeft + topW;
          const xBottomLeft = padding.left + (graphWidth - bottomW) / 2;
          const xBottomRight = xBottomLeft + bottomW;

          const points = `${xTopLeft},${yTop} ${xTopRight},${yTop} ${xBottomRight},${yBottom} ${xBottomLeft},${yBottom}`;
          const color = item.color || colorScheme[idx % colorScheme.length];
          const conversionRate = idx > 0 ? ((item.value / data[0].value) * 100).toFixed(1) : '100';

          return (
            <g key={idx}>
              <polygon
                points={points}
                fill={color}
                fillOpacity={0.85}
                stroke={color}
                strokeWidth={1.5}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const midY = (yTop + yBottom) / 2;
                    const relX = ((padding.left + graphWidth / 2) / svgWidth) * containerRect.width;
                    const relY = (midY / svgHeight) * containerRect.height;

                    setTooltip({
                      label: item.label,
                      value: `${item.value} (${conversionRate}%)`,
                      color,
                      x: relX,
                      y: relY,
                    });
                  }
                }}
              />
              {/* Funnel Stage Label */}
              <text
                x={xTopLeft - 12}
                y={(yTop + yBottom) / 2 + 4}
                textAnchor="end"
                className="sp-chart-axis-label"
                style={{ fontWeight: 600 }}
              >
                {item.label}
              </text>

              {/* Conversion Rate Label */}
              <text
                x={xTopRight + 12}
                y={(yTop + yBottom) / 2 + 4}
                textAnchor="start"
                className="sp-chart-axis-label"
                style={{ fontSize: 11 }}
              >
                {item.value} ({conversionRate}%)
              </text>
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
