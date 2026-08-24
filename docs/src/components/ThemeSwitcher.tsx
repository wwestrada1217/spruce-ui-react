import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useTheme,
  Icon,
  Popover,
  ACCENT_OPTIONS,
  HARMONY_PRESETS,
  HARMONY_SCHEMES,
  SPRUCE_THEME_PRESETS,
} from 'spruce-react';
import type { AccentId, HarmonySchemeId } from 'spruce-react';

// ── Theme registry ────────────────────────────────────────────────────────────

type ThemeMode = 'light' | 'dark';
type ThemeView = 'grid' | 'list';
type ModeFilter = 'all' | 'light' | 'dark';
type Density = 'dense' | 'default' | 'comfortable';

interface ThemeOption {
  id: string;
  label: string;
  /** Accent color used for the swatch / mini-preview chrome. */
  color: string;
  mode: ThemeMode;
}

const BASE_OPTIONS: ThemeOption[] = [
  { id: 'light', label: 'Spruce', color: '#166534', mode: 'light' },
  { id: 'dark', label: 'Spruce Dark', color: '#22c55e', mode: 'dark' },
];

const PRESET_OPTIONS: ThemeOption[] = SPRUCE_THEME_PRESETS.map(theme => ({
  id: theme.name,
  label: theme.displayName,
  color: theme.tokens['--sp-primary'] ?? (theme.base === 'dark' ? '#94a3b8' : '#166534'),
  mode: theme.base,
}));

const ALL_OPTIONS = [...BASE_OPTIONS, ...PRESET_OPTIONS];

/** Swatch shown for the "System" preference (splits light / dark). */
const SYSTEM_SWATCH = 'conic-gradient(#111827 0deg 180deg, #f8fafc 180deg 360deg)';

interface DensityOption {
  id: Density;
  label: string;
  description: string;
  icon: string;
}

const DENSITY_OPTIONS: DensityOption[] = [
  { id: 'dense',       label: 'Compact',     description: 'More content on screen', icon: 'menu' },
  { id: 'default',     label: 'Comfortable', description: 'Balanced spacing',       icon: 'list' },
  { id: 'comfortable', label: 'Spacious',    description: 'More breathing room',    icon: 'layout-list' },
];

