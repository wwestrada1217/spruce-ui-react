import './PropertyPanel.css';
import { useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';

export type PropertyPanelValue = string | number | boolean | null;
export type PropertyPanelEditor = 'text' | 'number' | 'boolean' | 'select' | 'color' | 'readonly' | 'dialog' | 'compound';
export type PropertyPanelMode = 'categorized' | 'alphabetical';

export interface PropertyPanelOption { label: string; value: string; }

export interface PropertyPanelCompoundField {
  key: string;
  label: string;
  editor?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface PropertyPanelProperty {
  name: string;
  label: string;
  category?: string;
  description?: string;
  editor?: PropertyPanelEditor;
  value?: PropertyPanelValue;
  defaultValue?: PropertyPanelValue;
  modified?: boolean;
  mixed?: boolean;
  disabled?: boolean;
  options?: readonly PropertyPanelOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  fields?: readonly PropertyPanelCompoundField[];
  separator?: string;
  readonlyText?: boolean;
  actionLabel?: string;
  children?: readonly PropertyPanelProperty[];
}

export type PropertyPanelValues = Record<string, PropertyPanelValue>;
export type PropertyPanelCollapsedGroups = Record<string, boolean>;

export interface PropertyPanelChange {
  name: string;
  value: PropertyPanelValue;
  property: PropertyPanelProperty;
}

export interface PropertyPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  properties?: readonly PropertyPanelProperty[];
  values?: PropertyPanelValues;
  onValuesChange?: (values: PropertyPanelValues) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  mode?: PropertyPanelMode;
  onModeChange?: (mode: PropertyPanelMode) => void;
  collapsedGroups?: PropertyPanelCollapsedGroups;
  onCollapsedGroupsChange?: (groups: PropertyPanelCollapsedGroups) => void;
  onPropertyChange?: (event: PropertyPanelChange) => void;
  onFocusedPropertyChange?: (property: PropertyPanelProperty) => void;
  onOpenDialog?: (property: PropertyPanelProperty) => void;
  showSearch?: boolean;
  showFooter?: boolean;
  ariaLabel?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  mixedText?: string;
  uncategorizedLabel?: string;
  footerTitle?: string;
  footerText?: string;
  fallbackDescription?: string;
  className?: string;
  style?: CSSProperties;
}

interface PropertyPanelGroup {
  name: string;
  properties: readonly PropertyPanelProperty[];
}

function hasValue(values: PropertyPanelValues, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(values, name);
}

/** A compact, searchable object inspector with controlled value callbacks. */
export function PropertyPanel({
  properties = [],
  values: controlledValues,
  onValuesChange,
  query: controlledQuery,
  onQueryChange,
  mode: controlledMode,
  onModeChange,
  collapsedGroups: controlledCollapsedGroups,
  onCollapsedGroupsChange,
  onPropertyChange,
  onFocusedPropertyChange,
  onOpenDialog,
  showSearch = true,
  showFooter = true,
  ariaLabel,
  searchPlaceholder,
  emptyText,
  mixedText = '(Mixed)',
  uncategorizedLabel,
  footerTitle,
  footerText,
  fallbackDescription,
  className = '',
  style,
  ...rest
}: PropertyPanelProps) {
  const { direction, t } = useI18n();
  const [internalValues, setInternalValues] = useState<PropertyPanelValues>({});
  const [internalQuery, setInternalQuery] = useState('');
  const [internalMode, setInternalMode] = useState<PropertyPanelMode>('categorized');
  const [internalCollapsedGroups, setInternalCollapsedGroups] = useState<PropertyPanelCollapsedGroups>({});
  const [focusedName, setFocusedName] = useState<string | null>(null);
  const [expandedNames, setExpandedNames] = useState<ReadonlySet<string>>(new Set());
  const values = controlledValues ?? internalValues;
  const query = controlledQuery ?? internalQuery;
  const mode = controlledMode ?? internalMode;
  const collapsedGroups = controlledCollapsedGroups ?? internalCollapsedGroups;
  const resolvedAriaLabel = ariaLabel ?? t('propertyPanel');
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('searchProperties');
  const resolvedEmptyText = emptyText ?? t('noPropertiesFound');
  const resolvedUncategorized = uncategorizedLabel ?? t('misc');
  const resolvedFooterTitle = footerTitle ?? t('properties');
  const resolvedFooterText = footerText ?? t('focusPropertyForDescription');
  const resolvedFallbackDescription = fallbackDescription ?? t('noDescriptionAvailable');

  function resolveValue(property: PropertyPanelProperty): PropertyPanelValue {
    return hasValue(values, property.name) ? values[property.name] : property.value ?? null;
  }

  function displayValue(property: PropertyPanelProperty): string {
    if (property.mixed) return mixedText;
    const value = resolveValue(property);
    if (value === null || value === '') return '';
    if (typeof value === 'boolean') return value ? 'True' : 'False';
    return String(value);
  }

  function editorFor(property: PropertyPanelProperty): PropertyPanelEditor {
    return property.editor ?? 'text';
  }

  const filteredProperties = (() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return properties;
    return properties.filter((property) => [
      property.name,
      property.label,
      property.category ?? '',
      property.description ?? '',
      displayValue(property),
    ].join(' ').toLocaleLowerCase().includes(normalizedQuery));
  })();

  const visibleGroups = useMemo<readonly PropertyPanelGroup[]>(() => {
    const sortProperties = (items: readonly PropertyPanelProperty[]) =>
      [...items].sort((left, right) => left.label.localeCompare(right.label));
    if (mode === 'alphabetical') return [{ name: t('alphabetical'), properties: sortProperties(filteredProperties) }];
    const groups = new Map<string, PropertyPanelProperty[]>();
    filteredProperties.forEach((property) => {
      const groupName = property.category || resolvedUncategorized;
      const group = groups.get(groupName);
      if (group) group.push(property);
      else groups.set(groupName, [property]);
    });
    return [...groups.entries()].map(([name, groupProperties]) => ({
      name,
      properties: sortProperties(groupProperties),
    }));
  }, [filteredProperties, mode, resolvedUncategorized, t]);

  const focusedProperty = useMemo(() => {
    const flattened = visibleGroups
      .filter((group) => mode === 'alphabetical' || collapsedGroups[group.name] !== true)
      .flatMap((group) => group.properties.flatMap((property) => [property, ...(property.children ?? [])]));
    return flattened.find((property) => property.name === focusedName) ?? flattened[0] ?? null;
  }, [collapsedGroups, focusedName, mode, visibleGroups]);

  function commitValues(next: PropertyPanelValues): void {
    if (controlledValues === undefined) setInternalValues(next);
    onValuesChange?.(next);
  }

  function commitQuery(next: string): void {
    if (controlledQuery === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  }

  function commitMode(next: PropertyPanelMode): void {
    if (controlledMode === undefined) setInternalMode(next);
    onModeChange?.(next);
  }

  function commitCollapsedGroups(next: PropertyPanelCollapsedGroups): void {
    if (controlledCollapsedGroups === undefined) setInternalCollapsedGroups(next);
    onCollapsedGroupsChange?.(next);
  }

  function focusProperty(property: PropertyPanelProperty): void {
    if (focusedName === property.name) return;
    setFocusedName(property.name);
    onFocusedPropertyChange?.(property);
  }

  function setPropertyValue(property: PropertyPanelProperty, value: PropertyPanelValue): void {
    if (property.disabled) return;
    const next = { ...values, [property.name]: value };
    commitValues(next);
    onPropertyChange?.({ name: property.name, value, property });
  }

  function valueText(property: PropertyPanelProperty): string {
    const value = resolveValue(property);
    return value === null ? '' : String(value);
  }

  function booleanValue(property: PropertyPanelProperty): boolean { return resolveValue(property) === true; }
  function numberValue(property: PropertyPanelProperty): string {
    const value = resolveValue(property);
    return typeof value === 'number' ? String(value) : '';
  }
  function selectValue(property: PropertyPanelProperty): string {
    if (property.mixed) return '';
    const value = resolveValue(property);
    return typeof value === 'string' ? value : '';
  }
  function colorValue(property: PropertyPanelProperty): string {
    const value = valueText(property);
    return /^#[\da-f]{6}$/i.test(value) ? value : '#000000';
  }
  function isModified(property: PropertyPanelProperty): boolean {
    if (property.modified !== undefined) return property.modified;
    return property.defaultValue !== undefined && resolveValue(property) !== property.defaultValue;
  }
  function isCollapsed(name: string): boolean { return mode === 'categorized' && collapsedGroups[name] === true; }
  function isExpanded(property: PropertyPanelProperty): boolean { return expandedNames.has(property.name); }
  function toggleExpanded(property: PropertyPanelProperty): void {
    setExpandedNames((current) => {
      const next = new Set(current);
      if (next.has(property.name)) next.delete(property.name); else next.add(property.name);
      return next;
    });
  }
  function compoundParts(property: PropertyPanelProperty): string[] {
    const raw = property.mixed ? '' : valueText(property);
    const parts = raw ? raw.split(property.separator || ',').map((part) => part.trim()) : [];
    const count = property.fields?.length ?? parts.length;
    return Array.from({ length: count }, (_, index) => parts[index] ?? '');
  }
  function setCompoundField(property: PropertyPanelProperty, index: number, value: string): void {
    const parts = compoundParts(property);
    parts[index] = value.trim();
    setPropertyValue(property, parts.join(property.separator || ','));
  }

  function renderEditor(property: PropertyPanelProperty): ReactNode {
    const disabled = property.disabled;
    const textInput = (
      <input
        type="text"
        disabled={disabled}
        placeholder={property.mixed ? mixedText : property.placeholder || ''}
        value={property.mixed ? '' : valueText(property)}
        onChange={(event) => setPropertyValue(property, event.target.value)}
      />
    );
    switch (editorFor(property)) {
      case 'boolean':
        return (
          <button
            className="sp-property-panel__checkbox"
            type="button"
            role="checkbox"
            disabled={disabled}
            aria-checked={property.mixed ? 'mixed' : booleanValue(property)}
            onClick={() => setPropertyValue(property, property.mixed ? true : !booleanValue(property))}
          >
            <span aria-hidden="true" />
            <strong>{property.mixed ? mixedText : booleanValue(property) ? 'True' : 'False'}</strong>
          </button>
        );
      case 'select':
        return (
          <select disabled={disabled} value={selectValue(property)} onChange={(event) => setPropertyValue(property, event.target.value)}>
            {property.mixed && <option value="" disabled>{mixedText}</option>}
            {(property.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            disabled={disabled}
            placeholder={property.mixed ? mixedText : property.placeholder || ''}
            value={numberValue(property)}
            min={property.min}
            max={property.max}
            step={property.step}
            onChange={(event) => setPropertyValue(property, event.target.value === '' ? null : Number(event.target.value))}
          />
        );
      case 'color':
        return (
          <div className="sp-property-panel__color">
            <input type="color" disabled={disabled} value={colorValue(property)} onChange={(event) => setPropertyValue(property, event.target.value)} />
            <input type="text" disabled={disabled} placeholder={property.mixed ? mixedText : property.placeholder || '#000000'} value={property.mixed ? '' : valueText(property)} onChange={(event) => setPropertyValue(property, event.target.value)} />
          </div>
        );
      case 'dialog':
        return (
          <div className="sp-property-panel__dialog">
            <input type="text" disabled={disabled} readOnly={property.readonlyText === true} placeholder={property.mixed ? mixedText : property.placeholder || ''} value={property.mixed ? '' : valueText(property)} onChange={(event) => setPropertyValue(property, event.target.value)} />
            <button type="button" className="sp-property-panel__dots" disabled={disabled} aria-label={property.actionLabel || `Open ${property.label} editor`} onClick={() => !disabled && onOpenDialog?.(property)}><span aria-hidden="true">…</span></button>
          </div>
        );
      case 'compound':
        return (
          <div className="sp-property-panel__compound">
            <button type="button" className="sp-property-panel__compound-toggle" aria-expanded={isExpanded(property)} aria-label={`${isExpanded(property) ? t('collapse') : t('expand')} ${property.label}`} onClick={() => toggleExpanded(property)}>
              <Icon name="chevron-down" size={12} />
            </button>
            {textInput}
          </div>
        );
      case 'readonly':
        return <span className="sp-property-panel__readonly">{displayValue(property)}</span>;
      default:
        return textInput;
    }
  }

  function renderProperty(property: PropertyPanelProperty, sub = false): ReactNode {
    return (
      <div
        className={[
          'sp-property-panel__row',
          sub && 'sp-property-panel__row--sub',
          isModified(property) && 'sp-property-panel__row--modified',
          property.disabled && 'sp-property-panel__row--disabled',
          focusedName === property.name && 'sp-property-panel__row--focused',
        ].filter(Boolean).join(' ')}
        role="row"
        key={property.name}
        onFocus={() => focusProperty(property)}
        onMouseEnter={() => focusProperty(property)}
      >
        <div className="sp-property-panel__name" role="rowheader">
          <span>{property.label}</span>
          {isModified(property) && <span className="sp-property-panel__modified-dot" aria-label={t('modified')} />}
        </div>
        <div className="sp-property-panel__editor" role="cell">{renderEditor(property)}</div>
      </div>
    );
  }

  const body = visibleGroups.length > 0 ? visibleGroups.map((group) => (
    <div key={group.name}>
      {mode === 'categorized' && (
        <button className="sp-property-panel__category" type="button" aria-expanded={!isCollapsed(group.name)} onClick={() => commitCollapsedGroups({ ...collapsedGroups, [group.name]: !collapsedGroups[group.name] })}>
          <Icon name="chevron-down" size={14} className={isCollapsed(group.name) ? 'sp-property-panel__category-icon--collapsed' : ''} />
          <span>{group.name}</span>
          <strong>{group.properties.length}</strong>
        </button>
      )}
      {(mode === 'alphabetical' || !isCollapsed(group.name)) && group.properties.map((property) => (
        <div key={property.name}>
          {renderProperty(property)}
          {editorFor(property) === 'compound' && isExpanded(property) && (property.fields ?? []).map((field, index) => (
            <div className="sp-property-panel__row sp-property-panel__row--sub" role="row" key={field.key}>
              <div className="sp-property-panel__name" role="rowheader"><span>{field.label}</span></div>
              <div className="sp-property-panel__editor" role="cell">
                <input type={field.editor === 'text' ? 'text' : 'number'} disabled={property.disabled} placeholder={field.placeholder || ''} value={compoundParts(property)[index] ?? ''} min={field.min} max={field.max} step={field.step} onChange={(event) => setCompoundField(property, index, event.target.value)} />
              </div>
            </div>
          ))}
          {(property.children ?? []).map((child) => renderProperty(child, true))}
        </div>
      ))}
    </div>
  )) : <p className="sp-property-panel__empty">{resolvedEmptyText}</p>;

  return (
    <section {...rest} className={['sp-property-panel', className].filter(Boolean).join(' ')} style={style} aria-label={resolvedAriaLabel} dir={direction}>
      <header className="sp-property-panel__toolbar">
        {showSearch && (
          <label className="sp-property-panel__search">
            <Icon name="search" size={14} />
            <input type="search" aria-label={resolvedSearchPlaceholder} placeholder={resolvedSearchPlaceholder} value={query} onChange={(event) => commitQuery(event.target.value)} />
            {query && <button type="button" aria-label={t('clearPropertySearch')} onClick={() => commitQuery('')}><Icon name="x" size={12} /></button>}
          </label>
        )}
        <div className="sp-property-panel__modes" role="radiogroup" aria-label={t('propertyOrder')}>
          <button type="button" role="radio" aria-label={t('categorized')} aria-checked={mode === 'categorized'} title={t('categorized')} className={mode === 'categorized' ? 'sp-property-panel__mode--active' : ''} onClick={() => commitMode('categorized')}><Icon name="filter" size={14} /></button>
          <button type="button" role="radio" aria-label={t('alphabetical')} aria-checked={mode === 'alphabetical'} title={t('alphabetical')} className={mode === 'alphabetical' ? 'sp-property-panel__mode--active' : ''} onClick={() => commitMode('alphabetical')}><span aria-hidden="true">A-Z</span></button>
        </div>
      </header>
      <div className="sp-property-panel__body" role="table" aria-label={`${resolvedAriaLabel} rows`}>{body}</div>
      {showFooter && (
        <footer className="sp-property-panel__footer" aria-live="polite">
          <strong title={focusedProperty?.label ?? resolvedFooterTitle}>{focusedProperty?.label ?? resolvedFooterTitle}</strong>
          <span title={focusedProperty?.description || resolvedFallbackDescription}>{focusedProperty?.description || resolvedFooterText}</span>
        </footer>
      )}
    </section>
  );
}

export type SpPropertyPanelProps = PropertyPanelProps;
export type SpPropertyPanelMode = PropertyPanelMode;
export type SpPropertyPanelValue = PropertyPanelValue;
export type SpPropertyPanelEditor = PropertyPanelEditor;
export type SpPropertyPanelOption = PropertyPanelOption;
export type SpPropertyPanelCompoundField = PropertyPanelCompoundField;
export type SpPropertyPanelProperty = PropertyPanelProperty;
export type SpPropertyPanelValues = PropertyPanelValues;
export type SpPropertyPanelCollapsedGroups = PropertyPanelCollapsedGroups;
export type SpPropertyPanelChange = PropertyPanelChange;
