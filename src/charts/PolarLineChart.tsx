import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartTooltipData } from './types.js';

export interface PolarSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface PolarLineChartProps {
  series: PolarSeries[];
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

export function PolarLineChart({
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
}: PolarLineChartProps) {
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
        {/* Polar Concentric Circular Gridlines */}
        {gridLevels.map((lvl, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={lvl * radius}
            fill="none"
            stroke="var(--sp-border-subtle, #e2e8f0)"
            strokeWidth="1"
            strokeDasharray={lvl === 1 ? undefined : '3,3'}
          />
        ))}

        {/* Polar Axis Lines and Labels */}
        {categories.map((cat, idx) => {
          const outer = getCoordinates(idx, calculatedMax);
          const labelPt = getCoordinates(idx, calculatedMax * 1.18);

          return (
            <g key={idx}>
              <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="var(--sp-border-subtle, #e2e8f0)" strokeWidth="1" />
              <text x={labelPt.x} y={labelPt.y + 4} textAnchor="middle" className="sp-chart-axis-label" style={{ fontSize: 11 }}>
                {cat}
              </text>
            </g>
          );
        })}

        {/* Polar Closed Trend Lines */}
        {series.map((s, seriesIdx) => {
          const color = s.color || colorScheme[seriesIdx % colorScheme.length];
          const linePoints = s.data.map((val, catIdx) => getCoordinates(catIdx, val));

          const pathD = linePoints.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '') + ' Z';

          return (
            <g key={seriesIdx}>
              <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} />
              {linePoints.map((pt, catIdx) => (
                <circle
                  key={catIdx}
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (containerRect) {
                      const relX = (pt.x / 300) * containerRect.width;
                      const relY = (pt.y / 280) * containerRect.height;
                      setTooltip({
                        label: categories[catIdx] || `Category ${catIdx + 1}`,
                        seriesName: s.name,
                        value: s.data[catIdx],
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
