/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect -- auto-layout and the imperative editor API are intentionally co-located; controlled arrays synchronize through effects. */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import './VisualizationCharts.css';

export type DiagramShapeType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'ellipse'
  | 'diamond'
  | 'triangle'
  | 'hexagon'
  | 'parallelogram'
  | 'cylinder';

export interface DiagramShape {
  id: string;
  type: DiagramShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fontSize?: number;
  textColor?: string;
}

export type ConnectorRouteType = 'straight' | 'curve' | 'orthogonal';

export interface DiagramConnector {
  id: string;
  sourceId: string;
  targetId: string;
  endType?: 'none' | 'arrow';
  startType?: 'none' | 'arrow';
  routeType?: ConnectorRouteType;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  label?: string;
}

export interface DiagramEditorConfig {
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
  defaultFill?: string;
  defaultStroke?: string;
  connectorColor?: string;
  connectorWidth?: number;
  defaultEndType?: 'none' | 'arrow';
  minZoom?: number;
  maxZoom?: number;
  maxUndoSteps?: number;
}

export interface ShapeDefinition {
  type: string;
  label: string;
  path: (width: number, height: number) => string;
  icon: string;
}

export type DiagramLayoutDirection = 'top-bottom' | 'left-right';

export interface DiagramLayoutOptions {
  direction?: DiagramLayoutDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
  padding?: number;
}

export interface DiagramSelectionEvent {
  type: 'shape' | 'connector' | 'none';
  id: string | null;
}

export interface DiagramEditorProps {
  shapes?: DiagramShape[];
  connectors?: DiagramConnector[];
  config?: DiagramEditorConfig;
  customShapes?: ShapeDefinition[];
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  onShapesChange?: (shapes: DiagramShape[]) => void;
  onConnectorsChange?: (connectors: DiagramConnector[]) => void;
  onSelectionChange?: (event: DiagramSelectionEvent) => void;
}

