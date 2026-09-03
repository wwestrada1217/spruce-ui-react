import './Fire.css';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from './effect-utils.js';

export type FireColor = 'classic' | 'blue' | 'purple' | 'emerald' | 'white' | string;
export type FireDensity = 'low' | 'medium' | 'high';

export interface FireProps {
  children?: ReactNode;
  /** Enable or disable the fire effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spFire?: boolean;
  /** Color theme or custom CSS color. */
  fireColor?: FireColor;
  /** Backwards-compatible color alias. */
  color?: FireColor;
  /** Flame intensity scale from 1 to 10. */
  fireIntensity?: number;
  /** Backwards-compatible intensity alias. */
  intensity?: number;
  /** Speed multiplier for rising embers. */
  fireSpeed?: number;
  /** Backwards-compatible speed alias. */
  speed?: number;
  /** Particle density. */
  fireDensity?: FireDensity;
  /** Backwards-compatible density alias. */
  density?: FireDensity;
  /** Horizontal wind drift angle from -5 to 5. */
  windDrift?: number;
  className?: string;
  style?: CSSProperties;
}

const PALETTES: Record<string, string[]> = {
  classic: ['#ff4500', '#ff8c00', '#ffd700', '#ffffff'],
  blue: ['#00bfff', '#1e90ff', '#4169e1', '#ffffff'],
  purple: ['#a855f7', '#c084fc', '#e879f9', '#ffffff'],
  emerald: ['#10b981', '#34d399', '#6ee7b7', '#ffffff'],
  white: ['#f8fafc', '#cbd5e1', '#94a3b8', '#ffffff'],
};

const DENSITY_MAP: Record<FireDensity, number> = { low: 8, medium: 16, high: 28 };

function effectiveColor(fireColor: FireColor, color: FireColor): FireColor {
  return color !== 'classic' ? color : fireColor;
}

function effectiveValue<T>(primary: T, alias: T, defaultValue: T): T {
  return alias !== defaultValue ? alias : primary;
}

function paletteFor(color: FireColor): string[] {
  return PALETTES[color] ?? [color, '#ff6b00', '#ffd700', '#ffffff'];
}

export function Fire({
  children,
  enabled,
  spFire,
  fireColor = 'classic',
  color = 'classic',
  fireIntensity = 5,
  intensity = 5,
  fireSpeed = 1,
  speed = 1,
  fireDensity = 'medium',
  density = 'medium',
  windDrift = 0,
  className = '',
  style,
}: FireProps) {
  const isEnabled = spFire ?? enabled ?? true;
  const resolvedColor = effectiveColor(fireColor, color);
  const resolvedIntensity = effectiveValue(fireIntensity, intensity, 5);
  const resolvedSpeed = effectiveValue(fireSpeed, speed, 1);
  const resolvedDensity = effectiveValue(fireDensity, density, 'medium');
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !isEnabled) return;

    const particles: HTMLElement[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let animationFrame: number | null = null;
    let lastSpawnTime = 0;
    const palette = paletteFor(resolvedColor);
    const normalizedIntensity = Math.min(10, Math.max(1, resolvedIntensity));
    const normalizedSpeed = Math.max(0.2, resolvedSpeed);

    const glow = document.createElement('div');
    glow.className = 'sp-fire-glow';
    glow.style.background = palette[0] ?? '#ff4500';
    host.appendChild(glow);

    if (reducedMotion || typeof window.requestAnimationFrame !== 'function') {
      return () => glow.remove();
    }

    const spawnEmber = () => {
      const rect = host.getBoundingClientRect();
      const width = rect.width || host.clientWidth || 200;
      const baseSize = 4 + normalizedIntensity * 1.5 * (0.8 + Math.random() * 0.4);
      const ember = document.createElement('span');
      const duration = 900 / normalizedSpeed + Math.random() * 400;
      ember.className = 'sp-fire-ember';
      ember.style.left = `${Math.random() * width}px`;
      ember.style.width = `${baseSize}px`;
      ember.style.height = `${baseSize * 1.4}px`;
      ember.style.background = palette[Math.floor(Math.random() * palette.length)] ?? palette[0] ?? '#ff4500';
      ember.style.boxShadow = `0 0 ${baseSize}px ${ember.style.background}`;
      ember.style.setProperty('--sp-fire-dx', `${windDrift * 10 + (Math.random() * 24 - 12)}px`);
      ember.style.setProperty('--sp-fire-dy', `${-(35 + normalizedIntensity * 8 + Math.random() * 40)}px`);
      ember.style.setProperty('--sp-fire-rot', `${Math.random() * 40 - 20}deg`);
      ember.style.setProperty('--sp-fire-duration', `${duration}ms`);
      host.appendChild(ember);
      particles.push(ember);
      const timer = setTimeout(() => {
        ember.remove();
        const index = particles.indexOf(ember);
        if (index >= 0) particles.splice(index, 1);
      }, duration);
      timers.push(timer);
    };

    const loop = (timestamp: number) => {
      const interval = 1000 / (DENSITY_MAP[resolvedDensity] ?? 16);
      if (timestamp - lastSpawnTime >= interval) {
        spawnEmber();
        lastSpawnTime = timestamp;
      }
      animationFrame = window.requestAnimationFrame(loop);
    };

    animationFrame = window.requestAnimationFrame(loop);
    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      timers.forEach((timer) => clearTimeout(timer));
      particles.forEach((particle) => particle.remove());
      glow.remove();
    };
  }, [isEnabled, reducedMotion, resolvedColor, resolvedDensity, resolvedIntensity, resolvedSpeed, windDrift]);

  const classes = [
    isEnabled && 'sp-fire-host',
    isEnabled && reducedMotion && 'sp-fire-host--reduced-motion',
    className,
  ].filter(Boolean).join(' ');

  return <div ref={hostRef} className={classes} style={style}>{children}</div>;
}
