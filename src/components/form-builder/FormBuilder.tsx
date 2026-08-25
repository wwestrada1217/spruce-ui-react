import './FormBuilder.css';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';
import { Button } from '../button/Button.js';
import { Checkbox } from '../checkbox/Checkbox.js';
import { Combobox } from '../combobox/Combobox.js';
import { DatePicker } from '../date-picker/DatePicker.js';
import { DateRangePicker, type DateRange } from '../date-range-picker/DateRangePicker.js';
import { Field } from '../field/Field.js';
import { GridCombobox } from '../grid-combobox/GridCombobox.js';
import { Input } from '../input/Input.js';
import { MaskedInput } from '../masked-input/MaskedInput.js';
import { Radio, RadioGroup } from '../radio/Radio.js';
import { Select } from '../select/Select.js';
import { Switch } from '../switch/Switch.js';
import { Textarea } from '../textarea/Textarea.js';

export type FormBuilderFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'daterange'
  | 'radio'
  | 'masked'
  | 'combobox'
  | 'grid-combobox'
  | 'datagrid';

export interface FormBuilderOption {
  label: string;
  value: string;
}

export interface FormBuilderGridColumn {
  key: string;
  label: string;
  width?: string;
}

export interface FormBuilderField {
  id: string;
  name: string;
  type: FormBuilderFieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: FormBuilderOption[];
  defaultValue?: unknown;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  mask?: string;
  columns?: FormBuilderGridColumn[];
  inputMode?: boolean;
  tabId?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FormBuilderTab {
  id: string;
  label: string;
}

export interface FormBuilderSection {
  id: string;
  title: string;
  description?: string;
  cols?: number;
  tabs?: FormBuilderTab[];
  fields: FormBuilderField[];
}

export interface FormBuilderSchema {
  sections: FormBuilderSection[];
}

export type FormBuilderMode = 'design' | 'preview';

export interface FormBuilderSubmitEvent {
  value: Record<string, unknown>;
  valid: boolean;
  errors: Record<string, string[]>;
}

export interface FormBuilderHandle {
  save(): FormBuilderSchema;
  restore(schema: FormBuilderSchema): void;
  submit(): void;
  resetValues(): void;
  addSection(title?: string): string;
  removeSection(sectionId: string): void;
  addField(sectionId: string, type: FormBuilderFieldType): string;
  removeField(fieldId: string): void;
}

export interface FormBuilderProps {
  schema?: FormBuilderSchema;
  onSchemaChange?: (schema: FormBuilderSchema) => void;
  value?: Record<string, unknown>;
  onValueChange?: (value: Record<string, unknown>) => void;
  mode?: FormBuilderMode;
  onModeChange?: (mode: FormBuilderMode) => void;
  readOnly?: boolean;
  /** Alias for consumers migrating from Angular's `[readonly]` input. */
  readonly?: boolean;
  showToolbar?: boolean;
  showPalette?: boolean;
  showProperties?: boolean;
  toolbar?: ReactNode;
  onSubmit?: (event: FormBuilderSubmitEvent) => void;
  className?: string;
  style?: CSSProperties;
}

interface FieldMeta {
  type: FormBuilderFieldType;
  label: string;
  icon: string;
  defaultLabel: string;
  defaultW: number;
  defaultH: number;
  defaultValue: unknown;
}

const FIELD_TYPES: readonly FieldMeta[] = [
  { type: 'text', label: 'Text', icon: 'text-cursor-input', defaultLabel: 'Text field', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'email', label: 'Email', icon: 'mail', defaultLabel: 'Email', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'number', label: 'Number', icon: 'hash', defaultLabel: 'Number', defaultW: 4, defaultH: 2, defaultValue: 0 },
  { type: 'password', label: 'Password', icon: 'lock', defaultLabel: 'Password', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'tel', label: 'Phone', icon: 'hash', defaultLabel: 'Phone', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'url', label: 'URL', icon: 'link', defaultLabel: 'URL', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'textarea', label: 'Textarea', icon: 'align-left', defaultLabel: 'Description', defaultW: 12, defaultH: 3, defaultValue: '' },
  { type: 'select', label: 'Select', icon: 'chevron-down', defaultLabel: 'Choose one', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'checkbox', label: 'Checkbox', icon: 'square-check', defaultLabel: 'Accept', defaultW: 6, defaultH: 1, defaultValue: false },
  { type: 'switch', label: 'Switch', icon: 'toggle-left', defaultLabel: 'Enabled', defaultW: 6, defaultH: 1, defaultValue: false },
  { type: 'date', label: 'Date', icon: 'calendar', defaultLabel: 'Date', defaultW: 6, defaultH: 2, defaultValue: null },
  { type: 'daterange', label: 'Date range', icon: 'calendar-range', defaultLabel: 'Date range', defaultW: 8, defaultH: 2, defaultValue: { start: null, end: null } },
  { type: 'radio', label: 'Radio', icon: 'circle-dot', defaultLabel: 'Pick one', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'masked', label: 'Masked', icon: 'hash', defaultLabel: 'Formatted value', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'combobox', label: 'Combobox', icon: 'search', defaultLabel: 'Search options', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'grid-combobox', label: 'Grid Combobox', icon: 'layout-grid', defaultLabel: 'Pick one', defaultW: 6, defaultH: 2, defaultValue: '' },
  { type: 'datagrid', label: 'Datagrid', icon: 'table', defaultLabel: 'Rows', defaultW: 12, defaultH: 5, defaultValue: [] },
];

const EMPTY_SCHEMA: FormBuilderSchema = { sections: [] };
let nextBuilderId = 0;

function nextId(prefix: string): string {
  nextBuilderId += 1;
  return `sp-fb-${prefix}-${nextBuilderId}`;
}

function cloneUnknown(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneUnknown);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneUnknown(item)]));
  }
  return value;
}

