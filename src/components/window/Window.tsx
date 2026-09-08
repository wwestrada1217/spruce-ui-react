/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Window.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFocusTrap } from '../../utils/FocusUtils.js';

/* ── Z-index management ──────────────────────────────────────────────── */

let globalZIndex = 1000;
let activeWindowZIndex = 1001;
const windowStackListeners = new Set<() => void>();

function nextZIndex(): number {
  return ++globalZIndex;
}

/* ── Types ────────────────────────────────────────────────────────────── */

export type WindowSize = 'sm' | 'md' | 'lg' | 'xl';

export interface WindowProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: WindowSize;
  resizable?: boolean;
  minWidth?: number;
  minHeight?: number;
  showBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  focusTrap?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onMaximizeChange?: (maximized: boolean) => void;
}

/* ── Size presets ─────────────────────────────────────────────────────── */

const SIZE_PRESETS: Record<WindowSize, { width: number; height: number }> = {
  sm: { width: 400, height: 300 },
  md: { width: 560, height: 420 },
  lg: { width: 720, height: 520 },
  xl: { width: 960, height: 640 },
};

/* ── Resize directions ───────────────────────────────────────────────── */

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

/* ── Component ───────────────────────────────────────────────────────── */

export function Window({
  open,
  onClose,
  title = '',
  size = 'md',
  resizable = true,
  minWidth = 280,
  minHeight = 200,
  showBackdrop = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  focusTrap = true,
  children,
  footer,
  className = '',
  onMaximizeChange,
}: WindowProps) {
  const { t } = useI18n();
  const preset = SIZE_PRESETS[size];

  const [dim, setDim] = useState({ width: preset.width, height: preset.height });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [zIndex, setZIndex] = useState(() => nextZIndex());
  const [initialized, setInitialized] = useState(false);
  const [activeZ, setActiveZ] = useState(activeWindowZIndex);
  const savedBounds = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);

  useFocusTrap(windowRef, {
    active: open && focusTrap && zIndex === activeZ,
    autoFocus: open && focusTrap && zIndex === activeZ,
    restoreFocus: true,
  });

  useEffect(() => {
    const listener = () => setActiveZ(activeWindowZIndex);
    windowStackListeners.add(listener);
    return () => { windowStackListeners.delete(listener); };
  }, []);

  // Reset state when opening or size changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!open) {
        setInitialized(false);
        setMaximized(false);
        return;
      }
      const p = SIZE_PRESETS[size];
      setDim({ width: p.width, height: p.height });
      setPos({
        x: Math.round((window.innerWidth - p.width) / 2),
        y: Math.round((window.innerHeight - p.height) / 2),
      });
      const newZ = nextZIndex();
      activeWindowZIndex = newZ;
      setZIndex(newZ);
      setActiveZ(newZ);
      setInitialized(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, size]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && zIndex === activeWindowZIndex) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, onClose, open, zIndex]);

  // Bring to front
  const bringToFront = useCallback(() => {
    setZIndex((prev) => {
      const next = nextZIndex();
      activeWindowZIndex = next;
      setActiveZ(next);
      windowStackListeners.forEach((listener) => listener());
      return next === prev ? prev : next;
    });
  }, []);

  // Drag
  function onDragStart(e: React.MouseEvent) {
    if (maximized) return;
    if ((e.target as Element).closest('button')) return;
    bringToFront();

    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { ...pos };

    const onMove = (ev: MouseEvent) => {
      setPos({
        x: origin.x + ev.clientX - startX,
        y: origin.y + ev.clientY - startY,
      });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // Resize
  function onResizeStart(e: React.MouseEvent, dir: ResizeDir) {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    bringToFront();

    const startX = e.clientX;
    const startY = e.clientY;
    const originPos = { ...pos };
    const originDim = { ...dim };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newX = originPos.x;
      let newY = originPos.y;
      let newW = originDim.width;
      let newH = originDim.height;

      if (dir.includes('e')) {
        newW = Math.max(minWidth, originDim.width + dx);
      }
      if (dir.includes('w')) {
        const proposedW = originDim.width - dx;
        if (proposedW >= minWidth) {
          newW = proposedW;
          newX = originPos.x + dx;
        } else {
          newW = minWidth;
          newX = originPos.x + (originDim.width - minWidth);
        }
      }
      if (dir.includes('s')) {
        newH = Math.max(minHeight, originDim.height + dy);
      }
      if (dir.includes('n')) {
        const proposedH = originDim.height - dy;
        if (proposedH >= minHeight) {
          newH = proposedH;
          newY = originPos.y + dy;
        } else {
          newH = minHeight;
          newY = originPos.y + (originDim.height - minHeight);
        }
      }

      setDim({ width: newW, height: newH });
      setPos({ x: newX, y: newY });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // Toggle maximize
  function toggleMaximize() {
    if (!resizable) return;
    if (maximized) {
      if (savedBounds.current) {
        setPos({ x: savedBounds.current.x, y: savedBounds.current.y });
        setDim({ width: savedBounds.current.width, height: savedBounds.current.height });
      } else {
        const p = SIZE_PRESETS[size];
        setDim({ width: p.width, height: p.height });
        setPos({
          x: Math.round((window.innerWidth - p.width) / 2),
          y: Math.round((window.innerHeight - p.height) / 2),
        });
      }
      setMaximized(false);
      onMaximizeChange?.(false);
    } else {
      savedBounds.current = { ...pos, ...dim };
      setMaximized(true);
      onMaximizeChange?.(true);
    }
  }

  // Backdrop click
  function onBackdropClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (closeOnBackdrop && event.target === event.currentTarget) onClose();
  }

  if (!open) return null;

  const windowClass = [
    'sp-window',
    maximized && 'sp-window--maximized',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const windowStyle: React.CSSProperties = maximized
    ? { zIndex }
    : {
        zIndex,
        left: pos.x,
        top: pos.y,
        width: dim.width,
        height: dim.height,
      };

  const portal = (
    <>
      {showBackdrop && (
        <div
          className="sp-window-backdrop"
          style={{ zIndex: zIndex - 1 }}
          onClick={onBackdropClick}
          aria-hidden
        />
      )}
      <div
        ref={windowRef}
        className={windowClass}
        style={{
          ...windowStyle,
          opacity: initialized ? 1 : 0,
        }}
        role="dialog"
        aria-label={title || undefined}
        aria-modal={showBackdrop ? 'true' : undefined}
        tabIndex={-1}
        onMouseDown={bringToFront}
      >
        {/* Header */}
        <div
          className="sp-window__header"
          onMouseDown={onDragStart}
          onDoubleClick={toggleMaximize}
        >
          <span className="sp-window__title">{title}</span>
          <div
            className="sp-window__controls"
            onMouseDown={(e) => {
              e.stopPropagation();
              bringToFront();
            }}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            {resizable && (
              <button
                type="button"
                className="sp-window__btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize();
                }}
                aria-label={maximized ? t('restore') : t('maximize')}
              >
                <Icon name={maximized ? 'minimize' : 'maximize'} size={14} />
              </button>
            )}
            <button
              type="button"
              className="sp-window__btn sp-window__btn--close"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label={t('close')}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="sp-window__body">{children}</div>

        {/* Footer */}
        <div className="sp-window__footer">{footer}</div>

        {/* Resize handles */}
        {resizable &&
          !maximized &&
          RESIZE_DIRS.map((dir) => (
            <div
              key={dir}
              className={`sp-window__resize sp-window__resize--${dir}`}
              onMouseDown={(e) => onResizeStart(e, dir)}
            />
          ))}
      </div>
    </>
  );

  return createPortal(portal, document.body);
}
