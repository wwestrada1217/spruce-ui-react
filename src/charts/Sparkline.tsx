/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 */

import './Sparkline.css';
import { useId } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { DEFAULT_CHART_COLORS, type ChartCommonProps } from './types.js';

export interface SparklineProps extends ChartCommonProps {
  /** Array of numeric data values. */
  data: number[];
  /** Sparkline display mode. */
  type?: 'line' | 'area' | 'bar';
  /** Primary line / bar color. */
  color?: string;
  /** Width of sparkline SVG. */
  width?: number | string;
  /** Height of sparkline SVG. */
  height?: number;
  /** Show endpoint / max point dot. */
  showSpot?: boolean;
}
export function Sparkline({
  data = [],
  type = 'area',
  color,
  width = 120,
  height = 36,
  showSpot = true,
  className,
  style,
  ...commonProps
}: SparklineProps) {
  const uniqueId = useId();
  const palette = useChartPalette(commonProps.config?.colorScheme ?? DEFAULT_CHART_COLORS, commonProps.config?.palette);
  const resolvedColor = color ?? palette[0];
  const accessibleName = commonProps.ariaLabel ?? 'Sparkline';

  if (!data || data.length === 0) {
    return <ChartContainer {...commonProps} chartType="Sparkline" ariaLabel={accessibleName} height={height} className={className} style={style}><div className="sp-sparkline-empty" style={{ width, height }} aria-hidden="true" /></ChartContainer>;
  }

  const svgWidth = 120;
  const svgHeight = height;
  const padding = 4;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const count = data.length;
  const stepX = count > 1 ? (svgWidth - padding * 2) / (count - 1) : svgWidth / 2;
  const points = data.map((val, idx) => ({ x: padding + idx * stepX, y: svgHeight - padding - ((val - minVal) / range) * (svgHeight - padding * 2), val }));
  const lastPoint = points[points.length - 1];
  const linePath = points.reduce((acc, point, idx) => idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`, '');
  const areaPath = `${linePath} L ${lastPoint.x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;
  const gradId = `spark-grad-${uniqueId}`;

  return <ChartContainer {...commonProps} chartType="Sparkline" ariaLabel={accessibleName} height={height} className={className} style={style}>
    <svg className="sp-sparkline" width={width} height={height} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={accessibleName}>
      {type === 'area' && <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={resolvedColor} stopOpacity={0.35} /><stop offset="100%" stopColor={resolvedColor} stopOpacity={0.02} /></linearGradient></defs>}
      {type === 'bar' ? data.map((val, idx) => {
        const barW = Math.max(2, (svgWidth - padding * 2) / count - 2);
        const barH = Math.max(2, ((val - minVal) / range) * (svgHeight - padding * 2));
        const x = padding + idx * (barW + 2);
        const y = svgHeight - padding - barH;
        return <rect key={idx} x={x} y={y} width={barW} height={barH} fill={resolvedColor} rx={1} className="sp-sparkline-bar" data-chart-point data-index={idx} data-value={val} />;
      }) : <>
        {type === 'area' && <path d={areaPath} fill={`url(#${gradId})`} />}
        <path d={linePath} stroke={resolvedColor} className="sp-sparkline-line" />
        {showSpot && <circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={resolvedColor} className="sp-sparkline-dot" data-chart-point data-index={data.length - 1} data-value={lastPoint.val} />}
      </>}
    </svg>
  </ChartContainer>;
}