export interface DiagramEditorRef {
  addShape: (shape: Partial<DiagramShape> & { type: DiagramShapeType }) => DiagramShape;
  addConnector: (connector: Partial<DiagramConnector> & Pick<DiagramConnector, 'sourceId' | 'targetId'>) => DiagramConnector;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
  resetView: () => void;
  autoLayout: (options?: DiagramLayoutOptions) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DEFAULT_CONFIG: Required<DiagramEditorConfig> = {
  height: 600,
  gridSize: 20,
  showGrid: true,
  snapToGrid: true,
  defaultFill: 'var(--sp-primary-subtle, #dbeafe)',
  defaultStroke: 'var(--sp-primary, #0f766e)',
  connectorColor: 'var(--sp-text-subtle, #64748b)',
  connectorWidth: 2,
  defaultEndType: 'arrow',
  minZoom: 0.25,
  maxZoom: 4,
  maxUndoSteps: 100,
};

const DEFAULT_WIDTH = 160;
const DEFAULT_HEIGHT = 80;
const MIN_WIDTH = 40;
const MIN_HEIGHT = 30;
const ARROW_SIZE = 10;
const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 700;

function rectPath(width: number, height: number): string { return 'M0,0 H' + width + ' V' + height + ' H0 Z'; }
function roundedRectPath(width: number, height: number): string {
  const radius = Math.min(10, width / 4, height / 4);
  return 'M' + radius + ',0 H' + (width - radius) + ' Q' + width + ',0 ' + width + ',' + radius + ' V' + (height - radius) + ' Q' + width + ',' + height + ' ' + (width - radius) + ',' + height + ' H' + radius + ' Q0,' + height + ' 0,' + (height - radius) + ' V' + radius + ' Q0,0 ' + radius + ',0 Z';
}
function ellipsePath(width: number, height: number): string {
  const rx = width / 2;
  const ry = height / 2;
  return 'M' + rx + ',0 A' + rx + ',' + ry + ' 0 1,1 ' + rx + ',' + height + ' A' + rx + ',' + ry + ' 0 1,1 ' + rx + ',0 Z';
}
function diamondPath(width: number, height: number): string { return 'M' + width / 2 + ',0 L' + width + ',' + height / 2 + ' L' + width / 2 + ',' + height + ' L0,' + height / 2 + ' Z'; }
function trianglePath(width: number, height: number): string { return 'M' + width / 2 + ',0 L' + width + ',' + height + ' L0,' + height + ' Z'; }
function hexagonPath(width: number, height: number): string {
  const inset = width * 0.25;
  return 'M' + inset + ',0 H' + (width - inset) + ' L' + width + ',' + height / 2 + ' L' + (width - inset) + ',' + height + ' H' + inset + ' L0,' + height / 2 + ' Z';
}
function parallelogramPath(width: number, height: number): string { const offset = width * 0.2; return 'M' + offset + ',0 H' + width + ' L' + (width - offset) + ',' + height + ' H0 Z'; }
function cylinderPath(width: number, height: number): string {
  const ry = Math.min(height * 0.15, 20);
  return 'M0,' + ry + ' A' + width / 2 + ',' + ry + ' 0 0,1 ' + width + ',' + ry + ' V' + (height - ry) + ' A' + width / 2 + ',' + ry + ' 0 0,1 0,' + (height - ry) + ' Z M0,' + ry + ' A' + width / 2 + ',' + ry + ' 0 0,0 ' + width + ',' + ry;
}

const BUILT_IN_SHAPES: ShapeDefinition[] = [
  { type: 'rectangle', label: 'Rectangle', path: rectPath, icon: 'M4,4 H20 V20 H4 Z' },
  { type: 'rounded-rectangle', label: 'Rounded Rectangle', path: roundedRectPath, icon: 'M7,4 H17 Q20,4 20,7 V17 Q20,20 17,20 H7 Q4,20 4,17 V7 Q4,4 7,4 Z' },
  { type: 'ellipse', label: 'Ellipse', path: ellipsePath, icon: 'M12,4 A8,8 0 1,1 12,20 A8,8 0 1,1 12,4 Z' },
  { type: 'diamond', label: 'Diamond', path: diamondPath, icon: 'M12,3 L21,12 L12,21 L3,12 Z' },
  { type: 'triangle', label: 'Triangle', path: trianglePath, icon: 'M12,4 L21,20 L3,20 Z' },
  { type: 'hexagon', label: 'Hexagon', path: hexagonPath, icon: 'M7,4 H17 L22,12 L17,20 H7 L2,12 Z' },
  { type: 'parallelogram', label: 'Parallelogram', path: parallelogramPath, icon: 'M8,5 H21 L16,19 H3 Z' },
  { type: 'cylinder', label: 'Cylinder', path: cylinderPath, icon: 'M5,7 A7,3 0 0,1 19,7 V17 A7,3 0 0,1 5,17 Z M5,7 A7,3 0 0,0 19,7' },
];

const DEFAULT_LAYOUT: Required<DiagramLayoutOptions> = { direction: 'top-bottom', nodeSpacing: 60, layerSpacing: 100, padding: 60 };

export function autoLayoutDiagram(shapes: DiagramShape[], connectors: DiagramConnector[], options?: DiagramLayoutOptions): DiagramShape[] {
  if (!shapes.length) return [];
  const opts = { ...DEFAULT_LAYOUT, ...options };
  const ids = new Set(shapes.map((shape) => shape.id));
  const shapeMap = new Map(shapes.map((shape) => [shape.id, shape]));
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  for (const id of ids) { children.set(id, []); parents.set(id, []); inDegree.set(id, 0); }
  for (const connector of connectors) {
    if (!ids.has(connector.sourceId) || !ids.has(connector.targetId) || connector.sourceId === connector.targetId) continue;
    children.get(connector.sourceId)!.push(connector.targetId);
    parents.get(connector.targetId)!.push(connector.sourceId);
    inDegree.set(connector.targetId, (inDegree.get(connector.targetId) ?? 0) + 1);
  }
  const layersById = new Map<string, number>();
  const queue = shapes.filter((shape) => inDegree.get(shape.id) === 0).map((shape) => shape.id);
  if (!queue.length) queue.push(shapes[0].id);
  for (const id of queue) layersById.set(id, 0);
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const currentLayer = layersById.get(current) ?? 0;
    for (const child of children.get(current) ?? []) {
      layersById.set(child, Math.max(layersById.get(child) ?? 0, currentLayer + 1));
      if ((parents.get(child) ?? []).every((parent) => layersById.has(parent)) && !queue.includes(child)) queue.push(child);
    }
  }
  for (const shape of shapes) if (!layersById.has(shape.id)) layersById.set(shape.id, 0);
  const maxLayer = Math.max(...layersById.values(), 0);
  const layers = Array.from({ length: maxLayer + 1 }, () => [] as string[]);
  for (const shape of shapes) layers[layersById.get(shape.id) ?? 0].push(shape.id);
  for (const layer of layers) layer.sort((a, b) => shapes.findIndex((shape) => shape.id === a) - shapes.findIndex((shape) => shape.id === b));
  for (let pass = 0; pass < 3; pass += 1) {
    const forward = pass < 2;
    const start = forward ? 1 : maxLayer - 1;
    const end = forward ? maxLayer + 1 : -1;
    const step = forward ? 1 : -1;
    for (let index = start; index !== end; index += step) {
      if (index < 0 || index > maxLayer) continue;
      const previous = index - step;
      const order = new Map(layers[previous].map((id, itemIndex) => [id, itemIndex]));
      const values = new Map(layers[index].map((id, itemIndex) => {
        const adjacent = (forward ? parents.get(id) : children.get(id))?.filter((parent) => order.has(parent)) ?? [];
        return [id, adjacent.length ? adjacent.reduce((total, parent) => total + (order.get(parent) ?? 0), 0) / adjacent.length : itemIndex] as [string, number];
      }));
      layers[index].sort((a, b) => (values.get(a) ?? 0) - (values.get(b) ?? 0));
    }
  }
  const isLeftRight = opts.direction === 'left-right';
  const result = shapes.map((shape) => ({ ...shape }));
  for (let layerIndex = 0; layerIndex <= maxLayer; layerIndex += 1) {
    layers[layerIndex].forEach((id, orderIndex) => {
      const shape = shapeMap.get(id)!;
      const crossOffset = orderIndex * ((isLeftRight ? shape.height : shape.width) + opts.nodeSpacing);
      const mainOffset = layerIndex * ((isLeftRight ? shape.width : shape.height) + opts.layerSpacing);
      const resultShape = result.find((candidate) => candidate.id === id)!;
      resultShape.x = isLeftRight ? opts.padding + mainOffset : opts.padding + crossOffset;
      resultShape.y = isLeftRight ? opts.padding + crossOffset : opts.padding + mainOffset;
    });
  }
  const extents = layers.map((layer) => {
    const layerShapes = layer.map((id) => result.find((shape) => shape.id === id)!);
    const positions = layerShapes.map((shape) => isLeftRight ? shape.y : shape.x);
    const sizes = layerShapes.map((shape) => isLeftRight ? shape.height : shape.width);
    return positions.length ? { start: Math.min(...positions), end: Math.max(...positions.map((position, index) => position + sizes[index])) } : { start: 0, end: 0 };
  });
  const widest = Math.max(...extents.map((extent) => extent.end - extent.start), 0);
  for (let layerIndex = 0; layerIndex <= maxLayer; layerIndex += 1) {
    const offset = (widest - (extents[layerIndex].end - extents[layerIndex].start)) / 2;
    for (const id of layers[layerIndex]) {
      const shape = result.find((candidate) => candidate.id === id)!;
      if (isLeftRight) shape.y += offset; else shape.x += offset;
    }
  }
  return result;
}

