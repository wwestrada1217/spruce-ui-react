import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { type ChartTooltipData } from './types.js';

export interface CandlestickDataItem {
  x: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps {
  data: CandlestickDataItem[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  showGrid?: boolean;
  upColor?: string;
  downColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CandlestickChart({
  data = [],
  title,
  subtitle,
  height = 320,
  showGrid = true,
  upColor = '#16a34a',
  downColor = '#dc2626',
  className,
  style,
}: CandlestickChartProps) {
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

  const allLows = data.map((d) => d.low);
  const allHighs = data.map((d) => d.high);
  const minVal = Math.min(...allLows);
  const maxVal = Math.max(...allHighs);
  const range = maxVal - minVal || 1;

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const candleWidth = graphWidth / data.length;

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
          const x = padding.left + idx * candleWidth + candleWidth / 2;
          return (
            <text key={idx} x={x} y={padding.top + graphHeight + 20} textAnchor="middle" className="sp-chart-axis-label">
              {item.x}
            </text>
          );
        })}

        {/* Render Candlesticks */}
        {data.map((item, idx) => {
          const isUp = item.close >= item.open;
          const color = isUp ? upColor : downColor;

          const yHigh = padding.top + graphHeight - ((item.high - minVal) / range) * graphHeight;
          const yLow = padding.top + graphHeight - ((item.low - minVal) / range) * graphHeight;

          const topVal = Math.max(item.open, item.close);
          const bottomVal = Math.min(item.open, item.close);

          const yTop = padding.top + graphHeight - ((topVal - minVal) / range) * graphHeight;
          const yBottom = padding.top + graphHeight - ((bottomVal - minVal) / range) * graphHeight;
          const bodyH = Math.max(3, yBottom - yTop);

          const xCenter = padding.left + idx * candleWidth + candleWidth / 2;
          const actualW = candleWidth * 0.6;
          const bodyX = xCenter - actualW / 2;

          return (
            <g key={idx}>
              {/* Wick Line */}
              <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth={1.5} />

              {/* Body Box */}
              <rect
                x={bodyX}
                y={yTop}
                width={actualW}
                height={bodyH}
                rx={2}
                fill={color}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const relX = (xCenter / svgWidth) * containerRect.width;
                    const relY = (yTop / svgHeight) * containerRect.height;
                    setTooltip({
                      label: item.x,
                      value: `O: ${item.open} | H: ${item.high} | L: ${item.low} | C: ${item.close}`,
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
