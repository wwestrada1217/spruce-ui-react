import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChartContainer } from './ChartContainer.js';
import { useChartPalette } from './ChartKernel.js';
import { DEFAULT_CHART_COLORS, type ChartCommonProps, type ChartMargin, type ChartTooltipConfig } from './types.js';
import './VisualizationCharts.css';

export interface GraphNode {
  id: string;
  label?: string;
  group?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  size?: number;
  metadata?: Record<string, string>;
  pinned?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  weight?: number;
  color?: string;
  width?: number;
  directed?: boolean;
  dashed?: boolean;
}

export interface GraphChartConfig {
  width?: number;
  height?: number | string;
  margin?: Partial<ChartMargin>;
  responsive?: boolean;
  title?: string;
  subtitle?: string;
  showGrid?: boolean;
  animate?: boolean;
  animationDuration?: number;
  colorScheme?: string[];
  palette?: string;
  showTooltip?: boolean;
  tooltip?: ChartTooltipConfig;
  showAxes?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  interactiveLegend?: boolean;
  directed?: boolean;
  layout?: 'force' | 'circular' | 'grid';
  repulsionStrength?: number;
  springStrength?: number;
  springLength?: number;
  gravity?: number;
  simulationIterations?: number;
  nodeRadius?: number;
  showNodeLabels?: boolean;
  nodeLabelSize?: number;
  edgeWidth?: number;
  showEdgeLabels?: boolean;
  edgeLabelSize?: number;
  arrowSize?: number;
  nodeFill?: 'color' | 'none';
  nodeBorderColor?: string;
  nodeBorderWidth?: number | null;
  zoomEnabled?: boolean;
  panEnabled?: boolean;
  minZoom?: number;
  maxZoom?: number;
  collisionDetection?: boolean;
  collisionPadding?: number;
  collisionStrength?: number;
  collisionIterations?: number;
  draggable?: boolean;
  traceOnHover?: boolean;
  traceDepth?: number;
  dimUnrelatedOnTrace?: boolean;
}

export interface GraphChartProps extends Omit<ChartCommonProps, 'config'> {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  config?: GraphChartConfig;
  title?: string;
  subtitle?: string;
  height?: number | string;
  colorScheme?: string[];
  onNodeClick?: (nodeId: string) => void;
}

interface PositionedNode extends GraphNode {
  label: string;
  group: string;
  color: string;
  radius: number;
  x: number;
  y: number;
}

interface PositionedEdge extends GraphEdge {
  id: string;
  sourceNode: PositionedNode;
  targetNode: PositionedNode;
  color: string;
  width: number;
  directed: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  labelX: number;
  labelY: number;
}

interface GraphRuntimeConfig {
  directed: boolean;
  layout: 'force' | 'circular' | 'grid';
  repulsionStrength: number;
  springStrength: number;
  springLength: number;
  gravity: number;
  simulationIterations: number;
  nodeRadius: number;
  showNodeLabels: boolean;
  nodeLabelSize: number;
  edgeWidth: number;
  showEdgeLabels: boolean;
  edgeLabelSize: number;
  arrowSize: number;
  nodeFill: 'color' | 'none';
  nodeBorderColor: string;
  nodeBorderWidth: number | null;
  zoomEnabled: boolean;
  panEnabled: boolean;
  minZoom: number;
  maxZoom: number;
  collisionDetection: boolean;
  collisionPadding: number;
  collisionStrength: number;
  collisionIterations: number;
  draggable: boolean;
  traceOnHover: boolean;
  traceDepth: number;
  dimUnrelatedOnTrace: boolean;
}

