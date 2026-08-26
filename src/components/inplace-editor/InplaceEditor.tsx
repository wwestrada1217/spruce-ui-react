import './InplaceEditor.css';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button } from '../button/Button.js';
import { Icon } from '../../icons/Icon.js';
import { MaskedInput } from '../masked-input/MaskedInput.js';
import { Combobox, type ComboboxSource } from '../combobox/Combobox.js';
import { GridCombobox, type GridComboboxColumn, type GridComboboxSource } from '../grid-combobox/GridCombobox.js';
import { DatePicker, type DateFilter } from '../date-picker/DatePicker.js';
import { DateRangePicker, type DateRange, type DateRangePreset } from '../date-range-picker/DateRangePicker.js';
import { DateTimePicker } from '../datetime-picker/DateTimePicker.js';
import { TimePicker } from '../time-picker/TimePicker.js';
import { EmojiPicker, type EmojiPickerEmoji } from '../emoji-picker/EmojiPicker.js';
import { ColorPicker, type ColorPickerColor } from '../color-picker/ColorPicker.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { type Placement } from '../../utils/positioning.js';

export type InplaceEditorSize = 'sm' | 'md' | 'lg';
export type InplaceEditorType = 'text' | 'number' | 'masked' | 'combobox' | 'grid-combobox' | 'date' | 'date-range' | 'datetime' | 'time' | 'emoji' | 'color';
export type InplaceEditorValue = string | number | string[] | DateRange | null;

export interface InplaceEditorProps<TValue extends InplaceEditorValue = string> {
  value?: TValue;
  type?: InplaceEditorType;
  disabled?: boolean;
  editLabel?: string;
  showIndicator?: boolean;
  showActions?: boolean;
  size?: InplaceEditorSize;
  placeholder?: string;
  displayFormatter?: (value: TValue) => string;
  min?: number | string | null;
  max?: number | string | null;
  step?: number | string | null;
  mask?: string;
  clearable?: boolean;
  showMaskGuide?: boolean;
  options?: ComboboxSource | null;
  gridOptions?: GridComboboxSource | null;
  columns?: GridComboboxColumn[];
  displayField?: string;
  valueField?: string;
  dataKey?: string | null;
  multiple?: boolean;
  pageSize?: number;
  searchFields?: string[] | null;
  filterBy?: string | string[];
  virtualScroll?: boolean;
  itemHeight?: number;
  virtualPaging?: boolean;
  showPagingFooter?: boolean;
  placement?: Placement;
  pickerInputMode?: boolean;
  showWeekNumbers?: boolean;
  minDate?: string | null;
  maxDate?: string | null;
  disabledDates?: string[];
  dateFilter?: DateFilter | null;
  weekNumberBackground?: boolean;
  months?: number;
  presets?: DateRangePreset[];
  use24Hour?: boolean;
  showSeconds?: boolean;
  defaultEmoji?: string;
  emojiIcon?: string | null;
  emojis?: readonly EmojiPickerEmoji[];
  defaultColor?: string;
  colorIcon?: string;
  colors?: readonly ColorPickerColor[];
  onValueChange?: (value: TValue) => void;
  onSelectedItem?: (item: unknown) => void;
  onEmojiSelected?: (emoji: EmojiPickerEmoji) => void;
  className?: string;
  style?: CSSProperties;
}

