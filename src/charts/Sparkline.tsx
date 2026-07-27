/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Sparkline.css';
import { useId } from 'react';
import { DEFAULT_CHART_COLORS } from './types.js';

export interface SparklineProps {
  /** Array of numeric data values */
  data: number[];
  /** Sparkline display mode */
  type?: 'line' | 'area' | 'bar';
  /** Primary line / bar color */
  color?: string;
  /** Width of sparkline SVG */
  width?: number | string;
  /** Height of sparkline SVG */
  height?: number;
  /** Show endpoint / max point dot */
  showSpot?: boolean;
  /** Custom class name applied to root element */
  className?: string;
  /** Inline styles applied to root element */
  style?: React.CSSProperties;
}

export function Sparkline({
  data = [],
  type = 'area',
  color = DEFAULT_CHART_COLORS[0],
  width = 120,
  height = 36,
  showSpot = true,
  className,
  style,
}: SparklineProps) {
  const uniqueId = useId();

  if (!data || data.length === 0) {
    return <div className="sp-sparkline-empty" style={{ width, height }} />;
  }

  const svgWidth = 120;
  const svgHeight = height;
  const padding = 4;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const count = data.length;
  const stepX = count > 1 ? (svgWidth - padding * 2) / (count - 1) : svgWidth / 2;

  const points = data.map((val, idx) => {
    const x = padding + idx * stepX;
    const y = svgHeight - padding - ((val - minVal) / range) * (svgHeight - padding * 2);
    return { x, y, val };
  });

  const lastPoint = points[points.length - 1];

  function getLinePath(): string {
    if (points.length === 0) return '';
    return points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  }

  function getAreaPath(): string {
    const lineD = getLinePath();
    const firstX = points[0].x;
    const lastX = lastPoint.x;
    return `${lineD} L ${lastX} ${svgHeight} L ${firstX} ${svgHeight} Z`;
  }

  const rootCls = ['sp-sparkline', className].filter(Boolean).join(' ');
  const gradId = `spark-grad-${uniqueId}`;

  return (
    <svg
      className={rootCls}
      width={width}
      height={height}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="xMidYMid meet"
      style={style}
    >
      {type === 'area' && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
      )}

      {type === 'bar' ? (
        data.map((val, idx) => {
          const barW = Math.max(2, (svgWidth - padding * 2) / count - 2);
          const barH = Math.max(2, ((val - minVal) / range) * (svgHeight - padding * 2));
          const x = padding + idx * (barW + 2);
          const y = svgHeight - padding - barH;

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill={color}
              rx={1}
              className="sp-sparkline-bar"
            />
          );
        })
      ) : (
        <>
          {type === 'area' && <path d={getAreaPath()} fill={`url(#${gradId})`} />}
          <path d={getLinePath()} stroke={color} className="sp-sparkline-line" />
          {showSpot && (
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={3}
              fill={color}
              className="sp-sparkline-dot"
            />
          )}
        </>
      )}
    </svg>
  );
}
