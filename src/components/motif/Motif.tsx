/* eslint-disable react-refresh/only-export-components */
import './Motif.css';
import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  SP_BUILT_IN_MOTIFS,
  type SpMotifDefinition,
  type SpMotifName,
} from './motif-definitions.js';

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
  motif?: SpMotifName;
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

interface MotifRegistry {
  get: (name: SpMotifName) => SpMotifDefinition | undefined;
  names: () => readonly string[];
}

function createMotifRegistry(motifs: readonly SpMotifDefinition[] = []): MotifRegistry {
  const definitions = new Map<string, SpMotifDefinition>(
    SP_BUILT_IN_MOTIFS.map((definition) => [definition.name, definition]),
  );
  motifs.forEach((definition) => definitions.set(definition.name, definition));
  return {
    get: (name) => definitions.get(name),
    names: () => [...definitions.keys()],
  };
}

const defaultRegistry = createMotifRegistry();
const MotifRegistryContext = createContext<MotifRegistry>(defaultRegistry);

/**
 * Adds or overrides trusted motif definitions for a React subtree. Passing a
 * new array is the controlled equivalent of Angular's runtime registry.
 */
export interface MotifProviderProps {
  motifs?: readonly SpMotifDefinition[];
  children?: ReactNode;
}

export function MotifProvider({ motifs = [], children }: MotifProviderProps) {
  const registry = useMemo(() => createMotifRegistry(motifs), [motifs]);
  return <MotifRegistryContext.Provider value={registry}>{children}</MotifRegistryContext.Provider>;
}

export function useMotifRegistry(): MotifRegistry {
  return useContext(MotifRegistryContext);
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
  const registry = useMotifRegistry();
  const resolved = mergeConfig(props);
  const definition = resolved.motif ? registry.get(resolved.motif) : undefined;
  const source = resolved.svg ?? definition?.svg;
  const anchor = ANCHORS[resolved.position ?? 'center-right'];
  const size = cssLength(resolved.size, '160px');
  const offsetX = cssLength(resolved.offsetX, '0px');
  const offsetY = cssLength(resolved.offsetY, '0px');
  const appearance = resolved.appearance ?? 'auto';
  const effectiveAppearance =
    appearance === 'auto' ? definition?.appearance ?? 'outlined' : appearance;
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
