import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { type ChartCommonProps, type ChartTooltipData } from './types.js';

export interface OrgNode {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface OrgChartProps extends ChartCommonProps {
  data: OrgNode;
  title?: string;
  subtitle?: string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

interface PositionedNode {
  node: OrgNode;
  x: number;
  y: number;
  width: number;
  height: number;
  parentX?: number;
  parentY?: number;
}

export function OrgChart({
  data,
  title,
  subtitle,
  height = 360,
  className,
  style,
  ...commonProps
}: OrgChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const palette = useChartPalette(undefined, commonProps.config?.palette);

  if (!data) {
    return (
      <ChartContainer {...commonProps} title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const svgWidth = 600;
  const svgHeight = 320;
  const cardW = 110;
  const cardH = 44;
  const levelGapY = 55;

  const positionedNodes: PositionedNode[] = [];

  // Tree layout algorithm
  function layout(node: OrgNode, level: number, leftX: number, rightX: number, parentPos?: { x: number; y: number }) {
    const midX = (leftX + rightX) / 2;
    const y = 25 + level * (cardH + levelGapY);

    positionedNodes.push({
      node,
      x: midX - cardW / 2,
      y,
      width: cardW,
      height: cardH,
      parentX: parentPos?.x,
      parentY: parentPos?.y,
    });

    if (node.children && node.children.length > 0) {
      const childSpan = (rightX - leftX) / node.children.length;
      node.children.forEach((child, idx) => {
        const cLeft = leftX + idx * childSpan;
        const cRight = cLeft + childSpan;
        layout(child, level + 1, cLeft, cRight, { x: midX, y: y + cardH });
      });
    }
  }

  layout(data, 0, 10, svgWidth - 10);

  return (
    <ChartContainer {...commonProps} title={title} subtitle={subtitle} tooltip={tooltip} height={height} className={className} style={style}>
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Connection Connector Lines */}
        {positionedNodes.map((pn, idx) => {
          if (pn.parentX === undefined || pn.parentY === undefined) return null;
          const targetX = pn.x + pn.width / 2;
          const targetY = pn.y;
          const midY = (pn.parentY + targetY) / 2;

          const pathD = `M ${pn.parentX} ${pn.parentY} L ${pn.parentX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;

          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke={palette[0]}
              strokeWidth={1.5}
              strokeDasharray="4,2"
            />
          );
        })}

        {/* Node Cards */}
        {positionedNodes.map((pn, idx) => {
          return (
            <g
              key={pn.node.id}
              data-chart-point
              data-index={idx}
              data-label={pn.node.name}
              data-value={pn.node.role || 'Member'}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                if (containerRect) {
                  const relX = ((pn.x + pn.width / 2) / svgWidth) * containerRect.width;
                  const relY = (pn.y / svgHeight) * containerRect.height;
                  setTooltip({
                    label: pn.node.name,
                    value: pn.node.role || 'Member',
                    color: palette[0],
                    x: relX,
                    y: relY,
                  });
                }
              }}
            >
              <rect
                x={pn.x}
                y={pn.y}
                width={pn.width}
                height={pn.height}
                rx={6}
                fill="var(--sp-surface-0, #ffffff)"
                stroke="var(--sp-border-strong, #cbd5e1)"
                strokeWidth={1.5}
              />
              <text
                x={pn.x + pn.width / 2}
                y={pn.y + 18}
                textAnchor="middle"
                fill="var(--sp-text-color, #0f172a)"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                {pn.node.name}
              </text>
              <text
                x={pn.x + pn.width / 2}
                y={pn.y + 32}
                textAnchor="middle"
                fill="var(--sp-text-subtle, #64748b)"
                style={{ fontSize: 9 }}
              >
                {pn.node.role || ''}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartContainer>
  );
}
