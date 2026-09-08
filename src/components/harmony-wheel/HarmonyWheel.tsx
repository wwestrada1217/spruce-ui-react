import './HarmonyWheel.css';
import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
  buildHarmonyPalette,
  harmonyOffsets,
  matchHarmonyScheme,
  type CustomHarmony,
  type HarmonySchemeId,
  type HarmonySelection,
} from '../../theme/accent-harmony.js';
import { hexToOklch, oklchToHex } from '../../theme/color.js';

type HarmonyMarkerRole = 'primary' | 'secondary' | 'tertiary';

interface HarmonyMarker {
  role: HarmonyMarkerRole;
  hue: number;
  offset: number;
  fill: string;
  x: number;
  y: number;
  label: string;
}

export interface HarmonyWheelProps {
  /** Brand color from which the harmony is derived. */
  base?: string;
  /** Named scheme or explicit companion hue offsets. */
  selection?: HarmonySelection;
  onBaseChange?: (base: string) => void;
  onSelectionChange?: (selection: HarmonySelection) => void;
  disabled?: boolean;
  showReadout?: boolean;
  /** Degrees within which custom offsets snap back to a named scheme. */
  snapTolerance?: number;
  ariaLabel?: string;
  className?: string;
}

const VIEW = 260;
const CENTER = VIEW / 2;
const RING_RADIUS = 104;
const RING_DOTS = 36;

const SCHEME_LABELS: Record<HarmonySchemeId, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  'split-complementary': 'Split complementary',
  tetradic: 'Tetradic',
  monochromatic: 'Monochromatic',
};

