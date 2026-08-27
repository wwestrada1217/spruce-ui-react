import { useState, useEffect } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { DEFAULT_CHART_COLORS, type ChartCommonProps, type ChartTooltipData } from './types.js';

export interface BarRaceFrame {
  time: string;
  data: Array<{ label: string; value: number; color?: string }>;
}

export interface BarRaceChartProps extends ChartCommonProps {
  frames: BarRaceFrame[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  durationPerFrame?: number;
  colorScheme?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function BarRaceChart({
  frames = [],
  title,
  subtitle,
  height = 320,
  durationPerFrame = 1200,
  colorScheme = DEFAULT_CHART_COLORS,
  className,
  style,
  ...commonProps
}: BarRaceChartProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);

  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;
    const interval = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, durationPerFrame);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, durationPerFrame]);

  if (frames.length === 0) {
    return (
      <ChartContainer {...commonProps} title={title} subtitle={subtitle} height={height} className={className} style={style}>
        <div style={{ color: 'var(--sp-text-subtle)', fontSize: 13, textAlign: 'center', padding: 32 }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const currentFrame = frames[frameIdx];
  const sortedBars = [...currentFrame.data].sort((a, b) => b.value - a.value);

  const maxVal = Math.max(...sortedBars.map((b) => b.value), 1);

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 30, right: 80, bottom: 20, left: 120 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const barHeight = graphHeight / Math.max(1, sortedBars.length);

  return (
    <ChartContainer {...commonProps} title={title} subtitle={subtitle} tooltip={tooltip} height={height} className={className} style={style}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Controls Overlay */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '4px 12px',
              borderRadius: 4,
              border: '1px solid var(--sp-border-subtle, #e2e8f0)',
              background: 'var(--sp-bg-surface, #ffffff)',
              color: 'var(--sp-text-default)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--sp-primary, #0f766e)' }}>
            Frame: {currentFrame.time}
          </span>
        </div>

        <svg
          className="sp-chart-svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setTooltip(null)}
        >
          {sortedBars.map((bar, idx) => {
            const barW = (bar.value / maxVal) * graphWidth;
            const y = padding.top + idx * barHeight;
            const actualH = barHeight * 0.7;
            const color = bar.color || palette[idx % palette.length];

            return (
              <g key={bar.label} style={{ transition: 'all 0.4s ease' }}>
                {/* Y Axis Bar Label */}
                <text
                  x={padding.left - 10}
                  y={y + actualH / 2 + 4}
                  textAnchor="end"
                  className="sp-chart-axis-label"
                  style={{ fontWeight: 600 }}
                >
                  {bar.label}
                </text>

                {/* Animated Horizontal Bar */}
                <rect
                  data-chart-point
                  data-index={idx}
                  data-label={bar.label}
                  data-value={bar.value}
                  x={padding.left}
                  y={y}
                  width={Math.max(4, barW)}
                  height={actualH}
                  rx={3}
                  fill={color}
                  style={{ cursor: 'pointer', transition: 'width 0.4s ease' }}
                  onMouseEnter={(e) => {
                    const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (containerRect) {
                      const relX = ((padding.left + barW) / svgWidth) * containerRect.width;
                      const relY = ((y + actualH / 2) / svgHeight) * containerRect.height;
                      setTooltip({
                        label: bar.label,
                        value: bar.value,
                        color,
                        x: relX,
                        y: relY,
                      });
                    }
                  }}
                />

                {/* Value Label */}
                <text
                  x={padding.left + barW + 8}
                  y={y + actualH / 2 + 4}
                  textAnchor="start"
                  className="sp-chart-axis-label"
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {bar.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartContainer>
  );
}
