import './EmojiPicker.css';
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { Popover } from '../popover/Popover.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export interface EmojiPickerEmoji {
  label: string;
  value: string;
  keywords?: readonly string[];
}

export interface EmojiPickerHandle {
  toggle(): void;
  openPanel(): void;
  close(): void;
}

export interface EmojiPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelected?: (emoji: EmojiPickerEmoji) => void;
  label?: string;
  icon?: string | null;
  emojis?: readonly EmojiPickerEmoji[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  error?: string;
  hint?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_EMOJIS: readonly EmojiPickerEmoji[] = [
  { label: 'Smile', value: '🙂', keywords: ['happy', 'friendly'] },
  { label: 'Grin', value: '😀', keywords: ['happy', 'joy'] },
  { label: 'Laugh', value: '😄', keywords: ['happy', 'fun'] },
  { label: 'Joy', value: '😂', keywords: ['laugh', 'funny'] },
  { label: 'Blush', value: '😊', keywords: ['warm', 'pleased'] },
  { label: 'Wink', value: '😉', keywords: ['playful'] },
  { label: 'Heart eyes', value: '😍', keywords: ['love', 'favorite'] },
  { label: 'Cool', value: '😎', keywords: ['awesome', 'great'] },
  { label: 'Sweat smile', value: '😅', keywords: ['awkward', 'nervous'] },
  { label: 'Upside down', value: '🙃', keywords: ['sarcasm', 'flip'] },
  { label: 'Thinking', value: '🤔', keywords: ['question', 'consider'] },
  { label: 'Neutral', value: '😐', keywords: ['plain'] },
  { label: 'Grimace', value: '😬', keywords: ['awkward', 'ouch'] },
  { label: 'Surprised', value: '😮', keywords: ['wow', 'shock'] },
  { label: 'Concerned', value: '😟', keywords: ['worry'] },
  { label: 'Sad', value: '😢', keywords: ['unhappy', 'cry'] },
  { label: 'Angry', value: '😡', keywords: ['mad', 'upset'] },
  { label: 'Celebrate', value: '🥳', keywords: ['party', 'success'] },
  { label: 'Hug', value: '🤗', keywords: ['welcome', 'warm'] },
  { label: 'Salute', value: '🫡', keywords: ['respect', 'thanks'] },
  { label: 'Clap', value: '👏', keywords: ['applause', 'great'] },
  { label: 'Thumbs up', value: '👍', keywords: ['approve', 'yes'] },
  { label: 'Thumbs down', value: '👎', keywords: ['no'] },
  { label: 'Raised hands', value: '🙌', keywords: ['celebrate'] },
  { label: 'Wave', value: '👋', keywords: ['hello', 'goodbye'] },
  { label: 'Handshake', value: '🤝', keywords: ['deal', 'agreement'] },
  { label: 'Pray', value: '🙏', keywords: ['thanks', 'please'] },
  { label: 'Heart', value: '❤️', keywords: ['love'] },
  { label: 'Green heart', value: '💚', keywords: ['grow', 'go'] },
  { label: 'Blue heart', value: '💙', keywords: ['trust'] },
  { label: 'Purple heart', value: '💜', keywords: ['support'] },
  { label: 'Yellow heart', value: '💛', keywords: ['friend'] },
  { label: 'Broken heart', value: '💔', keywords: ['sad', 'miss'] },
  { label: 'Sparkles', value: '✨', keywords: ['polish', 'magic'] },
  { label: 'Star', value: '⭐', keywords: ['favorite', 'highlight'] },
  { label: 'Fire', value: '🔥', keywords: ['hot', 'great'] },
  { label: 'Hundred', value: '💯', keywords: ['perfect', 'agree'] },
  { label: 'Party', value: '🎉', keywords: ['celebrate', 'confetti'] },
  { label: 'Trophy', value: '🏆', keywords: ['win', 'achievement'] },
  { label: 'Gift', value: '🎁', keywords: ['present', 'reward'] },
  { label: 'Rocket', value: '🚀', keywords: ['launch', 'ship'] },
  { label: 'Check', value: '✅', keywords: ['done', 'success'] },
  { label: 'Cross', value: '❌', keywords: ['no', 'wrong', 'fail'] },
  { label: 'Stop', value: '⛔', keywords: ['blocked', 'forbidden'] },
  { label: 'Warning', value: '⚠️', keywords: ['alert', 'careful'] },
  { label: 'Info', value: 'ℹ️', keywords: ['information'] },
  { label: 'Question', value: '❓', keywords: ['help', 'ask'] },
  { label: 'Exclamation', value: '❗', keywords: ['important', 'alert'] },
  { label: 'New', value: '🆕', keywords: ['fresh', 'latest'] },
  { label: 'Hourglass', value: '⏳', keywords: ['waiting', 'pending'] },
  { label: 'Repeat', value: '🔄', keywords: ['refresh', 'sync'] },
  { label: 'Sleep', value: '💤', keywords: ['inactive', 'rest'] },
  { label: 'Bug', value: '🐛', keywords: ['issue', 'fix'] },
  { label: 'Eyes', value: '👀', keywords: ['look', 'review'] },
  { label: 'Document', value: '📄', keywords: ['page', 'file'] },
  { label: 'Memo', value: '📝', keywords: ['note', 'write'] },
  { label: 'Books', value: '📚', keywords: ['library', 'docs'] },
  { label: 'Folder', value: '📁', keywords: ['organize', 'files'] },
  { label: 'Idea', value: '💡', keywords: ['lightbulb', 'think'] },
  { label: 'Target', value: '🎯', keywords: ['goal', 'aim'] },
  { label: 'Chart', value: '📊', keywords: ['data', 'stats'] },
  { label: 'Trend up', value: '📈', keywords: ['growth', 'increase'] },
  { label: 'Trend down', value: '📉', keywords: ['decline', 'decrease'] },
  { label: 'Calendar', value: '📅', keywords: ['date', 'schedule'] },
  { label: 'Timer', value: '⏱️', keywords: ['time', 'deadline'] },
  { label: 'Search', value: '🔍', keywords: ['find', 'look'] },
  { label: 'Pin', value: '📌', keywords: ['important', 'sticky'] },
  { label: 'Link', value: '🔗', keywords: ['url', 'connect'] },
  { label: 'Label', value: '🏷️', keywords: ['tag', 'category'] },
  { label: 'Speech', value: '💬', keywords: ['comment', 'chat'] },
  { label: 'Megaphone', value: '📣', keywords: ['announce'] },
  { label: 'Bell', value: '🔔', keywords: ['notification', 'alert'] },
  { label: 'Brain', value: '🧠', keywords: ['think', 'smart'] },
  { label: 'Puzzle', value: '🧩', keywords: ['piece', 'integrate'] },
  { label: 'Wrench', value: '🔧', keywords: ['fix', 'tool'] },
  { label: 'Gear', value: '⚙️', keywords: ['settings', 'config'] },
  { label: 'Tools', value: '🛠️', keywords: ['build', 'repair'] },
  { label: 'Test tube', value: '🧪', keywords: ['experiment', 'lab'] },
  { label: 'Brick', value: '🧱', keywords: ['block', 'build'] },
  { label: 'Seedling', value: '🌱', keywords: ['grow', 'new'] },
  { label: 'Globe', value: '🌍', keywords: ['world', 'international'] },
  { label: 'Office', value: '🏢', keywords: ['company', 'work'] },
  { label: 'People', value: '👥', keywords: ['team', 'group'] },
  { label: 'Briefcase', value: '💼', keywords: ['business', 'work'] },
  { label: 'Lock', value: '🔒', keywords: ['secure', 'private'] },
  { label: 'Key', value: '🔑', keywords: ['access', 'unlock'] },
  { label: 'Coffee', value: '☕', keywords: ['break', 'cafe'] },
];

function focusOption(
  options: readonly EmojiPickerEmoji[],
  refs: React.MutableRefObject<Array<HTMLButtonElement | null>>,
  index: number,
): void {
  const next = Math.max(0, Math.min(options.length - 1, index));
  refs.current[next]?.focus();
}

export const EmojiPicker = forwardRef<EmojiPickerHandle, EmojiPickerProps>(function EmojiPicker(
  {
    value,
    defaultValue = '🙂',
    onChange,
    onSelected,
    label,
    icon = 'smile',
    emojis = DEFAULT_EMOJIS,
    open,
    onOpenChange,
    disabled = false,
    readOnly = false,
    hidden = false,
    error,
    hint,
    errors,
    invalid,
    required = false,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    className = '',
    style,
  },
  ref: Ref<EmojiPickerHandle>,
) {
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isOpen = open ?? internalOpen;
  const selectedValue = value ?? internalValue;
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const labelText = label || field?.label || t('emoji');
  const errorId = `sp-emoji-picker-${instanceId}-error`;
  const hintId = `sp-emoji-picker-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy ||
    (errorMessage ? errorId : hint || field?.hint ? hintId : undefined);
  const filteredEmojis = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return emojis;
    return emojis.filter((emoji) =>
      `${emoji.label} ${emoji.keywords?.join(' ') ?? ''} ${emoji.value}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [emojis, query]);

  const setOpenState = useCallback((next: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (open === undefined) setInternalOpen(next);
    if (!next) setQuery('');
    onOpenChange?.(next);
  }, [effectiveDisabled, effectiveReadOnly, onOpenChange, open]);

  const selectEmoji = useCallback((emoji: EmojiPickerEmoji) => {
    if (value === undefined) setInternalValue(emoji.value);
    onChange?.(emoji.value);
    onSelected?.(emoji);
    setOpenState(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onChange, onSelected, setOpenState, value]);

  useLayoutEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    toggle: () => setOpenState(!isOpen),
    openPanel: () => setOpenState(true),
    close: () => setOpenState(false),
  }), [isOpen, setOpenState]);

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(filteredEmojis, optionRefs, (index + 1) % filteredEmojis.length);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(filteredEmojis, optionRefs, (index - 1 + filteredEmojis.length) % filteredEmojis.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusOption(filteredEmojis, optionRefs, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusOption(filteredEmojis, optionRefs, filteredEmojis.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpenState(false);
      triggerRef.current?.focus();
    }
  }

  if (hidden || field?.hidden) return null;
  const rootClasses = [
    'sp-emoji-picker',
    isOpen && 'sp-emoji-picker--open',
    effectiveDisabled && 'sp-emoji-picker--disabled',
    effectiveReadOnly && 'sp-emoji-picker--readonly',
    hasError && 'sp-emoji-picker--error',
    className,
  ].filter(Boolean).join(' ');
  const triggerLabel = ariaLabel || labelText;

  return (
    <div className={rootClasses} style={style} dir={direction}>
      <Popover
        open={isOpen}
        onOpenChange={setOpenState}
        placement="bottom-start"
        offset={4}
        padding="0"
        panelClassName="sp-emoji-picker__popover-panel"
        trigger={
          <button
            ref={triggerRef}
            className="sp-emoji-picker__trigger"
            type="button"
            aria-label={triggerLabel}
            title={triggerLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-labelledby={ariaLabelledBy || undefined}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            aria-required={required || field?.required || undefined}
            aria-disabled={effectiveDisabled || undefined}
            disabled={effectiveDisabled}
          >
            {icon ? <Icon name={icon} size={14} aria-hidden="true" /> : <span className="sp-emoji-picker__trigger-emoji" aria-hidden="true">{selectedValue}</span>}
          </button>
        }
      >
        <div className="sp-emoji-picker__panel" role="dialog" aria-label={labelText}>
          <label className="sp-emoji-picker__search-label">
            <span className="sp-emoji-picker__sr">{t('searchEmojis')}</span>
            <input
              ref={searchRef}
              className="sp-emoji-picker__search"
              type="search"
              value={query}
              placeholder={t('search')}
              aria-label={t('searchEmojis')}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="sp-emoji-picker__grid" role="listbox" aria-label={labelText}>
            {filteredEmojis.map((emoji, index) => {
              const active = emoji.value === selectedValue;
              return (
                <button
                  key={`${emoji.value}-${index}`}
                  ref={(element) => { optionRefs.current[index] = element; }}
                  className={['sp-emoji-picker__option', active && 'sp-emoji-picker__option--active'].filter(Boolean).join(' ')}
                  type="button"
                  role="option"
                  aria-label={emoji.label}
                  aria-selected={active}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                  onClick={() => selectEmoji(emoji)}
                >
                  {emoji.value}
                </button>
              );
            })}
            {filteredEmojis.length === 0 && <div className="sp-emoji-picker__empty">{t('noResults')}</div>}
          </div>
        </div>
      </Popover>
      {errorMessage && <p className="sp-emoji-picker__error" id={errorId} role="alert">{errorMessage}</p>}
      {hint && !errorMessage && <p className="sp-emoji-picker__hint" id={hintId}>{hint}</p>}
    </div>
  );
});
