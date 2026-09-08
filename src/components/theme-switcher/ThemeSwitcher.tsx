import './ThemeSwitcher.css';
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { ACCENT_OPTIONS } from '../../theme/accent-presets.js';
import { HARMONY_PRESETS, HARMONY_SCHEMES, type HarmonySelection } from '../../theme/accent-harmony.js';
import { useTheme } from '../../theme/theme-context.js';
import type { SpruceTheme } from '../../theme/types.js';
import { Icon } from '../../icons/Icon.js';
import { Button } from '../button/Button.js';
import { HarmonyWheel } from '../harmony-wheel/HarmonyWheel.js';
import { Popover } from '../popover/Popover.js';
import { Select } from '../select/Select.js';
import { Switch } from '../switch/Switch.js';

export type ThemeSwitcherTrigger = 'icon' | 'button' | 'menu' | 'custom';
export type ThemeSwitcherView = 'grid' | 'list';
export type ThemeSwitcherModeFilter = 'all' | 'light' | 'dark';
export type ThemeDensity = 'dense' | 'default' | 'comfortable';

interface ThemeOption {
  id: string;
  label: string;
  color: string;
  mode: 'light' | 'dark';
}

export interface ThemeSwitcherPanelProps {
  showHeader?: boolean;
  showFooter?: boolean;
  dismissible?: boolean;
  heading?: string;
  description?: string;
  view?: ThemeSwitcherView;
  defaultView?: ThemeSwitcherView;
  onViewChange?: (view: ThemeSwitcherView) => void;
  density?: ThemeDensity;
  defaultDensity?: ThemeDensity;
  onDensityChange?: (density: ThemeDensity) => void;
  reducedMotion?: boolean;
  defaultReducedMotion?: boolean;
  onReducedMotionChange?: (reduced: boolean) => void;
  resetLabel?: string;
  applyLabel?: string;
  onReset?: () => void;
  onApply?: () => void;
  onClose?: () => void;
  className?: string;
}

export interface ThemeSwitcherProps extends Omit<ThemeSwitcherPanelProps, 'className'> {
  trigger?: ThemeSwitcherTrigger;
  label?: string;
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  panelClassName?: string;
}

const MODE_FILTERS = [
  { label: 'All modes', value: 'all' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const DENSITIES: { id: ThemeDensity; label: string; description: string; icon: string }[] = [
  { id: 'dense', label: 'Compact', description: 'More content on screen', icon: 'menu' },
  { id: 'default', label: 'Comfortable', description: 'Balanced spacing', icon: 'list' },
  { id: 'comfortable', label: 'Spacious', description: 'More breathing room', icon: 'layout-list' },
];

const SYSTEM_SWATCH = 'conic-gradient(var(--sp-surface-900) 0deg 180deg, var(--sp-surface-0) 180deg 360deg)';
const DENSITY_STORAGE_KEY = 'spruce-density-preference';
const MOTION_STORAGE_KEY = 'spruce-reduce-motion';

function readStoredDensity(): ThemeDensity {
  if (typeof window === 'undefined') return 'default';
  try {
    const value = window.localStorage.getItem(DENSITY_STORAGE_KEY);
    return value === 'dense' || value === 'comfortable' ? value : 'default';
  } catch {
    return 'default';
  }
}

function readStoredMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try { return window.localStorage.getItem(MOTION_STORAGE_KEY) === 'true'; }
  catch { return false; }
}

function writeStoredPreference(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, value); }
  catch { /* Storage is optional in private/embedded contexts. */ }
}

function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value === undefined ? internal : value;
  function set(next: T) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }
  return [current, set] as const;
}

function applyDocumentPreference(name: 'data-density' | 'data-reduce-motion', value: string | null) {
  if (typeof document === 'undefined') return;
  if (value === null) document.documentElement.removeAttribute(name);
  else document.documentElement.setAttribute(name, value);
}

