import './VisualizationCharts.css';
/* eslint-disable react-hooks/set-state-in-effect -- remote map loading and view synchronization are external effects. */
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { formatCompact } from './axis.js';
import { interpolateColor } from './colors.js';
import { WORLD_110M, type GeoFeature } from './world.js';
import type { ChartCommonProps, CoreChartConfig } from './types.js';

export interface MapRegion { id: string; label?: string; value?: number; color?: string }
export interface MapMarker { lat: number; lng: number; label: string; radius?: number; color?: string; value?: number }
export interface MapConnection { from: [number, number]; to: [number, number]; label?: string; width?: number; color?: string; value?: number }
export interface MapData { regions?: MapRegion[]; markers?: MapMarker[]; connections?: MapConnection[] }
export interface MapChartConfig extends CoreChartConfig { projection?: 'mercator' | 'equirectangular'; lowColor?: string; highColor?: string; defaultFill?: string; strokeColor?: string; regionStrokeWidth?: number; markerRadius?: number; showMarkerLabels?: boolean; connectionStyle?: 'arc' | 'straight'; showScale?: boolean; interactive?: boolean; center?: [number, number]; zoom?: number; geoJsonUrl?: string; simplifyTolerance?: number }
export interface MapChartProps extends ChartCommonProps { data?: MapData; title?: string; subtitle?: string; height?: number | string }

const DEFAULTS = { projection: 'mercator' as const, lowColor: '#dbeafe', highColor: '#1d4ed8', defaultFill: '#e2e8f0', strokeColor: '#94a3b8', regionStrokeWidth: 0.5, markerRadius: 5, showMarkerLabels: false, connectionStyle: 'arc' as const, showScale: true, interactive: true, zoom: 1 };
const VB_W = 1000;
const VB_H = 500;
const MAX_LAT = 85.051129;

function project(lat: number, lng: number, projection: MapChartConfig['projection']): [number, number] {
  if (projection === 'equirectangular') return [(lng + 180) / 360 * VB_W, (90 - lat) / 180 * VB_H];
  const clamped = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  const mercator = Math.log(Math.tan(Math.PI / 4 + clamped * Math.PI / 360));
  return [(lng + 180) / 360 * VB_W, VB_H / 2 - mercator * VB_H / (2 * Math.PI)];
}

function simplifyRing(ring: number[][], tolerance: number): number[][] {
  if (tolerance <= 0 || ring.length < 4) return ring;
  const squared = tolerance * tolerance;
  const keep = new Uint8Array(ring.length);
  keep[0] = 1;
  keep[ring.length - 1] = 1;
  const simplify = (start: number, end: number) => {
    let maxDistance = squared;
    let split = -1;
    const [x1, y1] = ring[start];
    const [x2, y2] = ring[end];
    for (let index = start + 1; index < end; index += 1) {
      const [x, y] = ring[index];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = dx * dx + dy * dy;
      const t = length ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / length)) : 0;
      const px = x1 + t * dx;
      const py = y1 + t * dy;
      const distance = (x - px) ** 2 + (y - py) ** 2;
      if (distance > maxDistance) { maxDistance = distance; split = index; }
    }
    if (split >= 0) { keep[split] = 1; simplify(start, split); simplify(split, end); }
  };
  simplify(0, ring.length - 1);
  return ring.filter((_, index) => keep[index] === 1);
}

