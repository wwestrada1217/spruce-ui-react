import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './Fullscreen.css';

export type FullscreenMode = 'overlay' | 'native' | 'class';

export interface FullscreenHandle {
  active: boolean;
  toggle: () => void;
  enter: () => void;
  exit: () => void;
}

export interface FullscreenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  mode?: FullscreenMode;
  zIndex?: number | string;
  overlayBackground?: string;
  exitOnEscape?: boolean;
  children?: ReactNode;
}

export const Fullscreen = forwardRef<FullscreenHandle, FullscreenProps>(function Fullscreen(
  {
    active: controlledActive,
    onActiveChange,
    mode = 'overlay',
    zIndex = 1100,
    overlayBackground = 'var(--sp-surface-25)',
    exitOnEscape = true,
    children,
    className,
    style,
    ...props
  },
  ref,
) {
  const [internalActive, setInternalActive] = useState(false);
  const active = controlledActive ?? internalActive;
  const setActive = useCallback((next: boolean) => {
    if (controlledActive === undefined) setInternalActive(next);
    onActiveChange?.(next);
  }, [controlledActive, onActiveChange]);

  const elementRef = useRef<HTMLDivElement | null>(null);
  const setElementRef = useCallback((element: HTMLDivElement | null) => {
    elementRef.current = element;
  }, []);

  const enter = useCallback(() => {
    const element = elementRef.current;
    if (mode === 'native') {
      const request = element?.requestFullscreen;
      if (request) {
        request.call(element).then(() => setActive(true)).catch(() => setActive(false));
        return;
      }
    }
    setActive(true);
  }, [mode, setActive]);

  const exit = useCallback(() => {
    if (mode === 'native' && typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
    setActive(false);
  }, [mode, setActive]);

  useImperativeHandle(ref, () => ({ active, toggle: () => (active ? exit() : enter()), enter, exit }), [active, enter, exit]);

  useEffect(() => {
    if (mode !== 'native' || typeof document === 'undefined') return undefined;
    const sync = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [mode, setActive]);

  useEffect(() => {
    if (!exitOnEscape || !active) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mode !== 'native') {
        event.preventDefault();
        exit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, exit, exitOnEscape, mode]);

  const activeStyle: CSSProperties | undefined = mode === 'overlay' && active
    ? { position: 'fixed', inset: 0, zIndex, width: '100dvw', height: '100dvh', background: overlayBackground }
    : undefined;
  const modeStyle: CSSProperties = mode === 'class' && active
    ? { '--sp-fullscreen-z-index': zIndex, '--sp-fullscreen-background': overlayBackground } as CSSProperties
    : {};
  const combinedStyle = { ...style, ...modeStyle, ...activeStyle };
  return (
    <div
      {...props}
      ref={setElementRef}
      className={['sp-fullscreen', active ? 'sp-fullscreen--active' : '', className].filter(Boolean).join(' ')}
      style={combinedStyle}
      data-fullscreen-mode={mode}
      data-fullscreen-active={active ? 'true' : 'false'}
    >
      {children}
    </div>
  );
});

Fullscreen.displayName = 'Fullscreen';
