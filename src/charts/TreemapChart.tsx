import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartTooltipData } from './types.js';

export interface TreemapNode {
  name: string;
  value: number;
  color?: string;
}

export interface TreemapChartProps {
  data: TreemapNode[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

interface RectNode extends TreemapNode {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function TreemapChart({
  data = [],
  title,
  subtitle,
  height = 320,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: TreemapChartProps) {
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

  const totalValue = data.reduce((acc, d) => acc + d.value, 0) || 1;

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = svgWidth - padding.left - padding.right;
  const heightArea = svgHeight - padding.top - padding.bottom;

  // Simple slice-and-dice treemap layout algorithm
  const rects: RectNode[] = [];
  let currX = padding.left;
  let currY = padding.top;
  let currW = width;
  let currH = heightArea;

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  sortedData.forEach((item, idx) => {
    const fraction = item.value / totalValue;
    const isHorizontal = currW > currH;

    let w = 0;
    let h = 0;
    const x = currX;
    const y = currY;

    if (isHorizontal) {
      w = currW * fraction;
      h = currH;
      currX += w;
      currW -= w;
    } else {
      w = currW;
      h = currH * fraction;
      currY += h;
      currH -= h;
    }

    const color = item.color || colorScheme[idx % colorScheme.length];
    rects.push({ ...item, x, y, w: Math.max(0, w), h: Math.max(0, h), color });
  });

  const legendItems: LegendItem[] = rects.map((r) => ({
    label: r.name,
    color: r.color || colorScheme[0],
  }));

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      legend={legendItems}
      tooltip={tooltip}
      height={height}
      className={className}
      style={style}
    >
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setTooltip(null)}
      >
        {rects.map((r, idx) => {
          const share = ((r.value / totalValue) * 100).toFixed(1);

          return (
            <g key={idx}>
              <rect
                x={r.x + 2}
                y={r.y + 2}
                width={Math.max(0, r.w - 4)}
                height={Math.max(0, r.h - 4)}
                rx={4}
                fill={r.color}
                fillOpacity={0.85}
                stroke={r.color}
                strokeWidth={1}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const relX = ((r.x + r.w / 2) / svgWidth) * containerRect.width;
                    const relY = ((r.y + r.h / 2) / svgHeight) * containerRect.height;
                    setTooltip({
                      label: r.name,
                      value: `${r.value} (${share}%)`,
                      color: r.color,
                      x: relX,
                      y: relY,
                    });
                  }
                }}
              />
              {r.w > 40 && r.h > 24 && (
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 4}
                  textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 600, fill: '#ffffff', pointerEvents: 'none' }}
                >
                  {r.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