function cloneSchema(schema: FormBuilderSchema): FormBuilderSchema {
  return {
    sections: schema.sections.map((section) => ({
      ...section,
      tabs: section.tabs?.map((tab) => ({ ...tab })),
      fields: section.fields.map((field) => ({
        ...field,
        options: field.options?.map((option) => ({ ...option })),
        columns: field.columns?.map((column) => ({ ...column })),
        defaultValue: cloneUnknown(field.defaultValue),
      })),
    })),
  };
}

function defaultValueForType(type: FormBuilderFieldType): unknown {
  const meta = FIELD_TYPES.find((item) => item.type === type);
  return cloneUnknown(meta?.defaultValue ?? '');
}

function findFreeSlot(fields: readonly FormBuilderField[], cols: number, width: number, height: number): { x: number; y: number } {
  for (let y = 0; y < 100; y += 1) {
    for (let x = 0; x + width <= cols; x += 1) {
      const overlaps = fields.some((field) => !(field.x + field.w <= x || x + width <= field.x || field.y + field.h <= y || y + height <= field.y));
      if (!overlaps) return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

function validateField(field: FormBuilderField, value: unknown): string[] {
  const errors: string[] = [];
  const range = field.type === 'daterange' && value && typeof value === 'object' ? value as DateRange : null;
  const missing = value === null || value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (field.type === 'checkbox' && value === false) ||
    (field.type === 'daterange' && (!range?.start || !range?.end));
  if (field.required && missing) errors.push(`${field.label || field.name} is required`);
  if (typeof value === 'string') {
    if (field.minLength !== undefined && value.length < field.minLength) errors.push(`Must be at least ${field.minLength} characters`);
    if (field.maxLength !== undefined && value.length > field.maxLength) errors.push(`Must be at most ${field.maxLength} characters`);
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.push('Enter a valid email address');
    if (field.type === 'url' && value) {
      try { new URL(value); } catch { errors.push('Enter a valid URL'); }
    }
  }
  if (field.type === 'number') {
    const number = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(number)) {
      if (field.min !== undefined && number < field.min) errors.push(`Must be ≥ ${field.min}`);
      if (field.max !== undefined && number > field.max) errors.push(`Must be ≤ ${field.max}`);
    }
  }
  return errors;
}

function valueAsString(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

function numberOrZero(value: string): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function optionsFor(field: FormBuilderField): Array<{ label: string; value: string }> {
  return (field.options ?? []).map((option) => ({ label: option.label, value: option.value }));
}

export const FormBuilder = forwardRef<FormBuilderHandle, FormBuilderProps>(function FormBuilder(
  {
    schema,
    onSchemaChange,
    value,
    onValueChange,
    mode,
    onModeChange,
    readOnly = false,
    readonly = false,
    showToolbar = true,
    showPalette = true,
    showProperties = true,
    toolbar,
    onSubmit,
    className = '',
    style,
  },
  ref: Ref<FormBuilderHandle>,
) {
  const { direction, t } = useI18n();
  const [localSchema, setLocalSchema] = useState(() => cloneSchema(schema ?? EMPTY_SCHEMA));
  const [localValue, setLocalValue] = useState<Record<string, unknown>>(() => ({ ...(value ?? {}) }));
  const [localMode, setLocalMode] = useState<FormBuilderMode>(mode ?? 'design');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(schema?.sections[0]?.id ?? null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{ sectionId: string; fieldId: string; startX: number; startY: number; width: number; height: number } | null>(null);

  const currentSchema = schema ?? localSchema;
  const rawValue = value ?? localValue;
  const currentMode = mode ?? localMode;
  const effectiveReadOnly = readOnly || readonly;

  const commitSchema = useCallback((next: FormBuilderSchema) => {
    if (schema === undefined) setLocalSchema(next);
    onSchemaChange?.(next);
  }, [onSchemaChange, schema]);
  const commitValue = useCallback((next: Record<string, unknown>) => {
    if (value === undefined) setLocalValue(next);
    onValueChange?.(next);
  }, [onValueChange, value]);
  const commitMode = useCallback((next: FormBuilderMode) => {
    if (mode === undefined) setLocalMode(next);
    onModeChange?.(next);
  }, [mode, onModeChange]);

  const currentValue = useMemo(() => {
    const next = { ...rawValue };
    const names = new Set<string>();
    currentSchema.sections.forEach((section) => section.fields.forEach((field) => {
      names.add(field.name);
      if (!(field.name in next)) {
        next[field.name] = cloneUnknown(field.defaultValue ?? defaultValueForType(field.type));
      }
    }));
    Object.keys(next).forEach((name) => { if (!names.has(name)) delete next[name]; });
    return next;
  }, [currentSchema, rawValue]);

  const effectiveActiveSectionId = currentSchema.sections.some((section) => section.id === activeSectionId)
    ? activeSectionId
    : currentSchema.sections[0]?.id ?? null;
  const effectiveSelectedFieldId = selectedFieldId && currentSchema.sections.some((section) => section.fields.some((field) => field.id === selectedFieldId))
    ? selectedFieldId
    : null;

  const fieldErrors = useMemo(() => {
    const result: Record<string, string[]> = {};
    currentSchema.sections.forEach((section) => section.fields.forEach((field) => {
      const errors = validateField(field, currentValue[field.name]);
      if (errors.length > 0) result[field.name] = errors;
    }));
    return result;
  }, [currentSchema, currentValue]);
  const valid = Object.keys(fieldErrors).length === 0;

  const updateField = useCallback((fieldId: string, patch: Partial<FormBuilderField>) => {
    const next = cloneSchema(currentSchema);
    next.sections = next.sections.map((section) => ({ ...section, fields: section.fields.map((field) => field.id === fieldId ? { ...field, ...patch } : field) }));
    const previous = currentSchema.sections.flatMap((section) => section.fields).find((field) => field.id === fieldId);
    if (previous && patch.name && patch.name !== previous.name) {
      const nextValue = { ...currentValue };
      if (previous.name in nextValue) { nextValue[patch.name] = nextValue[previous.name]; delete nextValue[previous.name]; commitValue(nextValue); }
    }
    commitSchema(next);
  }, [commitSchema, commitValue, currentSchema, currentValue]);

  useEffect(() => {
    if (!resizing) return undefined;
    const handleMove = (event: globalThis.PointerEvent) => {
      const deltaColumns = Math.round((event.clientX - resizing.startX) / 72);
      const deltaRows = Math.round((event.clientY - resizing.startY) / 40);
      const section = currentSchema.sections.find((item) => item.id === resizing.sectionId);
      const field = section?.fields.find((item) => item.id === resizing.fieldId);
      if (!section || !field) return;
      updateField(field.id, {
        w: Math.max(1, Math.min(section.cols ?? 12, resizing.width + deltaColumns)),
        h: Math.max(1, resizing.height + deltaRows),
      });
    };
    const handleUp = () => setResizing(null);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp, { once: true });
    return () => { window.removeEventListener('pointermove', handleMove); window.removeEventListener('pointerup', handleUp); };
  }, [currentSchema, resizing, updateField]);

  function submit(): void {
    onSubmit?.({ value: { ...currentValue }, valid, errors: { ...fieldErrors } });
  }

  function addSection(title = t('section')): string {
    const id = nextId('section');
    commitSchema({ ...currentSchema, sections: [...currentSchema.sections, { id, title, cols: 12, fields: [] }] });
    setActiveSectionId(id);
    setEditingSectionId(id);
    return id;
  }

  function removeSection(sectionId: string): void {
    commitSchema({ ...currentSchema, sections: currentSchema.sections.filter((section) => section.id !== sectionId) });
  }

  function updateSection(sectionId: string, patch: Partial<FormBuilderSection>): void {
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((section) => section.id === sectionId ? { ...section, ...patch } : section) });
  }

  function moveSection(sectionId: string, directionValue: -1 | 1): void {
    const sections = [...currentSchema.sections];
    const index = sections.findIndex((section) => section.id === sectionId);
    const target = index + directionValue;
    if (index < 0 || target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    commitSchema({ ...currentSchema, sections });
  }

  function addField(sectionId: string, type: FormBuilderFieldType): string {
    const meta = FIELD_TYPES.find((item) => item.type === type) ?? FIELD_TYPES[0];
    const section = currentSchema.sections.find((item) => item.id === sectionId);
    if (!section) return '';
    const id = nextId('field');
    const tabId = activeTabIdFor(sectionId);
    const scopedFields = section.fields.filter((field) => tabId ? field.tabId === tabId : !field.tabId);
    const width = Math.min(meta.defaultW, section.cols ?? 12);
    const slot = findFreeSlot(scopedFields, section.cols ?? 12, width, meta.defaultH);
    const field: FormBuilderField = { id, name: `${type.replace('-', '_')}_${nextBuilderId}`, type, label: meta.defaultLabel, defaultValue: cloneUnknown(meta.defaultValue), x: slot.x, y: slot.y, w: width, h: meta.defaultH, ...(tabId ? { tabId } : {}) };
    if (['select', 'radio', 'combobox', 'grid-combobox'].includes(type)) field.options = [{ label: 'Option 1', value: 'option-1' }, { label: 'Option 2', value: 'option-2' }];
    if (type === 'grid-combobox') field.columns = [{ key: 'label', label: t('name') }];
    if (type === 'datagrid') field.columns = [{ key: 'name', label: t('name') }, { key: 'value', label: t('value') }];
    if (type === 'masked') field.mask = '(999) 999-9999';
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((item) => item.id === sectionId ? { ...item, fields: [...item.fields, field] } : item) });
    setActiveSectionId(sectionId);
    setSelectedFieldId(id);
    return id;
  }

  function removeField(fieldId: string): void {
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((section) => ({ ...section, fields: section.fields.filter((field) => field.id !== fieldId) })) });
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  }

  function duplicateField(fieldId: string): void {
    const source = currentSchema.sections.flatMap((section) => section.fields.map((field) => ({ section, field }))).find((item) => item.field.id === fieldId);
    if (!source) return;
    const id = nextId('field');
    const fields = source.section.fields;
    const slot = findFreeSlot(fields, source.section.cols ?? 12, source.field.w, source.field.h);
    const copy: FormBuilderField = { ...source.field, id, name: `${source.field.name}_copy`, x: slot.x, y: slot.y, options: source.field.options?.map((option) => ({ ...option })), columns: source.field.columns?.map((column) => ({ ...column })) };
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((section) => section.id === source.section.id ? { ...section, fields: [...section.fields, copy] } : section) });
    setSelectedFieldId(id);
  }

  function addTab(sectionId: string): void {
    const section = currentSchema.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const id = nextId('tab');
    const existingTabs = section.tabs ?? [];
    const firstTab = existingTabs.length === 0;
    const tabs = [...existingTabs, { id, label: `${t('tab')} ${existingTabs.length + 1}` }];
    const fields = section.fields.map((field) => firstTab && !field.tabId ? { ...field, tabId: id } : field);
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((item) => item.id === sectionId ? { ...item, tabs, fields } : item) });
    setActiveTabs((current) => ({ ...current, [sectionId]: id }));
    setEditingTabId(id);
  }

  function removeTab(sectionId: string, tabId: string): void {
    const section = currentSchema.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const tabs = (section.tabs ?? []).filter((tab) => tab.id !== tabId);
    const fields = tabs.length === 0
      ? section.fields.filter((field) => field.tabId !== tabId).map((field) => { const nextField = { ...field }; delete nextField.tabId; return nextField; })
      : section.fields.filter((field) => field.tabId !== tabId);
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((item) => item.id === sectionId ? { ...item, tabs: tabs.length ? tabs : undefined, fields } : item) });
    setActiveTabs((current) => ({ ...current, [sectionId]: tabs[0]?.id ?? '' }));
  }

  function activeTabIdFor(sectionId: string): string | null {
    const section = currentSchema.sections.find((item) => item.id === sectionId);
    if (!section?.tabs?.length) return null;
    const current = activeTabs[sectionId];
    return section.tabs.some((tab) => tab.id === current) ? current ?? null : section.tabs[0].id;
  }

  function fieldsForDesign(section: FormBuilderSection): FormBuilderField[] {
    const tabId = activeTabIdFor(section.id);
    return tabId ? section.fields.filter((field) => field.tabId === tabId) : section.fields.filter((field) => !field.tabId);
  }

  function handleFieldDrop(sectionId: string, targetId: string): void {
    if (!draggedFieldId || draggedFieldId === targetId) return;
    const section = currentSchema.sections.find((item) => item.id === sectionId);
    const source = section?.fields.find((field) => field.id === draggedFieldId);
    const target = section?.fields.find((field) => field.id === targetId);
    if (!section || !source || !target) return;
    const nextFields = section.fields.map((field) => field.id === source.id ? { ...field, x: target.x, y: target.y } : field.id === target.id ? { ...field, x: source.x, y: source.y } : field);
    commitSchema({ ...currentSchema, sections: currentSchema.sections.map((item) => item.id === sectionId ? { ...item, fields: nextFields } : item) });
    setDraggedFieldId(null);
  }

  function handleFieldKeyDown(event: KeyboardEvent<HTMLDivElement>, field: FormBuilderField): void {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedFieldId(field.id); }
    if (event.key === 'Delete' && !effectiveReadOnly) { event.preventDefault(); removeField(field.id); }
  }

  function handleResizeKeyDown(event: KeyboardEvent<HTMLButtonElement>, section: FormBuilderSection, field: FormBuilderField): void {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const width = event.key === 'Home' ? 1 : event.key === 'End' ? section.cols ?? 12 : field.w + (event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0);
    const height = event.key === 'Home' || event.key === 'End' ? field.h : Math.max(1, field.h + (event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0));
    updateField(field.id, { w: Math.max(1, Math.min(section.cols ?? 12, width)), h: height });
  }

  function setFieldValue(name: string, nextValue: unknown): void {
    commitValue({ ...currentValue, [name]: nextValue });
  }

  function renderDataGrid(field: FormBuilderField): ReactNode {
    const rows = Array.isArray(currentValue[field.name]) ? currentValue[field.name] as Record<string, unknown>[] : [];
    const columns = field.columns?.length ? field.columns : [{ key: 'name', label: t('name') }];
    const updateCell = (rowIndex: number, key: string, nextValue: string) => {
      const nextRows = rows.map((row, index) => index === rowIndex ? { ...row, [key]: nextValue } : row);
      setFieldValue(field.name, nextRows);
    };
    return (
      <div className="sp-fb__datagrid" role="region" aria-label={field.label}>
        <div className="sp-fb__datagrid-toolbar">
          <Button size="sm" variant="ghost" iconLeft="plus" onClick={() => setFieldValue(field.name, [...rows, Object.fromEntries(columns.map((column) => [column.key, '']))])}>{t('addRow')}</Button>
          <span className="sp-fb__datagrid-count" aria-live="polite">{rows.length} {rows.length === 1 ? t('row') : t('rows')}</span>
        </div>
        <div className="sp-fb__table-wrap">
          <table className="sp-fb__table">
            <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}<th scope="col"><span className="sp-fb__sr">{t('actions')}</span></th></tr></thead>
            <tbody>
              {rows.map((row, rowIndex) => <tr key={`${field.id}-row-${rowIndex}`}>
                {columns.map((column) => <td key={column.key}><Input ariaLabel={`${column.label} ${t('row')} ${rowIndex + 1}`} value={valueAsString(row[column.key])} onChange={(next) => updateCell(rowIndex, column.key, next)} /></td>)}
                <td><Button iconOnly iconLeft="trash-2" variant="ghost" aria-label={`${t('delete')} ${t('row')} ${rowIndex + 1}`} onClick={() => setFieldValue(field.name, rows.filter((_, index) => index !== rowIndex))} /></td>
              </tr>)}
              {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="sp-fb__table-empty">{t('noData')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderPreviewField(field: FormBuilderField): ReactNode {
    const error = fieldErrors[field.name]?.[0];
    const common = { required: Boolean(field.required), errorText: error, helperText: field.helperText };
    const stringValue = valueAsString(currentValue[field.name]);
    const options = optionsFor(field);
    const control = (() => {
      switch (field.type) {
        case 'textarea': return <Textarea value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'select': return <Select options={options} value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'combobox': return <Combobox options={options} value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'grid-combobox': return <GridCombobox columns={(field.columns ?? [{ key: 'label', label: t('name') }]).map((column) => ({ key: column.key, label: column.label, width: column.width }))} options={options} value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'checkbox': return <Checkbox checked={Boolean(currentValue[field.name])} onChange={(next) => setFieldValue(field.name, next)}>{field.helperText || field.label}</Checkbox>;
        case 'switch': return <Switch checked={Boolean(currentValue[field.name])} onChange={(next) => setFieldValue(field.name, next)} ariaLabel={field.label} />;
        case 'password': return <Input type="password" value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'number': return <Input type="number" value={stringValue} min={field.min} max={field.max} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, numberOrZero(next))} />;
        case 'date': return <DatePicker value={typeof currentValue[field.name] === 'string' ? currentValue[field.name] as string : null} inputMode={field.inputMode} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'daterange': {
          const range = currentValue[field.name] && typeof currentValue[field.name] === 'object' ? currentValue[field.name] as DateRange : { start: null, end: null };
          return <DateRangePicker value={range} inputMode={field.inputMode} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        }
        case 'radio': return <RadioGroup value={stringValue} onChange={(next) => setFieldValue(field.name, next)} ariaLabel={field.label}>{options.map((option) => <Radio key={option.value} value={option.value}>{option.label}</Radio>)}</RadioGroup>;
        case 'masked': return <MaskedInput mask={field.mask ?? ''} value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
        case 'datagrid': return renderDataGrid(field);
        default: return <Input type={field.type === 'email' || field.type === 'tel' || field.type === 'url' ? field.type : 'text'} value={stringValue} placeholder={field.placeholder} onChange={(next) => setFieldValue(field.name, next)} />;
      }
    })();
    return <Field label={field.label} {...common}>{control}</Field>;
  }

  function save(): FormBuilderSchema { return cloneSchema(currentSchema); }
  function restore(next: FormBuilderSchema): void { commitSchema(cloneSchema(next)); }
  function resetValues(): void {
    const next: Record<string, unknown> = {};
    currentSchema.sections.forEach((section) => section.fields.forEach((field) => { next[field.name] = cloneUnknown(field.defaultValue ?? defaultValueForType(field.type)); }));
    commitValue(next);
  }

  useImperativeHandle(ref, () => ({ save, restore, submit, resetValues, addSection, removeSection, addField, removeField }), [
    addField, addSection, removeField, removeSection, resetValues, restore, save, submit,
  ]);

  const rootClasses = ['sp-fb', currentMode === 'design' ? 'sp-fb--design' : 'sp-fb--preview', className].filter(Boolean).join(' ');
  return (
    <div className={rootClasses} style={style} dir={direction}>
      {showToolbar && <div className="sp-fb__toolbar" role="toolbar" aria-label={t('formBuilderToolbar')}>
        <div className="sp-fb__toolbar-group">
          <Button size="sm" variant={currentMode === 'design' ? 'primary' : 'ghost'} iconLeft="layout-dashboard" aria-pressed={currentMode === 'design'} onClick={() => commitMode('design')}>{t('design')}</Button>
          <Button size="sm" variant={currentMode === 'preview' ? 'primary' : 'ghost'} iconLeft="eye" aria-pressed={currentMode === 'preview'} onClick={() => commitMode('preview')}>{t('preview')}</Button>
        </div>
        {currentMode === 'design' && !effectiveReadOnly && <Button size="sm" variant="ghost" iconLeft="plus" onClick={() => addSection()}>{t('section')}</Button>}
        <span className="sp-fb__toolbar-spacer" />
        {toolbar && <div className="sp-fb__toolbar-group">{toolbar}</div>}
        {currentMode === 'preview' && <Button size="sm" variant="primary" iconLeft="check" onClick={submit}>{t('save')}</Button>}
      </div>}
      <div className="sp-fb__body">
        {currentMode === 'design' && showPalette && !effectiveReadOnly && <aside className="sp-fb__palette" aria-label={t('fieldPalette')}>
          <p className="sp-fb__panel-title">{t('fields')}</p>
          <div className="sp-fb__palette-list">{FIELD_TYPES.map((meta) => <button key={meta.type} className="sp-fb__palette-item" type="button" disabled={!effectiveActiveSectionId} onClick={() => effectiveActiveSectionId && addField(effectiveActiveSectionId, meta.type)}><Icon name={meta.icon} size={14} aria-hidden="true" /><span>{meta.label}</span></button>)}</div>
        </aside>}
        <div className="sp-fb__canvas">
          {currentSchema.sections.length === 0 && <div className="sp-fb__empty"><Icon name="wand-sparkles" size={24} aria-hidden="true" /><p>{t('noSectionsYet')}</p>{currentMode === 'design' && !effectiveReadOnly && <Button variant="primary" iconLeft="plus" onClick={() => addSection()}>{t('addSection')}</Button>}</div>}
          {currentSchema.sections.map((section, sectionIndex) => {
            const designFields = fieldsForDesign(section);
            const activeTab = activeTabIdFor(section.id);
            return <section key={section.id} className={['sp-fb__section', effectiveActiveSectionId === section.id && currentMode === 'design' && 'sp-fb__section--active'].filter(Boolean).join(' ')} onClick={() => setActiveSectionId(section.id)}>
              <header className="sp-fb__section-header">
                {editingSectionId === section.id && currentMode === 'design' && !effectiveReadOnly ? <input className="sp-fb__edit-input" value={section.title} onChange={(event) => updateSection(section.id, { title: event.target.value })} onBlur={() => setEditingSectionId(null)} onKeyDown={(event) => { if (event.key === 'Enter') setEditingSectionId(null); }} /> : <h2 className="sp-fb__section-title">{section.title || t('untitled')}</h2>}
                {section.description && <p className="sp-fb__section-desc">{section.description}</p>}
                {currentMode === 'design' && !effectiveReadOnly && <div className="sp-fb__section-actions">
                  <Button iconOnly iconLeft="edit" variant="ghost" aria-label={t('renameSection')} onClick={(event) => { event.stopPropagation(); setEditingSectionId(section.id); }} />
                  <Button iconOnly iconLeft="arrow-up" variant="ghost" aria-label={t('moveUp')} disabled={sectionIndex === 0} onClick={(event) => { event.stopPropagation(); moveSection(section.id, -1); }} />
                  <Button iconOnly iconLeft="arrow-down" variant="ghost" aria-label={t('moveDown')} disabled={sectionIndex === currentSchema.sections.length - 1} onClick={(event) => { event.stopPropagation(); moveSection(section.id, 1); }} />
                  <Button iconOnly iconLeft="trash-2" variant="ghost" aria-label={t('deleteSection')} onClick={(event) => { event.stopPropagation(); removeSection(section.id); }} />
                </div>}
              </header>
              <div className="sp-fb__section-body">
                {currentMode === 'design' && !effectiveReadOnly && <div className="sp-fb__tabs-bar" role="tablist" aria-label={t('tab')}>
                  {(section.tabs ?? []).map((tab) => <div key={tab.id} className={['sp-fb__tab-chip', activeTab === tab.id && 'sp-fb__tab-chip--active'].filter(Boolean).join(' ')} role="tab" aria-selected={activeTab === tab.id} tabIndex={0} onClick={(event) => { event.stopPropagation(); setActiveTabs((current) => ({ ...current, [section.id]: tab.id })); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveTabs((current) => ({ ...current, [section.id]: tab.id })); } }}>
                    {editingTabId === tab.id ? <input className="sp-fb__edit-input" value={tab.label} onChange={(event) => updateSection(section.id, { tabs: section.tabs?.map((item) => item.id === tab.id ? { ...item, label: event.target.value } : item) })} onBlur={() => setEditingTabId(null)} onKeyDown={(event) => { if (event.key === 'Enter') setEditingTabId(null); }} /> : <span className="sp-fb__tab-label">{tab.label || t('tab')}</span>}
                    <Button iconOnly iconLeft="edit" variant="ghost" aria-label={t('renameTab')} onClick={(event) => { event.stopPropagation(); setEditingTabId(tab.id); }} />
                    <Button iconOnly iconLeft="x" variant="ghost" aria-label={t('removeTab')} onClick={(event) => { event.stopPropagation(); removeTab(section.id, tab.id); }} />
                  </div>)}
                  <Button size="sm" variant="ghost" iconLeft="plus" onClick={(event) => { event.stopPropagation(); addTab(section.id); }}>{t('add')} {t('tab')}</Button>
                </div>}
                {currentMode === 'design' ? <div className="sp-fb__design-grid" style={{ '--sp-fb-grid-columns': section.cols ?? 12 } as CSSProperties}>{designFields.length === 0 ? <div className="sp-fb__section-empty">{t('noFieldsYet')}</div> : designFields.map((field) => <div key={field.id} className={['sp-fb__field-card', effectiveSelectedFieldId === field.id && 'sp-fb__field-card--selected'].filter(Boolean).join(' ')} draggable={!effectiveReadOnly} tabIndex={0} role="button" style={{ gridColumn: `${field.x + 1} / span ${field.w}`, gridRow: `${field.y + 1} / span ${field.h}` }} onClick={(event) => { event.stopPropagation(); setSelectedFieldId(field.id); setActiveSectionId(section.id); }} onKeyDown={(event) => handleFieldKeyDown(event, field)} onDragStart={() => setDraggedFieldId(field.id)} onDragOver={(event: DragEvent<HTMLDivElement>) => event.preventDefault()} onDrop={() => handleFieldDrop(section.id, field.id)}>
                  <div className="sp-fb__field-card-header"><Icon name={FIELD_TYPES.find((meta) => meta.type === field.type)?.icon ?? 'text-cursor-input'} size={12} aria-hidden="true" /><span className="sp-fb__field-card-label">{field.label || field.name}</span>{field.required && <span className="sp-fb__field-card-required" aria-hidden="true">*</span>}<Icon name="grip-vertical" size={12} aria-hidden="true" /></div>
                  <div className="sp-fb__field-card-body"><span>{field.type}</span><code>{field.name}</code></div>
                  <button className="sp-fb__resize" type="button" aria-label={`${t('resizeColumn', { column: field.label })}`} onPointerDown={(event: PointerEvent<HTMLButtonElement>) => { event.stopPropagation(); setResizing({ sectionId: section.id, fieldId: field.id, startX: event.clientX, startY: event.clientY, width: field.w, height: field.h }); }} onKeyDown={(event) => handleResizeKeyDown(event, section, field)}><Icon name="maximize" size={10} aria-hidden="true" /></button>
                </div>)}</div> : <div className="sp-fb__preview-grid">{section.tabs?.length ? section.tabs.map((tab) => <div key={tab.id} className="sp-fb__preview-tab"><h3>{tab.label}</h3>{section.fields.filter((field) => field.tabId === tab.id).map((field) => <div key={field.id}>{renderPreviewField(field)}</div>)}</div>) : section.fields.map((field) => <div key={field.id}>{renderPreviewField(field)}</div>)}</div>}
              </div>
            </section>;
          })}
        </div>
        {currentMode === 'design' && showProperties && !effectiveReadOnly && <aside className="sp-fb__props" aria-label={t('fieldProperties')}>
          <p className="sp-fb__panel-title"><Icon name="settings" size={14} aria-hidden="true" />{t('properties')}</p>
          {(() => {
            const selected = currentSchema.sections.flatMap((section) => section.fields).find((field) => field.id === effectiveSelectedFieldId);
            if (!selected) return <p className="sp-fb__props-empty">{t('selectFieldToEdit')}</p>;
            return <div className="sp-fb__props-form">
              {(['label', 'name', 'placeholder', 'helperText'] as const).map((key) => <label key={key} className="sp-fb__props-label">{key === 'helperText' ? t('helperText') : t(key === 'label' ? 'label' : key as 'name' | 'placeholder')}<Input value={selected[key] ?? ''} onChange={(next) => updateField(selected.id, { [key]: next })} /></label>)}
              <Checkbox checked={Boolean(selected.required)} onChange={(next) => updateField(selected.id, { required: next })}>{t('required')}</Checkbox>
              {(selected.type === 'number') && <div className="sp-fb__props-row"><label className="sp-fb__props-label">{t('min')}<Input type="number" value={selected.min === undefined ? '' : String(selected.min)} onChange={(next) => updateField(selected.id, { min: next ? numberOrZero(next) : undefined })} /></label><label className="sp-fb__props-label">{t('max')}<Input type="number" value={selected.max === undefined ? '' : String(selected.max)} onChange={(next) => updateField(selected.id, { max: next ? numberOrZero(next) : undefined })} /></label></div>}
              {selected.type === 'masked' && <label className="sp-fb__props-label">{t('maskPattern')}<Input value={selected.mask ?? ''} onChange={(next) => updateField(selected.id, { mask: next })} /></label>}
              {['select', 'radio', 'combobox', 'grid-combobox'].includes(selected.type) && <div className="sp-fb__props-options"><p className="sp-fb__props-options-title">{t('options')}</p>{(selected.options ?? []).map((option, index) => <div className="sp-fb__props-options-row" key={`${selected.id}-option-${index}`}><Input ariaLabel={`${t('label')} ${index + 1}`} value={option.label} onChange={(next) => { const options = [...(selected.options ?? [])]; options[index] = { ...options[index], label: next }; updateField(selected.id, { options }); }} /><Input ariaLabel={`${t('value')} ${index + 1}`} value={option.value} onChange={(next) => { const options = [...(selected.options ?? [])]; options[index] = { ...options[index], value: next }; updateField(selected.id, { options }); }} /><Button iconOnly iconLeft="x" variant="ghost" aria-label={t('removeOption')} onClick={() => updateField(selected.id, { options: (selected.options ?? []).filter((_, itemIndex) => itemIndex !== index) })} /></div>)}<Button size="sm" variant="ghost" iconLeft="plus" onClick={() => updateField(selected.id, { options: [...(selected.options ?? []), { label: `${t('items')} ${(selected.options?.length ?? 0) + 1}`, value: `option-${(selected.options?.length ?? 0) + 1}` }] })}>{t('addOption')}</Button></div>}
              {(selected.type === 'grid-combobox' || selected.type === 'datagrid') && <div className="sp-fb__props-options"><p className="sp-fb__props-options-title">{t('columns')}</p>{(selected.columns ?? []).map((column, index) => <div className="sp-fb__props-options-row" key={`${selected.id}-column-${index}`}><Input ariaLabel={`${t('label')} ${index + 1}`} value={column.label} onChange={(next) => { const columns = [...(selected.columns ?? [])]; columns[index] = { ...columns[index], label: next }; updateField(selected.id, { columns }); }} /><Input ariaLabel={`${t('name')} ${index + 1}`} value={column.key} onChange={(next) => { const columns = [...(selected.columns ?? [])]; columns[index] = { ...columns[index], key: next }; updateField(selected.id, { columns }); }} /><Button iconOnly iconLeft="x" variant="ghost" aria-label={t('removeColumn')} onClick={() => updateField(selected.id, { columns: (selected.columns ?? []).filter((_, itemIndex) => itemIndex !== index) })} /></div>)}<Button size="sm" variant="ghost" iconLeft="plus" onClick={() => updateField(selected.id, { columns: [...(selected.columns ?? []), { key: `column-${(selected.columns?.length ?? 0) + 1}`, label: `${t('column')} ${(selected.columns?.length ?? 0) + 1}` }] })}>{t('addColumn')}</Button></div>}
              <div className="sp-fb__props-actions"><Button size="sm" variant="ghost" iconLeft="copy" onClick={() => duplicateField(selected.id)}>{t('duplicate')}</Button><Button size="sm" variant="danger-outline" iconLeft="trash-2" onClick={() => removeField(selected.id)}>{t('delete')}</Button></div>
            </div>;
          })()}
        </aside>}
      </div>
    </div>
  );
});
