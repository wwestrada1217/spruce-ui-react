import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { type ChartTooltipData } from './types.js';

export interface WaterfallDataItem {
  label: string;
  value: number;
  isTotal?: boolean;
}

export interface WaterfallChartProps {
  data: WaterfallDataItem[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  showGrid?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function WaterfallChart({
  data = [],
  title,
  subtitle,
  height = 320,
  showGrid = true,
  positiveColor = '#16a34a',
  negativeColor = '#dc2626',
  totalColor = '#0284c7',
  className,
  style,
}: WaterfallChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);

  if (data.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  // Calculate cumulative baseline positions
  const computedBars = data.reduce<
    Array<WaterfallDataItem & { startVal: number; endVal: number }>
  >((acc, item) => {
    const prevTotal = acc.length > 0 ? acc[acc.length - 1].endVal : 0;
    let startVal = 0;
    let endVal = 0;

    if (item.isTotal) {
      startVal = 0;
      endVal = prevTotal;
    } else {
      startVal = prevTotal;
      endVal = prevTotal + item.value;
    }

    acc.push({
      ...item,
      startVal,
      endVal,
    });
    return acc;
  }, []);

  const allVals = computedBars.flatMap((b) => [b.startVal, b.endVal, 0]);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals, 1);
  const range = maxVal - minVal || 1;

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const barWidth = graphWidth / data.length;

  const yTicks = [minVal, minVal + range * 0.33, minVal + range * 0.66, maxVal];

  return (
    <ChartContainer title={title} subtitle={subtitle} tooltip={tooltip} height={height} className={className} style={style}>
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y Axis Gridlines */}
        {showGrid &&
          yTicks.map((val, idx) => {
            const y = padding.top + graphHeight - ((val - minVal) / range) * graphHeight;
            return (
              <line key={idx} x1={padding.left} y1={y} x2={padding.left + graphWidth} y2={y} className="sp-chart-gridline" />
            );
          })}

        {/* Y Axis Labels */}
        {yTicks.map((val, idx) => {
          const y = padding.top + graphHeight - ((val - minVal) / range) * graphHeight;
          return (
            <text key={idx} x={padding.left - 10} y={y + 4} textAnchor="end" className="sp-chart-axis-label">
              {Math.round(val)}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {data.map((item, idx) => {
          const x = padding.left + idx * barWidth + barWidth / 2;
          return (
            <text key={idx} x={x} y={padding.top + graphHeight + 20} textAnchor="middle" className="sp-chart-axis-label">
              {item.label}
            </text>
          );
        })}

        {/* Baseline Zero Line */}
        {(() => {
          const zeroY = padding.top + graphHeight - ((0 - minVal) / range) * graphHeight;
          return <line x1={padding.left} y1={zeroY} x2={padding.left + graphWidth} y2={zeroY} className="sp-chart-axis-line" />;
        })()}

        {/* Render Waterfall Bars */}
        {computedBars.map((bar, idx) => {
          const topVal = Math.max(bar.startVal, bar.endVal);
          const bottomVal = Math.min(bar.startVal, bar.endVal);

          const yTop = padding.top + graphHeight - ((topVal - minVal) / range) * graphHeight;
          const yBottom = padding.top + graphHeight - ((bottomVal - minVal) / range) * graphHeight;
          const barH = Math.max(2, yBottom - yTop);
          const barX = padding.left + idx * barWidth + barWidth * 0.15;
          const actualW = barWidth * 0.7;

          const color = bar.isTotal ? totalColor : bar.value >= 0 ? positiveColor : negativeColor;

          return (
            <g key={idx}>
              <rect
                x={barX}
                y={yTop}
                width={actualW}
                height={barH}
                rx={3}
                fill={color}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const relX = ((barX + actualW / 2) / svgWidth) * containerRect.width;
                    const relY = (yTop / svgHeight) * containerRect.height;
                    setTooltip({
                      label: bar.label,
                      value: bar.isTotal ? bar.endVal : `${bar.value >= 0 ? '+' : ''}${bar.value}`,
                      color,
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
