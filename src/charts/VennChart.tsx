import './VisualizationCharts.css';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import type { ChartCommonProps, CoreChartConfig } from './types.js';

export interface VennSet { key: string; label: string; size?: number; color?: string }
export interface VennIntersection { sets: string[]; label?: string; items?: string[] }
export interface VennChartConfig extends CoreChartConfig { intersections?: VennIntersection[]; fillOpacity?: number; overlapFactor?: number; showLabels?: boolean; showIntersectionLabels?: boolean; monoColor?: string }
export interface VennChartProps extends ChartCommonProps { data: VennSet[]; title?: string; subtitle?: string; height?: number | string; colorScheme?: string[] }

function splitLabel(text: string): string[] { const words = text.split(' '); return words.length <= 2 ? [text] : Array.from({ length: Math.ceil(words.length / 2) }, (_, index) => words.slice(index * 2, index * 2 + 2).join(' ')); }

export function VennChart({ data, title, subtitle, height = 320, colorScheme, ...commonProps }: VennChartProps) {
  const config = { fillOpacity: 0.65, overlapFactor: 0.4, showLabels: true, showIntersectionLabels: true, ...(commonProps.config as VennChartConfig | undefined) };
  const palette = useChartPalette(commonProps.config?.colorScheme ?? colorScheme, commonProps.config?.palette);
  const width = 600;
  const chartHeight = typeof height === 'number' ? height : 320;
  const availRadius = Math.min(width, chartHeight) / 2 - 10;
  const overlap = Math.max(0.1, Math.min(0.85, config.overlapFactor));
  const n = data.length;
  const positions = n === 1 ? [{ cx: width / 2, cy: chartHeight / 2, r: availRadius * 0.7 }] : n === 2 ? (() => { const r = availRadius * 0.62; const distance = r * 2 * (1 - overlap); return [{ cx: width / 2 - distance / 2, cy: chartHeight / 2, r }, { cx: width / 2 + distance / 2, cy: chartHeight / 2, r }]; })() : (() => { const sin = Math.sin(Math.PI / Math.max(1, n)); const r = availRadius / (1 + (1 - overlap) / sin); const ring = r * (1 - overlap) / sin; return data.map((item, index) => { const angle = -Math.PI / 2 + 2 * Math.PI * index / n; return { cx: width / 2 + ring * Math.cos(angle), cy: chartHeight / 2 + ring * Math.sin(angle), r: r * Math.sqrt(item.size ?? 1) }; }); })();
  const circles = data.map((item, index) => { const pos = positions[index] ?? { cx: width / 2, cy: chartHeight / 2, r: availRadius * 0.6 }; const labelX = n === 1 ? pos.cx : n === 2 ? pos.cx + (index === 0 ? -pos.r * 0.4 : pos.r * 0.4) : pos.cx + (pos.cx - width / 2) * 0.42; const labelY = n === 1 ? pos.cy : n === 2 ? pos.cy : pos.cy + (pos.cy - chartHeight / 2) * 0.42; return { ...item, ...pos, labelX, labelY, color: config.monoColor ?? item.color ?? palette[index % palette.length] }; });
  const byKey = new Map(circles.map((circle) => [circle.key, circle]));
  const intersections = (config.intersections ?? []).map((intersection) => { const involved = intersection.sets.map((key) => byKey.get(key)).filter((circle): circle is typeof circles[number] => Boolean(circle)); return involved.length ? { ...intersection, x: involved.reduce((sum, circle) => sum + circle.cx, 0) / involved.length, y: involved.reduce((sum, circle) => sum + circle.cy, 0) / involved.length } : null; }).filter((value): value is NonNullable<typeof value> => value !== null);
  return <ChartContainer {...commonProps} config={config} title={title} subtitle={subtitle} height={height} chartType="Venn diagram">
    <svg className="sp-chart-svg sp-visualization-chart__svg" viewBox={`0 0 ${width} ${chartHeight}`} role="img" aria-label={commonProps.ariaLabel ?? title ?? 'Venn diagram'}>
      {circles.map((circle, index) => <circle key={circle.key} className="sp-visualization-chart__interactive" data-chart-point data-index={index} data-label={circle.label} data-value={circle.label} data-color={circle.color} cx={circle.cx} cy={circle.cy} r={circle.r} fill={circle.color} fillOpacity={config.fillOpacity} />)}
      {config.showLabels && circles.map((circle) => <text key={`label-${circle.key}`} x={circle.labelX} y={circle.labelY} textAnchor="middle" dominantBaseline="central" fill="var(--sp-text-inverse, #fff)" fontSize={Math.max(10, Math.min(28, circle.r * 0.22))} fontWeight="800" pointerEvents="none">{circle.label}</text>)}
      {config.showIntersectionLabels && intersections.map((intersection, index) => <g key={`${intersection.label}-${index}`} pointerEvents="none">
        {splitLabel(intersection.label ?? '').map((line, lineIndex, lines) => <text key={`label-${lineIndex}`} x={intersection.x} y={intersection.y - (lines.length - 1) * 6 + lineIndex * 12 - (intersection.items?.length ?? 0) * 6} textAnchor="middle" dominantBaseline="central" fill="var(--sp-text-inverse, #fff)" fontSize="10" fontWeight="700">{line}</text>)}
        {(intersection.items ?? []).map((item, itemIndex) => splitLabel(item).map((line, lineIndex) => <text key={`${itemIndex}-${lineIndex}`} x={intersection.x} y={intersection.y + (itemIndex - ((intersection.items?.length ?? 1) - 1) / 2) * 12 + lineIndex * 10} textAnchor="middle" dominantBaseline="central" fill="var(--sp-text-inverse, #fff)" fontSize="9">{line}</text>))}
      </g>)}
    </svg>
  </ChartContainer>;
}
