import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartTooltipData } from './types.js';

export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
  color?: string;
}

export interface SunburstChartProps {
  data: SunburstNode;
  title?: string;
  subtitle?: string;
  height?: number | string;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

interface RenderSlice {
  name: string;
  value: number;
  startAngle: number;
  endAngle: number;
  depth: number;
  color: string;
}

export function SunburstChart({
  data,
  title,
  subtitle,
  height = 320,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: SunburstChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  if (!data || (!data.value && (!data.children || data.children.length === 0))) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  function getNodeValue(node: SunburstNode): number {
    if (node.value !== undefined) return node.value;
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((acc, c) => acc + getNodeValue(c), 0);
  }

  const totalValue = getNodeValue(data);

  const slices: RenderSlice[] = [];

  function layoutNodes(
    node: SunburstNode,
    startAngle: number,
    endAngle: number,
    depth: number,
    parentColorIndex: number,
  ) {
    if (depth > 0) {
      const color = node.color || colorScheme[parentColorIndex % colorScheme.length];
      slices.push({
        name: node.name,
        value: getNodeValue(node),
        startAngle,
        endAngle,
        depth,
        color,
      });
    }

    if (node.children && node.children.length > 0) {
      const parentVal = getNodeValue(node) || 1;
      let currentStart = startAngle;

      node.children.forEach((child, childIdx) => {
        const childVal = getNodeValue(child);
        const angleSpan = ((endAngle - startAngle) * childVal) / parentVal;
        const childEnd = currentStart + angleSpan;
        const colorIdx = depth === 0 ? childIdx : parentColorIndex;

        layoutNodes(child, currentStart, childEnd, depth + 1, colorIdx);
        currentStart = childEnd;
      });
    }
  }

  layoutNodes(data, 0, 2 * Math.PI, 0, 0);

  const cx = 150;
  const cy = 140;
  const maxRadius = 120;
  const maxDepth = Math.max(...slices.map((s) => s.depth), 1);
  const ringWidth = Math.max(42, maxRadius / (maxDepth + 1.2));

  function polarToCartesian(centerX: number, centerY: number, r: number, angleInRadians: number) {
    return {
      x: centerX + r * Math.cos(angleInRadians - Math.PI / 2),
      y: centerY + r * Math.sin(angleInRadians - Math.PI / 2),
    };
  }

  function getArcPath(startAngle: number, endAngle: number, innerR: number, outerR: number): string {
    // Prevent 360-degree SVG arc rendering glitch
    const angleGap = 0.001;
    const adjustedEnd = Math.min(endAngle, startAngle + 2 * Math.PI - angleGap);

    const startOuter = polarToCartesian(cx, cy, outerR, startAngle);
    const endOuter = polarToCartesian(cx, cy, outerR, adjustedEnd);
    const startInner = polarToCartesian(cx, cy, innerR, startAngle);
    const endInner = polarToCartesian(cx, cy, innerR, adjustedEnd);

    const largeArcFlag = adjustedEnd - startAngle > Math.PI ? 1 : 0;

    return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y} Z`;
  }

  const legendItems: LegendItem[] = (data.children || []).map((c, idx) => ({
    label: c.name,
    color: c.color || colorScheme[idx % colorScheme.length],
  }));

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
        {/* Sunburst Concentric Slices */}
        {slices.map((slice, idx) => {
          const innerR = slice.depth * ringWidth;
          const outerR = (slice.depth + 1) * ringWidth - 2;
          const pathD = getArcPath(slice.startAngle, slice.endAngle, innerR, outerR);

          return (
            <path
              key={idx}
              d={pathD}
              fill={slice.color}
              fillOpacity={0.85 - slice.depth * 0.15}
              stroke="var(--sp-surface-0, #ffffff)"
              strokeWidth={1.5}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
              onMouseEnter={(e) => {
                const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                if (containerRect) {
                  const midAngle = (slice.startAngle + slice.endAngle) / 2;
                  const midR = (innerR + outerR) / 2;
                  const pt = polarToCartesian(cx, cy, midR, midAngle);
                  const relX = (pt.x / 300) * containerRect.width;
                  const relY = (pt.y / 280) * containerRect.height;
                  const share = ((slice.value / totalValue) * 100).toFixed(1);

                  setTooltip({
                    label: slice.name,
                    value: `${slice.value} (${share}%)`,
                    color: slice.color,
                    x: relX,
                    y: relY,
                  });
                }
              }}
            />
          );
        })}

        {/* Center Circle & Label rendered ON TOP of slices */}
        <circle cx={cx} cy={cy} r={ringWidth} fill="var(--sp-surface-0, #ffffff)" stroke="var(--sp-border-subtle, #e2e8f0)" strokeWidth={1.5} />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="var(--sp-text-color, #0f172a)"
          style={{
            fontSize: data.name.length > 14 ? 9 : 11,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {data.name}
        </text>
      </svg>
    </ChartContainer>
  );
}
