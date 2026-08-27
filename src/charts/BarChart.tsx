/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './BarChart.css';
import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { DEFAULT_CHART_COLORS, type ChartCommonProps, type ChartDataItem, type ChartSeries, type ChartTooltipData } from './types.js';

export interface BarChartProps extends ChartCommonProps {
  /** Single series data items or multi-series data */
  data?: ChartDataItem[];
  series?: ChartSeries[];
  categories?: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function BarChart({
  data,
  series,
  categories,
  title,
  subtitle,
  height = 300,
  orientation = 'vertical',
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
  ...commonProps
}: BarChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const resolvedShowGrid = commonProps.config?.showGrid ?? showGrid;
  const resolvedOrientation = commonProps.config?.orientation ?? orientation;

  // Normalize single vs multi-series
  let normalizedCategories: string[] = [];
  let normalizedSeries: { name: string; data: number[]; color: string }[] = [];

  if (series && series.length > 0) {
    normalizedCategories = categories || [];
    normalizedSeries = series.map((s, idx) => ({
      name: s.name,
      data: s.data.map((d) => (typeof d === 'number' ? d : d.value)),
      color: s.color || palette[idx % palette.length],
    }));
  } else if (data && data.length > 0) {
    normalizedCategories = data.map((d) => d.label);
    normalizedSeries = [
      {
        name: 'Value',
        data: data.map((d) => d.value),
        color: palette[0],
      },
    ];
  }

  const categoryCount = normalizedCategories.length;
  if (categoryCount === 0) {
    return (
      <ChartContainer {...commonProps} title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const allValues = normalizedSeries.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues, 1);
  const niceMax = Math.ceil(maxVal * 1.15);

  const legendItems: LegendItem[] = normalizedSeries.map((s) => ({
    label: s.name,
    color: s.color,
  }));

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const ticks = [0, niceMax * 0.33, niceMax * 0.66, niceMax];

  return (
    <ChartContainer
      {...commonProps}
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
        {resolvedOrientation === 'horizontal' ? (
          /* Horizontal Orientation */
          <>
            {/* Vertical Gridlines */}
            {resolvedShowGrid &&
              ticks.map((val, idx) => {
                const x = padding.left + (val / niceMax) * graphWidth;
                return (
                  <line
                    key={idx}
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + graphHeight}
                    className="sp-chart-gridline"
                  />
                );
              })}

            {/* X Axis Labels */}
            {ticks.map((val, idx) => {
              const x = padding.left + (val / niceMax) * graphWidth;
              return (
                <text
                  key={idx}
                  x={x}
                  y={padding.top + graphHeight + 20}
                  textAnchor="middle"
                  className="sp-chart-axis-label"
                >
                  {Math.round(val)}
                </text>
              );
            })}

            {/* Y Axis Line */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + graphHeight}
              className="sp-chart-axis-line"
            />

            {/* Horizontal Bars */}
            {normalizedCategories.map((cat, catIdx) => {
              const groupHeight = graphHeight / categoryCount;
              const seriesCount = normalizedSeries.length;
              const barGap = 3;
              const totalBarHeight = groupHeight - 10;
              const barHeight = Math.max(6, (totalBarHeight - (seriesCount - 1) * barGap) / seriesCount);
              const groupY = padding.top + catIdx * groupHeight + 5;

              return (
                <g key={catIdx}>
                  <text
                    x={padding.left - 10}
                    y={groupY + totalBarHeight / 2 + 4}
                    textAnchor="end"
                    className="sp-chart-axis-label"
                  >
                    {cat}
                  </text>

                  {normalizedSeries.map((s, seriesIdx) => {
                    const val = s.data[catIdx] || 0;
                    const barW = (val / niceMax) * graphWidth;
                    const y = groupY + seriesIdx * (barHeight + barGap);
                    const color = data && data[catIdx]?.color ? data[catIdx].color : s.color;

                    return (
                      <rect
                        key={seriesIdx}
                        data-chart-series-index={seriesIdx}
                        data-chart-point
                        data-index={catIdx}
                        data-label={cat}
                        data-series-name={s.name}
                        data-value={val}
                        x={padding.left}
                        y={y}
                        width={barW}
                        height={barHeight}
                        fill={color}
                        rx={3}
                        ry={3}
                        className="sp-bar-chart-rect"
                        onMouseEnter={(e) => {
                          const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                          if (containerRect) {
                            const relX = ((padding.left + barW) / svgWidth) * containerRect.width;
                            const relY = (y / svgHeight) * containerRect.height;
                            setTooltip({
                              label: cat,
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
          </>
        ) : (
          /* Vertical Orientation */
          <>
            {/* Y Axis Gridlines */}
            {resolvedShowGrid &&
              ticks.map((val, idx) => {
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
            {ticks.map((val, idx) => {
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

            {/* X Axis Line */}
            <line
              x1={padding.left}
              y1={padding.top + graphHeight}
              x2={padding.left + graphWidth}
              y2={padding.top + graphHeight}
              className="sp-chart-axis-line"
            />

            {/* Vertical Bars */}
            {normalizedCategories.map((cat, catIdx) => {
              const groupWidth = graphWidth / categoryCount;
              const seriesCount = normalizedSeries.length;
              const barGap = 4;
              const totalBarWidth = groupWidth - 16;
              const barWidth = Math.max(6, (totalBarWidth - (seriesCount - 1) * barGap) / seriesCount);
              const groupX = padding.left + catIdx * groupWidth + 8;

              return (
                <g key={catIdx}>
                  <text
                    x={groupX + totalBarWidth / 2}
                    y={padding.top + graphHeight + 20}
                    textAnchor="middle"
                    className="sp-chart-axis-label"
                  >
                    {cat}
                  </text>

                  {normalizedSeries.map((s, seriesIdx) => {
                    const val = s.data[catIdx] || 0;
                    const barH = (val / niceMax) * graphHeight;
                    const x = groupX + seriesIdx * (barWidth + barGap);
                    const y = padding.top + graphHeight - barH;
                    const color = data && data[catIdx]?.color ? data[catIdx].color : s.color;

                    return (
                      <rect
                        key={seriesIdx}
                        data-chart-series-index={seriesIdx}
                        data-chart-point
                        data-index={catIdx}
                        data-label={cat}
                        data-series-name={s.name}
                        data-value={val}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barH}
                        fill={color}
                        rx={3}
                        ry={3}
                        className="sp-bar-chart-rect"
                        onMouseEnter={(e) => {
                          const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                          if (containerRect) {
                            const relX = (x / svgWidth) * containerRect.width;
                            const relY = (y / svgHeight) * containerRect.height;
                            setTooltip({
                              label: cat,
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
          </>
        )}
      </svg>
    </ChartContainer>
  );
}
