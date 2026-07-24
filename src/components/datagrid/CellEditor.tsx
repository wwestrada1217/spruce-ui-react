import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import type { CellEditorConfig, CellEditorContext, CellEditorType, SelectOption } from './grid-types';

export interface CellEditorProps<T = unknown> {
  initialValue: unknown;
  config: CellEditorConfig;
  /** Key that triggered edit-on-type; null means opened by click/dblclick */
  initialKey: string | null;
  /** Custom render function that overrides built-in editors */
  customRenderer?: (context: CellEditorContext<T>) => ReactNode;
  row: T;
  field: string;
  onCommit: (value: unknown) => void;
  onCancel: () => void;
  onNavigate: (value: unknown, direction: 'next' | 'prev') => void;
  onEnterCommit?: () => void;
}

function toIsoDate(v: unknown): string {
  if (!v) return '';
  const d = new Date(v as string);
  if (isNaN(d.getTime())) return String(v);
  return d.toISOString().split('T')[0];
}

function resolveOptions(opts: SelectOption[] | (() => SelectOption[]) | undefined): SelectOption[] {
  if (!opts) return [];
  return typeof opts === 'function' ? opts() : opts;
}

function getInitialDraft(
  type: CellEditorType,
  value: unknown,
  initialKey: string | null,
): { text: string; bool: boolean; select: string } {
  const draft = { text: '', bool: false, select: '' };

  if (type === 'boolean') {
    draft.bool = Boolean(value);
  } else if (type === 'select') {
    draft.select = value == null ? '' : String(value);
  } else if (type === 'number') {
    if (initialKey && /^[0-9.\-]$/.test(initialKey)) {
      draft.text = initialKey;
    } else {
      draft.text = value == null ? '' : String(value);
    }
  } else if (type === 'date') {
    draft.text = toIsoDate(value);
  } else {
    // text, textarea
    if (initialKey && initialKey.length === 1 && initialKey !== 'Backspace') {
      draft.text = initialKey;
    } else {
      draft.text = value == null ? '' : String(value);
    }
  }

  return draft;
}

