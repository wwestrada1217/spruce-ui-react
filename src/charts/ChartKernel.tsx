/* eslint-disable react-refresh/only-export-components */
/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { useI18n } from '../i18n/i18n-context.js';
import { useTheme } from '../theme/theme-context.js';
import {
  DEFAULT_CHART_COLORS,
  DEFAULT_CHART_CONFIG,
  type ChartCallbackEvent,
  type ChartPointEvent,
  type ChartThemeColors,
  type ChartTooltipData,
  type ChartTooltipEvent,
  type ChartTooltipItem,
  type ChartZoomState,
  type CoreChartConfig,
} from './types.js';
import {
  HARMONY_PALETTE,
  resolveChartPalette,
  resolveSeriesPalette,
} from './colors.js';

export { CHART_PALETTES, HARMONY_PALETTE, resolveSeriesPalette } from './colors.js';
export type { ChartPalette } from './colors.js';

function readToken(element: Element, name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(element).getPropertyValue(name).trim() || fallback;
}

export function readChartThemeColors(element?: Element | null, dark = false): ChartThemeColors {
  const fallback = dark
    ? {
        titleColor: '#f1f5f9', subtitleColor: '#94a3b8', axisText: '#94a3b8', axisLine: '#334155',
        gridLine: '#1e293b', valueLabel: '#cbd5e1', axisLabel: '#64748b', legendText: '#94a3b8',
        tooltipBg: '#1e293b', tooltipText: '#f9fafb', tooltipBorder: '#475569',
      }
    : {
        titleColor: '#1e293b', subtitleColor: '#64748b', axisText: '#64748b', axisLine: '#e2e8f0',
        gridLine: '#f1f5f9', valueLabel: '#475569', axisLabel: '#94a3b8', legendText: '#64748b',
        tooltipBg: '#1f2937', tooltipText: '#f9fafb', tooltipBorder: '#374151',
      };
  if (!element) return fallback;
  return {
    titleColor: readToken(element, '--sp-chart-title-color', fallback.titleColor),
    subtitleColor: readToken(element, '--sp-chart-subtitle-color', fallback.subtitleColor),
    axisText: readToken(element, '--sp-chart-axis-text', fallback.axisText),
    axisLine: readToken(element, '--sp-chart-axis-line', fallback.axisLine),
    gridLine: readToken(element, '--sp-chart-grid-line', fallback.gridLine),
    valueLabel: readToken(element, '--sp-chart-value-label', fallback.valueLabel),
    axisLabel: readToken(element, '--sp-chart-axis-label', fallback.axisLabel),
    legendText: readToken(element, '--sp-chart-legend-text', fallback.legendText),
    tooltipBg: readToken(element, '--sp-chart-tooltip-bg', fallback.tooltipBg),
    tooltipText: readToken(element, '--sp-chart-tooltip-text', fallback.tooltipText),
    tooltipBorder: readToken(element, '--sp-chart-tooltip-border', fallback.tooltipBorder),
  };
}

