/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './StackedBarChart.css';
import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartSeries, type ChartTooltipData } from './types.js';

export interface StackedBarChartProps {
  /** Array of series containing data for stacked bars */
  series: ChartSeries[];
  /** Categories along category axis */
  categories: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  /** Normalize stacked segments to 100% total height */
  percentage?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function StackedBarChart({
  series = [],
  categories = [],
  title,
  subtitle,
  height = 300,
  percentage = false,
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: StackedBarChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  const categoryCount = categories.length;
  if (categoryCount === 0 || series.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const normalizedSeries = series.map((s, idx) => ({
    name: s.name,
    data: s.data.map((d) => (typeof d === 'number' ? d : d.value)),
    color: s.color || colorScheme[idx % colorScheme.length],
  }));

  // Calculate cumulative category totals for stacked max
  const categoryTotals = categories.map((_, catIdx) =>
    normalizedSeries.reduce((acc, s) => acc + (s.data[catIdx] || 0), 0),
  );

  const maxVal = Math.max(...categoryTotals, 1);
  const niceMax = percentage ? 100 : Math.ceil(maxVal * 1.15);

  const legendItems: LegendItem[] = normalizedSeries.map((s) => ({
    label: s.name,
    color: s.color,
  }));

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const yTicks = [0, niceMax * 0.33, niceMax * 0.66, niceMax];

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
        preserveAspectRatio="none"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y Axis Gridlines */}
        {showGrid &&
          yTicks.map((val, idx) => {
            const y = padding.top + graphHeight - (val / niceMax) * graphHeight;
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
          const y = padding.top + graphHeight - (val / niceMax) * graphHeight;
          return (
            <text
              key={idx}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              className="sp-chart-axis-label"
            >
              {percentage ? `${Math.round(val)}%` : Math.round(val)}
            </text>
          );
        })}

        {/* X Axis Line */}
        <line
          x1={padding.left}
          y1={padding.top + graphHeight}
          x2={padding.left + graphWidth}
          y2={padding.top + graphHeight}
          className="sp-chart-axis-line"
        />

        {/* Render Stacked Bars */}
        {categories.map((cat, catIdx) => {
          const groupWidth = graphWidth / categoryCount;
          const barWidth = Math.max(12, groupWidth - 24);
          const x = padding.left + catIdx * groupWidth + (groupWidth - barWidth) / 2;
          const totalVal = categoryTotals[catIdx] || 1;

          let cumulativeY = padding.top + graphHeight;

          return (
            <g key={catIdx}>
              {/* Category Label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + graphHeight + 20}
                textAnchor="middle"
                className="sp-chart-axis-label"
              >
                {cat}
              </text>

              {/* Stacked segments for each series */}
              {normalizedSeries.map((s, seriesIdx) => {
                const val = s.data[catIdx] || 0;
                const effectiveVal = percentage ? (val / totalVal) * 100 : val;
                const barH = (effectiveVal / niceMax) * graphHeight;
                const y = cumulativeY - barH;
                cumulativeY = y;

                return (
                  <rect
                    key={seriesIdx}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    fill={s.color}
                    className="sp-stacked-bar-rect"
                    onMouseEnter={(e) => {
                      const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (containerRect) {
                        const relX = (x / svgWidth) * containerRect.width;
                        const relY = (y / svgHeight) * containerRect.height;
                        setTooltip({
                          label: cat,
                          seriesName: s.name,
                          value: percentage ? `${val} (${((val / totalVal) * 100).toFixed(1)}%)` : val,
                          color: s.color,
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
