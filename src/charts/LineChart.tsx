/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './LineChart.css';
import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartDataItem, type ChartSeries, type ChartTooltipData } from './types.js';

export interface LineChartProps {
  data?: ChartDataItem[];
  series?: ChartSeries[];
  categories?: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  curved?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function LineChart({
  data,
  series,
  categories,
  title,
  subtitle,
  height = 300,
  curved = true,
  showDots = true,
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  // Normalize single vs multi-series
  let normalizedCategories: string[] = [];
  let normalizedSeries: { name: string; data: number[]; color: string }[] = [];

  if (series && series.length > 0) {
    normalizedCategories = categories || [];
    normalizedSeries = series.map((s, idx) => ({
      name: s.name,
      data: s.data.map((d) => (typeof d === 'number' ? d : d.value)),
      color: s.color || colorScheme[idx % colorScheme.length],
    }));
  } else if (data && data.length > 0) {
    normalizedCategories = data.map((d) => d.label);
    normalizedSeries = [
      {
        name: 'Value',
        data: data.map((d) => d.value),
        color: colorScheme[0],
      },
    ];
  }

  const categoryCount = normalizedCategories.length;
  if (categoryCount === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const allValues = normalizedSeries.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues, 1);
  const niceMax = Math.ceil(maxVal * 1.15);

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const yTicks = [0, niceMax * 0.33, niceMax * 0.66, niceMax];
  const stepX = categoryCount > 1 ? graphWidth / (categoryCount - 1) : graphWidth / 2;

  const legendItems: LegendItem[] = normalizedSeries.map((s) => ({
    label: s.name,
    color: s.color,
  }));

  // Build SVG path string (curved spline or straight lines)
  function getLinePath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    if (!curved) {
      return points.reduce(
        (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        '',
      );
    }

    // Bezier curve smoothing
    return points.reduce((acc, p, idx, arr) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[idx - 1];
      const cp1X = prev.x + (p.x - prev.x) / 2;
      const cp1Y = prev.y;
      const cp2X = prev.x + (p.x - prev.x) / 2;
      const cp2Y = p.y;
      return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p.x} ${p.y}`;
    }, '');
  }

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      legend={showLegend && normalizedSeries.length > 1 ? legendItems : undefined}
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
              {Math.round(val)}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {normalizedCategories.map((cat, idx) => {
          const x = categoryCount > 1 ? padding.left + idx * stepX : padding.left + graphWidth / 2;
          return (
            <text
              key={idx}
              x={x}
              y={padding.top + graphHeight + 20}
              textAnchor="middle"
              className="sp-chart-axis-label"
            >
              {cat}
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

        {/* Series Paths & Dots */}
        {normalizedSeries.map((s, seriesIdx) => {
          const points = s.data.map((val, catIdx) => {
            const x = categoryCount > 1 ? padding.left + catIdx * stepX : padding.left + graphWidth / 2;
            const y = padding.top + graphHeight - (val / niceMax) * graphHeight;
            return { x, y, val, cat: normalizedCategories[catIdx] };
          });

          const pathD = getLinePath(points);

          return (
            <g key={seriesIdx}>
              <path d={pathD} stroke={s.color} className="sp-line-chart-path" />

              {showDots &&
                points.map((pt, ptIdx) => (
                  <circle
                    key={ptIdx}
                    cx={pt.x}
                    cy={pt.y}
                    r={4}
                    fill="var(--sp-surface-0, #ffffff)"
                    stroke={s.color}
                    strokeWidth={2}
                    className="sp-line-chart-dot"
                    onMouseEnter={(e) => {
                      const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (containerRect) {
                        const relX = (pt.x / svgWidth) * containerRect.width;
                        const relY = (pt.y / svgHeight) * containerRect.height;
                        setTooltip({
                          label: pt.cat,
                          seriesName: s.name,
                          value: pt.val,
                          color: s.color,
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
