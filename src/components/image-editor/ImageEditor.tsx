import './ImageEditor.css';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Button } from '../button/Button.js';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type ImageEditorTool = 'select' | 'text' | 'draw' | 'rect' | 'ellipse' | 'line' | 'arrow';
export type ImageEditorAspect = 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '2:3';
export type ImageEditorOutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';
export type ImageEditorSelectionShape = 'rectangle' | 'circle';
export type ImageEditorAnnotationKind = 'text' | 'path' | 'rect' | 'ellipse' | 'line' | 'arrow';
export type ImageEditorAdjustmentId = keyof ImageEditorAdjustments;

export interface ImageEditorPoint {
  readonly x: number;
  readonly y: number;
}

export interface ImageEditorAdjustments {
  readonly brightness: number;
  readonly contrast: number;
  readonly hue: number;
  readonly saturation: number;
  readonly exposure: number;
  readonly opacity: number;
  readonly blur: number;
}

export interface ImageEditorSelection {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ImageEditorAnnotation {
  readonly id: number;
  readonly kind: ImageEditorAnnotationKind;
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly points: readonly ImageEditorPoint[];
  readonly color: string;
  readonly size: number;
  readonly rotation: number;
  readonly strokeWidth: number;
  readonly opacity: number;
}

export interface ImageEditorChange {
  readonly dataUrl: string;
  readonly blob: Blob | null;
  readonly selection: ImageEditorSelection | null;
  readonly selectionShape: ImageEditorSelectionShape;
  readonly adjustments: ImageEditorAdjustments;
  readonly format: ImageEditorOutputFormat;
  readonly quality: number;
}

export interface ImageEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** Image URL or data URL to edit. A local image can also be uploaded from the toolbar. */
  src?: string;
  /** Accessible description of the source image. */
  alt?: string;
  /** Accessible label for the editing workspace. */
  ariaLabel?: string;
  /** Output MIME type used by crop and export. */
  format?: ImageEditorOutputFormat;
  /** Initial output quality from 0.1 to 1 for lossy formats. */
  initialQuality?: number;
  /** Controlled active tool. */
  tool?: ImageEditorTool;
  /** Called when the active tool changes. */
  onToolChange?: (tool: ImageEditorTool) => void;
  /** Controlled aspect ratio. */
  aspect?: ImageEditorAspect;
  /** Called when the aspect ratio changes. */
  onAspectChange?: (aspect: ImageEditorAspect) => void;
  /** Controlled zoom from 0.25 to 3. */
  zoom?: number;
  /** Called when zoom changes. */
  onZoomChange?: (zoom: number) => void;
  /** Controlled output quality from 0.1 to 1. */
  quality?: number;
  /** Called when output quality changes. */
  onQualityChange?: (quality: number) => void;
  /** Controlled image adjustments. */
  adjustments?: ImageEditorAdjustments;
  /** Called when an adjustment changes. */
  onAdjustmentsChange?: (adjustments: ImageEditorAdjustments) => void;
  /** Controlled image rotation in degrees. */
  rotation?: number;
  /** Called when image rotation changes. */
  onRotationChange?: (rotation: number) => void;
  /** Controlled horizontal flip state. */
  flipX?: boolean;
  /** Called when horizontal flip state changes. */
  onFlipXChange?: (flipX: boolean) => void;
  /** Controlled vertical flip state. */
  flipY?: boolean;
  /** Called when vertical flip state changes. */
  onFlipYChange?: (flipY: boolean) => void;
  /** Controlled crop selection in displayed workspace coordinates. */
  selection?: ImageEditorSelection | null;
  /** Called when the crop selection changes. */
  onSelectionChange?: (selection: ImageEditorSelection | null) => void;
  /** Controlled selection shape. */
  selectionShape?: ImageEditorSelectionShape;
  /** Called when the selection shape changes. */
  onSelectionShapeChange?: (shape: ImageEditorSelectionShape) => void;
  /** Controlled annotations. */
  annotations?: readonly ImageEditorAnnotation[];
  /** Called when annotations change. */
  onAnnotationsChange?: (annotations: readonly ImageEditorAnnotation[]) => void;
  /** Color used for new text and drawing annotations. */
  annotationColor?: string;
  /** Called with rendered output after an edit or export. */
  onChange?: (change: ImageEditorChange) => void;
  /** Alias for onChange for consumers mapping Angular's changed output directly. */
  onChanged?: (change: ImageEditorChange) => void;
  /** Called with rendered output before a crop is applied in place. */
  onCrop?: (change: ImageEditorChange) => void;
  /** Alias for onCrop for consumers mapping Angular's cropped output directly. */
  onCropped?: (change: ImageEditorChange) => void;
  /** Called when an image is uploaded. */
  onSourceChange?: (source: string, file: File) => void;
}

type DragMode =
  | 'create'
  | 'move'
  | 'draw'
  | 'graphic-create'
  | 'text'
  | 'text-rotate'
  | 'text-scale'
  | 'n'
  | 'e'
  | 's'
  | 'w'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw';

interface DragState {
  readonly mode: DragMode;
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  readonly initialSelection: ImageEditorSelection | null;
  readonly initialAnnotation: ImageEditorAnnotation | null;
  readonly annotationId: number | null;
}

interface ImageMetrics {
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly width: number;
  readonly height: number;
}

interface AdjustmentControl {
  readonly id: ImageEditorAdjustmentId;
  readonly labelKey:
    | 'brightness'
    | 'contrast'
    | 'hue'
    | 'saturation'
    | 'exposure'
    | 'opacity'
    | 'blur';
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string;
}

interface EditorSnapshot {
  readonly tool: ImageEditorTool;
  readonly aspect: ImageEditorAspect;
  readonly zoom: number;
  readonly quality: number;
  readonly adjustments: ImageEditorAdjustments;
  readonly rotation: number;
  readonly flipX: boolean;
  readonly flipY: boolean;
  readonly selectionShape: ImageEditorSelectionShape;
  readonly selection: ImageEditorSelection | null;
  readonly annotations: readonly ImageEditorAnnotation[];
}

interface UpdateOptions {
  readonly history?: boolean;
  readonly emit?: boolean;
}

const DEFAULT_ADJUSTMENTS: ImageEditorAdjustments = {
  brightness: 100,
  contrast: 100,
  hue: 0,
  saturation: 100,
  exposure: 0,
  opacity: 100,
  blur: 0,
};

const EMPTY_METRICS: ImageMetrics = {
  sourceWidth: 0,
  sourceHeight: 0,
  width: 0,
  height: 0,
};

const ADJUSTMENT_CONTROLS: readonly AdjustmentControl[] = [
  { id: 'brightness', labelKey: 'brightness', min: 0, max: 200, step: 1, unit: '%' },
  { id: 'contrast', labelKey: 'contrast', min: 0, max: 200, step: 1, unit: '%' },
  { id: 'hue', labelKey: 'hue', min: -180, max: 180, step: 1, unit: 'deg' },
  { id: 'saturation', labelKey: 'saturation', min: 0, max: 200, step: 1, unit: '%' },
  { id: 'exposure', labelKey: 'exposure', min: -100, max: 100, step: 1, unit: '' },
  { id: 'opacity', labelKey: 'opacity', min: 0, max: 100, step: 1, unit: '%' },
  { id: 'blur', labelKey: 'blur', min: 0, max: 20, step: 0.5, unit: 'px' },
];