const GRAPH_DEFAULTS: GraphRuntimeConfig = {
  directed: false,
  layout: 'force',
  repulsionStrength: 300,
  springStrength: 0.3,
  springLength: 100,
  gravity: 0.05,
  simulationIterations: 120,
  nodeRadius: 8,
  showNodeLabels: true,
  nodeLabelSize: 11,
  edgeWidth: 1.5,
  showEdgeLabels: false,
  edgeLabelSize: 10,
  arrowSize: 5,
  nodeFill: 'color',
  nodeBorderColor: '',
  nodeBorderWidth: null,
  zoomEnabled: false,
  panEnabled: false,
  minZoom: 0.5,
  maxZoom: 4,
  collisionDetection: true,
  collisionPadding: 8,
  collisionStrength: 0.8,
  collisionIterations: 8,
  draggable: false,
  traceOnHover: false,
  traceDepth: 1,
  dimUnrelatedOnTrace: true,
};

const GRAPH_WIDTH = 600;
const GRAPH_HEIGHT = 300;

function hashUnit(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) | 0;
  return (Math.abs(hash) % 1000) / 1000;
}

function initialPosition(id: string, index: number, count: number, layout: GraphChartConfig['layout']): { x: number; y: number } {
  if (count === 0) return { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 };
  if (layout === 'grid') {
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    return {
      x: ((index % columns) + 1) * GRAPH_WIDTH / (columns + 1),
      y: (Math.floor(index / columns) + 1) * GRAPH_HEIGHT / (rows + 1),
    };
  }
  const angle = 2 * Math.PI * index / count - Math.PI / 2;
  const radius = Math.min(GRAPH_WIDTH, GRAPH_HEIGHT) * (layout === 'circular' ? 0.34 : 0.24);
  const jitter = layout === 'force' ? hashUnit(id) * Math.min(GRAPH_WIDTH, GRAPH_HEIGHT) * 0.18 : 0;
  return {
    x: GRAPH_WIDTH / 2 + Math.cos(angle) * (radius + jitter),
    y: GRAPH_HEIGHT / 2 + Math.sin(angle) * (radius + jitter),
  };
}

function resolveCollisions(nodes: PositionedNode[], config: GraphRuntimeConfig): void {
  const padding = Math.max(0, config.collisionPadding);
  const strength = Math.max(0, Math.min(1, config.collisionStrength));
  for (let iteration = 0; iteration < config.collisionIterations; iteration += 1) {
    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first];
        const b = nodes[second];
        const dx = b.x - a.x || 0.01;
        const dy = b.y - a.y || 0.01;
        const distance = Math.hypot(dx, dy) || 1;
        const minimum = a.radius + b.radius + padding;
        if (distance >= minimum) continue;
        const offset = (minimum - distance) * strength / 2;
        a.x -= dx / distance * offset;
        a.y -= dy / distance * offset;
        b.x += dx / distance * offset;
        b.y += dy / distance * offset;
      }
    }
    for (const node of nodes) {
      node.x = Math.max(node.radius, Math.min(GRAPH_WIDTH - node.radius, node.x));
      node.y = Math.max(node.radius, Math.min(GRAPH_HEIGHT - node.radius, node.y));
    }
  }
}

