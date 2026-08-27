/* eslint-disable react-hooks/refs -- the shared tiny-chart hook intentionally returns its host ref. */
import './VisualizationCharts.css';
import { useMemo, type CSSProperties } from 'react';
import { normalizeTinyValues, sumValues } from './tiny-utils.js';
import { TINY_TRACK_COLOR, type TinyStack, type TinyStackedChartConfig, type TinyValues } from './tiny-types.js';
import { tinyStyle, useTinyChart } from './TinyChartBase.js';

export interface TinyStackedProps {
  data?: TinyValues | TinyStack[];
  config?: TinyStackedChartConfig;
  className?: string;
  style?: CSSProperties;
}

interface StackSource { label?: string; segments: ReturnType<typeof normalizeTinyValues> }

export function TinyStacked({ data = [], config: inputConfig, className, style }: TinyStackedProps) {
  const config = { normalize: false, segmentGap: 0, cornerRadius: 1, showTrack: false, showShare: true, ...inputConfig };
  const sources = useMemo<StackSource[]>(() => {
    const raw = data as Array<number | { value: number } | TinyStack>;
    if (!raw.length) return [];
    const first = raw[0];
    if (typeof first === 'object' && first !== null && 'segments' in first) return (raw as TinyStack[]).filter((stack) => stack.segments.length).map((stack) => ({ label: stack.label, segments: normalizeTinyValues(stack.segments).filter((datum) => datum.value > 0) }));
    const segments = normalizeTinyValues(raw as TinyValues).filter((datum) => datum.value > 0);
    return segments.length ? [{ segments }] : [];
  }, [data]);
  const summary = useMemo(() => sources.length === 1 ? sources[0].segments : sources.map((source) => ({ label: source.label, value: sumValues(source.segments) })), [sources]);
  const context = useTinyChart(inputConfig, 'Stacked chart', summary);
  const vertical = config.orientation ? config.orientation === 'vertical' : sources.length > 1;
  const across = vertical ? context.width : context.height;
  const along = vertical ? context.height : context.width;
  const gap = config.gap ?? context.sizeSpec.gap;
  const thickness = config.stackThickness ?? Math.max(1, (across - gap * (sources.length - 1)) / Math.max(1, sources.length));
  const totals = sources.map((source) => sumValues(source.segments));
  const max = config.max ?? Math.max(...totals, 0);
  const stacks = sources.map((source, stackIndex) => {
    const offset = stackIndex * (thickness + gap);
    const total = totals[stackIndex];
    const reference = config.normalize ? total : max;
    const stackLength = reference > 0 ? total / reference * along : 0;
    let cursor = 0;
    const segments = source.segments.map((datum, segmentIndex) => {
      const rawLength = reference > 0 ? datum.value / reference * along : 0;
      const start = cursor;
      cursor += rawLength;
      const length = Math.max(0, rawLength - config.segmentGap);
      return { index: segmentIndex, x: vertical ? offset : start, y: vertical ? along - start - length : offset, width: vertical ? thickness : length, height: vertical ? length : thickness, color: datum.color ?? context.seriesColor(segmentIndex), tooltip: context.tooltipText(datum.label, datum.value, config.showShare ? context.formatShare(datum.value, total) : undefined) };
    });
    return { index: stackIndex, stackLength, x: vertical ? offset : 0, y: vertical ? along - stackLength : offset, width: vertical ? thickness : stackLength, height: vertical ? stackLength : thickness, trackX: vertical ? offset : 0, trackY: vertical ? 0 : offset, trackWidth: vertical ? thickness : context.width, trackHeight: vertical ? context.height : thickness, segments };
  });
  return <div ref={context.hostRef} className={`${context.chartClassName}${className ? ` ${className}` : ''}`} style={{ ...tinyStyle(context), ...style }}>
    <svg className="sp-tiny__svg" width={context.width} height={context.height} viewBox={`0 0 ${context.width} ${context.height}`} {...context.svgProps}>
      <defs>{stacks.map((stack) => <clipPath id={`${context.uid}-stack-${stack.index}`} key={stack.index}><rect x={stack.x} y={stack.y} width={stack.width} height={stack.height} rx={config.cornerRadius} /></clipPath>)}</defs>
      {config.showTrack && <g aria-hidden="true">{stacks.map((stack) => <rect key={stack.index} x={stack.trackX} y={stack.trackY} width={stack.trackWidth} height={stack.trackHeight} rx={config.cornerRadius} fill={config.trackColor ?? TINY_TRACK_COLOR} />)}</g>}
      <g className={context.config.animate ? (vertical ? 'sp-tiny__grow' : 'sp-tiny__grow-x') : undefined} style={{ '--sp-tiny-origin': vertical ? `0 ${context.height}px` : '0 0' } as CSSProperties}>
        {stacks.map((stack) => <g key={stack.index} clipPath={`url(#${context.uid}-stack-${stack.index})`}>{stack.segments.map((segment) => <rect key={segment.index} x={segment.x} y={segment.y} width={segment.width} height={segment.height} fill={segment.color}>{context.config.showTooltip && <title>{segment.tooltip}</title>}</rect>)}</g>)}
      </g>
    </svg>
  </div>;
}

export const TinyStackedChart = TinyStacked;
export type TinyStackedChartProps = TinyStackedProps;