const RESIZE_HANDLES: readonly DragMode[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const HISTORY_LIMIT = 60;
let annotationId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cloneSelection(selection: ImageEditorSelection | null): ImageEditorSelection | null {
  return selection ? { ...selection } : null;
}

function cloneAnnotations(
  annotations: readonly ImageEditorAnnotation[],
): readonly ImageEditorAnnotation[] {
  return annotations.map((annotation) => ({
    ...annotation,
    points: annotation.points.map((point) => ({ ...point })),
  }));
}

function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlledRef = useRef(controlledValue);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    controlledRef.current = controlledValue;
    onChangeRef.current = onChange;
  }, [controlledValue, onChange]);

  const setValue = useCallback((value: T) => {
    if (controlledRef.current === undefined) {
      setInternalValue(value);
    }
    onChangeRef.current?.(value);
  }, []);

  return [controlledValue === undefined ? internalValue : controlledValue, setValue];
}

function getAspectRatio(aspect: ImageEditorAspect, shape: ImageEditorSelectionShape): number | null {
  if (shape === 'circle') return 1;
  switch (aspect) {
    case '1:1':
      return 1;
    case '4:3':
      return 4 / 3;
    case '16:9':
      return 16 / 9;
    case '3:2':
      return 3 / 2;
    case '2:3':
      return 2 / 3;
    default:
      return null;
  }
}