function normalizeHue(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

function signedOffset(degrees: number): number {
  const normalized = normalizeHue(degrees);
  return normalized > 180 ? normalized - 360 : normalized;
}

function pointOnRing(hue: number): { x: number; y: number } {
  const radians = ((normalizeHue(hue) - 90) * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(radians) * RING_RADIUS,
    y: CENTER + Math.sin(radians) * RING_RADIUS,
  };
}

/** Pointer, touch, and keyboard-editable OKLCH color-harmony wheel. */
export function HarmonyWheel({
  base = '#2563eb',
  selection = 'triadic',
  onBaseChange,
  onSelectionChange,
  disabled = false,
  showReadout = true,
  snapTolerance = 6,
  ariaLabel = 'Color harmony wheel',
  className = '',
}: HarmonyWheelProps) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<HarmonyMarkerRole | null>(null);
  const offsets = harmonyOffsets(selection);
  const baseHue = hexToOklch(base)?.h ?? 0;
  const palette = buildHarmonyPalette(base, selection);

  const ringDots = useMemo(() => Array.from({ length: RING_DOTS }, (_, index) => {
    const hue = (index / RING_DOTS) * 360;
    return { ...pointOnRing(hue), hue, fill: oklchToHex({ l: 0.68, c: 0.15, h: hue }) };
  }), []);

  const markers: HarmonyMarker[] = ([
    ['primary', 0, 'Base hue'],
    ['secondary', offsets.secondary, 'Secondary hue'],
    ['tertiary', offsets.tertiary, 'Tertiary hue'],
  ] as const).map(([role, offset, label]) => {
    const hue = normalizeHue(baseHue + offset);
    return {
      role,
      offset,
      hue,
      label,
      fill: palette?.light[role].base ?? oklchToHex({ l: 0.6, c: 0.15, h: hue }),
      ...pointOnRing(hue),
    };
  });

  const matchedScheme = typeof selection === 'string'
    ? selection
    : matchHarmonyScheme(offsets, snapTolerance);
  const schemeLabel = matchedScheme ? SCHEME_LABELS[matchedScheme] : 'Custom';

  function applyHue(role: HarmonyMarkerRole, hue: number) {
    const target = normalizeHue(hue);
    if (role === 'primary') {
      const seed = hexToOklch(base);
      if (seed) onBaseChange?.(oklchToHex({ ...seed, h: target }));
      return;
    }
    const next: CustomHarmony = {
      secondary: Math.round(signedOffset(role === 'secondary' ? target - baseHue : offsets.secondary)),
      tertiary: Math.round(signedOffset(role === 'tertiary' ? target - baseHue : offsets.tertiary)),
    };
    onSelectionChange?.(matchHarmonyScheme(next, snapTolerance) ?? next);
  }

  function hueFromPointer(event: PointerEvent<SVGSVGElement>): number | null {
    const rectangle = canvasRef.current?.getBoundingClientRect();
    if (!rectangle?.width || !rectangle.height) return null;
    const x = ((event.clientX - rectangle.left) / rectangle.width) * VIEW - CENTER;
    const y = ((event.clientY - rectangle.top) / rectangle.height) * VIEW - CENTER;
    return normalizeHue((Math.atan2(y, x) * 180) / Math.PI + 90);
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    if (disabled) return;
    const target = event.target as Element;
    const marker = target.closest<SVGGElement>('.sp-harmony-wheel__marker');
    const role = marker?.dataset.role;
    if (!marker || (role !== 'primary' && role !== 'secondary' && role !== 'tertiary')) return;
    setDragging(role);
    marker.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!dragging || disabled) return;
    const hue = hueFromPointer(event);
    if (hue !== null) applyHue(dragging, hue);
  }

  function handlePointerUp(event: PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<SVGGElement>, marker: HarmonyMarker) {
    if (disabled) return;
    const coarse = event.shiftKey ? 15 : 1;
    let nextHue: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextHue = marker.hue + coarse;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextHue = marker.hue - coarse;
    if (event.key === 'PageUp') nextHue = marker.hue + 15;
    if (event.key === 'PageDown') nextHue = marker.hue - 15;
    if (event.key === 'Home') nextHue = marker.role === 'primary' ? 0 : baseHue;
    if (event.key === 'End') nextHue = baseHue + 180;
    if (nextHue === null) return;
    event.preventDefault();
    applyHue(marker.role, nextHue);
  }

  return (
    <div className={['sp-harmony-wheel', disabled && 'sp-harmony-wheel--disabled', className].filter(Boolean).join(' ')}>
      <svg
        ref={canvasRef}
        className="sp-harmony-wheel__canvas"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="group"
        aria-label={ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {ringDots.map(dot => <circle key={dot.hue} cx={dot.x} cy={dot.y} r="6" fill={dot.fill} aria-hidden="true" />)}
        <polygon className="sp-harmony-wheel__link" points={markers.map(marker => `${marker.x.toFixed(1)},${marker.y.toFixed(1)}`).join(' ')} aria-hidden="true" />
        {markers.map(marker => (
          <g
            key={marker.role}
            className={['sp-harmony-wheel__marker', dragging === marker.role && 'sp-harmony-wheel__marker--active'].filter(Boolean).join(' ')}
            data-role={marker.role}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-label={marker.label}
            aria-valuemin={0}
            aria-valuemax={359}
            aria-valuenow={Math.round(marker.hue)}
            aria-valuetext={marker.role === 'primary' ? `${Math.round(marker.hue)} degrees` : `${Math.round(marker.hue)} degrees, ${Math.round(signedOffset(marker.offset))} degree offset`}
            aria-disabled={disabled || undefined}
            onKeyDown={event => handleKeyDown(event, marker)}
          >
            <circle className="sp-harmony-wheel__marker-halo" cx={marker.x} cy={marker.y} r={marker.role === 'primary' ? 21 : 18} />
            <circle className="sp-harmony-wheel__marker-dot" cx={marker.x} cy={marker.y} r={marker.role === 'primary' ? 17 : 14} fill={marker.fill} />
          </g>
        ))}
      </svg>
      {showReadout && (
        <div className="sp-harmony-wheel__readout" aria-live="polite">
          <span className="sp-harmony-wheel__scheme">{schemeLabel}</span>
          <span className="sp-harmony-wheel__offsets">{Math.round(signedOffset(offsets.secondary))}° / {Math.round(signedOffset(offsets.tertiary))}°</span>
        </div>
      )}
      <span className="sp-harmony-wheel__instructions">Use arrow keys for one-degree changes and Shift plus an arrow key for fifteen degrees.</span>
    </div>
  );
}
