/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './PieChart.css';
import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartDataItem, type ChartTooltipData } from './types.js';

export interface PieChartProps {
  /** Array of data slices */
  data: ChartDataItem[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  /** Donut chart mode with inner cutout radius */
  donut?: boolean;
  /** Inner radius for donut chart (0 to 90) */
  innerRadius?: number;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function PieChart({
  data = [],
  title,
  subtitle,
  height = 300,
  donut = false,
  innerRadius = 55,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: PieChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const cx = 150;
  const cy = 130;
  const outerR = 100;
  const innerR = donut ? (innerRadius / 100) * outerR : 0;

  const slices = data.map((d, idx) => {
    const previousSum = data.slice(0, idx).reduce((acc, item) => acc + item.value, 0);
    const startAngle = (previousSum / total) * 360;
    const angle = (d.value / total) * 360;
    const endAngle = startAngle + angle;

    return {
      ...d,
      color: d.color || colorScheme[idx % colorScheme.length],
      startAngle,
      endAngle,
      percentage: ((d.value / total) * 100).toFixed(1),
    };
  });

  const legendItems: LegendItem[] = slices.map((s) => ({
    label: `${s.label} (${s.percentage}%)`,
    color: s.color,
  }));

  function getArcPath(start: number, end: number, rOut: number, rIn: number) {
    // Avoid full 360 degree path bug by capping at 359.99
    const effectiveEnd = end - start >= 360 ? start + 359.99 : end;

    const radStart = (Math.PI / 180) * (start - 90);
    const radEnd = (Math.PI / 180) * (effectiveEnd - 90);

    const x1 = cx + rOut * Math.cos(radStart);
    const y1 = cy + rOut * Math.sin(radStart);
    const x2 = cx + rOut * Math.cos(radEnd);
    const y2 = cy + rOut * Math.sin(radEnd);

    const largeArc = effectiveEnd - start > 180 ? 1 : 0;

    if (rIn > 0) {
      const x3 = cx + rIn * Math.cos(radEnd);
      const y3 = cy + rIn * Math.sin(radEnd);
      const x4 = cx + rIn * Math.cos(radStart);
      const y4 = cy + rIn * Math.sin(radStart);

      return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    }

    return `M ${cx} ${cy} L ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

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
        viewBox="0 0 300 260"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {slices.map((slice, idx) => {
          const path = getArcPath(slice.startAngle, slice.endAngle, outerR, innerR);

          // Calculate center of slice for tooltip positioning
          const midAngle = slice.startAngle + (slice.endAngle - slice.startAngle) / 2;
          const midRad = (Math.PI / 180) * (midAngle - 90);
          const tipX = cx + (outerR * 0.7) * Math.cos(midRad);
          const tipY = cy + (outerR * 0.7) * Math.sin(midRad);

          return (
            <path
              key={idx}
              d={path}
              fill={slice.color}
              className="sp-pie-slice"
              onMouseEnter={(e) => {
                const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                if (containerRect) {
                  const relX = (tipX / 300) * containerRect.width;
                  const relY = (tipY / 260) * containerRect.height;
                  setTooltip({
                    label: slice.label,
                    value: `${slice.value} (${slice.percentage}%)`,
                    color: slice.color,
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
