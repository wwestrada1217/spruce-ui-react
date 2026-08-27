import './VisualizationCharts.css';
import { useMemo, type CSSProperties } from 'react';
import { useChartPalette } from './ChartKernel.js';

export interface FishboneCause { label: string }
export interface FishboneCategory { label: string; iconPath?: string; causes: FishboneCause[] }
export interface FishboneDiagramConfig { title?: string; subtitle?: string; height?: number; accentColor?: string; effectBoxColor?: string; branchAngle?: number; junctionSpacing?: number }
export interface FishboneChartProps { categories?: FishboneCategory[]; effect?: string; config?: FishboneDiagramConfig; ariaLabel?: string; className?: string; style?: CSSProperties }

const SVG_W = 1400;
const SVG_H = 620;
const SPINE_Y = 310;
const SPINE_START = 200;
const SPINE_END = 1150;
const EFFECT_X = 1165;
const EFFECT_W = 210;
const EFFECT_H = 200;
const ICON_R = 36;
const BRANCH_LEN = 260;
const CAUSE_SPACING = 76;

function wrap(text: string, maxChars: number): string[] { const lines: string[] = []; let current = ''; for (const word of text.split(' ')) { const next = current ? `${current} ${word}` : word; if (next.length > maxChars && current) { lines.push(current); current = word; } else current = next; } if (current) lines.push(current); return lines.slice(0, 2); }

export function FishboneChart({ categories = [], effect = '', config: inputConfig, ariaLabel, className, style }: FishboneChartProps) {
  const config = { height: 560, branchAngle: 45, ...(inputConfig ?? {}) };
  const palette = useChartPalette();
  const accent = config.accentColor ?? palette[0];
  const effectFill = config.effectBoxColor ?? palette[1] ?? accent;
  const effectLines = wrap(effect, 18);
  const layout = useMemo(() => {
    const angle = Math.max(15, Math.min(75, config.branchAngle)) * Math.PI / 180;
    const top = categories.filter((_, index) => index % 2 === 0);
    const bottom = categories.filter((_, index) => index % 2 === 1);
    const count = Math.max(top.length, bottom.length);
    const xs = count > 0 && config.junctionSpacing && config.junctionSpacing > 0
      ? Array.from({ length: count }, (_, index) => (SPINE_START + SPINE_END) / 2 - (count - 1) * config.junctionSpacing! / 2 + index * config.junctionSpacing!)
      : Array.from({ length: count }, (_, index) => SPINE_START + (SPINE_END - SPINE_START) / (count + 1) * (index + 1));
    return [...Array.from({ length: count }, (_, index) => ({ category: top[index], side: 'top' as const, x: xs[index] })), ...Array.from({ length: count }, (_, index) => ({ category: bottom[index], side: 'bottom' as const, x: xs[index] }))].filter((entry): entry is { category: FishboneCategory; side: 'top' | 'bottom'; x: number } => Boolean(entry.category)).map((entry) => {
      const sign = entry.side === 'top' ? -1 : 1;
      const bx = entry.x - BRANCH_LEN * Math.cos(angle);
      const by = SPINE_Y + sign * BRANCH_LEN * Math.sin(angle);
      const ix = bx;
      const iy = by + sign * (ICON_R + 8);
      const causes = entry.category.causes.map((cause, index) => { const distance = (index + 1) * CAUSE_SPACING; const x = entry.x - distance * Math.cos(angle); const y = SPINE_Y + sign * distance * Math.sin(angle); return { x1: x, y1: y, x2: x - 110, y2: y, textX: x - 116, textY: y, lines: wrap(cause.label, 20) }; });
      return { ...entry, bx, by, ix, iy, causes };
    });
  }, [categories, config.branchAngle, config.junctionSpacing]);
  const label = ariaLabel ?? (effect ? `Fishbone diagram: ${effect}` : 'Fishbone diagram');
  return <div className={`sp-fishbone${className ? ` ${className}` : ''}`} style={style}>
    {(config.title || config.subtitle) && <header className="sp-chart-header"><h3 className="sp-chart-title">{config.title}</h3>{config.subtitle && <p className="sp-chart-subtitle">{config.subtitle}</p>}</header>}
    <div className="sp-fishbone__viewport" style={{ height: config.height }}>
      <svg className="sp-fishbone__svg" viewBox={`0 0 ${SVG_W} ${SVG_H}`} role="img" aria-label={label}>
        <defs><marker id="sp-fishbone-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={accent} /></marker></defs>
        <line x1={SPINE_START} y1={SPINE_Y} x2={SPINE_END} y2={SPINE_Y} stroke={accent} strokeWidth="3" markerEnd="url(#sp-fishbone-arrow)" />
        <rect x={EFFECT_X} y={SPINE_Y - EFFECT_H / 2} width={EFFECT_W} height={EFFECT_H} rx="12" fill={effectFill} />
        {effectLines.map((line, index) => <text key={index} className="sp-fishbone__effect-text" x={EFFECT_X + EFFECT_W / 2} y={SPINE_Y - (effectLines.length - 1) * 11 + index * 22} textAnchor="middle" dominantBaseline="middle">{line}</text>)}
        {layout.map((category) => <g key={`${category.side}-${category.category.label}`}>
          <circle cx={category.x} cy={SPINE_Y} r="6" fill={accent} />
          <line x1={category.x} y1={SPINE_Y} x2={category.bx} y2={category.by} stroke={accent} strokeWidth="2.5" />
          {category.causes.map((cause, index) => <g key={index}><line x1={cause.x1} y1={cause.y1} x2={cause.x2} y2={cause.y2} stroke={accent} strokeWidth="1.5" opacity="0.8" />{cause.lines.map((line, lineIndex) => <text key={lineIndex} className="sp-fishbone__cause-text" x={cause.textX} y={cause.textY + (lineIndex - (cause.lines.length - 1) / 2) * 14} textAnchor="end" dominantBaseline="middle">{line}</text>)}</g>)}
          <circle cx={category.ix} cy={category.iy} r={ICON_R} fill={accent} />
          {category.category.iconPath ? <path d={category.category.iconPath} transform={`translate(${category.ix - 14},${category.iy - 14}) scale(1.1667)`} fill="var(--sp-text-inverse, #fff)" /> : <text x={category.ix} y={category.iy} textAnchor="middle" dominantBaseline="middle" fill="var(--sp-text-inverse, #fff)" fontSize="22" fontWeight="700">{category.category.label[0]}</text>}
          <text className="sp-fishbone__cat-label" x={category.ix} y={category.side === 'top' ? category.iy - ICON_R - 10 : category.iy + ICON_R + 22} textAnchor="middle" fill={accent}>{category.category.label}</text>
        </g>)}
      </svg>
    </div>
  </div>;
}
