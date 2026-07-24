import './Tabs.css';
import { useState, useCallback, useId, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface TabItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  /** Tab definitions. Each item describes a tab header and its panel content. */
  tabs: TabItem[];
  /** Controlled active index. When provided, the component is fully controlled. */
  activeIndex?: number;
  /** Initial active index for uncontrolled mode. Defaults to 0. */
  defaultActiveIndex?: number;
  /** Callback fired when the active tab changes. Receives the new index. */
  onChange?: (index: number) => void;
  /** When true, renders tabs vertically on the left side. */
  vertical?: boolean;
  /** Additional CSS class name(s) for the root element. */
  className?: string;
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function Tabs({
  tabs,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onChange,
  vertical = false,
  className = '',
}: TabsProps) {
  const isControlled = controlledIndex !== undefined;
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultActiveIndex);
  const current = isControlled ? controlledIndex : uncontrolledIndex;
  const baseId = useId();

  const handleSelect = useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (!tab || tab.disabled) return;

      if (!isControlled) {
        setUncontrolledIndex(index);
      }
      onChange?.(index);
    },
    [tabs, isControlled, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabledIndices = tabs
        .map((t, i) => (t.disabled ? -1 : i))
        .filter((i) => i !== -1);

      if (enabledIndices.length === 0) return;

      const currentEnabledPos = enabledIndices.indexOf(current);
      let nextIndex: number | undefined;

      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';

      if (e.key === nextKey) {
        e.preventDefault();
        const pos =
          currentEnabledPos === -1
            ? 0
            : (currentEnabledPos + 1) % enabledIndices.length;
        nextIndex = enabledIndices[pos];
      } else if (e.key === prevKey) {
        e.preventDefault();
        const pos =
          currentEnabledPos === -1
            ? enabledIndices.length - 1
            : (currentEnabledPos - 1 + enabledIndices.length) %
              enabledIndices.length;
        nextIndex = enabledIndices[pos];
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = enabledIndices[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = enabledIndices[enabledIndices.length - 1];
      }

      if (nextIndex !== undefined) {
        handleSelect(nextIndex);
        // Focus the newly activated tab button
        const btn = (e.currentTarget as HTMLElement).querySelector(
          `[data-tab-index="${nextIndex}"]`,
        ) as HTMLElement | null;
        btn?.focus();
      }
    },
    [tabs, current, vertical, handleSelect],
  );

  const rootClasses = [
    'sp-tabs',
    vertical && 'sp-tabs--vertical',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div
        className="sp-tabs__header"
        role="tablist"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => {
          const isActive = index === current;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          const tabClasses = [
            'sp-tabs__tab',
            isActive && 'sp-tabs__tab--active',
            tab.disabled && 'sp-tabs__tab--disabled',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={index}
              id={tabId}
              className={tabClasses}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              aria-disabled={tab.disabled || undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              data-tab-index={index}
              onClick={() => handleSelect(index)}
            >
              {tab.icon && <Icon name={tab.icon} size={14} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="sp-tabs__panels">
        {tabs.map((tab, index) => {
          const isActive = index === current;
          if (!isActive) return null;

          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <div
              key={index}
              id={panelId}
              className="sp-tab-panel"
              role="tabpanel"
              aria-labelledby={tabId}
              tabIndex={0}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
