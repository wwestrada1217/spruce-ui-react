import './Motif.css';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';

export type SpMotifPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type SpMotifAppearanceOption = 'auto' | 'outlined' | 'filled';

export interface SpDecorativeBackground {
  motif?: string;
  icon?: string;
  svg?: string;
  position?: SpMotifPosition;
  size?: number | string;
  opacity?: number;
  rotation?: number;
  offsetX?: number | string;
  offsetY?: number | string;
  appearance?: SpMotifAppearanceOption;
  color?: string;
}

export interface MotifProps extends SpDecorativeBackground {
  config?: SpDecorativeBackground;
  children?: ReactNode;
  className?: string;
}

const ANCHORS: Record<SpMotifPosition, { x: string; y: string; bx: string; by: string }> = {
  'top-left': { x: '0%', y: '0%', bx: '0%', by: '0%' },
  'top-center': { x: '50%', y: '0%', bx: '-50%', by: '0%' },
  'top-right': { x: '100%', y: '0%', bx: '-100%', by: '0%' },
  'center-left': { x: '0%', y: '50%', bx: '0%', by: '-50%' },
  center: { x: '50%', y: '50%', bx: '-50%', by: '-50%' },
  'center-right': { x: '100%', y: '50%', bx: '-100%', by: '-50%' },
  'bottom-left': { x: '0%', y: '100%', bx: '0%', by: '-100%' },
  'bottom-center': { x: '50%', y: '100%', bx: '-50%', by: '-100%' },
  'bottom-right': { x: '100%', y: '100%', bx: '-100%', by: '-100%' },
};

/* Small built-ins keep the feedback components useful without introducing a
 * second registry dependency. Consumers can provide trusted SVG for custom
 * art, or use an Icon name from the active Spruce registry. */
const BUILTIN_MOTIFS: Record<string, { svg: string; appearance?: 'outlined' | 'filled' }> = {
  'overlapping-diamonds': {
    svg: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path data-motif-shape d="M50 4 96 50 50 96 4 50Z"/><path data-motif-shape d="M50 22 78 50 50 78 22 50Z"/></svg>',
  },
  'arc-orbit': {
    svg: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="50" cy="50" r="32"/><path d="M14 50a36 36 0 0 1 72 0"/><circle data-motif-shape cx="50" cy="14" r="5"/></svg>',
  },
  'organic-blob': {
    svg: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path data-motif-shape d="M19 21c13-16 40-14 57-3 17 12 23 38 10 56-13 18-41 19-59 5C9 65 6 38 19 21Z"/></svg>',
  },
};

const GENERIC_MOTIF = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><circle data-motif-shape cx="50" cy="50" r="30"/><path d="M50 8v18M50 74v18M8 50h18M74 50h18"/></svg>';

function cssLength(value: number | string | undefined, fallback: string): string {
  if (value === undefined || value === '') return fallback;
  return typeof value === 'number' ? `${value}px` : value;
}

function mergeConfig(props: MotifProps): SpDecorativeBackground {
  const flat: SpDecorativeBackground = {
    motif: props.motif,
    icon: props.icon,
    svg: props.svg,
    position: props.position,
    size: props.size,
    opacity: props.opacity,
    rotation: props.rotation,
    offsetX: props.offsetX,
    offsetY: props.offsetY,
    appearance: props.appearance,
    color: props.color,
  };
  return Object.fromEntries(
    Object.entries({ ...props.config, ...flat }).filter(([, value]) => value !== undefined && value !== ''),
  ) as SpDecorativeBackground;
}

export function Motif(props: MotifProps) {
  const resolved = mergeConfig(props);
  const source = resolved.svg ?? (resolved.motif ? BUILTIN_MOTIFS[resolved.motif]?.svg ?? GENERIC_MOTIF : undefined);
  const anchor = ANCHORS[resolved.position ?? 'center-right'];
  const size = cssLength(resolved.size, '160px');
  const offsetX = cssLength(resolved.offsetX, '0px');
  const offsetY = cssLength(resolved.offsetY, '0px');
  const appearance = resolved.appearance ?? 'auto';
  const effectiveAppearance =
    appearance === 'auto' ? BUILTIN_MOTIFS[resolved.motif ?? '']?.appearance ?? 'outlined' : appearance;
  const style = {
    left: anchor.x,
    top: anchor.y,
    width: size,
    '--sp-motif-opacity': resolved.opacity ?? 0.1,
    ...(resolved.color === undefined ? {} : { '--sp-motif-color': resolved.color }),
    transform: `translate(calc(${anchor.bx} + ${offsetX}), calc(${anchor.by} + ${offsetY})) rotate(${resolved.rotation ?? 0}deg)`,
  } as CSSProperties;

  if (!source && !resolved.icon && !props.children) return null;

  return (
    <span className={['sp-motif', props.className].filter(Boolean).join(' ')} aria-hidden="true">
      <span
        className={[
          'sp-motif__shape',
          effectiveAppearance === 'filled' && 'sp-motif__shape--filled',
        ].filter(Boolean).join(' ')}
        style={style}
      >
        {source && <span className="sp-motif__art" dangerouslySetInnerHTML={{ __html: source }} />}
        {resolved.icon && !source && <Icon name={resolved.icon} size={Number.parseInt(size, 10) || 160} />}
        {!source && !resolved.icon && props.children && <span className="sp-motif__art">{props.children}</span>}
      </span>
    </span>
  );
}