function getPath(type: string, customShapes: ShapeDefinition[]): (width: number, height: number) => string {
  return [...BUILT_IN_SHAPES, ...customShapes].find((definition) => definition.type === type)?.path ?? rectPath;
}

interface Point { x: number; y: number; }
interface Port extends Point { side: 'top' | 'right' | 'bottom' | 'left'; }
interface RenderedConnector extends DiagramConnector { path: string; hitPath: string; startArrow?: string; endArrow?: string; labelX: number; labelY: number; color: string; width: number; }

function ports(shape: DiagramShape): Port[] {
  return [
    { x: shape.x + shape.width / 2, y: shape.y, side: 'top' },
    { x: shape.x + shape.width, y: shape.y + shape.height / 2, side: 'right' },
    { x: shape.x + shape.width / 2, y: shape.y + shape.height, side: 'bottom' },
    { x: shape.x, y: shape.y + shape.height / 2, side: 'left' },
  ];
}
function nearestPort(shape: DiagramShape, target: Point): Port {
  return ports(shape).reduce((best, port) => Math.hypot(port.x - target.x, port.y - target.y) < Math.hypot(best.x - target.x, best.y - target.y) ? port : best);
}
function arrowHead(tip: Point, from: Point): string {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
  const spread = Math.PI / 7;
  const first = { x: tip.x - ARROW_SIZE * Math.cos(angle - spread), y: tip.y - ARROW_SIZE * Math.sin(angle - spread) };
  const second = { x: tip.x - ARROW_SIZE * Math.cos(angle + spread), y: tip.y - ARROW_SIZE * Math.sin(angle + spread) };
  return 'M' + tip.x + ',' + tip.y + ' L' + first.x + ',' + first.y + ' L' + second.x + ',' + second.y + ' Z';
}
function connectorGeometry(source: Port, target: Port, route: ConnectorRouteType): { path: string; labelX: number; labelY: number } {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  if (route === 'orthogonal') {
    const path = Math.abs(target.x - source.x) > Math.abs(target.y - source.y)
      ? 'M' + source.x + ',' + source.y + ' H' + midX + ' V' + target.y + ' H' + target.x
      : 'M' + source.x + ',' + source.y + ' V' + midY + ' H' + target.x + ' V' + target.y;
    return { path, labelX: midX, labelY: midY - 5 };
  }
  if (route === 'curve') {
    const controlX = (source.x + target.x) / 2;
    const controlY = (source.y + target.y) / 2 - Math.min(80, Math.abs(target.x - source.x) * 0.25 + 20);
    return { path: 'M' + source.x + ',' + source.y + ' Q' + controlX + ',' + controlY + ' ' + target.x + ',' + target.y, labelX: controlX, labelY: controlY };
  }
  return { path: 'M' + source.x + ',' + source.y + ' L' + target.x + ',' + target.y, labelX: midX, labelY: midY - 5 };
}