export function CellEditor<T = unknown>({
  initialValue,
  config,
  initialKey,
  customRenderer,
  row,
  field,
  onCommit,
  onCancel,
  onNavigate,
  onEnterCommit,
}: CellEditorProps<T>) {
  const editorType: CellEditorType = config.type ?? 'text';
  const options = resolveOptions(config.options);

  const initial = getInitialDraft(editorType, initialValue, initialKey);
  const [textDraft, setTextDraft] = useState(initial.text);
  const [boolDraft, setBoolDraft] = useState(initial.bool);
  const [selectDraft, setSelectDraft] = useState(initial.select);
  const [validationError, setValidationError] = useState<string | null>(null);

  const committedRef = useRef(false);
  const hostRef = useRef<HTMLDivElement>(null);

  // Stable commit function that validates and fires onCommit
  const tryCommitValue = useCallback(
    (value: unknown): boolean => {
      if (committedRef.current) return false;
      if (config.validate) {
        const result = config.validate(value, row);
        if (result === false) {
          setValidationError('Invalid value');
          return false;
        }
        if (typeof result === 'string') {
          setValidationError(result);
          return false;
        }
      }
      setValidationError(null);
      committedRef.current = true;
      onCommit(value);
      return true;
    },
    [config, row, onCommit],
  );

  // Read the current draft value in the appropriate type for commit
  const getDraftValue = useCallback(
    (text: string, bool: boolean, sel: string): unknown => {
      if (editorType === 'boolean') return bool;
      if (editorType === 'select') {
        const match = options.find((o) => String(o.value) === sel);
        return match ? match.value : sel;
      }
      if (editorType === 'number') {
        return text === '' ? null : Number(text);
      }
      return text;
    },
    [editorType, options],
  );

  // Auto-focus the inner input on mount
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Use a microtask to let the DOM paint first
    queueMicrotask(() => {
      const target = host.querySelector<HTMLElement>(
        'input:not([type="checkbox"]), textarea, select, button[role="switch"]',
      );
      if (!target) return;
      target.focus();
      // Place cursor at end for text inputs
      if (target instanceof HTMLInputElement && target.type !== 'date') {
        const len = target.value.length;
        try {
          target.setSelectionRange(len, len);
        } catch {
          /* number inputs may throw */
        }
      }
      if (target instanceof HTMLTextAreaElement) {
        const len = target.value.length;
        target.setSelectionRange(len, len);
      }
    });
  }, []);

  // Host-level keydown handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
        return;
      }

      // Custom renderers handle their own Enter/Tab via context callbacks
      if (customRenderer) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        // Read latest draft from DOM to avoid stale closure values
        const host = hostRef.current;
        let currentText = textDraft;
        if (host) {
          const input = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(
            'input, textarea',
          );
          if (input) currentText = input.value;
        }
        const value = getDraftValue(currentText, boolDraft, selectDraft);
        if (tryCommitValue(value)) {
          onEnterCommit?.();
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        const dir = e.shiftKey ? 'prev' : 'next';
        const host = hostRef.current;
        let currentText = textDraft;
        if (host) {
          const input = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(
            'input, textarea',
          );
          if (input) currentText = input.value;
        }
        const value = getDraftValue(currentText, boolDraft, selectDraft);
        if (tryCommitValue(value)) {
          onNavigate(value, dir);
        }
      }
    },
    [
      customRenderer,
      textDraft,
      boolDraft,
      selectDraft,
      getDraftValue,
      tryCommitValue,
      onCancel,
      onNavigate,
      onEnterCommit,
    ],
  );

  // Focus-out handler: commit on blur (built-in editors only)
  const handleFocusOut = useCallback(
    (e: React.FocusEvent) => {
      if (customRenderer) return;
      // Delay so Enter/Tab keydown fires first
      setTimeout(() => {
        if (committedRef.current) return;
        const host = hostRef.current;
        if (!host) return;
        // If focus moved to another element inside this editor, skip
        if (document.activeElement && host.contains(document.activeElement)) return;
        // Read latest value from the DOM input
        let currentText = textDraft;
        const input = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          'input, textarea',
        );
        if (input) currentText = input.value;
        const value = getDraftValue(currentText, boolDraft, selectDraft);
        tryCommitValue(value);
      }, 0);
    },
    [customRenderer, textDraft, boolDraft, selectDraft, getDraftValue, tryCommitValue],
  );

  // Custom renderer context
  if (customRenderer) {
    const context: CellEditorContext<T> = {
      value: initialValue,
      row,
      field,
      config,
      commit: (v: unknown) => {
        if (tryCommitValue(v)) onEnterCommit?.();
      },
      cancel: () => onCancel(),
      navigate: (v: unknown, dir: 'next' | 'prev') => {
        if (tryCommitValue(v)) onNavigate(v, dir);
      },
    };

    return (
      <div
        ref={hostRef}
        className="sp-grid-cell-editor"
        onKeyDown={handleKeyDown}
        onBlur={handleFocusOut}
      >
        {customRenderer(context)}
        {validationError && (
          <div className="sp-grid-cell-editor__error">{validationError}</div>
        )}
      </div>
    );
  }

  // Built-in editor renderers
  let editorElement: ReactNode;

  switch (editorType) {
    case 'boolean': {
      const handleBoolClick = () => {
        const newVal = !boolDraft;
        setBoolDraft(newVal);
        // Delay to let the visual toggle transition finish
        setTimeout(() => tryCommitValue(newVal), 250);
      };
      editorElement = (
        <button
          type="button"
          role="switch"
          aria-checked={boolDraft}
          className={`sp-grid-cell-editor__switch ${boolDraft ? 'sp-grid-cell-editor__switch--checked' : ''}`}
          onClick={handleBoolClick}
        >
          <span className="sp-grid-cell-editor__switch-thumb" />
        </button>
      );
      break;
    }

    case 'select': {
      const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectDraft(val);
        setValidationError(null);
        // Auto-commit on selection
        const match = options.find((o) => String(o.value) === val);
        const commitVal = match ? match.value : val;
        // Use a microtask so the state update has settled
        queueMicrotask(() => tryCommitValue(commitVal));
      };
      editorElement = (
        <select
          className="sp-grid-cell-editor__select"
          value={selectDraft}
          onChange={handleSelectChange}
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      );
      break;
    }

    case 'number':
      editorElement = (
        <input
          type="number"
          className="sp-grid-cell-editor__input"
          value={textDraft}
          placeholder={config.placeholder ?? ''}
          min={config.min}
          max={config.max}
          step={config.step}
          onChange={(e) => {
            setTextDraft(e.target.value);
            setValidationError(null);
          }}
        />
      );
      break;

    case 'date':
      editorElement = (
        <input
          type="date"
          className="sp-grid-cell-editor__input"
          value={textDraft}
          onChange={(e) => {
            setTextDraft(e.target.value);
            setValidationError(null);
          }}
        />
      );
      break;

    case 'textarea':
      editorElement = (
        <textarea
          className="sp-grid-cell-editor__textarea"
          value={textDraft}
          rows={3}
          placeholder={config.placeholder ?? ''}
          onChange={(e) => {
            setTextDraft(e.target.value);
            setValidationError(null);
          }}
        />
      );
      break;

    default:
      // text
      editorElement = (
        <input
          type="text"
          className="sp-grid-cell-editor__input"
          value={textDraft}
          placeholder={config.placeholder ?? ''}
          onChange={(e) => {
            setTextDraft(e.target.value);
            setValidationError(null);
          }}
        />
      );
      break;
  }

  return (
    <div
      ref={hostRef}
      className="sp-grid-cell-editor"
      onKeyDown={handleKeyDown}
      onBlur={handleFocusOut}
    >
      {editorElement}
      {validationError && (
        <div className="sp-grid-cell-editor__error">{validationError}</div>
      )}
    </div>
  );
}