export function useChartPalette(
  colorScheme: readonly string[] = DEFAULT_CHART_COLORS,
  paletteName?: string,
): string[] {
  const { resolved, accentRevision, harmonyPalette } = useTheme();
  return useMemo(() => {
    if (paletteName === HARMONY_PALETTE) {
      const harmony = harmonyPalette?.[resolved]?.series;
      if (harmony?.length) return [...harmony];
      return typeof document === 'undefined' ? [...DEFAULT_CHART_COLORS] : resolveSeriesPalette(document.documentElement);
    }
    return resolveChartPalette(paletteName, colorScheme);
  // accentRevision invalidates CSS-published harmony variables when the palette object is unchanged.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accentRevision, colorScheme, harmonyPalette, paletteName, resolved]);
}

export interface ChartKernelOptions {
  config?: CoreChartConfig;
  ariaLabel?: string;
  onZoomChange?: (zoom: ChartZoomState) => void;
  onZoomReset?: (event: ChartCallbackEvent) => void;
  onTooltipChange?: (event: ChartTooltipEvent) => void;
  onDataPointClick?: (event: ChartPointEvent) => void;
  onDataPointHover?: (event: ChartPointEvent) => void;
}

export interface ChartKernelValue {
  chartId: string;
  rootRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  width: number;
  height: number;
  config: Required<CoreChartConfig>;
  themeColors: ChartThemeColors;
  palette: string[];
  hiddenSeries: ReadonlySet<string>;
  toggleSeries: (label: string) => void;
  isSeriesHidden: (label: string) => boolean;
  zoom: ChartZoomState;
  isZoomed: boolean;
  zoomViewX: [number, number];
  zoomViewY: [number, number];
  onWheel: (event: ReactWheelEvent<HTMLDivElement>) => void;
  onMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  resetZoom: (originalEvent?: Event) => void;
  zoomTransform: CSSProperties;
  tooltip: ChartTooltipData | null;
  showTooltip: (event: ReactMouseEvent<Element>, item: ChartTooltipData | ChartTooltipItem) => void;
  moveTooltip: (event: ReactMouseEvent<Element>) => void;
  hideTooltip: (originalEvent?: Event) => void;
  emitDataPoint: (event: Event, point: Omit<ChartPointEvent, 'originalEvent' | 'chartId'>) => void;
  staggerDelay: (index: number, count: number, perItem: number) => string;
}

const ChartKernelContext = createContext<ChartKernelValue | null>(null);

export function useChartKernel(options: ChartKernelOptions = {}): ChartKernelValue {
  const { resolved, accentRevision } = useTheme();
  const { locale } = useI18n();
  const {
    config: inputConfig,
    onZoomChange,
    onZoomReset,
    onTooltipChange,
    onDataPointClick,
    onDataPointHover,
  } = options;
  const config = useMemo<Required<CoreChartConfig>>(() => ({
    ...DEFAULT_CHART_CONFIG,
    ...inputConfig,
    margin: { ...DEFAULT_CHART_CONFIG.margin, ...(inputConfig?.margin ?? {}) },
    tooltip: { ...DEFAULT_CHART_CONFIG.tooltip, ...(inputConfig?.tooltip ?? {}) },
  }), [inputConfig]);
  const chartId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 600, height: typeof config.height === 'number' ? config.height : 300 });
  const [themeColors, setThemeColors] = useState<ChartThemeColors>(() => readChartThemeColors(null, resolved === 'dark'));
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(() => new Set());
  const [zoom, setZoom] = useState<ChartZoomState>({ scale: 1, offsetX: 0, offsetY: 0 });
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null);
  const panRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number; scale: number } | null>(null);
  const panMoveRef = useRef<((event: MouseEvent) => void) | null>(null);
  const panEndRef = useRef<(() => void) | null>(null);
  const palette = useChartPalette(config.colorScheme.length ? config.colorScheme : DEFAULT_CHART_COLORS, config.palette);

  const measure = useCallback(() => {
    const element = rootRef.current;
    if (!element) return;
    const width = element.getBoundingClientRect().width || element.clientWidth;
    if (width > 0) setSize((current) => ({ ...current, width }));
  }, []);

  useEffect(() => {
    const frame = typeof window !== 'undefined' ? window.requestAnimationFrame(measure) : 0;
    if (!config.responsive || typeof window === 'undefined') {
      return () => { if (frame) window.cancelAnimationFrame(frame); };
    }
    const element = rootRef.current;
    if (!element) return () => { if (frame) window.cancelAnimationFrame(frame); };
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        if (width > 0) setSize((current) => ({ ...current, width }));
      });
      observer.observe(element);
      return () => { if (frame) window.cancelAnimationFrame(frame); observer.disconnect(); };
    }
    window.addEventListener('resize', measure);
    return () => { if (frame) window.cancelAnimationFrame(frame); window.removeEventListener('resize', measure); };
  }, [config.responsive, measure]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    setThemeColors(readChartThemeColors(element, resolved === 'dark'));
  }, [accentRevision, locale, resolved]);

  const clampZoom = useCallback((next: ChartZoomState): ChartZoomState => {
    const scale = Math.max(config.minZoom, Math.min(config.maxZoom, next.scale));
    const maxX = Math.max(0, size.width * (scale - 1));
    const maxY = Math.max(0, size.height * (scale - 1));
    return {
      scale,
      offsetX: Math.max(-maxX, Math.min(0, next.offsetX)),
      offsetY: Math.max(-maxY, Math.min(0, next.offsetY)),
    };
  }, [config.maxZoom, config.minZoom, size.height, size.width]);

  const updateZoom = useCallback((next: ChartZoomState) => {
    setZoom(clampZoom(next));
  }, [clampZoom]);

  useEffect(() => {
    onZoomChange?.(zoom);
  }, [onZoomChange, zoom]);

  const onWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    if (!config.zoomEnabled) return;
    event.preventDefault();
    const current = zoom.scale;
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const nextScale = Math.max(config.minZoom, Math.min(config.maxZoom, current * delta));
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    const ratio = nextScale / current;
    updateZoom({
      scale: nextScale,
      offsetX: (zoom.offsetX - cx) * ratio + cx,
      offsetY: (zoom.offsetY - cy) * ratio + cy,
    });
  }, [config.maxZoom, config.minZoom, config.zoomEnabled, updateZoom, zoom]);

  const endPan = useCallback(() => {
    panRef.current = null;
    if (panMoveRef.current) document.removeEventListener('mousemove', panMoveRef.current);
    panMoveRef.current = null;
    if (panEndRef.current) document.removeEventListener('mouseup', panEndRef.current);
  }, []);

  const onMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!config.zoomEnabled || !config.panEnabled || zoom.scale <= 1) return;
    if ((event.target as Element).closest('button, a, input, select, textarea')) return;
    event.preventDefault();
    panRef.current = { x: event.clientX, y: event.clientY, offsetX: zoom.offsetX, offsetY: zoom.offsetY, scale: zoom.scale };
    const move = (moveEvent: MouseEvent) => {
      const pan = panRef.current;
      if (!pan) return;
      updateZoom({ scale: pan.scale, offsetX: pan.offsetX + moveEvent.clientX - pan.x, offsetY: pan.offsetY + moveEvent.clientY - pan.y });
    };
    panMoveRef.current = move;
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', endPan);
  }, [config.panEnabled, config.zoomEnabled, endPan, updateZoom, zoom]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    onMouseDown(event as unknown as ReactMouseEvent<HTMLDivElement>);
  }, [onMouseDown]);

  useEffect(() => {
    panEndRef.current = endPan;
    return () => {
      endPan();
      if (panEndRef.current === endPan) panEndRef.current = null;
    };
  }, [endPan]);

  const resetZoom = useCallback((originalEvent?: Event) => {
    setZoom({ scale: 1, offsetX: 0, offsetY: 0 });
    if (originalEvent) onZoomReset?.({ originalEvent, chartId });
  }, [chartId, onZoomReset]);

  const toggleSeries = useCallback((label: string) => {
    if (!config.interactiveLegend) return;
    setHiddenSeries((current) => {
      const next = new Set(current);
      const hidden = !next.has(label);
      if (hidden) next.add(label); else next.delete(label);
      return next;
    });
  }, [config.interactiveLegend]);

  const showTooltip = useCallback((event: ReactMouseEvent<Element>, item: ChartTooltipData | ChartTooltipItem) => {
    if (!config.showTooltip || config.tooltip.enabled === false) return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const data: ChartTooltipData = {
      ...item,
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top - 10,
    };
    setTooltip(data);
    onTooltipChange?.({ originalEvent: event.nativeEvent, chartId, tooltip: data });
  }, [chartId, config.showTooltip, config.tooltip, onTooltipChange]);

  const moveTooltip = useCallback((event: ReactMouseEvent<Element>) => {
    const root = rootRef.current;
    if (!root || !tooltip) return;
    const rect = root.getBoundingClientRect();
    setTooltip((current) => current ? { ...current, x: event.clientX - rect.left + 12, y: event.clientY - rect.top - 10 } : null);
  }, [tooltip]);

  const hideTooltip = useCallback((originalEvent?: Event) => {
    if (!tooltip) return;
    setTooltip(null);
    if (originalEvent) onTooltipChange?.({ originalEvent, chartId, tooltip: null });
  }, [chartId, onTooltipChange, tooltip]);

  const emitDataPoint = useCallback((originalEvent: Event, point: Omit<ChartPointEvent, 'originalEvent' | 'chartId'>) => {
    const event = { ...point, originalEvent, chartId };
    onDataPointClick?.(event);
    onDataPointHover?.(event);
  }, [chartId, onDataPointClick, onDataPointHover]);

  const zoomViewX: [number, number] = useMemo(() => {
    if (zoom.scale <= 1 || size.width <= 0) return [0, 1];
    const start = -zoom.offsetX / (zoom.scale * size.width);
    return [start, start + 1 / zoom.scale];
  }, [size.width, zoom.offsetX, zoom.scale]);
  const zoomViewY: [number, number] = useMemo(() => {
    if (zoom.scale <= 1 || size.height <= 0) return [0, 1];
    const start = -zoom.offsetY / (zoom.scale * size.height);
    return [start, start + 1 / zoom.scale];
  }, [size.height, zoom.offsetY, zoom.scale]);
  const staggerDelay = useCallback((index: number, count: number, perItem: number) => {
    const maxTotal = config.animationDuration * 0.8;
    const raw = index * perItem;
    return `${count <= 1 || raw <= maxTotal ? raw : (index / Math.max(1, count - 1)) * maxTotal}ms`;
  }, [config.animationDuration]);

  return useMemo(() => ({
    chartId,
    rootRef,
    svgRef,
    width: size.width,
    height: size.height,
    config,
    themeColors,
    palette,
    hiddenSeries,
    toggleSeries,
    isSeriesHidden: (label: string) => hiddenSeries.has(label),
    zoom,
    isZoomed: zoom.scale !== 1 || zoom.offsetX !== 0 || zoom.offsetY !== 0,
    zoomViewX,
    zoomViewY,
    onWheel,
    onMouseDown,
    onPointerDown,
    resetZoom,
    zoomTransform: {
      transform: zoom.scale === 1 ? undefined : `translate(${zoom.offsetX / zoom.scale}px, ${zoom.offsetY / zoom.scale}px) scale(${zoom.scale})`,
      transformOrigin: 'center center',
    },
    tooltip,
    showTooltip,
    moveTooltip,
    hideTooltip,
    emitDataPoint,
    staggerDelay,
  }), [chartId, config, emitDataPoint, hiddenSeries, hideTooltip, moveTooltip, onMouseDown, onPointerDown, onWheel, palette, resetZoom, showTooltip, size.height, size.width, staggerDelay, themeColors, tooltip, toggleSeries, zoom, zoomViewX, zoomViewY]);
}

export function ChartKernelProvider({ value, children }: { value: ChartKernelValue; children: ReactNode }): ReactNode {
  return <ChartKernelContext.Provider value={value}>{children}</ChartKernelContext.Provider>;
}

export function useChartContext(): ChartKernelValue {
  const context = useContext(ChartKernelContext);
  if (!context) throw new Error('useChartContext must be used inside ChartContainer');
  return context;
}