let generatedId = 0;
function createId(prefix: string): string { generatedId += 1; return prefix + '-' + generatedId; }

export const DiagramEditor = forwardRef<DiagramEditorRef, DiagramEditorProps>(function DiagramEditor({
  shapes: shapesProp,
  connectors: connectorsProp,
  config: inputConfig = {},
  customShapes = [],
  className,
  style,
  ariaLabel = 'Diagram editor',
  onShapesChange,
  onConnectorsChange,
  onSelectionChange,
}, ref) {
  const config = { ...DEFAULT_CONFIG, ...inputConfig };
  const [localShapes, setLocalShapes] = useState<DiagramShape[]>(shapesProp ?? []);
  const [localConnectors, setLocalConnectors] = useState<DiagramConnector[]>(connectorsProp ?? []);
  const shapes = shapesProp ?? localShapes;
  const connectors = connectorsProp ?? localConnectors;
  const [selected, setSelected] = useState<DiagramSelectionEvent>({ type: 'none', id: null });
  const [mode, setMode] = useState<string>('select');
  const [connectStart, setConnectStart] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const undoStack = useRef<Array<{ shapes: DiagramShape[]; connectors: DiagramConnector[] }>>([]);
  const redoStack = useRef<Array<{ shapes: DiagramShape[]; connectors: DiagramConnector[] }>>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const drag = useRef<{ kind: 'move' | 'resize' | 'pan'; id?: string; corner?: string; start: Point; origin?: DiagramShape; panOrigin?: Point } | null>(null);

  useEffect(() => { if (shapesProp !== undefined) setLocalShapes(shapesProp); }, [shapesProp]);
  useEffect(() => { if (connectorsProp !== undefined) setLocalConnectors(connectorsProp); }, [connectorsProp]);

  const commit = useCallback((nextShapes: DiagramShape[], nextConnectors: DiagramConnector[], history = true) => {
    if (history && config.maxUndoSteps > 0) {
      undoStack.current = [...undoStack.current.slice(-(config.maxUndoSteps - 1)), { shapes: shapes.map((shape) => ({ ...shape })), connectors: connectors.map((connector) => ({ ...connector })) }];
      redoStack.current = [];
      setCanUndo(true);
      setCanRedo(false);
    }
    if (shapesProp === undefined) setLocalShapes(nextShapes);
    if (connectorsProp === undefined) setLocalConnectors(nextConnectors);
    onShapesChange?.(nextShapes);
    onConnectorsChange?.(nextConnectors);
  }, [config.maxUndoSteps, connectors, connectorsProp, onConnectorsChange, onShapesChange, shapes, shapesProp]);

  const select = useCallback((next: DiagramSelectionEvent) => {
    setSelected(next);
    onSelectionChange?.(next);
  }, [onSelectionChange]);

  const canvasPoint = (event: ReactPointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / Math.max(1, rect.width) * VIEW_WIDTH, y: (event.clientY - rect.top) / Math.max(1, rect.height) * VIEW_HEIGHT };
  };
  const snap = (value: number) => config.snapToGrid ? Math.round(value / config.gridSize) * config.gridSize : value;
  const addShape = useCallback((partial: Partial<DiagramShape> & { type: DiagramShapeType }): DiagramShape => {
    const shape: DiagramShape = {
      ...partial,
      id: partial.id ?? createId('shape'),
      type: partial.type,
      x: partial.x ?? 100,
      y: partial.y ?? 100,
      width: partial.width ?? DEFAULT_WIDTH,
      height: partial.height ?? DEFAULT_HEIGHT,
      text: partial.text ?? 'New shape',
      fill: partial.fill ?? config.defaultFill,
      stroke: partial.stroke ?? config.defaultStroke,
    };
    commit([...shapes, shape], connectors);
    select({ type: 'shape', id: shape.id });
    return shape;
  }, [commit, config.defaultFill, config.defaultStroke, connectors, select, shapes]);
  const addConnector = useCallback((partial: Partial<DiagramConnector> & Pick<DiagramConnector, 'sourceId' | 'targetId'>): DiagramConnector => {
    const connector: DiagramConnector = { id: partial.id ?? createId('connector'), ...partial, endType: partial.endType ?? config.defaultEndType, startType: partial.startType ?? 'none', routeType: partial.routeType ?? 'straight', stroke: partial.stroke ?? config.connectorColor, strokeWidth: partial.strokeWidth ?? config.connectorWidth };
    commit(shapes, [...connectors, connector]);
    select({ type: 'connector', id: connector.id });
    return connector;
  }, [commit, config.connectorColor, config.connectorWidth, config.defaultEndType, connectors, select, shapes]);
  const deleteSelected = useCallback(() => {
    if (!selected.id) return;
    if (selected.type === 'shape') {
      commit(shapes.filter((shape) => shape.id !== selected.id), connectors.filter((connector) => connector.sourceId !== selected.id && connector.targetId !== selected.id));
    } else if (selected.type === 'connector') {
      commit(shapes, connectors.filter((connector) => connector.id !== selected.id));
    }
    select({ type: 'none', id: null });
  }, [commit, connectors, select, selected.id, selected.type, shapes]);
  const undo = useCallback(() => {
    const previous = undoStack.current.pop();
    if (!previous) return;
    redoStack.current.push({ shapes: shapes.map((shape) => ({ ...shape })), connectors: connectors.map((connector) => ({ ...connector })) });
    commit(previous.shapes, previous.connectors, false);
    setCanUndo(undoStack.current.length > 0);
    setCanRedo(true);
  }, [commit, connectors, shapes]);
  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push({ shapes: shapes.map((shape) => ({ ...shape })), connectors: connectors.map((connector) => ({ ...connector })) });
    commit(next.shapes, next.connectors, false);
    setCanUndo(true);
    setCanRedo(redoStack.current.length > 0);
  }, [commit, connectors, shapes]);
  const autoLayout = useCallback((options?: DiagramLayoutOptions) => commit(autoLayoutDiagram(shapes, connectors, options), connectors), [commit, connectors, shapes]);
  useImperativeHandle(ref, () => ({ addShape, addConnector, deleteSelected, undo, redo, resetView: () => { setZoom(1); setPan({ x: 0, y: 0 }); }, autoLayout, canUndo, canRedo }), [addConnector, addShape, autoLayout, canRedo, canUndo, deleteSelected, redo, undo]);

  const renderedConnectors = useMemo<RenderedConnector[]>(() => connectors.flatMap((connector) => {
    const sourceShape = shapes.find((shape) => shape.id === connector.sourceId);
    const targetShape = shapes.find((shape) => shape.id === connector.targetId);
    if (!sourceShape || !targetShape) return [];
    const source = nearestPort(sourceShape, { x: targetShape.x + targetShape.width / 2, y: targetShape.y + targetShape.height / 2 });
    const target = nearestPort(targetShape, { x: sourceShape.x + sourceShape.width / 2, y: sourceShape.y + sourceShape.height / 2 });
    const geometry = connectorGeometry(source, target, connector.routeType ?? 'straight');
    return [{ ...connector, ...geometry, hitPath: geometry.path, color: connector.stroke ?? config.connectorColor, width: connector.strokeWidth ?? config.connectorWidth, startArrow: connector.startType === 'arrow' ? arrowHead(source, target) : undefined, endArrow: connector.endType !== 'none' ? arrowHead(target, source) : undefined }];
  }), [config.connectorColor, config.connectorWidth, connectors, shapes]);

  const handleShapePointerDown = (event: ReactPointerEvent<SVGGElement>, shape: DiagramShape) => {
    event.stopPropagation();
    if (mode === 'connect') {
      if (connectStart && connectStart !== shape.id) {
        addConnector({ sourceId: connectStart, targetId: shape.id });
        setConnectStart(null);
      } else setConnectStart(shape.id);
      select({ type: 'shape', id: shape.id });
      return;
    }
    select({ type: 'shape', id: shape.id });
    if (mode !== 'select') return;
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left) / Math.max(1, rect.width) * VIEW_WIDTH, y: (event.clientY - rect.top) / Math.max(1, rect.height) * VIEW_HEIGHT };
    drag.current = { kind: 'move', id: shape.id, start: point, origin: { ...shape } };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const handleResizePointerDown = (event: ReactPointerEvent<SVGRectElement>, shape: DiagramShape, corner: string) => {
    event.stopPropagation();
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    drag.current = { kind: 'resize', id: shape.id, corner, start: { x: (event.clientX - rect.left) / Math.max(1, rect.width) * VIEW_WIDTH, y: (event.clientY - rect.top) / Math.max(1, rect.height) * VIEW_HEIGHT }, origin: { ...shape } };
  };
  const handleCanvasPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget && !(event.target as Element).hasAttribute('data-diagram-canvas')) return;
    if (mode !== 'select') {
      const point = canvasPoint(event);
      if (mode !== 'connect') addShape({ type: mode as DiagramShapeType, x: snap(point.x - DEFAULT_WIDTH / 2), y: snap(point.y - DEFAULT_HEIGHT / 2) });
      return;
    }
    select({ type: 'none', id: null });
    drag.current = { kind: 'pan', start: canvasPoint(event), panOrigin: pan };
  };
  const handleCanvasPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const state = drag.current;
    if (!state) return;
    const point = canvasPoint(event);
    if (state.kind === 'pan' && state.panOrigin) {
      setPan({ x: state.panOrigin.x + (point.x - state.start.x), y: state.panOrigin.y + (point.y - state.start.y) });
      return;
    }
    if (!state.id || !state.origin) return;
    if (state.kind === 'move') {
      const next = { ...state.origin, x: snap(state.origin.x + point.x - state.start.x), y: snap(state.origin.y + point.y - state.start.y) };
      commit(shapes.map((shape) => shape.id === state.id ? next : shape), connectors);
    } else {
      const deltaX = point.x - state.start.x;
      const deltaY = point.y - state.start.y;
      const next = { ...state.origin };
      if (state.corner?.includes('e')) next.width = Math.max(MIN_WIDTH, state.origin.width + deltaX);
      if (state.corner?.includes('s')) next.height = Math.max(MIN_HEIGHT, state.origin.height + deltaY);
      if (state.corner?.includes('w')) { next.x = state.origin.x + deltaX; next.width = Math.max(MIN_WIDTH, state.origin.width - deltaX); }
      if (state.corner?.includes('n')) { next.y = state.origin.y + deltaY; next.height = Math.max(MIN_HEIGHT, state.origin.height - deltaY); }
      commit(shapes.map((shape) => shape.id === state.id ? next : shape), connectors);
    }
  };
  const stopDrag = () => { drag.current = null; };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selected.id) { event.preventDefault(); deleteSelected(); }
    if (event.key === 'Escape') { setConnectStart(null); setEditingId(null); select({ type: 'none', id: null }); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); if (event.shiftKey) redo(); else undo(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); }
    if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'v') setMode('select');
    if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'c') setMode('connect');
  };
  const toolbarShapes = [...BUILT_IN_SHAPES, ...customShapes];
  const classNames = ['sp-diagram-editor', className].filter(Boolean).join(' ');
  return (
    <div className={classNames} style={{ ...style, '--sp-diagram-height': config.height + 'px' } as CSSProperties} tabIndex={0} onKeyDown={handleKeyDown} aria-label={ariaLabel}>
      <div className="sp-diagram-editor__toolbar" role="toolbar" aria-label="Diagram tools">
        <button type="button" aria-label="Select tool" aria-pressed={mode === 'select'} onClick={() => setMode('select')}>↖</button>
        <button type="button" aria-label="Connect tool" aria-pressed={mode === 'connect'} onClick={() => setMode('connect')}>↗</button>
        <button type="button" aria-label="Undo" disabled={!canUndo} onClick={undo}>↶</button>
        <button type="button" aria-label="Redo" disabled={!canRedo} onClick={redo}>↷</button>
        {toolbarShapes.map((definition) => <button key={definition.type} type="button" aria-label={'Add ' + definition.label} aria-pressed={mode === definition.type} onClick={() => setMode(definition.type)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={definition.icon} fill="none" stroke="currentColor" /></svg></button>)}
        <button type="button" aria-label="Delete selected" disabled={!selected.id} onClick={deleteSelected}>⌫</button>
        <button type="button" aria-label="Auto layout top to bottom" onClick={() => autoLayout()}>↓</button>
        <button type="button" aria-label="Auto layout left to right" onClick={() => autoLayout({ direction: 'left-right' })}>→</button>
        <button type="button" aria-label="Zoom out" onClick={() => setZoom((current) => Math.max(config.minZoom, current / 1.2))}>−</button>
        <button type="button" aria-label="Zoom in" onClick={() => setZoom((current) => Math.min(config.maxZoom, current * 1.2))}>+</button>
        <button type="button" aria-label="Reset view" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
      </div>
      <div className="sp-diagram-editor__canvas">
        <svg className="sp-diagram-editor__svg" viewBox={'0 0 ' + VIEW_WIDTH + ' ' + VIEW_HEIGHT} role="group" aria-label={ariaLabel} onPointerDown={handleCanvasPointerDown} onPointerMove={handleCanvasPointerMove} onPointerUp={stopDrag} onPointerLeave={stopDrag}>
          <defs><pattern id="sp-diagram-grid" width={config.gridSize} height={config.gridSize} patternUnits="userSpaceOnUse"><path d={'M ' + config.gridSize + ' 0 L 0 0 0 ' + config.gridSize} fill="none" stroke="var(--sp-border, #e2e8f0)" strokeWidth="0.6" /></pattern></defs>
          <rect data-diagram-canvas width={VIEW_WIDTH} height={VIEW_HEIGHT} fill={config.showGrid ? 'url(#sp-diagram-grid)' : 'var(--sp-surface-0, #fff)'} />
          <g transform={'translate(' + pan.x + ' ' + pan.y + ') scale(' + zoom + ')'}>
            {renderedConnectors.map((connector) => <g key={connector.id} className={selected.id === connector.id ? 'sp-diagram-editor__connector--selected' : undefined} onClick={(event) => { event.stopPropagation(); select({ type: 'connector', id: connector.id }); }}>
              <path className="sp-diagram-editor__connector-hit" d={connector.hitPath} tabIndex={0} role="button" aria-label={connector.label ? 'Connector: ' + connector.label : 'Connector'} />
              <path d={connector.path} fill="none" stroke={selected.id === connector.id ? 'var(--sp-primary, #0f766e)' : connector.color} strokeWidth={connector.width} strokeDasharray={connector.strokeDasharray || undefined} />
              {connector.startArrow && <path d={connector.startArrow} fill={connector.color} />}
              {connector.endArrow && <path d={connector.endArrow} fill={connector.color} />}
              {connector.label && <text x={connector.labelX} y={connector.labelY} textAnchor="middle" fill="var(--sp-text-subtle, #64748b)" fontSize="12">{connector.label}</text>}
            </g>)}
            {shapes.map((shape) => {
              const selectedShape = selected.type === 'shape' && selected.id === shape.id;
              const resizeHandles = selectedShape ? [{ key: 'nw', x: shape.x - 4, y: shape.y - 4 }, { key: 'ne', x: shape.x + shape.width - 4, y: shape.y - 4 }, { key: 'sw', x: shape.x - 4, y: shape.y + shape.height - 4 }, { key: 'se', x: shape.x + shape.width - 4, y: shape.y + shape.height - 4 }] : [];
              return <g key={shape.id} className="sp-diagram-editor__shape" transform={'translate(' + shape.x + ' ' + shape.y + ')'} tabIndex={0} role="button" aria-label={shape.text || shape.type} onPointerDown={(event) => handleShapePointerDown(event, shape)} onDoubleClick={(event) => { event.stopPropagation(); setEditingId(shape.id); }} onKeyDown={(event) => { if (event.key === 'Enter') setEditingId(shape.id); }}>
                <path d={getPath(shape.type, customShapes)(shape.width, shape.height)} fill={shape.fill ?? config.defaultFill} fillOpacity={shape.fillOpacity ?? 1} stroke={selectedShape ? 'var(--sp-primary, #0f766e)' : shape.stroke ?? config.defaultStroke} strokeWidth={selectedShape ? 2 : shape.strokeWidth ?? 1.5} strokeDasharray={shape.strokeDasharray || undefined} />
                <text x={shape.width / 2} y={shape.height / 2} textAnchor="middle" dominantBaseline="middle" fill={shape.textColor ?? 'var(--sp-text-color, #1e293b)'} fontSize={shape.fontSize ?? 14}>{shape.text}</text>
                {editingId === shape.id && <foreignObject x="8" y={shape.height / 2 - 18} width={shape.width - 16} height="36"><textarea autoFocus value={shape.text} aria-label="Edit shape text" onChange={(event) => commit(shapes.map((candidate) => candidate.id === shape.id ? { ...candidate, text: event.target.value } : candidate), connectors)} onBlur={() => setEditingId(null)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); setEditingId(null); } }} /></foreignObject>}
                {resizeHandles.map((handle) => <rect key={handle.key} className="sp-diagram-editor__resize-handle" x={handle.x - shape.x} y={handle.y - shape.y} width="8" height="8" fill="var(--sp-surface-0, #fff)" stroke="var(--sp-primary, #0f766e)" onPointerDown={(event) => handleResizePointerDown(event, shape, handle.key)} />)}
              </g>;
            })}
          </g>
        </svg>
      </div>
    </div>
  );
});

DiagramEditor.displayName = 'DiagramEditor';

export { BUILT_IN_SHAPES };