function createGraphLayout(nodes: GraphNode[], edges: GraphEdge[], inputConfig: GraphChartConfig, palette: string[], dragged: Record<string, { x: number; y: number }>): { nodes: PositionedNode[]; edges: PositionedEdge[] } {
  const config: GraphRuntimeConfig = { ...GRAPH_DEFAULTS, ...inputConfig };
  const groups = new Map<string, number>();
  const positioned = nodes.map((node, index) => {
    if (node.group && !groups.has(node.group)) groups.set(node.group, groups.size);
    const colorIndex = node.group ? groups.get(node.group) ?? index : index;
    const position = initialPosition(node.id, index, nodes.length, config.layout);
    return {
      ...node,
      label: node.label ?? node.id,
      group: node.group ?? '',
      color: node.color ?? palette[colorIndex % palette.length],
      radius: Math.max(3, config.nodeRadius * (node.size ?? 1)),
      x: position.x,
      y: position.y,
    };
  });
  const nodeMap = new Map(positioned.map((node) => [node.id, node]));
  if (config.layout === 'force') {
    const velocity = new Map(positioned.map((node) => [node.id, { x: 0, y: 0 }]));
    const iterations = Math.min(Math.max(0, config.simulationIterations), 180);
    for (let tick = 0; tick < iterations; tick += 1) {
      const alpha = 1 - tick / Math.max(1, iterations);
      for (let first = 0; first < positioned.length; first += 1) {
        for (let second = first + 1; second < positioned.length; second += 1) {
          const a = positioned[first];
          const b = positioned[second];
          const dx = b.x - a.x || 0.01;
          const dy = b.y - a.y || 0.01;
          const distance = Math.hypot(dx, dy) || 1;
          const force = config.repulsionStrength * alpha / Math.max(1, distance * distance);
          const av = velocity.get(a.id);
          const bv = velocity.get(b.id);
          if (av) { av.x -= force * dx / distance; av.y -= force * dy / distance; }
          if (bv) { bv.x += force * dx / distance; bv.y += force * dy / distance; }
        }
      }
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target || source === target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.hypot(dx, dy) || 1;
        const stretch = (distance - config.springLength / Math.max(0.01, edge.weight ?? 1)) * config.springStrength * 0.08;
        const sv = velocity.get(source.id);
        const tv = velocity.get(target.id);
        if (sv) { sv.x += stretch * dx / distance; sv.y += stretch * dy / distance; }
        if (tv) { tv.x -= stretch * dx / distance; tv.y -= stretch * dy / distance; }
      }
      for (const node of positioned) {
        const v = velocity.get(node.id);
        if (!v || node.pinned) continue;
        v.x += (GRAPH_WIDTH / 2 - node.x) * config.gravity * 0.02;
        v.y += (GRAPH_HEIGHT / 2 - node.y) * config.gravity * 0.02;
        v.x = Math.max(-12, Math.min(12, v.x));
        v.y = Math.max(-12, Math.min(12, v.y));
        node.x += v.x;
        node.y += v.y;
        v.x *= 0.76;
        v.y *= 0.76;
      }
      if (config.collisionDetection) resolveCollisions(positioned, { ...config, collisionIterations: 1 });
    }
  }
  if (config.collisionDetection) resolveCollisions(positioned, config);
  for (const node of positioned) {
    const override = dragged[node.id];
    if (override) { node.x = override.x; node.y = override.y; }
    node.x = Math.max(node.radius, Math.min(GRAPH_WIDTH - node.radius, node.x));
    node.y = Math.max(node.radius, Math.min(GRAPH_HEIGHT - node.radius, node.y));
    if (nodes.length === 1) { node.x = GRAPH_WIDTH / 2; node.y = GRAPH_HEIGHT / 2; }
  }
  const positionedEdges: PositionedEdge[] = [];
  edges.forEach((edge, index) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode || sourceNode === targetNode) return;
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const directed = edge.directed ?? config.directed;
    const arrowPadding = directed ? config.arrowSize : 0;
    positionedEdges.push({
      ...edge,
      id: edge.source + '-' + edge.target + '-' + index,
      sourceNode,
      targetNode,
      color: edge.color ?? 'var(--sp-chart-axis-line, #94a3b8)',
      width: edge.width ?? config.edgeWidth,
      directed,
      x1: sourceNode.x + ux * sourceNode.radius,
      y1: sourceNode.y + uy * sourceNode.radius,
      x2: targetNode.x - ux * (targetNode.radius + arrowPadding),
      y2: targetNode.y - uy * (targetNode.radius + arrowPadding),
      labelX: (sourceNode.x + targetNode.x) / 2,
      labelY: (sourceNode.y + targetNode.y) / 2 - 4,
    });
  });
  return { nodes: positioned, edges: positionedEdges };
}