function geometryPath(geometry: Record<string, unknown>, projection: MapChartConfig['projection'], simplifyTolerance = 0): string {
  const rings: number[][][] = [];
  if (geometry.type === 'Polygon') rings.push(...((geometry.coordinates as number[][][]) ?? []).slice(0, 1));
  if (geometry.type === 'MultiPolygon') for (const polygon of (geometry.coordinates as number[][][][]) ?? []) if (polygon[0]) rings.push(polygon[0]);
  if (simplifyTolerance > 0) {
    return rings.filter((ring) => ring.length >= 3).map((ring) => {
      const simplified = simplifyRing(ring, simplifyTolerance);
      return 'M' + simplified.map(([lng, lat]) => {
        const [x, y] = project(lat, lng, projection);
        return (Math.round(x * 10) / 10) + ',' + (Math.round(y * 10) / 10);
      }).join('L') + 'Z';
    }).join(' ');
  }
  return rings.filter((ring) => ring.length >= 3).map((ring) => `M${ring.map(([lng, lat]) => { const [x, y] = project(lat, lng, projection); return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`; }).join('L')}Z`).join(' ');
}

function parseFeatures(value: unknown, projection: MapChartConfig['projection'], simplifyTolerance = 0.3): GeoFeature[] {
  if (!value || typeof value !== 'object') return [];
  const root = value as { type?: string; features?: unknown[] };
  const topology = value as {
    type?: string;
    objects?: Record<string, unknown>;
    arcs?: number[][][];
    transform?: { scale: [number, number]; translate: [number, number] };
  };
  if (topology.type === 'Topology' && topology.objects && topology.arcs) {
    const object = topology.objects[Object.keys(topology.objects)[0]] as { geometries?: Array<Record<string, unknown>> } | undefined;
    if (!object?.geometries) return [];
    const decodeArc = (arcIndex: number): number[][] => {
      const reversed = arcIndex < 0;
      const arc = topology.arcs![reversed ? ~arcIndex : arcIndex] ?? [];
      let x = 0;
      let y = 0;
      const decoded = arc.map(([dx, dy]) => {
        x += dx;
        y += dy;
        const scale = topology.transform?.scale ?? [1, 1];
        const translate = topology.transform?.translate ?? [0, 0];
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
      });
      return reversed ? decoded.reverse() : decoded;
    };
    const decodeRing = (arcIndexes: number[]) => arcIndexes.flatMap((index, ringIndex) => {
      const ring = decodeArc(index);
      return ringIndex ? ring.slice(1) : ring;
    });
    return object.geometries.flatMap((geometry): GeoFeature[] => {
      const properties = (geometry.properties ?? {}) as Record<string, unknown>;
      const id = String(properties.ISO_A2 ?? properties.iso_a2 ?? properties.ADM0_A3 ?? properties.iso_a3 ?? geometry.id ?? '');
      const name = String(properties.ADMIN ?? properties.admin ?? properties.name ?? properties.NAME ?? id);
      const coordinates = geometry.type === 'Polygon'
        ? ((geometry.arcs as number[][]) ?? []).map(decodeRing)
        : geometry.type === 'MultiPolygon'
          ? ((geometry.arcs as number[][][]) ?? []).map((polygon) => polygon.map(decodeRing))
          : [];
      const path = coordinates.length ? geometryPath({ type: geometry.type, coordinates }, projection, simplifyTolerance) : '';
      return id && path ? [{ id, name, path }] : [];
    });
  }
  if (root.type !== 'FeatureCollection') return [];
  return (root.features ?? []).flatMap((entry): GeoFeature[] => {
    if (!entry || typeof entry !== 'object') return [];
    const feature = entry as { geometry?: Record<string, unknown>; properties?: Record<string, unknown> };
    const properties = feature.properties ?? {};
    const id = String(properties.ISO_A2 ?? properties.iso_a2 ?? properties.ADM0_A3 ?? properties.iso_a3 ?? '');
    const name = String(properties.ADMIN ?? properties.admin ?? properties.name ?? properties.NAME ?? id);
    const path = feature.geometry ? geometryPath(feature.geometry, projection, simplifyTolerance) : '';
    return id && path ? [{ id, name, path }] : [];
  });
}

function connectionPath(from: [number, number], to: [number, number], style: 'arc' | 'straight', projection: MapChartConfig['projection']): string {
  if (style === 'straight') { const [x1, y1] = project(from[0], from[1], projection); const [x2, y2] = project(to[0], to[1], projection); return `M${x1},${y1} L${x2},${y2}`; }
  const points = Array.from({ length: 25 }, (_, index) => { const t = index / 24; const lat = from[0] + (to[0] - from[0]) * t; const lng = from[1] + (to[1] - from[1]) * t; const lift = Math.sin(Math.PI * t) * Math.min(35, Math.abs(to[1] - from[1]) * 0.12); const [x, y] = project(lat + lift, lng, projection); return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`; });
  return `M${points.join(' L')}`;
}

