import { ChartContainer } from './ChartContainer.js';

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;
  unit?: string;
  height?: number | string;
  color?: string;
  /** Render a needle indicator pointing to current value */
  showNeedle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function GaugeChart({
  value = 0,
  min = 0,
  max = 100,
  title,
  subtitle,
  unit = '%',
  height = 280,
  color = '#0f766e',
  showNeedle = false,
  className,
  style,
}: GaugeChartProps) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min || 1);

  const cx = 150;
  const cy = 135;
  const radius = 80;
  const strokeWidth = 16;

  // Semi-circle arc: from -Math.PI to 0
  const startAngle = -Math.PI;
  const endAngle = 0;

  function polarToCartesian(centerX: number, centerY: number, r: number, angleInRadians: number) {
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  }

  function getArcPath(startA: number, endA: number, r: number): string {
    const start = polarToCartesian(cx, cy, r, startA);
    const end = polarToCartesian(cx, cy, r, endA);
    const angleDiff = endA - startA;
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;
    const sweepFlag = angleDiff > 0 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
  }

  const bgPath = getArcPath(startAngle, endAngle, radius);

  // Avoid zero-length or full-circle arc artifacts
  const currentAngle = startAngle + Math.max(0.001, Math.min(0.999, percentage)) * Math.PI;
  const valPath = getArcPath(startAngle, currentAngle, radius);

  // Needle calculations
  const needleAngle = startAngle + percentage * Math.PI;
  const needleLength = radius - 10;
  const needleTip = polarToCartesian(cx, cy, needleLength, needleAngle);

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height} className={className} style={style}>
      <svg className="sp-chart-svg" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet">
        {/* Background Arc */}
        <path
          d={bgPath}
          fill="none"
          stroke="var(--sp-bg-hover, #e2e8f0)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <path
          d={valPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ transition: 'd 0.3s ease' }}
        />

        {/* Needle Indicator */}
        {showNeedle && (
          <g style={{ transition: 'transform 0.3s ease' }}>
            <line
              x1={cx}
              y1={cy}
              x2={needleTip.x}
              y2={needleTip.y}
              stroke="var(--sp-text-color, var(--sp-text-default, #1e293b))"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r={6} fill="var(--sp-text-color, var(--sp-text-default, #1e293b))" />
            <circle cx={cx} cy={cy} r={3} fill="var(--sp-surface, #ffffff)" />
          </g>
        )}

        {/* Center Text */}
        <text
          x={cx}
          y={showNeedle ? cy + 30 : cy - 5}
          textAnchor="middle"
          style={{ fontSize: 24, fontWeight: 700, fill: 'var(--sp-text-color, var(--sp-text-default, #1e293b))' }}
        >
          {clampedValue}{unit}
        </text>
        <text
          x={cx}
          y={showNeedle ? cy + 46 : cy + 16}
          textAnchor="middle"
          style={{ fontSize: 11, fill: 'var(--sp-text-muted, var(--sp-text-subtle, #64748b))' }}
        >
          {min}{unit} - {max}{unit}
        </text>
      </svg>
    </ChartContainer>
  );
}