export function GraphChart({
  nodes = [],
  edges = [],
  config: inputConfig = {},
  title,
  subtitle,
  height = 320,
  colorScheme = DEFAULT_CHART_COLORS,
  onNodeClick,
  className,
  style,
  ...commonProps
}: GraphChartProps) {
  const [dragged, setDragged] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [tracedId, setTracedId] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const palette = useChartPalette(inputConfig.colorScheme ?? colorScheme, inputConfig.palette);
  const config = useMemo(() => ({ ...GRAPH_DEFAULTS, ...inputConfig, height: inputConfig.height ?? height } as GraphRuntimeConfig & GraphChartConfig), [height, inputConfig]);
  const layout = useMemo(() => createGraphLayout(nodes, edges, config, palette, dragged), [config, dragged, edges, nodes, palette]);
  const traceSet = useMemo(() => {
    if (!tracedId || !config.traceOnHover) return new Set<string>();
    const result = new Set([tracedId]);
    let frontier = new Set([tracedId]);
    for (let depth = 0; depth < Math.max(1, config.traceDepth ?? 1); depth += 1) {
      const next = new Set<string>();
      for (const edge of edges) {
        if (frontier.has(edge.source) && !result.has(edge.target)) { result.add(edge.target); next.add(edge.target); }
        if (frontier.has(edge.target) && !result.has(edge.source)) { result.add(edge.source); next.add(edge.source); }
      }
      frontier = next;
      if (!frontier.size) break;
    }
    return result;
  }, [config.traceDepth, config.traceOnHover, edges, tracedId]);
  const markerPrefix = 'sp-graph-arrow-' + (title ?? 'chart').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const label = title ? title + ': graph chart with ' + layout.nodes.length + ' nodes and ' + layout.edges.length + ' edges' : 'Graph chart with ' + layout.nodes.length + ' nodes and ' + layout.edges.length + ' edges';
  const toSvgPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / Math.max(1, rect.width) * GRAPH_WIDTH, y: (event.clientY - rect.top) / Math.max(1, rect.height) * GRAPH_HEIGHT };
  };
  const handlePointerDown = (event: ReactPointerEvent<SVGGElement>, node: PositionedNode) => {
    if (!config.draggable) return;
    event.preventDefault();
    event.stopPropagation();
    const point = toSvgPoint(event as unknown as ReactPointerEvent<SVGSVGElement>);
    setDraggingId(node.id);
    dragStart.current = { x: point.x, y: point.y, offsetX: point.x - node.x, offsetY: point.y - node.y };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!draggingId || !dragStart.current) return;
    const point = toSvgPoint(event);
    setDragged((current) => ({ ...current, [draggingId]: { x: point.x - dragStart.current!.offsetX, y: point.y - dragStart.current!.offsetY } }));
  };
  const stopDragging = () => { setDraggingId(null); dragStart.current = null; };
  return (
    <ChartContainer
      {...commonProps}
      title={title}
      subtitle={subtitle}
      height={height}
      config={config as unknown as import('./types.js').CoreChartConfig}
      className={className}
      style={style}
      chartType="graph"
      ariaLabel={commonProps.ariaLabel ?? label}
    >
      <svg className="sp-graph-chart__svg" viewBox={'0 0 ' + GRAPH_WIDTH + ' ' + GRAPH_HEIGHT} role="group" aria-label={commonProps.ariaLabel ?? label} onPointerMove={handlePointerMove} onPointerUp={stopDragging} onPointerLeave={() => { stopDragging(); setTracedId(null); }}>
        <defs>
          {layout.edges.filter((edge) => edge.directed).map((edge) => (
            <marker key={edge.id} id={markerPrefix + '-' + edge.id} markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={edge.color} />
            </marker>
          ))}
        </defs>
        <g className="sp-graph-chart__edges">
          {layout.edges.map((edge) => {
            const active = Boolean(config.traceOnHover && tracedId && traceSet.has(edge.source) && traceSet.has(edge.target));
            const dimmed = Boolean(config.traceOnHover && config.dimUnrelatedOnTrace && tracedId && !active);
            return (
              <g key={edge.id} className={dimmed ? 'sp-graph-chart__edge--trace-dimmed' : active ? 'sp-graph-chart__edge--trace-active' : undefined}>
                <line className="sp-graph-chart__edge" data-chart-point data-label={edge.label ?? edge.source + ' → ' + edge.target} data-value={edge.weight ?? 1} data-color={edge.color} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={edge.color} strokeWidth={edge.width} strokeDasharray={edge.dashed ? '6 4' : undefined} markerEnd={edge.directed ? 'url(#' + markerPrefix + '-' + edge.id + ')' : undefined} />
                {config.showEdgeLabels && edge.label && <text className="sp-graph-chart__edge-label" x={edge.labelX} y={edge.labelY} fontSize={config.edgeLabelSize} fill="var(--sp-chart-axis-text, #64748b)" textAnchor="middle">{edge.label}</text>}
              </g>
            );
          })}
        </g>
        <g className="sp-graph-chart__nodes">
          {layout.nodes.map((node) => {
            const active = Boolean(config.traceOnHover && traceSet.has(node.id));
            const dimmed = Boolean(config.traceOnHover && config.dimUnrelatedOnTrace && tracedId && !active);
            const nodeClass = ['sp-graph-chart__node', config.draggable ? 'sp-graph-chart__node--draggable' : '', draggingId === node.id ? 'sp-graph-chart__node--dragging' : '', dimmed ? 'sp-graph-chart__node--trace-dimmed' : '', active ? 'sp-graph-chart__node--trace-active' : ''].filter(Boolean).join(' ');
            const fill = config.nodeFill === 'none' ? 'none' : node.color;
            const stroke = node.borderColor ?? config.nodeBorderColor ?? (config.nodeFill === 'none' ? node.color : 'var(--sp-surface-0, #fff)');
            return (
              <g key={node.id} className={nodeClass} transform={'translate(' + node.x + ' ' + node.y + ')'} tabIndex={0} role="button" aria-label={node.group ? node.label + ', ' + node.group : node.label} data-chart-point data-label={node.label} data-value={node.id} data-series-name={node.group || undefined} data-color={node.color} onPointerDown={(event) => handlePointerDown(event, node)} onClick={() => { if (!dragStart.current) onNodeClick?.(node.id); }} onFocus={() => config.traceOnHover && setTracedId(node.id)} onMouseEnter={() => config.traceOnHover && setTracedId(node.id)} onMouseLeave={() => config.traceOnHover && setTracedId(null)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onNodeClick?.(node.id); } }}>
                <circle className="sp-graph-chart__node-circle" r={node.radius} fill={fill} stroke={stroke} strokeWidth={node.borderWidth ?? config.nodeBorderWidth ?? (config.nodeFill === 'none' ? 2.25 : 1.5)} />
                {config.showNodeLabels && node.label && <text className="sp-graph-chart__node-label" x="0" y={node.radius + config.nodeLabelSize + 3} fontSize={config.nodeLabelSize} fill="var(--sp-chart-axis-text, #64748b)" textAnchor="middle">{node.label}</text>}
              </g>
            );
          })}
        </g>
      </svg>
    </ChartContainer>
  );
}

export interface PerformanceGraphConfig extends GraphChartConfig {
  draggable?: boolean;
}

export interface PerformanceGraphProps extends Omit<GraphChartProps, 'config'> {
  config?: PerformanceGraphConfig;
}

export function PerformanceGraph({ config: inputConfig = {}, className, ...props }: PerformanceGraphProps) {
  const config: PerformanceGraphConfig = { ...inputConfig, draggable: inputConfig.draggable ?? true };
  return <GraphChart {...props} config={config} className={['sp-performance-graph', className].filter(Boolean).join(' ')} />;
}

export type { PositionedNode as SvgGraphNode, PositionedEdge as SvgGraphEdge };
