import './Fireworks.css';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { useReducedMotion } from './effect-utils.js';

export type FireworksIntensity = 'low' | 'medium' | 'high';
export type FireworksPalette = 'multicolor' | 'gold' | 'neon' | 'patriot';

export interface FireworksBurst {
  x: number;
  y: number;
}

export interface FireworksHandle {
  /** Programmatically launch a rocket to container-relative coordinates. */
  launch(targetX?: number, targetY?: number): void;
}

export interface FireworksProps {
  children?: ReactNode;
  /** Enable or disable the fireworks effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spFireworks?: boolean;
  /** Firework explosion frequency/intensity. */
  intensity?: FireworksIntensity;
  /** Color palette scheme. */
  palette?: FireworksPalette;
  /** Continuously launch fireworks. */
  autoLaunch?: boolean;
  /** Launch a rocket when the host is clicked. */
  launchOnClick?: boolean;
  /** Optional callback when a rocket detonates. */
  onBurst?: (burst: FireworksBurst) => void;
  /** Accessible name for the host when it is a meaningful visual region. */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<FireworksHandle>;
}

const PALETTES: Record<FireworksPalette, string[]> = {
  multicolor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'],
  gold: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef08a', '#ffffff'],
  neon: ['#00ffcc', '#ff00ff', '#00ffff', '#ff3366', '#ffff00'],
  patriot: ['#ef4444', '#ffffff', '#3b82f6'],
};

const DENSITY_MAP: Record<FireworksIntensity, number> = { low: 1600, medium: 1000, high: 550 };

class FireworkRocket {
  x: number;
  y: number;
  private readonly startX: number;
  private readonly startY: number;
  private readonly destX: number;
  private readonly destY: number;
  readonly colors: string[];
  private progress = 0;
  exploded = false;

  constructor(startX: number, startY: number, destX: number, destY: number, colors: string[]) {
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.destX = destX;
    this.destY = destY;
    this.colors = colors;
  }

  update(): void {
    this.progress += 0.035;
    if (this.progress >= 1) {
      this.x = this.destX;
      this.y = this.destY;
      this.exploded = true;
      return;
    }
    this.x = this.startX + (this.destX - this.startX) * this.progress;
    this.y = this.startY + (this.destY - this.startY) * Math.sin(this.progress * (Math.PI / 2));
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.shadowBlur = 8;
    context.shadowColor = '#fcd34d';
    context.fill();
    context.shadowBlur = 0;
  }
}

class FireworkParticle {
  x: number;
  y: number;
  private vx: number;
  private vy: number;
  private readonly color: string;
  alpha = 1;
  private readonly decay: number;

  constructor(x: number, y: number, colors: string[]) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = colors[Math.floor(Math.random() * colors.length)] ?? '#ffffff';
    this.decay = 0.015 + Math.random() * 0.02;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.alpha -= this.decay;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.alpha <= 0) return;
    context.save();
    context.globalAlpha = Math.max(0, this.alpha);
    context.beginPath();
    context.arc(this.x, this.y, 2, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.shadowBlur = 6;
    context.shadowColor = this.color;
    context.fill();
    context.restore();
  }
}

export const Fireworks = forwardRef<FireworksHandle, FireworksProps>(function Fireworks(
  {
    children,
    enabled,
    spFireworks,
    intensity = 'medium',
    palette = 'multicolor',
    autoLaunch = true,
    launchOnClick = false,
    onBurst,
    ariaLabel,
    className = '',
    style,
  },
  ref,
) {
  const isEnabled = spFireworks ?? enabled ?? true;
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const rocketsRef = useRef<FireworkRocket[]>([]);
  const particlesRef = useRef<FireworkParticle[]>([]);
  const burstCallbackRef = useRef(onBurst);

  useEffect(() => {
    burstCallbackRef.current = onBurst;
  }, [onBurst]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'sp-fireworks-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    canvasRef.current = canvas;

    try {
      contextRef.current = canvas.getContext('2d');
    } catch {
      contextRef.current = null;
    }

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = rect.width || host.clientWidth || 300;
      const height = rect.height || host.clientHeight || 200;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      contextRef.current?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      canvas.remove();
      canvasRef.current = null;
      contextRef.current = null;
      rocketsRef.current = [];
      particlesRef.current = [];
    };
  }, []);

  const launch = useCallback((targetX?: number, targetY?: number) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context || reducedMotion) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || hostRef.current?.clientWidth || 300;
    const height = rect.height || hostRef.current?.clientHeight || 200;
    const startX = width * (0.2 + Math.random() * 0.6);
    const startY = height;
    const destX = targetX ?? width * (0.15 + Math.random() * 0.7);
    const destY = targetY ?? height * (0.1 + Math.random() * 0.45);
    rocketsRef.current.push(new FireworkRocket(startX, startY, destX, destY, PALETTES[palette]));
  }, [palette, reducedMotion]);

  useImperativeHandle(ref, () => ({ launch }), [launch]);

  useEffect(() => {
    const context = contextRef.current;
    if (!isEnabled || reducedMotion || !context || typeof window.requestAnimationFrame !== 'function') return;

    const renderLoop = () => {
      const host = hostRef.current;
      if (!host || !contextRef.current) return;
      const rect = host.getBoundingClientRect();
      const width = rect.width || host.clientWidth || 300;
      const height = rect.height || host.clientHeight || 200;
      const currentContext = contextRef.current;
      currentContext.fillStyle = 'rgba(15, 23, 42, 0.18)';
      currentContext.fillRect(0, 0, width, height);

      for (let index = rocketsRef.current.length - 1; index >= 0; index -= 1) {
        const rocket = rocketsRef.current[index];
        rocket.update();
        rocket.draw(currentContext);
        if (!rocket.exploded) continue;
        const count = 35 + Math.floor(Math.random() * 25);
        for (let particleIndex = 0; particleIndex < count; particleIndex += 1) {
          particlesRef.current.push(new FireworkParticle(rocket.x, rocket.y, rocket.colors));
        }
        burstCallbackRef.current?.({ x: rocket.x, y: rocket.y });
        rocketsRef.current.splice(index, 1);
      }

      for (let index = particlesRef.current.length - 1; index >= 0; index -= 1) {
        const particle = particlesRef.current[index];
        particle.update();
        particle.draw(currentContext);
        if (particle.alpha <= 0) particlesRef.current.splice(index, 1);
      }
      frameId = window.requestAnimationFrame(renderLoop);
    };

    let intervalId: number | null = null;
    let frameId: number | null = null;
    if (autoLaunch) {
      launch();
      intervalId = window.setInterval(launch, DENSITY_MAP[intensity]);
    }
    frameId = window.requestAnimationFrame(renderLoop);

    return () => {
      if (intervalId !== null) window.clearInterval(intervalId);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      rocketsRef.current = [];
      particlesRef.current = [];
    };
  }, [autoLaunch, intensity, isEnabled, launch, reducedMotion]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!launchOnClick) return;
    const rect = event.currentTarget.getBoundingClientRect();
    launch(event.clientX - rect.left, event.clientY - rect.top);
  };

  const classes = [
    isEnabled && 'sp-fireworks-host',
    isEnabled && reducedMotion && 'sp-fireworks-host--reduced-motion',
    className,
  ].filter(Boolean).join(' ');

  return <div ref={hostRef} className={classes} style={style} aria-label={ariaLabel} onClick={handleClick}>{children}</div>;
});