export function ImageEditor({
  src = '',
  alt = 'Editable image',
  ariaLabel,
  format = 'image/jpeg',
  initialQuality = 0.92,
  tool: controlledTool,
  onToolChange,
  aspect: controlledAspect,
  onAspectChange,
  zoom: controlledZoom,
  onZoomChange,
  quality: controlledQuality,
  onQualityChange,
  adjustments: controlledAdjustments,
  onAdjustmentsChange,
  rotation: controlledRotation,
  onRotationChange,
  flipX: controlledFlipX,
  onFlipXChange,
  flipY: controlledFlipY,
  onFlipYChange,
  selection: controlledSelection,
  onSelectionChange,
  selectionShape: controlledSelectionShape,
  onSelectionShapeChange,
  annotations: controlledAnnotations,
  onAnnotationsChange,
  annotationColor = 'var(--sp-image-editor-annotation-color, var(--sp-surface-0, #fff))',
  onChange,
  onChanged,
  onCrop,
  onCropped,
  onSourceChange,
  className = '',
  style,
  ...rest
}: ImageEditorProps) {
  const { t } = useI18n();
  const instanceId = useId().replace(/:/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const historyRef = useRef<EditorSnapshot[]>([]);
  const historyIndexRef = useRef(-1);
  const uploadedUrlRef = useRef<string | null>(null);
  const readyRef = useRef(false);

  const [tool, setTool] = useControllableState(controlledTool, 'select', onToolChange);
  const [aspect, setAspect] = useControllableState(controlledAspect, 'free', onAspectChange);
  const [zoom, setZoom] = useControllableState(controlledZoom, 1, onZoomChange);
  const [quality, setQuality] = useControllableState(
    controlledQuality,
    clamp(initialQuality, 0.1, 1),
    onQualityChange,
  );
  const [adjustments, setAdjustments] = useControllableState(
    controlledAdjustments,
    DEFAULT_ADJUSTMENTS,
    onAdjustmentsChange,
  );
  const [rotation, setRotation] = useControllableState(controlledRotation, 0, onRotationChange);
  const [flipX, setFlipX] = useControllableState(controlledFlipX, false, onFlipXChange);
  const [flipY, setFlipY] = useControllableState(controlledFlipY, false, onFlipYChange);
  const [selection, setSelection] = useControllableState(
    controlledSelection,
    null,
    onSelectionChange,
  );
  const [selectionShape, setSelectionShape] = useControllableState(
    controlledSelectionShape,
    'rectangle' as ImageEditorSelectionShape,
    onSelectionShapeChange,
  );
  const [annotations, setAnnotations] = useControllableState(
    controlledAnnotations,
    [] as readonly ImageEditorAnnotation[],
    onAnnotationsChange,
  );
  const [annotationText, setAnnotationText] = useState('Note');
  const [adjustmentsOpen, setAdjustmentsOpen] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [metrics, setMetrics] = useState<ImageMetrics>(EMPTY_METRICS);
  const [, setHistoryVersion] = useState(0);
  const [sourceOverride, setSourceOverride] = useState<string | null>(null);

  const source = sourceOverride ?? src;
  const resolvedAriaLabel = ariaLabel ?? t('imageEditor');
  const zoomValue = clamp(zoom, 0.25, 3);
  const qualityValue = clamp(quality, 0.1, 1);
  const snapshot = useMemo<EditorSnapshot>(
    () => ({
      tool,
      aspect,
      zoom: zoomValue,
      quality: qualityValue,
      adjustments,
      rotation,
      flipX,
      flipY,
      selectionShape,
      selection,
      annotations,
    }),
    [adjustments, annotations, aspect, flipX, flipY, qualityValue, rotation, selection, selectionShape, tool, zoomValue],
  );
  const editorRef = useRef<EditorSnapshot>(snapshot);
  editorRef.current = snapshot;
  readyRef.current = imageReady;

  const adjustmentPanelId = `${instanceId}-adjustments`;
  const workspaceWidth = Math.max(0, Math.round(metrics.width * zoomValue));
  const workspaceHeight = Math.max(0, Math.round(metrics.height * zoomValue));

  const metricsForRotation = useCallback((nextRotation: number): ImageMetrics => {
    const image = imageRef.current;
    const sourceWidth = image?.naturalWidth ?? 0;
    const sourceHeight = image?.naturalHeight ?? 0;
    const rotated = Math.abs(nextRotation) % 180 !== 0;
    return {
      sourceWidth,
      sourceHeight,
      width: rotated ? sourceHeight : sourceWidth,
      height: rotated ? sourceWidth : sourceHeight,
    };
  }, []);

  const workspaceSize = useCallback((next: EditorSnapshot): ImageMetrics => {
    const nextMetrics = metricsForRotation(next.rotation);
    return {
      ...nextMetrics,
      width: Math.max(0, nextMetrics.width * clamp(next.zoom, 0.25, 3)),
      height: Math.max(0, nextMetrics.height * clamp(next.zoom, 0.25, 3)),
    };
  }, [metricsForRotation]);

  const normalizeSelection = useCallback(
    (value: ImageEditorSelection, next: EditorSnapshot): ImageEditorSelection => {
      const size = workspaceSize(next);
      const width = Math.max(1, Math.min(Math.abs(value.width), size.width));
      const height = Math.max(1, Math.min(Math.abs(value.height), size.height));
      return {
        x: clamp(value.x, 0, Math.max(0, size.width - width)),
        y: clamp(value.y, 0, Math.max(0, size.height - height)),
        width,
        height,
      };
    },
    [workspaceSize],
  );

  const selectionToImageSelection = useCallback(
    (value: ImageEditorSelection, next: EditorSnapshot): ImageEditorSelection => {
      const nextMetrics = metricsForRotation(next.rotation);
      const nextZoom = clamp(next.zoom, 0.25, 3);
      return {
        x: clamp(value.x / nextZoom, 0, nextMetrics.width),
        y: clamp(value.y / nextZoom, 0, nextMetrics.height),
        width: clamp(value.width / nextZoom, 1, nextMetrics.width),
        height: clamp(value.height / nextZoom, 1, nextMetrics.height),
      };
    },
    [metricsForRotation],
  );

  const resolveCanvasColor = useCallback((value: string): string => {
    if (!value.startsWith('var(') || typeof window === 'undefined') return value;
    const element = rootRef.current ?? document.documentElement;
    const resolved = getComputedStyle(element).getPropertyValue('--sp-image-editor-annotation-color').trim();
    if (resolved && !resolved.startsWith('var(')) return resolved;
    const computed = getComputedStyle(element);
    return computed.backgroundColor || computed.color || 'white';
  }, []);

  const imageFilter = useCallback((next: EditorSnapshot): string => {
    const nextAdjustments = next.adjustments;
    const brightness = clamp(nextAdjustments.brightness + nextAdjustments.exposure, 0, 300);
    return [
      `brightness(${brightness}%)`,
      `contrast(${nextAdjustments.contrast}%)`,
      `hue-rotate(${nextAdjustments.hue}deg)`,
      `saturate(${nextAdjustments.saturation}%)`,
      `blur(${nextAdjustments.blur}px)`,
    ].join(' ');
  }, []);

  const rectX = useCallback((annotation: ImageEditorAnnotation): number => {
    return annotation.width < 0 ? annotation.x + annotation.width : annotation.x;
  }, []);

  const rectY = useCallback((annotation: ImageEditorAnnotation): number => {
    return annotation.height < 0 ? annotation.y + annotation.height : annotation.y;
  }, []);

  const renderAnnotations = useCallback(
    (context: CanvasRenderingContext2D, next: EditorSnapshot): void => {
      for (const annotation of next.annotations) {
        context.save();
        context.globalAlpha = annotation.opacity;
        context.strokeStyle = resolveCanvasColor(annotation.color);
        context.fillStyle = resolveCanvasColor(annotation.color);
        context.lineWidth = annotation.strokeWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        if (annotation.kind === 'text') {
          context.translate(annotation.x, annotation.y);
          context.rotate((annotation.rotation * Math.PI) / 180);
          context.font = `600 ${annotation.size}px sans-serif`;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.shadowColor = 'rgba(0, 0, 0, 0.35)';
          context.shadowBlur = 3;
          context.fillText(annotation.text, 0, 0);
        } else if (annotation.kind === 'path') {
          const [first, ...rest] = annotation.points;
          if (first) {
            context.beginPath();
            context.moveTo(first.x, first.y);
            for (const point of rest) context.lineTo(point.x, point.y);
            context.stroke();
          }
        } else if (annotation.kind === 'rect') {
          context.strokeRect(
            rectX(annotation),
            rectY(annotation),
            Math.abs(annotation.width),
            Math.abs(annotation.height),
          );
        } else if (annotation.kind === 'ellipse') {
          context.beginPath();
          context.ellipse(
            annotation.x + annotation.width / 2,
            annotation.y + annotation.height / 2,
            Math.abs(annotation.width) / 2,
            Math.abs(annotation.height) / 2,
            0,
            0,
            Math.PI * 2,
          );
          context.stroke();
        } else {
          const endX = annotation.x + annotation.width;
          const endY = annotation.y + annotation.height;
          context.beginPath();
          context.moveTo(annotation.x, annotation.y);
          context.lineTo(endX, endY);
          context.stroke();
          if (annotation.kind === 'arrow') {
            const angle = Math.atan2(annotation.height, annotation.width);
            const headLength = Math.max(10, annotation.strokeWidth * 4);
            context.beginPath();
            context.moveTo(endX, endY);
            context.lineTo(
              endX - headLength * Math.cos(angle - Math.PI / 6),
              endY - headLength * Math.sin(angle - Math.PI / 6),
            );
            context.moveTo(endX, endY);
            context.lineTo(
              endX - headLength * Math.cos(angle + Math.PI / 6),
              endY - headLength * Math.sin(angle + Math.PI / 6),
            );
            context.stroke();
          }
        }
        context.restore();
      }
    },
    [rectX, rectY, resolveCanvasColor],
  );

  const drawTransformedImage = useCallback(
    (context: CanvasRenderingContext2D, nextMetrics: ImageMetrics, next: EditorSnapshot): void => {
      const image = imageRef.current;
      if (!image) return;
      context.save();
      context.filter = imageFilter(next);
      context.globalAlpha = clamp(next.adjustments.opacity, 0, 100) / 100;
      context.translate(nextMetrics.width / 2, nextMetrics.height / 2);
      context.rotate((next.rotation * Math.PI) / 180);
      context.scale(next.flipX ? -1 : 1, next.flipY ? -1 : 1);
      context.drawImage(
        image,
        -nextMetrics.sourceWidth / 2,
        -nextMetrics.sourceHeight / 2,
        nextMetrics.sourceWidth,
        nextMetrics.sourceHeight,
      );
      context.restore();
    },
    [imageFilter],
  );

  const renderOutput = useCallback(
    (next: EditorSnapshot): ImageEditorChange | null => {
      if (!readyRef.current || !imageRef.current) return null;
      const nextMetrics = metricsForRotation(next.rotation);
      const normalized = next.selection ? normalizeSelection(next.selection, next) : null;
      const outputSelection = normalized
        ? selectionToImageSelection(normalized, next)
        : null;
      const sx = outputSelection?.x ?? 0;
      const sy = outputSelection?.y ?? 0;
      const sw = outputSelection?.width ?? nextMetrics.width;
      const sh = outputSelection?.height ?? nextMetrics.height;
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = Math.max(1, Math.round(sw));
      outputCanvas.height = Math.max(1, Math.round(sh));
      const context = outputCanvas.getContext('2d');
      if (!context) return null;

      context.save();
      if (outputSelection && next.selectionShape === 'circle') {
        const radius = Math.min(outputCanvas.width, outputCanvas.height) / 2;
        context.beginPath();
        context.arc(outputCanvas.width / 2, outputCanvas.height / 2, radius, 0, Math.PI * 2);
        context.clip();
      }
      context.translate(-sx, -sy);
      drawTransformedImage(context, nextMetrics, next);
      renderAnnotations(context, next);
      context.restore();

      let dataUrl: string;
      try {
        dataUrl = outputCanvas.toDataURL(format, next.quality);
      } catch {
        return null;
      }
      return {
        dataUrl,
        blob: dataUrlToBlob(dataUrl, format),
        selection: outputSelection,
        selectionShape: outputSelection ? next.selectionShape : 'rectangle',
        adjustments: next.adjustments,
        format,
        quality: next.quality,
      };
    },
    [drawTransformedImage, format, metricsForRotation, normalizeSelection, renderAnnotations, selectionToImageSelection],
  );

  const emitChange = useCallback(
    (next: EditorSnapshot): void => {
      const change = renderOutput(next);
      if (!change) return;
      onChange?.(change);
      onChanged?.(change);
    },
    [onChange, onChanged, renderOutput],
  );

  const commitHistory = useCallback((next: EditorSnapshot): void => {
    if (!readyRef.current) return;
    const current = historyRef.current[historyIndexRef.current];
    if (current && JSON.stringify(current) === JSON.stringify(next)) return;
    const nextHistory = [...historyRef.current.slice(0, historyIndexRef.current + 1), next];
    historyRef.current = nextHistory.slice(-HISTORY_LIMIT);
    historyIndexRef.current = historyRef.current.length - 1;
    setHistoryVersion((version) => version + 1);
  }, []);

  const applySnapshot = useCallback(
    (next: EditorSnapshot): void => {
      const previous = editorRef.current;
      editorRef.current = next;
      if (previous.tool !== next.tool) setTool(next.tool);
      if (previous.aspect !== next.aspect) setAspect(next.aspect);
      if (previous.zoom !== next.zoom) setZoom(clamp(next.zoom, 0.25, 3));
      if (previous.quality !== next.quality) setQuality(clamp(next.quality, 0.1, 1));
      if (previous.adjustments !== next.adjustments) setAdjustments(next.adjustments);
      if (previous.rotation !== next.rotation) {
        setRotation(next.rotation);
        setMetrics(metricsForRotation(next.rotation));
      }
      if (previous.flipX !== next.flipX) setFlipX(next.flipX);
      if (previous.flipY !== next.flipY) setFlipY(next.flipY);
      if (previous.selectionShape !== next.selectionShape) setSelectionShape(next.selectionShape);
      if (previous.selection !== next.selection) setSelection(cloneSelection(next.selection));
      if (previous.annotations !== next.annotations) setAnnotations(cloneAnnotations(next.annotations));
    },
    [metricsForRotation, setAdjustments, setAnnotations, setAspect, setFlipX, setFlipY, setQuality, setRotation, setSelection, setSelectionShape, setTool, setZoom],
  );

  const updateEditor = useCallback(
    (patch: Partial<EditorSnapshot>, options: UpdateOptions = {}): EditorSnapshot => {
    const next = { ...editorRef.current, ...patch };
      applySnapshot(next);
      if (options.history !== false) commitHistory(next);
      if (options.emit) emitChange(next);
      return next;
    },
    [applySnapshot, commitHistory, emitChange],
  );

  const resetEditor = useCallback(
    (emit: boolean): EditorSnapshot => {
      const next: EditorSnapshot = {
        tool: 'select',
        aspect: 'free',
        zoom: 1,
        quality: clamp(initialQuality, 0.1, 1),
        adjustments: DEFAULT_ADJUSTMENTS,
        rotation: 0,
        flipX: false,
        flipY: false,
        selectionShape: 'rectangle',
        selection: null,
        annotations: [],
      };
      return updateEditor(next, { emit });
    },
    [initialQuality, updateEditor],
  );

  useEffect(() => {
    setSourceOverride(null);
    if (uploadedUrlRef.current && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(uploadedUrlRef.current);
      uploadedUrlRef.current = null;
    }
  }, [src]);

  useEffect(() => {
    readyRef.current = false;
    setImageReady(false);
    setMetrics(EMPTY_METRICS);
    const next = { ...editorRef.current, selection: null, annotations: [] };
    applySnapshot(next);
    historyRef.current = [];
    historyIndexRef.current = -1;
    setHistoryVersion((version) => version + 1);

    if (!source) {
      imageRef.current = null;
      return undefined;
    }

    const image = new Image();
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    const onLoad = () => {
      imageRef.current = image;
      const nextMetrics = metricsForRotation(0);
      setMetrics(nextMetrics);
      readyRef.current = true;
      setImageReady(true);
      historyRef.current = [editorRef.current];
      historyIndexRef.current = 0;
      setHistoryVersion((version) => version + 1);
    };
    const onError = () => {
      readyRef.current = false;
      setImageReady(false);
      setMetrics(EMPTY_METRICS);
    };
    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = source;

    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      if (imageRef.current === image) imageRef.current = null;
    };
  }, [applySnapshot, metricsForRotation, source]);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!imageReady || !image || !canvas || metrics.width <= 0 || metrics.height <= 0) return;

    const width = Math.max(1, Math.round(metrics.width * zoomValue));
    const height = Math.max(1, Math.round(metrics.height * zoomValue));
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.save();
    context.scale(zoomValue, zoomValue);
    drawTransformedImage(context, metrics, snapshot);
    context.restore();
  }, [drawTransformedImage, imageReady, metrics, snapshot, zoomValue]);

  useEffect(() => {
    return () => {
      if (uploadedUrlRef.current && typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(uploadedUrlRef.current);
    };
  }, []);

  const setAspectValue = useCallback(
    (nextAspect: ImageEditorAspect): void => {
      const nextShape = nextAspect === '1:1' ? editorRef.current.selectionShape : 'rectangle';
      const currentSelection = editorRef.current.selection;
      const size = workspaceSize(editorRef.current);
      const nextSelection = currentSelection && nextAspect !== 'free'
        ? applyAspect(currentSelection, nextAspect, nextShape, currentSelection.x, currentSelection.y, size.width, size.height)
        : currentSelection;
      updateEditor({ aspect: nextAspect, selectionShape: nextShape, selection: nextSelection }, { emit: true });
    },
    [updateEditor, workspaceSize],
  );

  const toggleCircleSelection = useCallback((): void => {
    const nextShape: ImageEditorSelectionShape =
      editorRef.current.selectionShape === 'circle' ? 'rectangle' : 'circle';
    const nextAspect = nextShape === 'circle' ? '1:1' : editorRef.current.aspect;
    const currentSelection = editorRef.current.selection;
    const size = workspaceSize(editorRef.current);
    const nextSelection = currentSelection
      ? applyAspect(currentSelection, nextAspect, nextShape, currentSelection.x, currentSelection.y, size.width, size.height)
      : null;
    updateEditor({ selectionShape: nextShape, aspect: nextAspect, selection: nextSelection }, { emit: true });
  }, [updateEditor, workspaceSize]);

  const changeAdjustment = useCallback(
    (id: ImageEditorAdjustmentId, value: number): void => {
      const nextAdjustments = { ...editorRef.current.adjustments, [id]: value };
      updateEditor({ adjustments: nextAdjustments }, { emit: true });
    },
    [updateEditor],
  );

  const zoomTo = useCallback(
    (nextZoom: number): void => {
      const next = { ...editorRef.current, zoom: clamp(nextZoom, 0.25, 3) };
      const nextSelection = editorRef.current.selection
        ? normalizeSelection(editorRef.current.selection, next)
        : null;
      updateEditor({ zoom: next.zoom, selection: nextSelection }, { emit: true });
    },
    [normalizeSelection, updateEditor],
  );

  const resetEdits = useCallback((): void => {
    if (!readyRef.current) return;
    resetEditor(true);
  }, [resetEditor]);

  const undo = useCallback((): void => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const next = historyRef.current[historyIndexRef.current];
    if (!next) return;
    applySnapshot(next);
    setHistoryVersion((version) => version + 1);
    emitChange(next);
  }, [applySnapshot, emitChange]);

  const redo = useCallback((): void => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const next = historyRef.current[historyIndexRef.current];
    if (!next) return;
    applySnapshot(next);
    setHistoryVersion((version) => version + 1);
    emitChange(next);
  }, [applySnapshot, emitChange]);

  const addAnnotation = useCallback(
    (x?: number, y?: number): void => {
      const text = annotationText.trim();
      if (!text || !readyRef.current) return;
      const nextMetrics = metricsForRotation(editorRef.current.rotation);
      const nextAnnotation: ImageEditorAnnotation = {
        id: ++annotationId,
        kind: 'text',
        text,
        x: x ?? nextMetrics.width / 2,
        y: y ?? nextMetrics.height / 2,
        width: 0,
        height: 0,
        points: [],
        color: annotationColor,
        size: Math.max(16, Math.round(nextMetrics.width / 32)),
        rotation: 0,
        strokeWidth: 0,
        opacity: 1,
      };
      updateEditor({ annotations: [...editorRef.current.annotations, nextAnnotation] }, { emit: true });
    },
    [annotationColor, annotationText, metricsForRotation, updateEditor],
  );

  const createGraphicAnnotation = useCallback(
    (nextTool: ImageEditorTool, point: ImageEditorPoint): ImageEditorAnnotation => {
      const kind = annotationKindForTool(nextTool);
      return {
        id: ++annotationId,
        kind,
        text: '',
        x: point.x,
        y: point.y,
        width: 1,
        height: 1,
        points: kind === 'path' ? [point] : [],
        color: annotationColor,
        size: 0,
        rotation: 0,
        strokeWidth: Math.max(2, Math.round(metricsForRotation(editorRef.current.rotation).width / 320)),
        opacity: 0.95,
      };
    },
    [annotationColor, metricsForRotation],
  );

  const pointerToImagePoint = useCallback((event: ReactPointerEvent): ImageEditorPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const nextZoom = clamp(editorRef.current.zoom, 0.25, 3);
    const x = (event.clientX - rect.left) / nextZoom;
    const y = (event.clientY - rect.top) / nextZoom;
    const nextMetrics = metricsForRotation(editorRef.current.rotation);
    if (x < 0 || y < 0 || x > nextMetrics.width || y > nextMetrics.height) return null;
    return { x, y };
  }, [metricsForRotation]);

  const pointerToCanvasPoint = useCallback((event: ReactPointerEvent): ImageEditorPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const next = editorRef.current;
    const size = workspaceSize(next);
    if (x < 0 || y < 0 || x > size.width || y > size.height) return null;
    return { x, y };
  }, [workspaceSize]);

  const capturePointer = useCallback((event: ReactPointerEvent): void => {
    viewportRef.current?.setPointerCapture?.(event.pointerId);
  }, []);

  const releasePointer = useCallback((event: ReactPointerEvent): void => {
    const viewport = viewportRef.current;
    if (viewport?.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  }, []);

  const onViewportPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!readyRef.current || event.button !== 0) return;
    const current = editorRef.current;
    if (isDrawingTool(current.tool)) {
      const point = pointerToImagePoint(event);
      if (!point) return;
      event.preventDefault();
      capturePointer(event);
      const annotation = createGraphicAnnotation(current.tool, point);
      updateEditor({ annotations: [...current.annotations, annotation] }, { history: false });
      dragRef.current = {
        mode: current.tool === 'draw' ? 'draw' : 'graphic-create',
        pointerId: event.pointerId,
        startX: point.x,
        startY: point.y,
        initialSelection: null,
        initialAnnotation: annotation,
        annotationId: annotation.id,
      };
      return;
    }

    const point = pointerToCanvasPoint(event);
    if (!point) return;
    if (current.tool === 'text') {
      addAnnotation(point.x / clamp(current.zoom, 0.25, 3), point.y / clamp(current.zoom, 0.25, 3));
      return;
    }

    event.preventDefault();
    capturePointer(event);
    const initial = normalizeSelection({ x: point.x, y: point.y, width: 1, height: 1 }, current);
    updateEditor({ selection: initial }, { history: false });
    dragRef.current = {
      mode: 'create',
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      initialSelection: initial,
      initialAnnotation: null,
      annotationId: null,
    };
  }, [addAnnotation, capturePointer, createGraphicAnnotation, normalizeSelection, pointerToCanvasPoint, pointerToImagePoint, updateEditor]);

  const onSelectionPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!readyRef.current || event.button !== 0) return;
    const point = pointerToCanvasPoint(event);
    const current = editorRef.current;
    if (!point || !current.selection) return;
    event.preventDefault();
    event.stopPropagation();
    capturePointer(event);
    dragRef.current = {
      mode: 'move',
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      initialSelection: current.selection,
      initialAnnotation: null,
      annotationId: null,
    };
  }, [capturePointer, pointerToCanvasPoint]);

  const onResizePointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>, handle: DragMode): void => {
    const point = pointerToCanvasPoint(event);
    const current = editorRef.current;
    if (!point || !current.selection) return;
    event.preventDefault();
    event.stopPropagation();
    capturePointer(event);
    dragRef.current = {
      mode: handle,
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      initialSelection: current.selection,
      initialAnnotation: null,
      annotationId: null,
    };
  }, [capturePointer, pointerToCanvasPoint]);

  const onAnnotationPointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>, annotation: ImageEditorAnnotation): void => {
    if (event.button !== 0) return;
    const point = pointerToImagePoint(event);
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    capturePointer(event);
    dragRef.current = {
      mode: 'text',
      pointerId: event.pointerId,
      startX: point.x - annotation.x,
      startY: point.y - annotation.y,
      initialSelection: null,
      initialAnnotation: annotation,
      annotationId: annotation.id,
    };
  }, [capturePointer, pointerToImagePoint]);

  const onAnnotationTransformPointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>, annotation: ImageEditorAnnotation, mode: 'text-rotate' | 'text-scale'): void => {
    if (event.button !== 0) return;
    const point = pointerToImagePoint(event);
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    capturePointer(event);
    dragRef.current = {
      mode,
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      initialSelection: null,
      initialAnnotation: annotation,
      annotationId: annotation.id,
    };
  }, [capturePointer, pointerToImagePoint]);

  const onViewportPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = ['text', 'text-rotate', 'text-scale', 'draw', 'graphic-create'].includes(drag.mode)
      ? pointerToImagePoint(event)
      : pointerToCanvasPoint(event);
    if (!point) return;
    event.preventDefault();
    const current = editorRef.current;

    if (drag.mode === 'text' && drag.annotationId !== null) {
      const nextMetrics = metricsForRotation(current.rotation);
      updateEditor({
        annotations: current.annotations.map((item) => item.id === drag.annotationId
          ? { ...item, x: clamp(point.x - drag.startX, 0, nextMetrics.width), y: clamp(point.y - drag.startY, 0, nextMetrics.height) }
          : item),
      }, { history: false });
      return;
    }
    if (drag.mode === 'text-rotate' && drag.initialAnnotation && drag.annotationId !== null) {
      const startAngle = angleBetween(drag.initialAnnotation.x, drag.initialAnnotation.y, drag.startX, drag.startY);
      const currentAngle = angleBetween(drag.initialAnnotation.x, drag.initialAnnotation.y, point.x, point.y);
      const nextRotation = drag.initialAnnotation.rotation + currentAngle - startAngle;
      updateEditor({ annotations: current.annotations.map((item) => item.id === drag.annotationId ? { ...item, rotation: nextRotation } : item) }, { history: false });
      return;
    }
    if (drag.mode === 'text-scale' && drag.initialAnnotation && drag.annotationId !== null) {
      const startDistance = distanceBetween(drag.initialAnnotation.x, drag.initialAnnotation.y, drag.startX, drag.startY);
      const currentDistance = distanceBetween(drag.initialAnnotation.x, drag.initialAnnotation.y, point.x, point.y);
      const scale = startDistance <= 0 ? 1 : currentDistance / startDistance;
      const size = clamp(drag.initialAnnotation.size * scale, 8, Math.max(256, metricsForRotation(current.rotation).width));
      updateEditor({ annotations: current.annotations.map((item) => item.id === drag.annotationId ? { ...item, size } : item) }, { history: false });
      return;
    }
    if (drag.mode === 'draw' && drag.annotationId !== null) {
      updateEditor({ annotations: current.annotations.map((item) => item.id === drag.annotationId && item.kind === 'path' ? { ...item, points: [...item.points, point] } : item) }, { history: false });
      return;
    }
    if (drag.mode === 'graphic-create' && drag.annotationId !== null) {
      updateEditor({ annotations: current.annotations.map((item) => item.id === drag.annotationId ? { ...item, width: point.x - drag.startX, height: point.y - drag.startY } : item) }, { history: false });
      return;
    }
    if (drag.mode === 'create') {
      const size = workspaceSize(current);
      updateEditor({ selection: selectionFromCorners(drag.startX, drag.startY, point.x, point.y, current, size.width, size.height) }, { history: false });
      return;
    }
    if (drag.mode === 'move' && drag.initialSelection) {
      const next = { ...drag.initialSelection, x: drag.initialSelection.x + point.x - drag.startX, y: drag.initialSelection.y + point.y - drag.startY };
      updateEditor({ selection: normalizeSelection(next, current) }, { history: false });
      return;
    }
    if (drag.initialSelection) {
      let left = drag.initialSelection.x;
      let top = drag.initialSelection.y;
      let right = drag.initialSelection.x + drag.initialSelection.width;
      let bottom = drag.initialSelection.y + drag.initialSelection.height;
      if (drag.mode.includes('w')) left = point.x;
      if (drag.mode.includes('e')) right = point.x;
      if (drag.mode.includes('n')) top = point.y;
      if (drag.mode.includes('s')) bottom = point.y;
      const size = workspaceSize(current);
      updateEditor({ selection: selectionFromCorners(left, top, right, bottom, current, size.width, size.height) }, { history: false });
    }
  }, [metricsForRotation, normalizeSelection, pointerToCanvasPoint, pointerToImagePoint, updateEditor, workspaceSize]);

  const onViewportPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    releasePointer(event);
    dragRef.current = null;
    commitHistory(editorRef.current);
    emitChange(editorRef.current);
  }, [commitHistory, emitChange, releasePointer]);

  const onViewportKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.metaKey || event.ctrlKey) {
      if (event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
        return;
      }
      if (event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }
    }
    const current = editorRef.current;
    if (!current.selection) return;
    const step = event.shiftKey ? 10 : 1;
    const movement: Record<string, readonly [number, number]> = {
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    const nextSelection = normalizeSelection({ ...current.selection, x: current.selection.x + delta[0], y: current.selection.y + delta[1] }, current);
    updateEditor({ selection: nextSelection }, { emit: true });
  }, [normalizeSelection, redo, undo, updateEditor]);

  const handleCrop = useCallback((): void => {
    const result = renderOutput(editorRef.current);
    if (!result) return;
    onCrop?.(result);
    onCropped?.(result);
    setSourceOverride(result.dataUrl);
    updateEditor({ selection: null, annotations: [], rotation: 0, flipX: false, flipY: false, adjustments: DEFAULT_ADJUSTMENTS }, { history: false });
  }, [onCrop, onCropped, renderOutput, updateEditor]);

  const handleDownload = useCallback((): void => {
    const result = renderOutput(editorRef.current);
    if (!result) return;
    const anchor = document.createElement('a');
    anchor.href = result.dataUrl;
    anchor.download = `image-edit.${extensionForFormat(result.format)}`;
    anchor.click();
    onChange?.(result);
    onChanged?.(result);
  }, [onChange, onChanged, renderOutput]);

  const handleFileSelected = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (uploadedUrlRef.current && typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(uploadedUrlRef.current);
    if (typeof URL.createObjectURL !== 'function') return;
    const nextSource = URL.createObjectURL(file);
    uploadedUrlRef.current = nextSource;
    updateEditor({ adjustments: DEFAULT_ADJUSTMENTS }, { history: false });
    setSourceOverride(nextSource);
    onSourceChange?.(nextSource, file);
    event.target.value = '';
  }, [onSourceChange, updateEditor]);

  const rootClasses = ['sp-image-editor', className].filter(Boolean).join(' ');
  const zoomPercent = Math.round(zoomValue * 100);
  const qualityPercent = Math.round(qualityValue * 100);
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current >= 0 && historyIndexRef.current < historyRef.current.length - 1;

  return (
    <div ref={rootRef} className={rootClasses} style={style} {...rest}>
      <div className="sp-image-editor__toolbar" role="toolbar" aria-label={t('imageEditorTools')}>
        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('file')}>
          <label className="sp-image-editor__action sp-image-editor__upload">
            <Icon name="upload" size={15} />
            <span>{t('upload')}</span>
            <input type="file" accept="image/*" onChange={handleFileSelected} aria-label={t('uploadImage')} />
          </label>
          <Button variant="outline" size="sm" iconLeft="undo" onClick={resetEdits} disabled={!imageReady} title={t('resetEdits')}>
            {t('reset')}
          </Button>
        </div>

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('history')}>
          <Button variant="ghost" size="sm" iconOnly iconLeft="undo" onClick={undo} disabled={!canUndo} aria-label={t('undo')} title={t('undo')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="redo" onClick={redo} disabled={!canRedo} aria-label={t('redo')} title={t('redo')} />
        </div>

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('selection')}>
          <Button variant="ghost" size="sm" iconOnly iconLeft="square" active={tool === 'select'} onClick={() => updateEditor({ tool: 'select' }, { history: false })} aria-pressed={tool === 'select'} aria-label={t('selection')} title={t('selection')} />
          <Button variant="ghost" size="sm" active={aspect === '1:1'} onClick={() => setAspectValue(aspect === '1:1' ? 'free' : '1:1')} aria-pressed={aspect === '1:1'} aria-label={t('squareSelection')} title={t('squareSelection')}>1:1</Button>
          <Button variant="ghost" size="sm" iconOnly iconLeft="circle" active={selectionShape === 'circle'} onClick={toggleCircleSelection} aria-pressed={selectionShape === 'circle'} aria-label={t('circleSelection')} title={t('circleSelection')} />
          <label className="sp-image-editor__select-label">
            <Icon name="ratio" size={15} />
            <span className="sp-image-editor__sr">{t('aspectRatio')}</span>
            <select value={aspect} onChange={(event) => setAspectValue(event.target.value as ImageEditorAspect)} aria-label={t('aspectRatio')}>
              <option value="free">{t('free')}</option>
              <option value="1:1">{t('square')}</option>
              <option value="4:3">4:3</option>
              <option value="16:9">16:9</option>
              <option value="3:2">3:2</option>
              <option value="2:3">2:3</option>
            </select>
          </label>
        </div>

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('annotations')}>
          <Button variant="ghost" size="sm" iconOnly iconLeft="text-cursor-input" active={tool === 'text'} onClick={() => updateEditor({ tool: 'text' }, { history: false })} aria-pressed={tool === 'text'} aria-label={t('textAnnotation')} title={t('textAnnotation')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="highlighter" active={tool === 'draw'} onClick={() => updateEditor({ tool: 'draw' }, { history: false })} aria-pressed={tool === 'draw'} aria-label={t('draw')} title={t('draw')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="square" active={tool === 'rect'} onClick={() => updateEditor({ tool: 'rect' }, { history: false })} aria-pressed={tool === 'rect'} aria-label={t('rectangleAnnotation')} title={t('rectangleAnnotation')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="circle" active={tool === 'ellipse'} onClick={() => updateEditor({ tool: 'ellipse' }, { history: false })} aria-pressed={tool === 'ellipse'} aria-label={t('ellipseAnnotation')} title={t('ellipseAnnotation')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="minus" active={tool === 'line'} onClick={() => updateEditor({ tool: 'line' }, { history: false })} aria-pressed={tool === 'line'} aria-label={t('lineAnnotation')} title={t('lineAnnotation')} />
          <Button variant="ghost" size="sm" active={tool === 'arrow'} onClick={() => updateEditor({ tool: 'arrow' }, { history: false })} aria-pressed={tool === 'arrow'} aria-label={t('arrowAnnotation')} title={t('arrowAnnotation')}>-&gt;</Button>
          <label className="sp-image-editor__text-field">
            <Icon name="text-cursor-input" size={15} />
            <span className="sp-image-editor__sr">{t('annotationText')}</span>
            <input type="text" value={annotationText} onChange={(event) => setAnnotationText(event.target.value)} placeholder={t('annotation')} aria-label={t('annotationText')} />
          </label>
          <Button variant="ghost" size="sm" iconOnly iconLeft="check" onClick={() => addAnnotation()} aria-label={t('addAnnotation')} title={t('addAnnotation')} />
        </div>

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('zoom')}>
          <Button variant="ghost" size="sm" iconOnly iconLeft="zoom-out" onClick={() => zoomTo(zoomValue - 0.1)} aria-label={t('zoomOut')} title={t('zoomOut')} />
          <input className="sp-image-editor__range sp-image-editor__range--zoom" type="range" min="25" max="300" step="5" value={zoomPercent} onChange={(event) => zoomTo(Number(event.target.value) / 100)} aria-label={t('zoom')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="zoom-in" onClick={() => zoomTo(zoomValue + 0.1)} aria-label={t('zoomIn')} title={t('zoomIn')} />
          <span className="sp-image-editor__value" aria-live="polite">{zoomPercent}%</span>
        </div>

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('transform')}>
          <Button variant="ghost" size="sm" iconOnly iconLeft="rotate-ccw" onClick={() => updateEditor({ rotation: (rotation + 270) % 360, selection: null }, { emit: true })} aria-label={t('rotateLeft')} title={t('rotateLeft')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="flip-horizontal" onClick={() => updateEditor({ flipX: !flipX }, { emit: true })} aria-label={t('flipHorizontally')} title={t('flipHorizontally')} />
          <Button variant="ghost" size="sm" iconOnly iconLeft="flip-vertical" onClick={() => updateEditor({ flipY: !flipY }, { emit: true })} aria-label={t('flipVertically')} title={t('flipVertically')} />
        </div>

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('adjustments')}>
          <Button variant="ghost" size="sm" iconLeft="sliders-horizontal" active={adjustmentsOpen} onClick={() => setAdjustmentsOpen((open) => !open)} aria-label={t('imageAdjustments')} aria-pressed={adjustmentsOpen} aria-expanded={adjustmentsOpen} aria-controls={adjustmentPanelId} title={t('imageAdjustments')}>
            {t('adjust')}
          </Button>
          {adjustmentsOpen && (
            <div id={adjustmentPanelId} className="sp-image-editor__adjustments" role="group" aria-label={t('imageAdjustments')}>
              {ADJUSTMENT_CONTROLS.map((control) => {
                const label = t(control.labelKey);
                const value = adjustments[control.id];
                return (
                  <label className="sp-image-editor__adjustment" key={control.id}>
                    <span>{label}</span>
                    <input className="sp-image-editor__range sp-image-editor__range--adjustment" type="range" min={control.min} max={control.max} step={control.step} value={value} onChange={(event) => changeAdjustment(control.id, Number(event.target.value))} aria-label={label} />
                    <span className="sp-image-editor__adjustment-value">{value}{control.unit}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <span className="sp-image-editor__spacer" />

        <div className="sp-image-editor__toolbar-group" role="group" aria-label={t('output')}>
          <label className="sp-image-editor__quality">
            <span>{t('quality')}</span>
            <input className="sp-image-editor__range" type="range" min="10" max="100" step="1" value={qualityPercent} onChange={(event) => updateEditor({ quality: clamp(Number(event.target.value) / 100, 0.1, 1) }, { emit: true })} aria-label={t('outputQuality')} />
            <span className="sp-image-editor__value">{qualityPercent}%</span>
          </label>
          <Button variant="outline" size="sm" iconLeft="save" onClick={handleCrop}>{t('crop')}</Button>
          <Button variant="outline" size="sm" iconLeft="download" onClick={handleDownload}>{t('export')}</Button>
        </div>
      </div>

      <div className="sp-image-editor__body">
        <div ref={viewportRef} className={`sp-image-editor__viewport${!imageReady ? ' sp-image-editor__viewport--empty' : ''}`} onPointerDown={onViewportPointerDown} onPointerMove={onViewportPointerMove} onPointerUp={onViewportPointerUp} onPointerCancel={onViewportPointerUp} onKeyDown={onViewportKeyDown} tabIndex={0} role="application" aria-label={resolvedAriaLabel} aria-describedby={`${instanceId}-alt`}>
          {imageReady && metrics.width > 0 && metrics.height > 0 ? (
            <div className="sp-image-editor__workspace" style={{ width: workspaceWidth, height: workspaceHeight }}>
              <canvas ref={canvasRef} className="sp-image-editor__canvas" width={workspaceWidth} height={workspaceHeight} style={{ width: workspaceWidth, height: workspaceHeight }} aria-hidden="true" />
              <svg className="sp-image-editor__annotation-svg" width={workspaceWidth} height={workspaceHeight} viewBox={`0 0 ${metrics.width} ${metrics.height}`} aria-hidden="true">
                <defs>
                  <marker id={`${instanceId}-arrowhead`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                    <path d="M 0 0 L 8 4 L 0 8 z" fill="context-stroke" />
                  </marker>
                </defs>
                {annotations.map((annotation) => {
                  const stroke = annotation.color;
                  if (annotation.kind === 'path') return <polyline key={annotation.id} className="sp-image-editor__svg-mark" points={pointsAttribute(annotation.points)} stroke={stroke} strokeWidth={annotation.strokeWidth} opacity={annotation.opacity} />;
                  if (annotation.kind === 'rect') return <rect key={annotation.id} className="sp-image-editor__svg-mark" x={rectX(annotation)} y={rectY(annotation)} width={Math.abs(annotation.width)} height={Math.abs(annotation.height)} stroke={stroke} strokeWidth={annotation.strokeWidth} opacity={annotation.opacity} />;
                  if (annotation.kind === 'ellipse') return <ellipse key={annotation.id} className="sp-image-editor__svg-mark" cx={annotation.x + annotation.width / 2} cy={annotation.y + annotation.height / 2} rx={Math.abs(annotation.width) / 2} ry={Math.abs(annotation.height) / 2} stroke={stroke} strokeWidth={annotation.strokeWidth} opacity={annotation.opacity} />;
                  if (annotation.kind === 'line' || annotation.kind === 'arrow') return <line key={annotation.id} className="sp-image-editor__svg-mark" x1={annotation.x} y1={annotation.y} x2={annotation.x + annotation.width} y2={annotation.y + annotation.height} stroke={stroke} strokeWidth={annotation.strokeWidth} opacity={annotation.opacity} markerEnd={annotation.kind === 'arrow' ? `url(#${instanceId}-arrowhead)` : undefined} />;
                  return null;
                })}
              </svg>
              {annotations.map((annotation) => annotation.kind === 'text' ? (
                <div key={annotation.id} className="sp-image-editor__annotation-wrap" style={{ left: annotation.x * zoomValue, top: annotation.y * zoomValue, transform: `translate(-50%, -50%) rotate(${annotation.rotation}deg)` }}>
                  <button className="sp-image-editor__annotation" type="button" style={{ color: annotation.color, fontSize: annotation.size * zoomValue }} onPointerDown={(event) => onAnnotationPointerDown(event, annotation)} aria-label={`${t('moveAnnotation')}: ${annotation.text}`}>
                    {annotation.text}
                  </button>
                  <button className="sp-image-editor__annotation-control sp-image-editor__annotation-control--rotate" type="button" onPointerDown={(event) => onAnnotationTransformPointerDown(event, annotation, 'text-rotate')} aria-label={`${t('rotateAnnotation')}: ${annotation.text}`} title={t('rotateAnnotation')}><span aria-hidden="true" /></button>
                  <button className="sp-image-editor__annotation-control sp-image-editor__annotation-control--scale" type="button" onPointerDown={(event) => onAnnotationTransformPointerDown(event, annotation, 'text-scale')} aria-label={`${t('scaleAnnotation')}: ${annotation.text}`} title={t('scaleAnnotation')}><span aria-hidden="true" /></button>
                </div>
              ) : null)}
              {selection && (
                <div className={`sp-image-editor__selection${selectionShape === 'circle' ? ' sp-image-editor__selection--circle' : ''}`} style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }} onPointerDown={onSelectionPointerDown} role="group" aria-label={t('cropSelection')}>
                  <span className="sp-image-editor__gridline sp-image-editor__gridline--v1" />
                  <span className="sp-image-editor__gridline sp-image-editor__gridline--v2" />
                  {RESIZE_HANDLES.map((handle) => <button key={handle} className={`sp-image-editor__handle sp-image-editor__handle--${handle}`} type="button" onPointerDown={(event) => onResizePointerDown(event, handle)} aria-label={`${t('resizeSelection')} (${handle})`} />)}
                </div>
              )}
            </div>
          ) : (
            <div className="sp-image-editor__empty">
              <Icon name="image" size={32} />
              <span>{t('loadImageToStart')}</span>
            </div>
          )}
        </div>
        <div className="sp-image-editor__meta" aria-live="polite">
          {selection ? <><span>{Math.round(selection.width / zoomValue)} x {Math.round(selection.height / zoomValue)}px</span><span>x {Math.round(selection.x / zoomValue)}, y {Math.round(selection.y / zoomValue)}</span></> : <span>{t('dragToCreateSelection')}</span>}
        </div>
      </div>
      <span id={`${instanceId}-alt`} className="sp-image-editor__sr">{alt}</span>
    </div>
  );
}

function applyAspect(
  selection: ImageEditorSelection,
  aspect: ImageEditorAspect,
  shape: ImageEditorSelectionShape,
  anchorX: number,
  anchorY: number,
  widthLimit: number,
  heightLimit: number,
): ImageEditorSelection {
  const ratio = getAspectRatio(aspect, shape);
  if (!ratio) return selection;
  const signX = selection.x + selection.width >= anchorX ? 1 : -1;
  const signY = selection.y + selection.height >= anchorY ? 1 : -1;
  let width = Math.max(selection.width, 1);
  let height = Math.max(selection.height, 1);
  if (width / height > ratio) height = width / ratio;
  else width = height * ratio;
  return normalizeSelectionStatic({
    x: signX > 0 ? anchorX : anchorX - width,
    y: signY > 0 ? anchorY : anchorY - height,
    width,
    height,
  }, widthLimit, heightLimit);
}

function selectionFromCorners(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  next: EditorSnapshot,
  widthLimit: number,
  heightLimit: number,
): ImageEditorSelection {
  const ratio = getAspectRatio(next.aspect, next.selectionShape);
  let width = Math.max(Math.abs(x2 - x1), 1);
  let height = Math.max(Math.abs(y2 - y1), 1);
  if (ratio) {
    if (width / height > ratio) height = width / ratio;
    else width = height * ratio;
  }
  return normalizeSelectionStatic({ x: x2 >= x1 ? x1 : x1 - width, y: y2 >= y1 ? y1 : y1 - height, width, height }, widthLimit, heightLimit);
}

function normalizeSelectionStatic(selection: ImageEditorSelection, widthLimit: number, heightLimit: number): ImageEditorSelection {
  const width = Math.max(1, Math.min(Math.abs(selection.width), widthLimit || Number.MAX_SAFE_INTEGER));
  const height = Math.max(1, Math.min(Math.abs(selection.height), heightLimit || Number.MAX_SAFE_INTEGER));
  return { x: clamp(selection.x, 0, Math.max(0, widthLimit - width)), y: clamp(selection.y, 0, Math.max(0, heightLimit - height)), width, height };
}

function pointsAttribute(points: readonly ImageEditorPoint[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function isDrawingTool(tool: ImageEditorTool): boolean {
  return tool === 'draw' || tool === 'rect' || tool === 'ellipse' || tool === 'line' || tool === 'arrow';
}

function annotationKindForTool(tool: ImageEditorTool): ImageEditorAnnotationKind {
  if (tool === 'draw') return 'path';
  if (tool === 'rect' || tool === 'ellipse' || tool === 'line' || tool === 'arrow') return tool;
  return 'path';
}

function angleBetween(centerX: number, centerY: number, x: number, y: number): number {
  return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
}

function distanceBetween(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

function dataUrlToBlob(dataUrl: string, format: ImageEditorOutputFormat): Blob | null {
  if (typeof atob !== 'function') return null;
  const parts = dataUrl.split(',');
  const meta = parts[0];
  const data = parts[1];
  if (!meta || !data) return null;
  const mime = meta.match(/data:(.*);base64/)?.[1] ?? format;
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

function extensionForFormat(format: ImageEditorOutputFormat): string {
  if (format === 'image/png') return 'png';
  if (format === 'image/webp') return 'webp';
  return 'jpg';
}
