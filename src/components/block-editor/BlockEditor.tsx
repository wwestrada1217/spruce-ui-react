/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './BlockEditor.css';
import {
  useState,
  type ChangeEvent,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { Select, type SelectOption } from '../select/Select.js';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'callout'
  | 'list'
  | 'code'
  | 'divider';

export interface BlockItem {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    calloutType?: 'info' | 'warning' | 'success' | 'danger';
    listType?: 'unordered' | 'ordered';
    language?: string;
  };
}

export type BlockEditorSize = 'sm' | 'md' | 'lg';

export interface BlockEditorProps {
  /** Array of content block items */
  blocks?: BlockItem[];
  /** Emits updated array of block items */
  onChange?: (blocks: BlockItem[]) => void;
  /** Placeholder text for new blocks */
  placeholder?: string;
  /** Disable editing and block actions */
  disabled?: boolean;
  /** Make content read-only */
  readOnly?: boolean;
  /** Field label displayed above editor */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Helper text / hint displayed below editor */
  hint?: string;
  /** Validation error message string */
  error?: string;
  /** Visual size variant */
  size?: BlockEditorSize;
  /** Custom class name applied to root element */
  className?: string;
  /** Inline styles applied to root element */
  style?: React.CSSProperties;
}

const BLOCK_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Quote',     value: 'quote' },
  { label: 'Callout',   value: 'callout' },
  { label: 'List Item', value: 'list' },
  { label: 'Code',      value: 'code' },
  { label: 'Divider',   value: 'divider' },
];

