import './VisualizationCharts.css';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import type { ChartCommonProps, CoreChartConfig } from './types.js';

export interface WheelItem { label: string; description?: string; iconPath?: string; iconText?: string; color?: string }
export interface WheelDiagramConfig extends CoreChartConfig { centerTitle?: string; centerSubTitle?: string; showDescriptions?: boolean; showRing?: boolean; ringColor?: string }
export interface WheelDiagramProps extends ChartCommonProps { data: WheelItem[]; title?: string; subtitle?: string; height?: number | string; colorScheme?: string[] }

function splitLines(text: string, maxChars: number): string[] { const words = text.split(' '); const lines: string[] = []; let current = ''; for (const word of words) { const next = current ? `${current} ${word}` : word; if (next.length > maxChars && current) { lines.push(current); current = word; } else current = next; } if (current) lines.push(current); return lines; }
function polar(cx: number, cy: number, radius: number, angle: number) { const rad = angle - Math.PI / 2; return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }; }
function arcPath(cx: number, cy: number, radius: number, start: number, end: number) { const a = polar(cx, cy, radius, start); const b = polar(cx, cy, radius, end); return `M${a.x},${a.y} A${radius},${radius} 0 ${end - start > Math.PI ? 1 : 0} 1 ${b.x},${b.y}`; }

export function WheelDiagram({ data, title, subtitle, height = 440, colorScheme, ...commonProps }: WheelDiagramProps) {
  const config = { showDescriptions: true, showRing: true, ringColor: 'var(--sp-chart-axis-line, var(--sp-border-strong, #cbd5e1))', ...(commonProps.config as WheelDiagramConfig | undefined) };
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const width = 600;
  const chartHeight = typeof height === 'number' ? height : 440;
  const center = { x: width / 2, y: chartHeight / 2 };
  const min = Math.min(width, chartHeight);
  const centerRadius = min * 0.185;
  const ringRadius = min * 0.315;
  const ringWidth = Math.max(min * 0.062, 22);
  const iconRadius = Math.min(min * 0.065, 36);
  const iconDistance = ringRadius + ringWidth / 2 + 14 + iconRadius;
  return <ChartContainer {...commonProps} config={config} title={title} subtitle={subtitle} height={height} chartType="Wheel diagram">
    <svg className="sp-chart-svg sp-visualization-chart__svg" viewBox={`0 -80 ${width} ${chartHeight + 160}`} role="img" aria-label={commonProps.ariaLabel ?? title ?? 'Wheel diagram'}>
      {config.showRing && data.length > 1 && data.map((item, index) => { const start = 2 * Math.PI * index / data.length; const end = 2 * Math.PI * (index + 1) / data.length + 0.01; return <path key={`ring-${index}`} d={arcPath(center.x, center.y, ringRadius, start, end)} fill="none" stroke={item.color ?? palette[index % palette.length]} strokeWidth={ringWidth} />; })}
      {config.showRing && data.length > 1 && <circle cx={center.x} cy={center.y} r={ringRadius} fill="none" stroke={config.ringColor} strokeWidth={ringWidth} strokeDasharray="2 5" aria-hidden="true" />}
      {data.map((item, index) => { const angle = 2 * Math.PI * index / Math.max(1, data.length); const point = polar(center.x, center.y, iconDistance, angle); const color = item.color ?? palette[index % palette.length]; const top = Math.sin(angle) < -0.75; const bottom = Math.sin(angle) > 0.75; const right = Math.cos(angle) >= 0.25; const titleLines = splitLines(item.label, top || bottom ? 17 : 13); const descLines = item.description ? splitLines(item.description, 19) : []; const textAnchor = top || bottom ? 'middle' : right ? 'start' : 'end'; const textX = top || bottom ? point.x : point.x + (right ? iconRadius + 12 : -iconRadius - 12); const totalHeight = titleLines.length * 13 + (config.showDescriptions ? 4 + descLines.length * 11 : 0); const textY = top ? point.y - iconRadius - totalHeight : bottom ? point.y + iconRadius + 13 : point.y - totalHeight / 2 + 13; const connectorStart = polar(center.x, center.y, config.showRing ? ringRadius + ringWidth / 2 + 4 : centerRadius + 4, angle); const connectorEnd = polar(center.x, center.y, iconDistance - iconRadius - 4, angle); return <g key={item.label + index}>
        <line x1={connectorStart.x} y1={connectorStart.y} x2={connectorEnd.x} y2={connectorEnd.y} stroke={color} strokeWidth="1.5" opacity="0.7" />
        <g className="sp-visualization-chart__interactive" data-chart-point data-index={index} data-label={item.label} data-value={item.description ?? item.label} data-color={color}>
          <circle cx={point.x} cy={point.y} r={iconRadius} fill={color} />
          {item.iconText && <text x={point.x} y={point.y} textAnchor="middle" dominantBaseline="central" fill="var(--sp-text-inverse, #fff)" fontSize="18">{item.iconText}</text>}
          {item.iconPath && <path d={item.iconPath} transform={`translate(${point.x - iconRadius * 0.5},${point.y - iconRadius * 0.5}) scale(${iconRadius / 12})`} fill="none" stroke="var(--sp-text-inverse, #fff)" strokeWidth="2" strokeLinecap="round" />}
        </g>
        {titleLines.map((line, lineIndex) => <text key={`title-${lineIndex}`} x={textX} y={textY + lineIndex * 13} textAnchor={textAnchor as 'start' | 'middle' | 'end'} fill="var(--sp-chart-title-color, var(--sp-text-color, #1e293b))" fontSize="11" fontWeight="700">{line}</text>)}
        {config.showDescriptions && descLines.map((line, lineIndex) => <text key={`desc-${lineIndex}`} x={textX} y={textY + titleLines.length * 13 + 4 + lineIndex * 11} textAnchor={textAnchor as 'start' | 'middle' | 'end'} fill="var(--sp-chart-axis-text, var(--sp-text-subtle, #64748b))" fontSize="10">{line}</text>)}
      </g>; })}
      <circle cx={center.x} cy={center.y} r={centerRadius} fill="var(--sp-primary, #1e3a6e)" />
      {splitLines(config.centerTitle ?? '', 12).map((line, index, lines) => <text key={index} x={center.x} y={center.y + (index - (lines.length - 1) / 2) * 22} textAnchor="middle" dominantBaseline="middle" fill="var(--sp-text-inverse, #fff)" fontSize="13" fontWeight="800">{line}</text>)}
      {config.centerSubTitle && <text x={center.x} y={center.y + 36} textAnchor="middle" fill="var(--sp-text-inverse, #fff)" fontSize="10" opacity="0.85">{config.centerSubTitle}</text>}
    </svg>
  </ChartContainer>;
}
