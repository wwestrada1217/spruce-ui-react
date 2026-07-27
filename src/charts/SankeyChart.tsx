import { useState } from 'react';
import { ChartContainer, type LegendItem } from './ChartContainer.js';
import { DEFAULT_CHART_COLORS, type ChartTooltipData } from './types.js';

export interface SankeyNode {
  id: string;
  name: string;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  nodeWidth?: number;
  showLegend?: boolean;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function SankeyChart({
  nodes = [],
  links = [],
  title,
  subtitle,
  height = 340,
  nodeWidth = 16,
  showLegend = true,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
}: SankeyChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  if (nodes.length === 0 || links.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const svgWidth = 600;
  const svgHeight = 300;
  const padding = { top: 20, right: 80, bottom: 20, left: 80 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Simple 2-column Sankey layout (Sources on left, Targets on right)
  const targetIds = new Set(links.map((l) => l.target));
  const sourceNodes = nodes.filter((n) => !targetIds.has(n.id));
  const targetNodes = nodes.filter((n) => targetIds.has(n.id));

  const nodeColorMap = new Map<string, string>();
  nodes.forEach((n, idx) => {
    nodeColorMap.set(n.id, n.color || colorScheme[idx % colorScheme.length]);
  });

  // Calculate node heights
  const sourceTotal = links.reduce((acc, l) => acc + l.value, 0) || 1;

  let currentSourceY = padding.top;
  const sourceLayout = new Map<string, { x: number; y: number; height: number }>();
  sourceNodes.forEach((n) => {
    const nodeVal = links.filter((l) => l.source === n.id).reduce((acc, l) => acc + l.value, 0);
    const h = Math.max(12, (nodeVal / sourceTotal) * graphHeight * 0.85);
    sourceLayout.set(n.id, { x: padding.left, y: currentSourceY, height: h });
    currentSourceY += h + 16;
  });

  let currentTargetY = padding.top;
  const targetLayout = new Map<string, { x: number; y: number; height: number }>();
  targetNodes.forEach((n) => {
    const nodeVal = links.filter((l) => l.target === n.id).reduce((acc, l) => acc + l.value, 0);
    const h = Math.max(12, (nodeVal / sourceTotal) * graphHeight * 0.85);
    targetLayout.set(n.id, { x: padding.left + graphWidth, y: currentTargetY, height: h });
    currentTargetY += h + 16;
  });

  const legendItems: LegendItem[] = nodes.map((n) => ({
    label: n.name,
    color: nodeColorMap.get(n.id) || '#0f766e',
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
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Render Ribbon Links */}
        {links.map((link, idx) => {
          const sPos = sourceLayout.get(link.source);
          const tPos = targetLayout.get(link.target);

          if (!sPos || !tPos) return null;

          const x0 = sPos.x + nodeWidth;
          const y0 = sPos.y + sPos.height / 2;
          const x1 = tPos.x;
          const y1 = tPos.y + tPos.height / 2;
          const linkWidth = Math.max(4, (link.value / sourceTotal) * graphHeight * 0.6);

          const cpX = (x0 + x1) / 2;
          const pathD = `M ${x0} ${y0} C ${cpX} ${y0}, ${cpX} ${y1}, ${x1} ${y1}`;
          const color = link.color || nodeColorMap.get(link.source) || '#0f766e';

          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={linkWidth}
              strokeOpacity={0.4}
              style={{ cursor: 'pointer', transition: 'stroke-opacity 0.2s ease' }}
              onMouseEnter={(e) => {
                const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                if (containerRect) {
                  const relX = (cpX / svgWidth) * containerRect.width;
                  const relY = (((y0 + y1) / 2) / svgHeight) * containerRect.height;
                  const sourceName = nodes.find((n) => n.id === link.source)?.name || link.source;
                  const targetName = nodes.find((n) => n.id === link.target)?.name || link.target;

                  setTooltip({
                    label: `${sourceName} → ${targetName}`,
                    value: link.value,
                    color,
                    x: relX,
                    y: relY,
                  });
                }
              }}
            />
          );
        })}

        {/* Render Source Nodes */}
        {sourceNodes.map((n) => {
          const pos = sourceLayout.get(n.id);
          if (!pos) return null;
          const color = nodeColorMap.get(n.id) || '#0f766e';

          return (
            <g key={n.id}>
              <rect x={pos.x} y={pos.y} width={nodeWidth} height={pos.height} rx={3} fill={color} />
              <text x={pos.x - 8} y={pos.y + pos.height / 2 + 4} textAnchor="end" className="sp-chart-axis-label" style={{ fontWeight: 600 }}>
                {n.name}
              </text>
            </g>
          );
        })}

        {/* Render Target Nodes */}
        {targetNodes.map((n) => {
          const pos = targetLayout.get(n.id);
          if (!pos) return null;
          const color = nodeColorMap.get(n.id) || '#0f766e';

          return (
            <g key={n.id}>
              <rect x={pos.x} y={pos.y} width={nodeWidth} height={pos.height} rx={3} fill={color} />
              <text x={pos.x + nodeWidth + 8} y={pos.y + pos.height / 2 + 4} textAnchor="start" className="sp-chart-axis-label" style={{ fontWeight: 600 }}>
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