function generateId(): string {
  return `block_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
}

const DEFAULT_INITIAL_BLOCKS: BlockItem[] = [
  {
    id: generateId(),
    type: 'h1',
    content: 'Welcome to Spruce Block Editor',
  },
  {
    id: generateId(),
    type: 'paragraph',
    content: 'Add, reorder, duplicate, and format content blocks easily.',
  },
];

/* ── Component ───────────────────────────────────────────────────────────── */

export function BlockEditor({
  blocks: propBlocks,
  onChange,
  placeholder = 'Type block content...',
  disabled = false,
  readOnly = false,
  label,
  required = false,
  hint,
  error: propError,
  size = 'md',
  className,
  style,
}: BlockEditorProps) {
  const [internalBlocks, setInternalBlocks] = useState<BlockItem[]>(
    propBlocks ?? DEFAULT_INITIAL_BLOCKS,
  );

  // Sync propBlocks
  const [prevPropBlocks, setPrevPropBlocks] = useState(propBlocks);
  if (propBlocks !== prevPropBlocks) {
    setPrevPropBlocks(propBlocks);
    if (propBlocks !== undefined) {
      setInternalBlocks(propBlocks);
    }
  }

  const currentBlocks = propBlocks !== undefined ? propBlocks : internalBlocks;

  function updateBlocks(nextBlocks: BlockItem[]) {
    setInternalBlocks(nextBlocks);
    onChange?.(nextBlocks);
  }

  function handleAddBlock(type: BlockType = 'paragraph', index?: number) {
    if (disabled || readOnly) return;
    const newBlock: BlockItem = {
      id: generateId(),
      type,
      content: '',
      ...(type === 'callout' ? { metadata: { calloutType: 'info' } } : {}),
      ...(type === 'list' ? { metadata: { listType: 'unordered' } } : {}),
    };

    const targetIndex = index !== undefined ? index + 1 : currentBlocks.length;
    const nextBlocks = [...currentBlocks];
    nextBlocks.splice(targetIndex, 0, newBlock);
    updateBlocks(nextBlocks);
  }

  function handleUpdateBlock(id: string, updates: Partial<BlockItem>) {
    if (disabled || readOnly) return;
    const nextBlocks = currentBlocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    updateBlocks(nextBlocks);
  }

  function handleMoveBlock(index: number, direction: -1 | 1) {
    if (disabled || readOnly) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentBlocks.length) return;

    const nextBlocks = [...currentBlocks];
    const [moved] = nextBlocks.splice(index, 1);
    nextBlocks.splice(targetIndex, 0, moved);
    updateBlocks(nextBlocks);
  }

  function handleDuplicateBlock(id: string) {
    if (disabled || readOnly) return;
    const index = currentBlocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const target = currentBlocks[index];
    const clonedBlock: BlockItem = {
      ...target,
      id: generateId(),
      metadata: target.metadata ? { ...target.metadata } : undefined,
    };

    const nextBlocks = [...currentBlocks];
    nextBlocks.splice(index + 1, 0, clonedBlock);
    updateBlocks(nextBlocks);
  }

  function handleDeleteBlock(id: string) {
    if (disabled || readOnly) return;
    const nextBlocks = currentBlocks.filter((b) => b.id !== id);
    updateBlocks(nextBlocks);
  }

  const isInteractive = !disabled && !readOnly;

  const sizeCls = size === 'sm' ? 'sp-block-editor--sm' : size === 'lg' ? 'sp-block-editor--lg' : '';
  const rootCls = [
    'sp-block-editor',
    sizeCls,
    disabled ? 'sp-block-editor--disabled' : '',
    readOnly ? 'sp-block-editor--readonly' : '',
    propError ? 'sp-block-editor--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls} style={style}>
      {label && (
        <label className="sp-block-editor__label">
          {label}
          {required && <span className="sp-block-editor__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="sp-block-editor__container">
        {currentBlocks.length === 0 ? (
          <div className="sp-block-editor__empty">
            <p>No content blocks yet</p>
            {isInteractive && (
              <button
                type="button"
                className="sp-block-editor__add-btn"
                onClick={() => handleAddBlock('paragraph')}
              >
                <Icon name="plus" size={14} />
                Add First Block
              </button>
            )}
          </div>
        ) : (
          <div className="sp-block-editor__list">
            {currentBlocks.map((block, index) => {
              const inputCls = `sp-block-editor__input sp-block-editor__input--${block.type}`;

              return (
                <div key={block.id} className="sp-block-editor__block">
                  {/* Block Type Selector */}
                  <div className="sp-block-editor__type-wrap">
                    <Select
                      options={BLOCK_TYPE_OPTIONS}
                      value={block.type}
                      onChange={(val) => {
                        const selectedType = (Array.isArray(val) ? val[0] : val) as BlockType;
                        handleUpdateBlock(block.id, { type: selectedType });
                      }}
                      disabled={!isInteractive}
                      size="sm"
                    />
                  </div>

                  {/* Block Content Input */}
                  <div className="sp-block-editor__content-wrap">
                    {block.type === 'divider' ? (
                      <div className="sp-block-editor__divider-line" />
                    ) : block.type === 'callout' ? (
                      <div
                        className={`sp-block-editor__callout sp-block-editor__callout--${
                          block.metadata?.calloutType || 'info'
                        }`}
                      >
                        <Icon name="info" size={18} />
                        <input
                          type="text"
                          className="sp-block-editor__input sp-block-editor__input--paragraph"
                          value={block.content}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleUpdateBlock(block.id, { content: e.target.value })
                          }
                          placeholder={placeholder}
                          disabled={!isInteractive}
                          aria-label="Callout content"
                        />
                      </div>
                    ) : block.type === 'code' ? (
                      <textarea
                        className={inputCls}
                        rows={2}
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          handleUpdateBlock(block.id, { content: e.target.value })
                        }
                        placeholder="// Enter code snippet..."
                        disabled={!isInteractive}
                        aria-label="Code block content"
                      />
                    ) : (
                      <input
                        type="text"
                        className={inputCls}
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleUpdateBlock(block.id, { content: e.target.value })
                        }
                        placeholder={placeholder}
                        disabled={!isInteractive}
                        aria-label="Block content"
                      />
                    )}
                  </div>

                  {/* Block Actions Toolbar */}
                  {isInteractive && (
                    <div className="sp-block-editor__actions">
                      <button
                        type="button"
                        className="sp-block-editor__action-btn"
                        onClick={() => handleMoveBlock(index, -1)}
                        disabled={index === 0}
                        title="Move Up"
                        aria-label="Move Block Up"
                      >
                        <Icon name="arrow-up" size={14} />
                      </button>
                      <button
                        type="button"
                        className="sp-block-editor__action-btn"
                        onClick={() => handleMoveBlock(index, 1)}
                        disabled={index === currentBlocks.length - 1}
                        title="Move Down"
                        aria-label="Move Block Down"
                      >
                        <Icon name="arrow-down" size={14} />
                      </button>
                      <button
                        type="button"
                        className="sp-block-editor__action-btn"
                        onClick={() => handleDuplicateBlock(block.id)}
                        title="Duplicate Block"
                        aria-label="Duplicate Block"
                      >
                        <Icon name="copy" size={14} />
                      </button>
                      <button
                        type="button"
                        className="sp-block-editor__action-btn sp-block-editor__action-btn--danger"
                        onClick={() => handleDeleteBlock(block.id)}
                        title="Delete Block"
                        aria-label="Delete Block"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Block Footer Button */}
        {isInteractive && currentBlocks.length > 0 && (
          <button
            type="button"
            className="sp-block-editor__add-btn"
            onClick={() => handleAddBlock('paragraph')}
          >
            <Icon name="plus" size={14} />
            Add Block
          </button>
        )}
      </div>

      {/* Error message */}
      {propError && (
        <div className="sp-block-editor__error-msg" role="alert">
          {propError}
        </div>
      )}

      {/* Hint message */}
      {!propError && hint && (
        <div className="sp-block-editor__hint-msg">{hint}</div>
      )}
    </div>
  );
}