const MODE_FILTERS: { id: ModeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const THEME_KEY   = 'spruce-theme-preference';
const MOTION_KEY  = 'spruce-docs-reduce-motion';
const DENSITY_KEY = 'spruce-docs-density-preference';

function readStorage(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function writeStorage(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}

function applyReduceMotion(value: boolean) {
  // The token system's manual override: collapses every duration/distance/scale
  // token and disables animations globally (see tokens.css).
  if (value) {
    document.documentElement.setAttribute('data-reduce-motion', 'true');
  } else {
    document.documentElement.removeAttribute('data-reduce-motion');
  }
  writeStorage(MOTION_KEY, String(value));
}

function applyDensity(value: Density) {
  // Re-resolves the semantic density aliases (see tokens.css).
  document.documentElement.setAttribute('data-density', value);
  writeStorage(DENSITY_KEY, value);
}

function resolveThemeMeta(id: string): { label: string; color: string } {
  const found = ALL_OPTIONS.find(o => o.id === id);
  return found
    ? { label: found.label, color: found.color }
    : { label: 'System', color: SYSTEM_SWATCH };
}

// ── Mini-preview thumb (bar + sidebar + content, tinted by the theme) ────────

function ThemeThumb({ opt }: { opt?: ThemeOption }) {
  const style = opt
    ? ({ '--tsw-accent': opt.color } as React.CSSProperties)
    : undefined;
  return (
    <span
      className={`tsw-card__thumb${opt ? '' : ' tsw-card__thumb--system'}`}
      data-mode={opt?.mode}
      style={style}
      aria-hidden="true"
    >
      <span className="tsw-card__thumb-bar" />
      <span className="tsw-card__thumb-body">
        <span className="tsw-card__thumb-side" />
        <span className="tsw-card__thumb-main" />
      </span>
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ThemeSwitcher() {
  const {
    preference,
    setTheme,
    registerTheme,
    accentPreference,
    accentCustomColor,
    accentHarmony,
    accentHarmonyCustom,
    setAccent,
    setCustomAccentColor,
    setAccentHarmony,
    setAccentHarmonyCustom,
    setHarmonyPreset,
    resetAccent,
  } = useTheme();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ThemeView>('grid');
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [density, setDensity] = useState<Density>(
    () => readStorage(DENSITY_KEY, 'default') as Density,
  );
  const [reduceMotion, setReduceMotion] = useState(
    () => readStorage(MOTION_KEY, 'false') === 'true',
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Built-in presets are already registered by the provider. Registering the
  // same objects here keeps this switcher compatible with older providers.
  useEffect(() => {
    for (const theme of SPRUCE_THEME_PRESETS) {
      registerTheme(theme);
    }
    applyReduceMotion(readStorage(MOTION_KEY, 'false') === 'true');
    applyDensity(readStorage(DENSITY_KEY, 'default') as Density);
  }, [registerTheme]);

  // Close on Escape (outside-click dismissal is handled by the Popover)
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const filteredThemes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_OPTIONS.filter(o =>
      (modeFilter === 'all' || o.mode === modeFilter) &&
      (q === '' || o.label.toLowerCase().includes(q)),
    );
  }, [query, modeFilter]);

  const showSystem = modeFilter === 'all' && query.trim() === '';
  const hasResults = showSystem || filteredThemes.length > 0;

  function activate(id: string) {
    setTheme(id as Parameters<typeof setTheme>[0]);
    writeStorage(THEME_KEY, id);
  }

  function activateAccent(id: AccentId) {
    setAccent(id);
  }

  function activateHarmony(id: HarmonySchemeId | 'none') {
    setAccentHarmony(id);
  }

  function updateCustomHarmony(role: 'secondary' | 'tertiary', value: string) {
    const current = accentHarmonyCustom ?? { secondary: 120, tertiary: 240 };
    const degrees = Number(value);
    if (!Number.isFinite(degrees)) return;
    setAccentHarmonyCustom({ ...current, [role]: degrees });
  }

  function changeDensity(next: Density) {
    setDensity(next);
    applyDensity(next);
  }

  function toggleMotion() {
    const next = !reduceMotion;
    setReduceMotion(next);
    applyReduceMotion(next);
  }

  function resetToDefault() {
    activate('system');
    resetAccent();
    changeDensity('default');
    setReduceMotion(false);
    applyReduceMotion(false);
    setQuery('');
    setModeFilter('all');
  }

  const activeId = preference as string;
  const activeMeta = resolveThemeMeta(activeId);

  return (
    <div className="tsw__root">
      <Popover
        placement="top-start"
        offset={8}
        padding="0"
        panelClassName="tsw__panel"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            ref={triggerRef}
            className="tsw__trigger"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={`Open appearance settings. Current theme: ${activeMeta.label}`}
          >
            <span className="tsw__swatch" style={{ background: activeMeta.color }} aria-hidden="true">
              <Icon name="palette" size={14} />
            </span>
            <span className="tsw__trigger-info">
              <span className="tsw__trigger-label">Appearance</span>
              <span className="tsw__trigger-sub">{activeMeta.label}</span>
            </span>
            <Icon name="chevron-up" size={14} aria-hidden="true" />
          </button>
        }
      >
        <div role="group" aria-label="Appearance settings" className="tsw__surface">
          {/* Header */}
          <div className="tsw__header">
            <span className="tsw__header-badge" aria-hidden="true">
              <Icon name="palette" size={18} />
            </span>
            <span className="tsw__header-text">
              <span className="tsw__title">Appearance</span>
              <span className="tsw__subtitle">Theme, density &amp; motion</span>
            </span>
            <button
              type="button"
              className="tsw__close"
              aria-label="Close appearance settings"
              onClick={() => setOpen(false)}
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Filters */}
          <div className="tsw__filters">
            <div className="tsw__search">
              <span className="tsw__search-icon" aria-hidden="true">
                <Icon name="search" size={13} />
              </span>
              <input
                type="text"
                className="tsw__search-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search themes…"
                aria-label="Search themes"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="tsw__search-clear"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                >
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
            <div className="tsw__select">
              <select
                className="tsw__select-input"
                aria-label="Filter themes by mode"
                value={modeFilter}
                onChange={e => setModeFilter(e.target.value as ModeFilter)}
              >
                {MODE_FILTERS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <span className="tsw__select-icon" aria-hidden="true">
                <Icon name="chevron-down" size={13} />
              </span>
            </div>
            <div className="tsw__view-toggle" role="radiogroup" aria-label="Theme layout">
              <button
                type="button"
                className={`tsw__view-btn${view === 'grid' ? ' tsw__view-btn--active' : ''}`}
                role="radio"
                aria-label="Grid view"
                aria-checked={view === 'grid'}
                onClick={() => setView('grid')}
              >
                <Icon name="layout-grid" size={14} />
              </button>
              <button
                type="button"
                className={`tsw__view-btn${view === 'list' ? ' tsw__view-btn--active' : ''}`}
                role="radio"
                aria-label="List view"
                aria-checked={view === 'list'}
                onClick={() => setView('list')}
              >
                <Icon name="list" size={14} />
              </button>
            </div>
          </div>

          <div className="tsw__content">
            {/* ── Themes ─────────────────────────────────────── */}
            {view === 'grid' ? (
              <div className="tsw__grid" role="radiogroup" aria-label="Theme preset">
                {showSystem && (
                  <button
                    type="button"
                    className={`tsw-card${activeId === 'system' ? ' tsw-card--active' : ''}`}
                    role="radio"
                    aria-label="System default"
                    aria-checked={activeId === 'system'}
                    onClick={() => activate('system')}
                  >
                    <ThemeThumb />
                    {activeId === 'system' && (
                      <span className="tsw-card__check" aria-hidden="true">
                        <Icon name="check" size={12} />
                      </span>
                    )}
                    <span className="tsw-card__meta">
                      <span className="tsw-card__name">System</span>
                      <span className="tsw-card__mode">
                        <span className="tsw-card__dot" style={{ background: SYSTEM_SWATCH }} />
                        Auto
                      </span>
                    </span>
                  </button>
                )}
                {filteredThemes.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`tsw-card${activeId === opt.id ? ' tsw-card--active' : ''}`}
                    role="radio"
                    aria-label={opt.label}
                    aria-checked={activeId === opt.id}
                    onClick={() => activate(opt.id)}
                  >
                    <ThemeThumb opt={opt} />
                    {activeId === opt.id && (
                      <span className="tsw-card__check" aria-hidden="true">
                        <Icon name="check" size={12} />
                      </span>
                    )}
                    <span className="tsw-card__meta">
                      <span className="tsw-card__name">{opt.label}</span>
                      <span className="tsw-card__mode">
                        <span className="tsw-card__dot" style={{ background: opt.color }} />
                        {opt.mode === 'dark' ? 'Dark' : 'Light'}
                      </span>
                    </span>
                  </button>
                ))}
                {!hasResults && (
                  <p className="tsw__empty">No themes match &ldquo;{query}&rdquo;.</p>
                )}
              </div>
            ) : (
              <div className="tsw__list" role="radiogroup" aria-label="Theme preset">
                {showSystem && (
                  <button
                    type="button"
                    className={`tsw-row${activeId === 'system' ? ' tsw-row--active' : ''}`}
                    role="radio"
                    aria-checked={activeId === 'system'}
                    onClick={() => activate('system')}
                  >
                    <span className="tsw-row__swatch" style={{ background: SYSTEM_SWATCH }} aria-hidden="true" />
                    <span className="tsw-row__label">System default</span>
                    <span className="tsw-row__mode">Auto</span>
                    {activeId === 'system' && <Icon name="check" size={14} />}
                  </button>
                )}
                {filteredThemes.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`tsw-row${activeId === opt.id ? ' tsw-row--active' : ''}`}
                    role="radio"
                    aria-label={opt.label}
                    aria-checked={activeId === opt.id}
                    onClick={() => activate(opt.id)}
                  >
                    <span className="tsw-row__swatch" style={{ background: opt.color }} aria-hidden="true" />
                    <span className="tsw-row__label">{opt.label}</span>
                    <span className="tsw-row__mode">{opt.mode === 'dark' ? 'Dark' : 'Light'}</span>
                    {activeId === opt.id && <Icon name="check" size={14} />}
                  </button>
                ))}
                {!hasResults && (
                  <p className="tsw__empty">No themes match &ldquo;{query}&rdquo;.</p>
                )}
              </div>
            )}

            {/* ── Accent and color harmony ─────────────────────── */}
            <div className="tsw__section">
              <span className="tsw__section-label">Accent</span>
              <div className="tsw__accent-grid" role="radiogroup" aria-label="Accent preset">
                {ACCENT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`tsw-accent${accentPreference === option.id ? ' tsw-accent--active' : ''}`}
                    role="radio"
                    aria-checked={accentPreference === option.id}
                    onClick={() => activateAccent(option.id)}
                  >
                    <span className="tsw-accent__swatch" style={{ background: option.swatch }} aria-hidden="true" />
                    <span>{option.label}</span>
                  </button>
                ))}
                <label className={`tsw-accent tsw-accent--custom${accentPreference === 'custom' ? ' tsw-accent--active' : ''}`}>
                  <input
                    type="color"
                    value={accentCustomColor}
                    aria-label="Custom accent color"
                    onChange={event => setCustomAccentColor(event.target.value)}
                  />
                  <span className="tsw-accent__swatch" style={{ background: accentCustomColor }} aria-hidden="true" />
                  <span>Custom</span>
                </label>
              </div>
            </div>

            <div className="tsw__section">
              <span className="tsw__section-label">Color harmony</span>
              <div className="tsw__harmony-grid" role="radiogroup" aria-label="Color harmony scheme">
                <button
                  type="button"
                  className={`tsw-harmony${accentHarmony === 'none' ? ' tsw-harmony--active' : ''}`}
                  role="radio"
                  aria-checked={accentHarmony === 'none'}
                  onClick={() => activateHarmony('none')}
                >
                  Single hue
                </button>
                {HARMONY_SCHEMES.map(scheme => (
                  <button
                    key={scheme.id}
                    type="button"
                    className={`tsw-harmony${accentHarmony === scheme.id ? ' tsw-harmony--active' : ''}`}
                    role="radio"
                    aria-checked={accentHarmony === scheme.id}
                    onClick={() => activateHarmony(scheme.id)}
                    title={scheme.description}
                  >
                    {scheme.label}
                  </button>
                ))}
              </div>
              {accentHarmony === 'custom' && (
                <div className="tsw__harmony-custom">
                  <label>
                    Secondary offset
                    <input
                      type="number"
                      value={accentHarmonyCustom?.secondary ?? 120}
                      min={-360}
                      max={360}
                      onChange={event => updateCustomHarmony('secondary', event.target.value)}
                    />
                  </label>
                  <label>
                    Tertiary offset
                    <input
                      type="number"
                      value={accentHarmonyCustom?.tertiary ?? 240}
                      min={-360}
                      max={360}
                      onChange={event => updateCustomHarmony('tertiary', event.target.value)}
                    />
                  </label>
                </div>
              )}
              <div className="tsw__harmony-presets" aria-label="Harmony presets">
                {HARMONY_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    className="tsw-harmony-preset"
                    onClick={() => setHarmonyPreset(preset.id)}
                  >
                    <span aria-hidden="true" style={{ background: preset.base }} />
                    {preset.displayName}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Interface density ───────────────────────────── */}
            <div className="tsw__section">
              <span className="tsw__section-label">Interface density</span>
              <div className="tsw__density" role="radiogroup" aria-label="Interface density">
                {DENSITY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`tsw-density${density === opt.id ? ' tsw-density--active' : ''}`}
                    role="radio"
                    aria-checked={density === opt.id}
                    onClick={() => changeDensity(opt.id)}
                  >
                    <span className="tsw-density__icon" aria-hidden="true">
                      <Icon name={opt.icon} size={16} />
                    </span>
                    <span className="tsw-density__text">
                      <span className="tsw-density__name">{opt.label}</span>
                      <span className="tsw-density__desc">{opt.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Reduce motion ───────────────────────────────── */}
            <div className="tsw__section">
              <div className="tsw-option">
                <span className="tsw-option__icon" aria-hidden="true">
                  <Icon name="activity" size={16} />
                </span>
                <span className="tsw-option__text">
                  <span className="tsw-option__name" id="reduce-motion-label">Reduce motion</span>
                  <span className="tsw-option__desc">Minimize animations throughout the interface</span>
                </span>
                <button
                  type="button"
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
          </div>

          {/* Footer */}
          <div className="tsw__footer">
            <span className="tsw__footer-hint">
              <Icon name="eye" size={15} />
              <span className="tsw__footer-hint-text">
                <span className="tsw__footer-hint-title">Live preview</span>
                <span className="tsw__footer-hint-sub">Changes apply as you pick them</span>
              </span>
            </span>
            <div className="tsw__footer-actions">
              <button type="button" className="tsw-btn tsw-btn--ghost" onClick={resetToDefault}>
                <Icon name="rotate-ccw" size={13} />
                Reset
              </button>
              <button type="button" className="tsw-btn tsw-btn--primary" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