export function InplaceEditor<TValue extends InplaceEditorValue = string>({
  value = '' as TValue, type = 'text', disabled = false, editLabel, showIndicator = false, showActions = false, size = 'md', placeholder = '', displayFormatter,
  min = null, max = null, step = null, mask = '', clearable = false, showMaskGuide = true, options = null, gridOptions = null, columns = [], displayField = 'label', valueField = 'value', dataKey = null, multiple = false, pageSize = 20, searchFields = null, filterBy = 'label', virtualScroll = false, itemHeight = 32, virtualPaging = false, showPagingFooter = true, placement = 'bottom-start', pickerInputMode = false, showWeekNumbers = false, minDate = null, maxDate = null, disabledDates = [], dateFilter = null, weekNumberBackground = false, months = 2, presets = [], use24Hour = false, showSeconds = false, defaultEmoji = '🙂', emojiIcon = 'smile', emojis = [], defaultColor = '#111827', colorIcon = 'palette', colors = [], onValueChange, onSelectedItem, onEmojiSelected, className = '', style,
}: InplaceEditorProps<TValue>) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<InplaceEditorValue>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedEditLabel = editLabel ?? t('editValue');

  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [editing]);

  function startEdit() { if (!disabled) { setDraft(value); setEditing(true); } }
  function emit(next: InplaceEditorValue) {
    if (JSON.stringify(next) !== JSON.stringify(value)) onValueChange?.(next as TValue);
  }
  function commit(next = draft) { setEditing(false); emit(next); }
  function cancel() { setDraft(value); setEditing(false); }
  function textValue(next: string) { setDraft(next); if (!showActions) emit(next); }
  function numberValue(next: string) { const parsed = next.trim() === '' ? null : Number(next); setDraft(parsed); if (!showActions) emit((Number.isNaN(parsed) ? value : parsed) as InplaceEditorValue); }

  function renderEditor() {
    if (type === 'number') return <input ref={inputRef} className="sp-inplace-editor__native-input" type="number" value={draft === null ? '' : String(draft)} min={min ?? undefined} max={max ?? undefined} step={step ?? undefined} placeholder={placeholder} aria-label={resolvedEditLabel} onChange={(event) => numberValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') commit(); if (event.key === 'Escape') cancel(); }} onBlur={() => !showActions && commit()} />;
    if (type === 'masked') return <MaskedInput disabled={disabled} size={size} placeholder={placeholder} ariaLabel={resolvedEditLabel} value={typeof draft === 'string' ? draft : ''} mask={mask} clearable={clearable} showMaskGuide={showMaskGuide} onChange={textValue} />;
    if (type === 'combobox') return <Combobox options={options} value={Array.isArray(draft) ? draft : typeof draft === 'string' ? draft : ''} onChange={(next) => { setDraft(next); if (!showActions) emit(next); }} onSelectedItem={onSelectedItem} multiple={multiple} displayField={displayField} valueField={valueField} dataKey={dataKey ?? undefined} pageSize={pageSize} searchFields={searchFields ?? undefined} virtualScroll={virtualScroll} itemHeight={itemHeight} virtualPaging={virtualPaging} showPagingFooter={showPagingFooter} placement={placement} ariaLabel={resolvedEditLabel} />;
    if (type === 'grid-combobox') return <GridCombobox options={gridOptions} columns={columns} value={typeof draft === 'string' ? draft : ''} onChange={(next) => { setDraft(next); if (!showActions) emit(next); }} onSelectedItem={onSelectedItem} displayField={displayField} valueField={valueField} filterBy={filterBy} pageSize={pageSize} virtualScroll={virtualScroll} itemHeight={itemHeight} virtualPaging={virtualPaging} showPagingFooter={showPagingFooter} placement={placement} ariaLabel={resolvedEditLabel} />;
    if (type === 'date') return <DatePicker value={typeof draft === 'string' ? draft : null} onChange={(next) => showActions ? setDraft(next) : commit(next)} placeholder={placeholder} inputMode={pickerInputMode} showWeekNumbers={showWeekNumbers} weekNumberBackground={weekNumberBackground} minDate={minDate} maxDate={maxDate} disabledDates={disabledDates} dateFilter={dateFilter} disabled={disabled} />;
    if (type === 'date-range') return <DateRangePicker value={isDateRange(draft) ? draft : { start: null, end: null }} onChange={(next) => showActions ? setDraft(next) : commit(next)} placeholder={placeholder} inputMode={pickerInputMode} months={months} presets={presets} disabled={disabled} />;
    if (type === 'datetime') return <DateTimePicker value={typeof draft === 'string' ? draft : null} onChange={(next) => showActions ? setDraft(next) : commit(next)} placeholder={placeholder} inputMode={pickerInputMode} use24Hour={use24Hour} showSeconds={showSeconds} disabled={disabled} />;
    if (type === 'time') return <TimePicker value={typeof draft === 'string' ? draft : null} onChange={(next) => showActions ? setDraft(next) : commit(next)} placeholder={placeholder} inputMode={pickerInputMode} use24Hour={use24Hour} showSeconds={showSeconds} disabled={disabled} />;
    if (type === 'emoji') return <EmojiPicker value={typeof draft === 'string' ? draft : defaultEmoji} onChange={(next) => showActions ? setDraft(next) : commit(next)} onSelected={(emoji) => onEmojiSelected?.(emoji)} emojis={emojis} icon={emojiIcon ?? undefined} ariaLabel={resolvedEditLabel} />;
    if (type === 'color') return <ColorPicker value={typeof draft === 'string' ? draft : defaultColor} onChange={(next) => showActions ? setDraft(next) : commit(next)} colors={colors} icon={colorIcon} ariaLabel={resolvedEditLabel} />;
    return <input ref={inputRef} className="sp-inplace-editor__native-input" type="text" value={typeof draft === 'string' ? draft : stringify(draft)} placeholder={placeholder} aria-label={resolvedEditLabel} onChange={(event) => textValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') commit(); if (event.key === 'Escape') cancel(); }} onBlur={() => !showActions && commit()} />;
  }

  if (editing) return <span className={['sp-inplace-editor__editing', `sp-inplace-editor--${size}`, className].filter(Boolean).join(' ')} style={style} onKeyDown={(event) => { if (event.key === 'Escape') cancel(); }}>
    {renderEditor()}
    {showActions && <span className="sp-inplace-editor__actions"><Button iconOnly iconLeft="check" size="sm" variant="ghost" aria-label={t('inplaceAccept')} onClick={() => commit()} /><Button iconOnly iconLeft="x" size="sm" variant="ghost" aria-label={t('inplaceDiscard')} onClick={cancel} /></span>}
  </span>;

  const display = displayFormatter ? displayFormatter(value) : stringify(value);
  return <button type="button" className={['sp-inplace-editor__display', size !== 'md' && `sp-inplace-editor--${size}`, showIndicator && 'sp-inplace-editor__display--indicator', disabled && 'sp-inplace-editor__display--disabled', className].filter(Boolean).join(' ')} style={style} onClick={startEdit} disabled={disabled} aria-label={resolvedEditLabel}>
    <span className="sp-inplace-editor__text">{display || '\u00a0'}</span>
    {showIndicator && !disabled && <Icon name="pencil" size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} className="sp-inplace-editor__icon" aria-hidden="true" />}
  </button>;
}

function isDateRange(value: InplaceEditorValue): value is DateRange { return typeof value === 'object' && value !== null && 'start' in value && 'end' in value; }
function stringify(value: InplaceEditorValue): string { if (value === null) return ''; if (Array.isArray(value)) return value.join(', '); if (isDateRange(value)) return [value.start, value.end].filter(Boolean).join(' – '); return String(value); }