function themeOptions(registered: SpruceTheme[]): ThemeOption[] {
  const seen = new Set<string>();
  const light = registered.find(theme => theme.name === 'spruce');
  const dark = registered.find(theme => theme.name === 'spruce-dark');
  const base: ThemeOption[] = [
    { id: 'light', label: 'Spruce', color: light?.tokens['--sp-primary'] ?? 'var(--sp-primary)', mode: 'light' },
    { id: 'dark', label: 'Spruce Dark', color: dark?.tokens['--sp-primary'] ?? 'var(--sp-primary)', mode: 'dark' },
  ];
  return [...base, ...registered.filter(theme => theme.name !== 'spruce' && theme.name !== 'spruce-dark').map(theme => ({
    id: theme.name,
    label: theme.displayName,
    color: theme.tokens['--sp-primary'] ?? (theme.base === 'dark' ? 'var(--sp-surface-700)' : 'var(--sp-primary)'),
    mode: theme.base,
  }))].filter(option => !seen.has(option.id) && seen.add(option.id));
}

function ThemePreview({ option }: { option?: ThemeOption }) {
  return (
    <span
      className={['sp-theme-switcher__preview', !option && 'sp-theme-switcher__preview--system'].filter(Boolean).join(' ')}
      data-mode={option?.mode}
      style={option ? ({ '--sp-theme-preview-accent': option.color } as CSSProperties) : undefined}
      aria-hidden="true"
    >
      <span /><span /><span />
    </span>
  );
}

