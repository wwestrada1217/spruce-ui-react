/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './AreaChart.css';
import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartDataItem, type ChartSeries, type ChartTooltipData } from './types.js';

export interface AreaChartProps {
  data?: ChartDataItem[];
  series?: ChartSeries[];
  categories?: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  curved?: boolean;
  fillOpacity?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function AreaChart({
  data,
  series,
  categories,
  title,
  subtitle,
  height = 300,
  curved = true,
  fillOpacity = 0.35,
  showDots = true,
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: AreaChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

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

  function getLinePath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    if (!curved) {
      return points.reduce(
        (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        '',
      );
    }

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

  function getAreaPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return '';
    const linePath = getLinePath(points);
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const bottomY = padding.top + graphHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
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
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          {normalizedSeries.map((s, idx) => (
            <linearGradient key={idx} id={`sp-area-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={fillOpacity} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>

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

        {/* Series Paths & Filled Areas */}
        {normalizedSeries.map((s, seriesIdx) => {
          const points = s.data.map((val, catIdx) => {
            const x = categoryCount > 1 ? padding.left + catIdx * stepX : padding.left + graphWidth / 2;
            const y = padding.top + graphHeight - (val / niceMax) * graphHeight;
            return { x, y, val, cat: normalizedCategories[catIdx] };
          });

          const areaD = getAreaPath(points);
          const lineD = getLinePath(points);

          return (
            <g key={seriesIdx}>
              {/* Gradient Filled Area */}
              <path d={areaD} fill={`url(#sp-area-grad-${seriesIdx})`} className="sp-area-chart-area" />

              {/* Stroke Line */}
              <path d={lineD} stroke={s.color} className="sp-area-chart-path" />

              {/* Data Point Dots */}
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
                    className="sp-area-chart-dot"
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
