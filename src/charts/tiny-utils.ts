import type { TinyDatum, TinyThreshold, TinyValues } from './tiny-types.js';

export interface TinyPoint { x: number; y: number; value: number; label?: string }

export function normalizeTinyValues(values: TinyValues | null | undefined): TinyDatum[] {
  if (!values?.length) return [];
  return values.map((entry) => typeof entry === 'number'
    ? { value: Number.isFinite(entry) ? entry : 0 }
    : { ...entry, value: Number.isFinite(entry.value) ? entry.value : 0 });
}

export function sortTinyData(data: TinyDatum[], sort: 'none' | 'asc' | 'desc'): TinyDatum[] {
  if (sort === 'none') return data;
  return [...data].sort((a, b) => sort === 'asc' ? a.value - b.value : b.value - a.value);
}

export function resolveThresholdColor(value: number, thresholds: TinyThreshold[] | undefined, fallback: string): string {
  if (!thresholds?.length) return fallback;
  let color = fallback;
  let best = -Infinity;
  for (const threshold of thresholds) {
    if (value >= threshold.value && threshold.value >= best) {
      best = threshold.value;
      color = threshold.color;
    }
  }
  return color;
}

export function clamp(value: number, lo: number, hi: number): number { return Math.min(hi, Math.max(lo, value)); }
export function sumValues(data: TinyDatum[]): number { return data.reduce((sum, datum) => sum + datum.value, 0); }

export function linearPath(points: TinyPoint[]): string {
  return points.length ? `M ${points.map((point) => `${round(point.x)} ${round(point.y)}`).join(' L ')}` : '';
}

export function monotonePath(points: TinyPoint[]): string {
  if (points.length < 2) return linearPath(points);
  let path = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const midX = (from.x + to.x) / 2;
    path += ` C ${round(midX)} ${round(from.y)}, ${round(midX)} ${round(to.y)}, ${round(to.x)} ${round(to.y)}`;
  }
  return path;
}

export function stepPath(points: TinyPoint[]): string {
  if (!points.length) return '';
  let path = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let index = 1; index < points.length; index += 1) {
    const midX = (points[index - 1].x + points[index].x) / 2;
    path += ` H ${round(midX)} V ${round(points[index].y)} H ${round(points[index].x)}`;
  }
  return path;
}

export function tinyLinePath(points: TinyPoint[], curve: 'linear' | 'monotone' | 'step'): string {
  return curve === 'linear' ? linearPath(points) : curve === 'step' ? stepPath(points) : monotonePath(points);
}

export function closeToFloor(path: string, points: TinyPoint[], floorY: number): string {
  if (!path || !points.length) return '';
  return `${path} L ${round(points.at(-1)?.x ?? 0)} ${round(floorY)} L ${round(points[0].x)} ${round(floorY)} Z`;
}

export function polarPoint(cx: number, cy: number, radius: number, angle: number): { x: number; y: number } {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

export function piePath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const sweep = endAngle - startAngle;
  if (sweep <= 0) return '';
  if (sweep >= 359.999) return `M ${round(cx)} ${round(cy - radius)} A ${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy + radius)} A ${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy - radius)} Z`;
  const start = polarPoint(cx, cy, radius, startAngle);
  const end = polarPoint(cx, cy, radius, endAngle);
  return `M ${round(cx)} ${round(cy)} L ${round(start.x)} ${round(start.y)} A ${round(radius)} ${round(radius)} 0 ${sweep > 180 ? 1 : 0} 1 ${round(end.x)} ${round(end.y)} Z`;
}

export function arcStrokePath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const sweep = endAngle - startAngle;
  if (sweep <= 0) return '';
  if (sweep >= 359.999) return `M ${round(cx)} ${round(cy - radius)} A ${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy + radius)} A ${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy - radius)}`;
  const start = polarPoint(cx, cy, radius, startAngle);
  const end = polarPoint(cx, cy, radius, endAngle);
  return `M ${round(start.x)} ${round(start.y)} A ${round(radius)} ${round(radius)} 0 ${sweep > 180 ? 1 : 0} 1 ${round(end.x)} ${round(end.y)}`;
}

function round(value: number): number { return Math.round(value * 10) / 10; }
