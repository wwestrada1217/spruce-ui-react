/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './StackedAreaChart.css';
import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { DEFAULT_CHART_COLORS, type ChartCommonProps, type ChartSeries, type ChartTooltipData } from './types.js';

export interface StackedAreaChartProps extends ChartCommonProps {
  series: ChartSeries[];
  categories: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  curved?: boolean;
  fillOpacity?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function StackedAreaChart({
  series = [],
  categories = [],
  title,
  subtitle,
  height = 300,
  curved = true,
  fillOpacity = 0.6,
  showGrid = true,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
  ...commonProps
}: StackedAreaChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const resolvedShowGrid = commonProps.config?.showGrid ?? showGrid;
  const resolvedCurved = commonProps.config?.curve ? commonProps.config.curve !== 'linear' : curved;
  const resolvedFillOpacity = typeof commonProps.config?.fillOpacity === 'number' ? commonProps.config.fillOpacity : fillOpacity;

  const categoryCount = categories.length;
  if (categoryCount === 0 || series.length === 0) {
    return (
      <ChartContainer {...commonProps} title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const normalizedSeries = series.map((s, idx) => ({
    name: s.name,
    data: s.data.map((d) => (typeof d === 'number' ? d : d.value)),
    color: s.color || palette[idx % palette.length],
  }));

  const categoryTotals = categories.map((_, catIdx) =>
    normalizedSeries.reduce((acc, s) => acc + (s.data[catIdx] || 0), 0),
  );

  const maxVal = Math.max(...categoryTotals, 1);
  const niceMax = Math.ceil(maxVal * 1.15);

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
  const stepX = categoryCount > 1 ? graphWidth / (categoryCount - 1) : graphWidth / 2;

  // Build cumulative baseline and top points for each layer
  const layers = normalizedSeries.map((s, seriesIdx) => {
    const points = categories.map((cat, catIdx) => {
      const x = categoryCount > 1 ? padding.left + catIdx * stepX : padding.left + graphWidth / 2;

      // Bottom baseline
      const bottomVal = normalizedSeries
        .slice(0, seriesIdx)
        .reduce((acc, prevS) => acc + (prevS.data[catIdx] || 0), 0);

      // Top boundary
      const topVal = bottomVal + (s.data[catIdx] || 0);

      const yBottom = padding.top + graphHeight - (bottomVal / niceMax) * graphHeight;
      const yTop = padding.top + graphHeight - (topVal / niceMax) * graphHeight;

      return { x, yBottom, yTop, val: s.data[catIdx] || 0, cat };
    });

    return { ...s, points };
  });

  function getLinePath(pts: { x: number; y: number }[]): string {
    if (pts.length === 0) return '';
    if (!resolvedCurved) {
      return pts.reduce(
        (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        '',
      );
    }
    return pts.reduce((acc, p, idx, arr) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[idx - 1];
      const cp1X = prev.x + (p.x - prev.x) / 2;
      const cp1Y = prev.y;
      const cp2X = prev.x + (p.x - prev.x) / 2;
      const cp2Y = p.y;
      return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p.x} ${p.y}`;
    }, '');
  }

  function getStackedAreaPath(pts: { x: number; yBottom: number; yTop: number }[]): string {
    const topPts = pts.map((p) => ({ x: p.x, y: p.yTop }));
    const bottomPts = pts.map((p) => ({ x: p.x, y: p.yBottom }));

    const topPath = getLinePath(topPts);

    if (!resolvedCurved) {
      const bottomLine = bottomPts.slice().reverse().reduce((acc, p) => `${acc} L ${p.x} ${p.y}`, '');
      return `${topPath} ${bottomLine} Z`;
    }

    // For curved paths, traverse bottom points in reverse while tracing identical cubic Bezier segments backward
    let bottomPath = '';
    for (let idx = bottomPts.length - 1; idx > 0; idx--) {
      const pCurrent = bottomPts[idx];
      const pPrev = bottomPts[idx - 1];

      // Reconstruct control points of forward segment (idx - 1 -> idx)
      const cp1X = pPrev.x + (pCurrent.x - pPrev.x) / 2;
      const cp1Y = pPrev.y;
      const cp2X = pPrev.x + (pCurrent.x - pPrev.x) / 2;
      const cp2Y = pCurrent.y;

      // In reverse (pCurrent -> pPrev), control points are cp2 and cp1
      bottomPath += ` C ${cp2X} ${cp2Y}, ${cp1X} ${cp1Y}, ${pPrev.x} ${pPrev.y}`;
    }

    const firstBottom = bottomPts[bottomPts.length - 1];
    return `${topPath} L ${firstBottom.x} ${firstBottom.y}${bottomPath} Z`;
  }

  return (
    <ChartContainer
      {...commonProps}
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
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y Axis Gridlines */}
        {resolvedShowGrid &&
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
        {categories.map((cat, idx) => {
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

        {/* Render Stacked Layers */}
        {layers.map((layer, seriesIdx) => {
          const areaD = getStackedAreaPath(layer.points);

          return (
            <g key={seriesIdx} data-chart-series-index={seriesIdx}>
              <path
                d={areaD}
                data-chart-point
                data-index={Math.floor(layer.points.length / 2)}
                data-label={layer.points[Math.floor(layer.points.length / 2)]?.cat}
                data-series-name={layer.name}
                data-value={layer.points[Math.floor(layer.points.length / 2)]?.val}
                fill={layer.color}
                fillOpacity={resolvedFillOpacity}
                stroke={layer.color}
                strokeWidth={1.5}
                className="sp-stacked-area-layer"
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect && layer.points[0]) {
                    const midPt = layer.points[Math.floor(layer.points.length / 2)];
                    const relX = (midPt.x / svgWidth) * containerRect.width;
                    const relY = (midPt.yTop / svgHeight) * containerRect.height;
                    setTooltip({
                      label: midPt.cat,
                      seriesName: layer.name,
                      value: midPt.val,
                      color: layer.color,
                      x: relX,
                      y: relY,
                    });
                  }
                }}
              />
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
