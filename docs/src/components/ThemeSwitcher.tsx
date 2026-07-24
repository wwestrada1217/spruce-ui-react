import { useEffect, useRef, useState } from 'react';
import {
  useTheme,
  Icon,
  oceanTheme,
  forestTheme,
  roseTheme,
  corporateTheme,
  corporateDarkTheme,
  nightTheme,
  draculaTheme,
  dimTheme,
  retroTheme,
  bumblebeeTheme,
  nordTheme,
  shadcnTheme,
  shadcnDarkTheme,
} from 'spruce-react';

// ── Theme registry ────────────────────────────────────────────────────────────

const CUSTOM_THEMES = [
  oceanTheme, forestTheme, roseTheme, corporateTheme, retroTheme, bumblebeeTheme, shadcnTheme,
  nightTheme, draculaTheme, dimTheme, nordTheme, shadcnDarkTheme, corporateDarkTheme,
];

interface ThemeOption {
  id: string;
  label: string;
  color: string;
}

const LIGHT_OPTIONS: ThemeOption[] = [
  { id: 'light',      label: 'Default',   color: '#2563eb' },
  { id: 'ocean',      label: 'Ocean',     color: '#0e7490' },
  { id: 'forest',     label: 'Forest',    color: '#166534' },
  { id: 'rose',       label: 'Rose',      color: '#be185d' },
  { id: 'corporate',  label: 'Corporate', color: '#1d3557' },
  { id: 'retro',      label: 'Retro',     color: '#d97706' },
  { id: 'bumblebee',  label: 'Bumblebee', color: '#e5c700' },
  { id: 'shadcn',     label: 'Shadcn',    color: '#18181b' },
];

const DARK_OPTIONS: ThemeOption[] = [
  { id: 'dark',           label: 'Dark',           color: '#4f8ef7' },
  { id: 'night',          label: 'Night',          color: '#38bdf8' },
  { id: 'dracula',        label: 'Dracula',        color: '#bd93f9' },
  { id: 'dim',            label: 'Dim',            color: '#818cf8' },
  { id: 'nord',           label: 'Nord',           color: '#88C0D0' },
  { id: 'shadcn-dark',    label: 'Shadcn Dark',    color: '#fafafa' },
  { id: 'corporate-dark', label: 'Corporate Dark', color: '#4a8cc4' },
];

const ALL_OPTIONS = [...LIGHT_OPTIONS, ...DARK_OPTIONS];

const STORAGE_KEY = 'spruce-docs-theme-preference';
const MOTION_KEY  = 'spruce-docs-reduce-motion';

function getStoredTheme(): string {
  try { return localStorage.getItem(STORAGE_KEY) ?? 'light'; } catch { return 'light'; }
}

function getStoredMotion(): boolean {
  try { return localStorage.getItem(MOTION_KEY) === 'true'; } catch { return false; }
}

function applyReduceMotion(value: boolean) {
  if (value) {
    document.documentElement.classList.add('reduce-motion');
  } else {
    document.documentElement.classList.remove('reduce-motion');
  }
  try { localStorage.setItem(MOTION_KEY, String(value)); } catch { /* noop */ }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ThemeSwitcher() {
  const { preference, setTheme, registerTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(getStoredMotion);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Register all custom themes once
  useEffect(() => {
    for (const theme of CUSTOM_THEMES) {
      registerTheme(theme);
    }
    // Restore persisted theme
    const stored = getStoredTheme();
    setTheme(stored as Parameters<typeof setTheme>[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore reduce-motion on mount
  useEffect(() => {
    applyReduceMotion(getStoredMotion());
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function activate(id: string) {
    setTheme(id as Parameters<typeof setTheme>[0]);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* noop */ }
  }

  function toggleMotion() {
    const next = !reduceMotion;
    setReduceMotion(next);
    applyReduceMotion(next);
  }

  const activeId = preference as string;
  const activeOpt = ALL_OPTIONS.find(o => o.id === activeId) ?? LIGHT_OPTIONS[0];

  return (
    <div className="tsw__root">
      {/* Panel — renders above the trigger */}
      {open && (
        <div
          ref={panelRef}
          className="tsw__panel"
          role="dialog"
          aria-label="Theme switcher"
          aria-modal="true"
        >
          <p className="tsw__heading">Theme</p>

          <div className="tsw__section">
            <p className="tsw__section-label">Light</p>
            <div className="tsw__row" role="radiogroup" aria-label="Light themes">
              {LIGHT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`tsw__dot${activeId === opt.id ? ' tsw__dot--active' : ''}`}
                  role="radio"
                  aria-checked={activeId === opt.id}
                  aria-label={opt.label}
                  title={opt.label}
                  onClick={() => activate(opt.id)}
                >
                  <span className="tsw__dot-inner" style={{ background: opt.color }} />
                </button>
              ))}
            </div>
          </div>

          <div className="tsw__section">
            <p className="tsw__section-label">Dark</p>
            <div className="tsw__row" role="radiogroup" aria-label="Dark themes">
              {DARK_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`tsw__dot${activeId === opt.id ? ' tsw__dot--active' : ''}`}
                  role="radio"
                  aria-checked={activeId === opt.id}
                  aria-label={opt.label}
                  title={opt.label}
                  onClick={() => activate(opt.id)}
                >
                  <span
                    className="tsw__dot-inner"
                    style={{ background: opt.color, border: '1.5px solid rgba(255,255,255,0.18)' }}
                  />
                </button>
              ))}
            </div>
          </div>

          <p className="tsw__current">{activeOpt.label}</p>

          <div className="tsw__divider" />

          <div className="tsw__motion-row">
            <span className="tsw__motion-label" id="reduce-motion-label">Reduce motion</span>
            <button
              className="tsw__toggle"
              role="switch"
              aria-checked={reduceMotion}
              aria-labelledby="reduce-motion-label"
              onClick={toggleMotion}
            >
              <span className={`tsw__toggle-thumb${reduceMotion ? ' tsw__toggle-thumb--on' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        className="tsw__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Open theme selector. Current theme: ${activeOpt.label}`}
      >
        <span className="tsw__swatch" style={{ background: activeOpt.color }} aria-hidden="true">
          <Icon name="palette" size={14} />
        </span>
        <span className="tsw__trigger-info">
          <span className="tsw__trigger-label">Theme</span>
          <span className="tsw__trigger-sub">{activeOpt.label}</span>
        </span>
        <Icon name="chevron-up" size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
