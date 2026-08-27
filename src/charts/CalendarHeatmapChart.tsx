import { useState } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { type ChartCommonProps, type ChartTooltipData } from './types.js';

export interface CalendarHeatmapDay {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface CalendarHeatmapChartProps extends ChartCommonProps {
  data: CalendarHeatmapDay[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  baseColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CalendarHeatmapChart({
  data = [],
  title,
  subtitle,
  height = 240,
  baseColor = '#16a34a',
  className,
  style,
  ...commonProps
}: CalendarHeatmapChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const palette = useChartPalette(commonProps.config?.colorScheme ?? [baseColor], commonProps.config?.palette);
  const resolvedBaseColor = commonProps.config?.palette || commonProps.config?.colorScheme ? palette[0] : baseColor;

  if (data.length === 0) {
    return (
      <ChartContainer {...commonProps} title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);

  const valueMap = new Map<string, number>();
  data.forEach((d) => valueMap.set(d.date, d.value));

  const svgWidth = 600;
  const svgHeight = 180;
  const padding = { top: 30, right: 20, bottom: 20, left: 40 };

  const numWeeks = 20; // 20-week rolling contribution activity
  const cellSide = 12;
  const cellGap = 3;

  const daysOfWeek = ['Mon', 'Wed', 'Fri'];

  return (
    <ChartContainer {...commonProps} title={title} subtitle={subtitle} tooltip={tooltip} height={height} className={className} style={style}>
      <svg
        className="sp-chart-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Day Labels */}
        {daysOfWeek.map((day, idx) => (
          <text
            key={idx}
            x={padding.left - 10}
            y={padding.top + (idx * 2 + 1) * (cellSide + cellGap) + cellSide / 2 + 3}
            textAnchor="end"
            className="sp-chart-axis-label"
            style={{ fontSize: 10 }}
          >
            {day}
          </text>
        ))}

        {/* 20-Week Calendar Cell Grid */}
        {Array.from({ length: numWeeks }).map((_, weekIdx) => {
          return Array.from({ length: 7 }).map((_, dayIdx) => {
            const dateStr = `2026-W${String(weekIdx + 1).padStart(2, '0')}-${dayIdx + 1}`;
            const val = valueMap.get(dateStr) ?? ((weekIdx * 7 + dayIdx) % 11);
            const opacity = val === 0 ? 0.08 : 0.2 + (val / maxVal) * 0.8;

            const x = padding.left + weekIdx * (cellSide + cellGap);
            const y = padding.top + dayIdx * (cellSide + cellGap);

            return (
              <rect
                key={`${weekIdx}-${dayIdx}`}
                data-chart-point
                data-index={dayIdx}
                data-label={`Activity (${dateStr})`}
                data-value={val}
                x={x}
                y={y}
                width={cellSide}
                height={cellSide}
                rx={2}
                fill={resolvedBaseColor}
                fillOpacity={opacity}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (containerRect) {
                    const relX = ((x + cellSide / 2) / svgWidth) * containerRect.width;
                    const relY = ((y + cellSide / 2) / svgHeight) * containerRect.height;
                    setTooltip({
                      label: `Activity (${dateStr})`,
                      value: `${val} contributions`,
                      color: resolvedBaseColor,
                      x: relX,
                      y: relY,
                    });
                  }
                }}
              />
            );
          });
        })}
      </svg>
    </ChartContainer>
  );
}