/** Reusable appearance editor for pages, drawers, dialogs, and ThemeSwitcher. */
export function ThemeSwitcherPanel({
  showHeader = true,
  showFooter = true,
  dismissible = true,
  heading = 'Appearance',
  description = 'Theme, density, accent, and motion',
  view: controlledView,
  defaultView = 'grid',
  onViewChange,
  density: controlledDensity,
  defaultDensity = readStoredDensity(),
  onDensityChange,
  reducedMotion: controlledReducedMotion,
  defaultReducedMotion = readStoredMotion(),
  onReducedMotionChange,
  resetLabel = 'Reset',
  applyLabel = 'Done',
  onReset,
  onApply,
  onClose,
  className = '',
}: ThemeSwitcherPanelProps) {
  const theme = useTheme();
  const [view, setView] = useControllableState(controlledView, defaultView, onViewChange);
  const [density, setDensityState] = useControllableState(controlledDensity, defaultDensity, onDensityChange);
  const [reducedMotion, setReducedMotionState] = useControllableState(controlledReducedMotion, defaultReducedMotion, onReducedMotionChange);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ThemeSwitcherModeFilter>('all');
  const [wheelOpen, setWheelOpen] = useState(false);

  useEffect(() => {
    applyDocumentPreference('data-density', density);
    applyDocumentPreference('data-reduce-motion', reducedMotion ? 'true' : null);
  }, [density, reducedMotion]);

  const options = useMemo(() => themeOptions(theme.getRegisteredThemes()), [theme]);
  const filtered = options.filter(option =>
    (filter === 'all' || option.mode === filter) && option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const showSystem = filter === 'all' && (query.trim() === '' || 'system default'.includes(query.trim().toLowerCase()));

  function changeDensity(next: ThemeDensity) {
    setDensityState(next);
    applyDocumentPreference('data-density', next);
    writeStoredPreference(DENSITY_STORAGE_KEY, next);
  }

  function changeMotion(next: boolean) {
    setReducedMotionState(next);
    applyDocumentPreference('data-reduce-motion', next ? 'true' : null);
    writeStoredPreference(MOTION_STORAGE_KEY, String(next));
  }

  function reset() {
    theme.setTheme('system');
    theme.resetAccent();
    changeDensity('default');
    changeMotion(false);
    setQuery('');
    setFilter('all');
    setWheelOpen(false);
    onReset?.();
  }

  const harmonySelection: HarmonySelection = theme.harmonySelection ?? 'triadic';
  const selectTheme = (id: string) => {
    theme.setTheme(id);
    if (id === 'light' || id === 'dark' || id === 'system') theme.resetAccent();
  };

  return (
    <section className={['sp-theme-switcher-panel', className].filter(Boolean).join(' ')} aria-label={heading}>
      {showHeader && (
        <header className="sp-theme-switcher-panel__header">
          <span className="sp-theme-switcher-panel__badge" aria-hidden="true"><Icon name="palette" size={18} /></span>
          <span className="sp-theme-switcher-panel__heading"><strong>{heading}</strong>{description && <small>{description}</small>}</span>
          {dismissible && <Button variant="ghost" size="sm" iconOnly iconLeft="x" aria-label={`Close ${heading}`} onClick={onClose} />}
        </header>
      )}

      <div className="sp-theme-switcher-panel__filters">
        <label className="sp-theme-switcher-panel__search">
          <span className="sp-theme-switcher-panel__visually-hidden">Search themes</span>
          <Icon name="search" size={14} aria-hidden="true" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search themes…" />
        </label>
        <Select options={MODE_FILTERS} value={filter} onChange={value => setFilter(value as ThemeSwitcherModeFilter)} size="sm" ariaLabel="Filter themes by mode" />
        <div className="sp-theme-switcher-panel__view" role="radiogroup" aria-label="Theme layout">
          {(['grid', 'list'] as const).map(next => <Button key={next} variant="ghost" size="sm" iconOnly iconLeft={next === 'grid' ? 'layout-grid' : 'list'} active={view === next} aria-label={`${next} view`} aria-pressed={view === next} onClick={() => setView(next)} />)}
        </div>
      </div>

      <div className="sp-theme-switcher-panel__content">
        <div className={`sp-theme-switcher-panel__themes sp-theme-switcher-panel__themes--${view}`} role="radiogroup" aria-label="Theme preset">
          {showSystem && <ThemeChoice id="system" label="System default" color={SYSTEM_SWATCH} mode="light" active={theme.preference === 'system'} onSelect={selectTheme} />}
          {filtered.map(option => <ThemeChoice key={option.id} {...option} active={theme.preference === option.id} onSelect={selectTheme} />)}
          {!showSystem && filtered.length === 0 && <p className="sp-theme-switcher-panel__empty">No matching themes.</p>}
        </div>

        <fieldset className="sp-theme-switcher-panel__section">
          <legend>Accent</legend>
          <div className="sp-theme-switcher-panel__chips" role="radiogroup" aria-label="Accent preset">
            {ACCENT_OPTIONS.map(option => <button key={option.id} type="button" role="radio" aria-checked={theme.accentPreference === option.id} className={theme.accentPreference === option.id ? 'is-active' : ''} onClick={() => theme.setAccent(option.id)}><span style={{ background: option.swatch }} aria-hidden="true" />{option.label}</button>)}
            <label className={theme.accentPreference === 'custom' ? 'is-active' : ''}><input type="color" value={theme.accentCustomColor} aria-label="Custom accent color" onChange={event => theme.setCustomAccentColor(event.target.value)} /><span style={{ background: theme.accentCustomColor }} aria-hidden="true" />Custom</label>
          </div>
        </fieldset>

        <fieldset className="sp-theme-switcher-panel__section">
          <legend>Color harmony</legend>
          <div className="sp-theme-switcher-panel__chips" role="radiogroup" aria-label="Color harmony scheme">
            <button type="button" role="radio" aria-checked={theme.accentHarmony === 'none'} className={theme.accentHarmony === 'none' ? 'is-active' : ''} onClick={() => theme.setAccentHarmony('none')}>Single hue</button>
            {HARMONY_SCHEMES.map(option => <button key={option.id} type="button" role="radio" aria-checked={theme.accentHarmony === option.id} className={theme.accentHarmony === option.id ? 'is-active' : ''} onClick={() => theme.setAccentHarmony(option.id)}>{option.label}</button>)}
          </div>
          <Button variant="outline" size="sm" iconLeft="palette" aria-expanded={wheelOpen} onClick={() => setWheelOpen(open => !open)}>Edit harmony</Button>
          {wheelOpen && <HarmonyWheel base={theme.accentHarmonyBase} selection={harmonySelection} onBaseChange={theme.setCustomAccentColor} onSelectionChange={selection => typeof selection === 'string' ? theme.setAccentHarmony(selection) : theme.setAccentHarmonyCustom(selection)} />}
          <div className="sp-theme-switcher-panel__presets" aria-label="Harmony presets">
            {HARMONY_PRESETS.map(preset => <button key={preset.id} type="button" onClick={() => theme.setHarmonyPreset(preset.id)}><span style={{ background: preset.base }} aria-hidden="true" />{preset.displayName}</button>)}
          </div>
        </fieldset>

        <fieldset className="sp-theme-switcher-panel__section">
          <legend>Interface density</legend>
          <div className="sp-theme-switcher-panel__density" role="radiogroup">
            {DENSITIES.map(option => <button key={option.id} type="button" role="radio" aria-checked={density === option.id} className={density === option.id ? 'is-active' : ''} onClick={() => changeDensity(option.id)}><Icon name={option.icon} size={16} /><span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}
          </div>
        </fieldset>

        <div className="sp-theme-switcher-panel__motion">
          <span><strong>Reduce motion</strong><small>Minimize animation throughout the interface</small></span>
          <Switch checked={reducedMotion} onChange={changeMotion} ariaLabel="Reduce motion" />
        </div>
      </div>

      {showFooter && <footer className="sp-theme-switcher-panel__footer"><span>Changes preview immediately</span><div><Button variant="outline" size="sm" iconLeft="rotate-ccw" onClick={reset}>{resetLabel}</Button><Button size="sm" onClick={() => { onApply?.(); onClose?.(); }}>{applyLabel}</Button></div></footer>}
    </section>
  );
}

function ThemeChoice({ id, label, color, mode, active, onSelect }: ThemeOption & { active: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className={['sp-theme-switcher__theme', active && 'is-active'].filter(Boolean).join(' ')} role="radio" aria-checked={active} onClick={() => onSelect(id)}><ThemePreview option={id === 'system' ? undefined : { id, label, color, mode }} /><span><strong>{label}</strong><small>{id === 'system' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}</small></span>{active && <Icon name="check" size={13} />}</button>;
}

/** Trigger plus popover convenience wrapper around ThemeSwitcherPanel. */
export function ThemeSwitcher({
  trigger = 'icon', label = 'Appearance', children, open: controlledOpen, defaultOpen = false,
  onOpenChange, className = '', panelClassName = '', onClose, onApply, ...panelProps
}: ThemeSwitcherProps) {
  const theme = useTheme();
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);
  const registered = theme.getRegisteredThemes();
  const active = themeOptions(registered).find(candidate => candidate.id === theme.preference);
  const activeLabel = theme.preference === 'system' ? 'System' : active?.label ?? String(theme.preference);
  const activeColor = active?.color ?? SYSTEM_SWATCH;
  const close = () => { setOpen(false); onClose?.(); };
  const triggerNode = trigger === 'custom' ? children : (
    <button type="button" className={`sp-theme-switcher__trigger sp-theme-switcher__trigger--${trigger}`} aria-label={`${label}: ${activeLabel}`}>
      <span className="sp-theme-switcher__swatch" style={{ background: activeColor }} aria-hidden="true" />
      <Icon name="palette" size={16} aria-hidden="true" />
      {trigger !== 'icon' && <><span className="sp-theme-switcher__label">{label}</span><small>{activeLabel}</small><Icon name={trigger === 'menu' ? 'chevron-right' : 'chevron-down'} size={14} aria-hidden="true" /></>}
    </button>
  );
  return <Popover className={className} panelClassName={['sp-theme-switcher__popover', panelClassName].filter(Boolean).join(' ')} panelAriaLabel={label} padding="0" placement={trigger === 'menu' ? 'right-start' : 'bottom-end'} open={open} onOpenChange={setOpen} trigger={triggerNode ?? <span />}><ThemeSwitcherPanel {...panelProps} onApply={() => { onApply?.(); setOpen(false); }} onClose={close} /></Popover>;
}
