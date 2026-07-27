/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './BlockEditor.css';
import {
  useState,
  useRef,
  useLayoutEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { computePosition } from '../../utils/positioning.js';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'callout'
  | 'list'
  | 'list-ordered'
  | 'code'
  | 'divider';

export interface BlockItem {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    calloutType?: 'info' | 'warning' | 'success' | 'danger';
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

interface SlashCommandOption {
  type: BlockType;
  label: string;
  desc: string;
  iconName: string;
}

const SLASH_COMMANDS: SlashCommandOption[] = [
  { type: 'paragraph',    label: 'Text',           desc: 'Just start typing with plain text.', iconName: 'type' },
  { type: 'h1',           label: 'Heading 1',      desc: 'Big section heading.',               iconName: 'heading' },
  { type: 'h2',           label: 'Heading 2',      desc: 'Medium section heading.',            iconName: 'heading' },
  { type: 'h3',           label: 'Heading 3',      desc: 'Small section heading.',             iconName: 'heading' },
  { type: 'list',         label: 'Bulleted List',  desc: 'Create a simple bulleted list.',    iconName: 'list' },
  { type: 'list-ordered', label: 'Numbered List',  desc: 'Create a numbered list.',            iconName: 'list-ordered' },
  { type: 'quote',        label: 'Quote',          desc: 'Capture a quote or highlight text.', iconName: 'quote' },
  { type: 'callout',      label: 'Callout',        desc: 'Make text stand out with a box.',    iconName: 'info' },
  { type: 'code',         label: 'Code Block',     desc: 'Capture code snippet.',              iconName: 'code' },
  { type: 'divider',      label: 'Divider',        desc: 'Visually divide blocks with a line.',iconName: 'minus' },
];

function generateId(): string {
  return `block_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
}

const NOTION_DEFAULT_BLOCKS: BlockItem[] = [
  { id: generateId(), type: 'h1',        content: 'Notion & TipTap Style Block Editor' },
  { id: generateId(), type: 'paragraph', content: 'Type "/" anywhere to open the Notion slash command menu.' },
  { id: generateId(), type: 'callout',   content: 'Pro tip: Press Enter to create a new block, or Backspace on an empty block to delete it.', metadata: { calloutType: 'info' } },
];

/* ── Component ───────────────────────────────────────────────────────────── */

export function BlockEditor({
  blocks: propBlocks,
  onChange,
  placeholder = "Type '/' for commands...",
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
    propBlocks ?? NOTION_DEFAULT_BLOCKS,
  );
  const [activeSlashBlockId, setActiveSlashBlockId] = useState<string | null>(null);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });

  const [activeContextMenuBlockId, setActiveContextMenuBlockId] = useState<string | null>(null);
  const [contextPos, setContextPos] = useState({ top: 0, left: 0 });

  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const gripRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const slashMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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

  function focusBlock(id: string) {
    requestAnimationFrame(() => {
      const el = inputRefs.current[id];
      if (el) el.focus();
    });
  }

  function handleAddBlock(type: BlockType = 'paragraph', index?: number) {
    if (disabled || readOnly) return;
    const newBlock: BlockItem = {
      id: generateId(),
      type,
      content: '',
      ...(type === 'callout' ? { metadata: { calloutType: 'info' } } : {}),
    };

    const targetIndex = index !== undefined ? index + 1 : currentBlocks.length;
    const nextBlocks = [...currentBlocks];
    nextBlocks.splice(targetIndex, 0, newBlock);
    updateBlocks(nextBlocks);
    focusBlock(newBlock.id);
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
    setActiveContextMenuBlockId(null);
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
    setActiveContextMenuBlockId(null);
    focusBlock(clonedBlock.id);
  }

  function handleDeleteBlock(id: string) {
    if (disabled || readOnly) return;
    const nextBlocks = currentBlocks.filter((b) => b.id !== id);
    updateBlocks(nextBlocks);
    setActiveContextMenuBlockId(null);
  }

  /* ── Slash Menu Filtering & Smart Positioning ────────────────────────────── */

  const filteredSlashCommands = SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
      cmd.type.toLowerCase().includes(slashQuery.toLowerCase()),
  );

  useLayoutEffect(() => {
    if (!activeSlashBlockId) return;
    const anchor = inputRefs.current[activeSlashBlockId];
    const popover = slashMenuRef.current;
    if (anchor && popover) {
      const pos = computePosition(anchor, popover, 'bottom-start', 4);
      setSlashPos({ top: pos.top, left: pos.left });
    }
  }, [activeSlashBlockId, slashQuery, currentBlocks]);

  useLayoutEffect(() => {
    if (!activeContextMenuBlockId) return;
    const anchor = gripRefs.current[activeContextMenuBlockId];
    const popover = contextMenuRef.current;
    if (anchor && popover) {
      const pos = computePosition(anchor, popover, 'bottom-start', 4);
      setContextPos({ top: pos.top, left: pos.left });
    }
  }, [activeContextMenuBlockId]);

  function applySlashCommand(blockId: string, type: BlockType) {
    const block = currentBlocks.find((b) => b.id === blockId);
    if (!block) return;

    // Strip slash command text from content
    let cleanContent = block.content;
    const slashIdx = cleanContent.indexOf('/');
    if (slashIdx !== -1) {
      cleanContent = cleanContent.substring(0, slashIdx);
    }

    handleUpdateBlock(blockId, { type, content: cleanContent });
    setActiveSlashBlockId(null);
    setSlashQuery('');
    setSlashSelectedIndex(0);
    focusBlock(blockId);
  }

  /* ── Input Event Handlers & Hotkeys ──────────────────────────────────────── */

  function handleInputChange(id: string, newContent: string) {
    handleUpdateBlock(id, { content: newContent });

    // Check for Slash Command trigger
    if (newContent.includes('/')) {
      setActiveSlashBlockId(id);
      const slashText = newContent.substring(newContent.lastIndexOf('/') + 1);
      setSlashQuery(slashText);
    } else if (activeSlashBlockId === id) {
      setActiveSlashBlockId(null);
      setSlashQuery('');
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, block: BlockItem, index: number) {
    // Handling Slash Menu Keyboard Navigation
    if (activeSlashBlockId === block.id && filteredSlashCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (prev + 1) % filteredSlashCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const selectedCmd = filteredSlashCommands[slashSelectedIndex] || filteredSlashCommands[0];
        if (selectedCmd) applySlashCommand(block.id, selectedCmd.type);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveSlashBlockId(null);
        return;
      }
    }

    // Enter Key Handling
    if (e.key === 'Enter') {
      // Code blocks allow newline on Enter, and Ctrl/Cmd+Enter creates a new block below
      if (block.type === 'code') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleAddBlock('paragraph', index);
        }
        return; // Allow standard newline in code block textarea
      }

      if (!e.shiftKey) {
        e.preventDefault();

        // Bulleted and Numbered list continuation
        if (block.type === 'list' || block.type === 'list-ordered') {
          if (block.content.trim() === '') {
            // Convert empty list item to paragraph (exit list)
            handleUpdateBlock(block.id, { type: 'paragraph' });
          } else {
            // Continue list creation of same list type
            handleAddBlock(block.type, index);
          }
          return;
        }

        handleAddBlock('paragraph', index);
        return;
      }
    }

    // Backspace Key on Empty Block: Delete and Focus Previous
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      if (currentBlocks.length > 1) {
        handleDeleteBlock(block.id);
        const prevBlock = currentBlocks[index - 1] || currentBlocks[index + 1];
        if (prevBlock) focusBlock(prevBlock.id);
      }
    }
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

      <div className="sp-block-editor__canvas">
        {currentBlocks.length === 0 ? (
          <div className="sp-block-editor__empty-hint" onClick={() => handleAddBlock('paragraph')}>
            Click to start typing or enter '/' for commands...
          </div>
        ) : (
          currentBlocks.map((block, index) => {
            const inputCls = `sp-block-editor__input sp-block-editor__input--${block.type}`;

            // Calculate contiguous sequence number for numbered list items starting at 1
            let orderedListIndex = 1;
            if (block.type === 'list-ordered') {
              let count = 1;
              for (let i = index - 1; i >= 0; i--) {
                if (currentBlocks[i].type === 'list-ordered') {
                  count++;
                } else {
                  break;
                }
              }
              orderedListIndex = count;
            }

            return (
              <div key={block.id} className="sp-block-editor__line">
                {/* (1) Notion Side Handle (Grip + Add Button) in clear left gutter */}
                {isInteractive && (
                  <div className="sp-block-editor__side-handle">
                    <button
                      type="button"
                      className="sp-block-editor__handle-btn"
                      onClick={() => handleAddBlock('paragraph', index)}
                      title="Add Block Below"
                      aria-label="Add Block Below"
                    >
                      <Icon name="plus" size={14} />
                    </button>
                    <button
                      ref={(el) => { gripRefs.current[block.id] = el; }}
                      type="button"
                      className="sp-block-editor__handle-btn"
                      onClick={() =>
                        setActiveContextMenuBlockId(
                          activeContextMenuBlockId === block.id ? null : block.id,
                        )
                      }
                      title="Block Options"
                      aria-label="Block Options"
                    >
                      <Icon name="grip-vertical" size={14} />
                    </button>
                  </div>
                )}

                {/* Content Node */}
                <div className="sp-block-editor__node">
                  {block.type === 'divider' ? (
                    <div className="sp-block-editor__divider-bar" />
                  ) : block.type === 'list' ? (
                    <>
                      <span className="sp-block-editor__list-bullet">•</span>
                      <input
                        ref={(el) => { inputRefs.current[block.id] = el; }}
                        type="text"
                        className={inputCls}
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(block.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        placeholder={placeholder}
                        disabled={!isInteractive}
                      />
                    </>
                  ) : block.type === 'list-ordered' ? (
                    <>
                      <span className="sp-block-editor__list-bullet">{orderedListIndex}.</span>
                      <input
                        ref={(el) => { inputRefs.current[block.id] = el; }}
                        type="text"
                        className={inputCls}
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(block.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        placeholder={placeholder}
                        disabled={!isInteractive}
                      />
                    </>
                  ) : block.type === 'quote' ? (
                    <div className="sp-block-editor__quote-wrap">
                      <input
                        ref={(el) => { inputRefs.current[block.id] = el; }}
                        type="text"
                        className={inputCls}
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(block.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        placeholder="Quote text..."
                        disabled={!isInteractive}
                      />
                    </div>
                  ) : block.type === 'callout' ? (
                    /* (2) Callout with straight vertical accent line */
                    <div className="sp-block-editor__callout-card">
                      <Icon name="info" size={18} className="sp-block-editor__callout-icon" />
                      <input
                        ref={(el) => { inputRefs.current[block.id] = el; }}
                        type="text"
                        className="sp-block-editor__input sp-block-editor__input--paragraph"
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(block.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        placeholder="Callout note..."
                        disabled={!isInteractive}
                      />
                    </div>
                  ) : block.type === 'code' ? (
                    /* (3) Code block textarea allows multiline newlines */
                    <div className="sp-block-editor__code-card">
                      <textarea
                        ref={(el) => { inputRefs.current[block.id] = el; }}
                        className={inputCls}
                        rows={3}
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          handleInputChange(block.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        placeholder="// Enter code snippet..."
                        disabled={!isInteractive}
                      />
                    </div>
                  ) : (
                    <input
                      ref={(el) => { inputRefs.current[block.id] = el; }}
                      type="text"
                      className={inputCls}
                      value={block.content}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(block.id, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, block, index)}
                      placeholder={placeholder}
                      disabled={!isInteractive}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* (4) Smart Positioned Portal: Slash Command Menu Popover */}
      {activeSlashBlockId && filteredSlashCommands.length > 0 && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={slashMenuRef}
            className="sp-block-editor__slash-menu"
            style={{ top: `${slashPos.top}px`, left: `${slashPos.left}px` }}
          >
            <div className="sp-block-editor__slash-title">Basic Blocks</div>
            {filteredSlashCommands.map((cmd, cmdIdx) => (
              <button
                key={cmd.type}
                type="button"
                className={`sp-block-editor__slash-item${
                  cmdIdx === slashSelectedIndex ? ' sp-block-editor__slash-item--active' : ''
                }`}
                onClick={() => applySlashCommand(activeSlashBlockId, cmd.type)}
              >
                <div className="sp-block-editor__slash-icon">
                  <Icon name={cmd.iconName} size={14} />
                </div>
                <div>
                  <strong>{cmd.label}</strong>
                  <span className="sp-block-editor__slash-desc">{cmd.desc}</span>
                </div>
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* (4) Smart Positioned Portal: Context Menu Popover */}
      {activeContextMenuBlockId && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={contextMenuRef}
            className="sp-block-editor__context-menu"
            style={{ top: `${contextPos.top}px`, left: `${contextPos.left}px` }}
          >
            <button
              type="button"
              className="sp-block-editor__menu-btn"
              onClick={() => {
                const idx = currentBlocks.findIndex((b) => b.id === activeContextMenuBlockId);
                if (idx !== -1) handleMoveBlock(idx, -1);
              }}
            >
              <Icon name="arrow-up" size={14} /> Move Up
            </button>
            <button
              type="button"
              className="sp-block-editor__menu-btn"
              onClick={() => {
                const idx = currentBlocks.findIndex((b) => b.id === activeContextMenuBlockId);
                if (idx !== -1) handleMoveBlock(idx, 1);
              }}
            >
              <Icon name="arrow-down" size={14} /> Move Down
            </button>
            <button
              type="button"
              className="sp-block-editor__menu-btn"
              onClick={() => handleDuplicateBlock(activeContextMenuBlockId)}
            >
              <Icon name="copy" size={14} /> Duplicate
            </button>
            <button
              type="button"
              className="sp-block-editor__menu-btn sp-block-editor__menu-btn--danger"
              onClick={() => handleDeleteBlock(activeContextMenuBlockId)}
            >
              <Icon name="trash" size={14} /> Delete
            </button>
          </div>,
          document.body,
        )}

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
