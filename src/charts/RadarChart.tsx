import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartTooltipData } from './types.js';

export interface RadarSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface RadarChartProps {
  series: RadarSeries[];
  categories: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  maxValue?: number;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function RadarChart({
  series = [],
  categories = [],
  title,
  subtitle,
  height = 320,
  maxValue,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: RadarChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  const numCategories = categories.length;

  if (series.length === 0 || numCategories === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const allValues = series.flatMap((s) => s.data);
  const calculatedMax = maxValue || Math.max(...allValues, 1);

  const cx = 150;
  const cy = 140;
  const radius = 95;

  const angleStep = (2 * Math.PI) / numCategories;

  function getCoordinates(index: number, val: number) {
    const angle = index * angleStep - Math.PI / 2;
    const r = (val / calculatedMax) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  const legendItems: LegendItem[] = series.map((s, idx) => ({
    label: s.name,
    color: s.color || colorScheme[idx % colorScheme.length],
  }));

  const gridLevels = [0.25, 0.5, 0.75, 1];

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
        viewBox="0 0 300 280"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Background Concentric Radar Web Polygons */}
        {gridLevels.map((lvl, lvlIdx) => {
          const points = categories
            .map((_, catIdx) => {
              const { x, y } = getCoordinates(catIdx, lvl * calculatedMax);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={lvlIdx}
              points={points}
              fill="none"
              stroke="var(--sp-border-subtle, #e2e8f0)"
              strokeWidth="1"
              strokeDasharray={lvl === 1 ? undefined : '3,3'}
            />
          );
        })}

        {/* Axis Spokes from Center to Outer Radius */}
        {categories.map((cat, idx) => {
          const outer = getCoordinates(idx, calculatedMax);
          const labelPt = getCoordinates(idx, calculatedMax * 1.18);

          return (
            <g key={idx}>
              <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="var(--sp-border-subtle, #e2e8f0)" strokeWidth="1" />
              <text
                x={labelPt.x}
                y={labelPt.y + 4}
                textAnchor="middle"
                className="sp-chart-axis-label"
                style={{ fontSize: 11 }}
              >
                {cat}
              </text>
            </g>
          );
        })}

        {/* Radar Polygons for Series */}
        {series.map((s, seriesIdx) => {
          const color = s.color || colorScheme[seriesIdx % colorScheme.length];
          const polyPoints = s.data
            .map((val, catIdx) => {
              const { x, y } = getCoordinates(catIdx, val);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <g key={seriesIdx}>
              <polygon points={polyPoints} fill={color} fillOpacity={0.35} stroke={color} strokeWidth={2} />
              {s.data.map((val, catIdx) => {
                const { x, y } = getCoordinates(catIdx, val);
                return (
                  <circle
                    key={catIdx}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (containerRect) {
                        const relX = (x / 300) * containerRect.width;
                        const relY = (y / 280) * containerRect.height;
                        setTooltip({
                          label: categories[catIdx] || `Axis ${catIdx + 1}`,
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
              })}
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