export function MapChart({ data = {}, title, subtitle, height = 400, ...commonProps }: MapChartProps) {
  const config = { ...DEFAULTS, ...(commonProps.config as MapChartConfig | undefined) };
  const palette = useChartPalette();
  const gradientId = `sp-map-gradient-${useId().replace(/:/g, '')}`;
  const [remoteFeatures, setRemoteFeatures] = useState<GeoFeature[] | null>(null);
  const [loading, setLoading] = useState(false);
  const initialPan = useMemo(() => {
    if (!config.center) return { x: 0, y: 0 };
    const [x, y] = project(config.center[0], config.center[1], config.projection);
    return { x: VB_W / 2 - x * config.zoom, y: VB_H / 2 - y * config.zoom };
  }, [config.center, config.projection, config.zoom]);
  const [scale, setScale] = useState(config.zoom);
  const [pan, setPan] = useState(initialPan);
  const drag = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  useEffect(() => { setScale(config.zoom); setPan(initialPan); }, [config.zoom, initialPan]);
  useEffect(() => {
    if (!config.geoJsonUrl) { setRemoteFeatures(null); return undefined; }
    const controller = new AbortController();
    setLoading(true);
    fetch(config.geoJsonUrl, { signal: controller.signal }).then((response) => response.json()).then((json: unknown) => setRemoteFeatures(parseFeatures(json, config.projection, config.simplifyTolerance))).catch(() => setRemoteFeatures(null)).finally(() => setLoading(false));
    return () => controller.abort();
  }, [config.geoJsonUrl, config.projection, config.simplifyTolerance]);
  const features = remoteFeatures ?? WORLD_110M;
  const regions = new Map((data.regions ?? []).map((region) => [region.id, region]));
  const values = (data.regions ?? []).filter((region) => region.value !== undefined).map((region) => region.value as number);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;
  const valueRange = maxValue === minValue ? 1 : maxValue - minValue;
  const markers = data.markers ?? [];
  const connections = data.connections ?? [];
  const mapTransform = `translate(${pan.x} ${pan.y}) scale(${scale})`;
  const onWheel = (event: React.WheelEvent<SVGSVGElement>) => { if (!config.interactive) return; event.preventDefault(); setScale((current) => Math.max(0.4, Math.min(24, current * (event.deltaY > 0 ? 0.88 : 1.14)))); };
  const onDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!config.interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left) / Math.max(1, rect.width) * VB_W, y: (event.clientY - rect.top) / Math.max(1, rect.height) * VB_H };
    const next = Math.min(24, scale * 1.8);
    const ratio = next / scale;
    setPan((current) => ({ x: point.x - ratio * (point.x - current.x), y: point.y - ratio * (point.y - current.y) }));
    setScale(next);
  };
  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => { if (!config.interactive) return; (event.currentTarget as SVGSVGElement).setPointerCapture(event.pointerId); drag.current = { clientX: event.clientX, clientY: event.clientY, panX: pan.x, panY: pan.y }; };
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => { if (!drag.current) return; setPan({ x: drag.current.panX + event.clientX - drag.current.clientX, y: drag.current.panY + event.clientY - drag.current.clientY }); };
  const stopDrag = () => { drag.current = null; };
  const reset = () => { setScale(config.zoom); setPan(initialPan); };
  return <ChartContainer {...commonProps} config={{ ...config, zoomEnabled: false }} title={title} subtitle={subtitle} height={height} chartType="Map chart">
    <div className="sp-visualization-chart" style={{ position: 'relative' } as CSSProperties} onDoubleClick={onDoubleClick}>
      <svg className={`sp-chart-svg sp-visualization-chart__svg sp-map__svg${config.interactive ? '' : ' sp-map__svg--static'}`} viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={commonProps.ariaLabel ?? title ?? 'Map chart'} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
        <defs><linearGradient id={gradientId}><stop offset="0%" stopColor={config.lowColor} /><stop offset="100%" stopColor={config.highColor} /></linearGradient></defs>
        <g transform={mapTransform}>
          {features.map((feature, index) => { const region = regions.get(feature.id); const fill = region?.color ?? (region?.value !== undefined ? interpolateColor(config.lowColor, config.highColor, Math.max(0, Math.min(1, (region.value - minValue) / valueRange))) : config.defaultFill); return <path key={`${feature.id}-${index}`} className="sp-map__region" data-chart-point data-index={index} data-label={region?.label ?? feature.name} data-value={region?.value ?? ''} d={feature.path} fill={fill} stroke={config.strokeColor} strokeWidth={config.regionStrokeWidth} />; })}
          {connections.map((connection, index) => <path key={`connection-${index}`} className="sp-map__connection" data-chart-point data-index={index} data-label={connection.label ?? 'Connection'} data-value={connection.value ?? ''} d={connectionPath(connection.from, connection.to, config.connectionStyle, config.projection)} fill="none" stroke={connection.color ?? palette[(index + 2) % palette.length]} strokeWidth={connection.width ?? 1.5} strokeLinecap="round" />)}
          {markers.map((marker, index) => { const [x, y] = project(marker.lat, marker.lng, config.projection); const color = marker.color ?? palette[index % palette.length]; return <g key={`${marker.label}-${index}`}><circle className="sp-map__marker" data-chart-point data-index={index} data-label={marker.label} data-value={marker.value ?? ''} cx={x} cy={y} r={marker.radius ?? config.markerRadius} fill={color} stroke="var(--sp-text-inverse, #fff)" strokeWidth="1.5" />{config.showMarkerLabels && <text className="sp-map__marker-label" x={x} y={y - (marker.radius ?? config.markerRadius) - 4} textAnchor="middle">{marker.label}</text>}</g>; })}
        </g>
        {config.showScale && values.length > 0 && <g transform="translate(800 450)"><rect width="150" height="8" rx="3" fill={`url(#${gradientId})`} /><text className="sp-map__legend-text" x="0" y="20">{formatCompact(minValue)}</text><text className="sp-map__legend-text" x="150" y="20" textAnchor="end">{formatCompact(maxValue)}</text></g>}
      </svg>
      {config.interactive && (scale !== config.zoom || pan.x !== 0 || pan.y !== 0) && <button type="button" className="sp-map__reset" aria-label="Reset map view" onClick={reset}>↻</button>}
      {loading && <div className="sp-map__loading" role="status">Loading map data…</div>}
    </div>
  </ChartContainer>;
}
