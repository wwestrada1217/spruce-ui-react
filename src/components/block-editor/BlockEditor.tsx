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
  useEffect,
  useLayoutEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { Select, type SelectOption } from '../select/Select.js';
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
  | 'divider'
  | 'image'
  | 'table';

export interface BlockItem {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    calloutType?: 'info' | 'warning' | 'success' | 'danger';
    language?: string;
    imageWidth?: number; // 25, 50, 75, 100
    tableData?: string[][];
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

const CODE_LANGUAGES: SelectOption[] = [
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'HTML',       value: 'html' },
  { label: 'CSS',        value: 'css' },
  { label: 'Python',     value: 'python' },
  { label: 'JSON',       value: 'json' },
  { label: 'Markdown',   value: 'markdown' },
  { label: 'SQL',        value: 'sql' },
  { label: 'Bash',       value: 'bash' },
  { label: 'Plain Text', value: 'plaintext' },
];

const CALLOUT_VARIANTS: SelectOption[] = [
  { label: 'Information', value: 'info' },
  { label: 'Warning',     value: 'warning' },
  { label: 'Danger',      value: 'danger' },
  { label: 'Success',     value: 'success' },
];

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
  { type: 'code',         label: 'Code Block',     desc: 'Capture code with syntax highlighting.', iconName: 'code' },
  { type: 'image',        label: 'Image',          desc: 'Insert an image with resizable width.', iconName: 'image' },
  { type: 'table',        label: 'Table',          desc: 'Add interactive table with rows & cols.', iconName: 'table' },
  { type: 'divider',      label: 'Divider',        desc: 'Visually divide blocks with a line.',iconName: 'minus' },
];

function generateId(): string {
  return `block_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
}

/* ── (3) Zero-Dependency Syntax Highlighting Helper ─────────────────────── */

function highlightCode(code: string): string {
  if (!code) return ' ';

  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Strings
  html = html.replace(/(["'`])(.*?)\1/g, '<span class="sp-token-string">$1$2$1</span>');

  // Comments
  html = html.replace(/(\/\/.*$)/gm, '<span class="sp-token-comment">$1</span>');

  // Keywords
  const keywords = /\b(const|let|var|function|return|import|export|from|if|else|for|while|type|interface|class|def|async|await|default|case|switch|try|catch|new|select|where|from)\b/g;
  html = html.replace(keywords, '<span class="sp-token-keyword">$1</span>');

  // Numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="sp-token-number">$1</span>');

  // Function calls: foo(...)
  html = html.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/g, '<span class="sp-token-function">$1</span>');

  return html;
}

const NOTION_DEFAULT_BLOCKS: BlockItem[] = [
  { id: generateId(), type: 'h1',        content: 'Notion & TipTap Style Block Editor' },
  { id: generateId(), type: 'paragraph', content: 'Type "/" anywhere to open the Notion slash command menu.' },
  { id: generateId(), type: 'callout',   content: 'Pro tip: Press Enter to create a new block, or Backspace on an empty block to delete it.', metadata: { calloutType: 'info' } },
  { id: generateId(), type: 'code',      content: 'function helloWorld() {\n  console.log("Hello from Spruce Block Editor!");\n}', metadata: { language: 'typescript' } },
  {
    id: generateId(),
    type: 'table',
    content: '',
    metadata: {
      tableData: [
        ['Component', 'Feature', 'Status'],
        ['BlockEditor', 'Notion Slash Menu', 'Ready'],
        ['BlockEditor', 'Syntax Highlighting', 'Ready'],
      ],
    },
  },
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
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

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

  /* ── 1. Click-Outside Dismissal ─────────────────────────────────────────── */
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;

      // Dismiss Slash Command Menu when clicking outside
      if (
        activeSlashBlockId &&
        slashMenuRef.current &&
        !slashMenuRef.current.contains(target)
      ) {
        setActiveSlashBlockId(null);
      }

      // Dismiss Context Options Menu when clicking outside
      if (
        activeContextMenuBlockId &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(target) &&
        !Object.values(gripRefs.current).some((el) => el?.contains(target))
      ) {
        setActiveContextMenuBlockId(null);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [activeSlashBlockId, activeContextMenuBlockId]);

  /* ── Code Block Textarea Autogrow Layout ────────────────────────────────── */
  useLayoutEffect(() => {
    currentBlocks.forEach((block) => {
      if (block.type === 'code') {
        const el = inputRefs.current[block.id];
        if (el) {
          el.style.height = 'auto';
          el.style.height = `${Math.max(60, el.scrollHeight)}px`;
        }
      }
    });
  }, [currentBlocks]);

  function adjustTextareaHeight(target: HTMLTextAreaElement) {
    target.style.height = 'auto';
    target.style.height = `${Math.max(60, target.scrollHeight)}px`;
  }

  function handleAddBlock(type: BlockType = 'paragraph', index?: number) {
    if (disabled || readOnly) return;
    const newBlock: BlockItem = {
      id: generateId(),
      type,
      content: '',
      ...(type === 'callout' ? { metadata: { calloutType: 'info' } } : {}),
      ...(type === 'code' ? { metadata: { language: 'typescript' } } : {}),
      ...(type === 'image' ? { metadata: { imageWidth: 100 } } : {}),
      ...(type === 'table'
        ? {
            metadata: {
              tableData: [
                ['Header 1', 'Header 2'],
                ['Row 1', 'Row 2'],
              ],
            },
          }
        : {}),
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
      metadata: target.metadata ? JSON.parse(JSON.stringify(target.metadata)) : undefined,
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

  function handleCopyCode(blockId: string, content: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopiedCodeId(blockId);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  }

  /* ── (6) Interactive Table Block Actions ────────────────────────────────── */

  function handleTableAddRow(blockId: string) {
    const block = currentBlocks.find((b) => b.id === blockId);
    if (!block || !block.metadata?.tableData) return;
    const grid = block.metadata.tableData;
    const colCount = grid[0]?.length || 2;
    const newRow = Array(colCount).fill('Cell');
    handleUpdateBlock(blockId, {
      metadata: { ...block.metadata, tableData: [...grid, newRow] },
    });
  }

  function handleTableRemoveRow(blockId: string) {
    const block = currentBlocks.find((b) => b.id === blockId);
    if (!block || !block.metadata?.tableData || block.metadata.tableData.length <= 1) return;
    const grid = [...block.metadata.tableData];
    grid.pop();
    handleUpdateBlock(blockId, {
      metadata: { ...block.metadata, tableData: grid },
    });
  }

  function handleTableAddCol(blockId: string) {
    const block = currentBlocks.find((b) => b.id === blockId);
    if (!block || !block.metadata?.tableData) return;
    const grid = block.metadata.tableData.map((row, idx) => [
      ...row,
      idx === 0 ? `Header ${row.length + 1}` : 'Cell',
    ]);
    handleUpdateBlock(blockId, {
      metadata: { ...block.metadata, tableData: grid },
    });
  }

  function handleTableRemoveCol(blockId: string) {
    const block = currentBlocks.find((b) => b.id === blockId);
    if (!block || !block.metadata?.tableData || (block.metadata.tableData[0]?.length || 0) <= 1) return;
    const grid = block.metadata.tableData.map((row) => {
      const nextRow = [...row];
      nextRow.pop();
      return nextRow;
    });
    handleUpdateBlock(blockId, {
      metadata: { ...block.metadata, tableData: grid },
    });
  }

  function handleTableCellChange(blockId: string, rowIndex: number, colIndex: number, value: string) {
    const block = currentBlocks.find((b) => b.id === blockId);
    if (!block || !block.metadata?.tableData) return;
    const grid = block.metadata.tableData.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell)),
    );
    handleUpdateBlock(blockId, {
      metadata: { ...block.metadata, tableData: grid },
    });
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

    let cleanContent = block.content;
    const slashIdx = cleanContent.indexOf('/');
    if (slashIdx !== -1) {
      cleanContent = cleanContent.substring(0, slashIdx);
    }

    handleUpdateBlock(blockId, {
      type,
      content: cleanContent,
      ...(type === 'code' ? { metadata: { language: 'typescript' } } : {}),
      ...(type === 'callout' ? { metadata: { calloutType: 'info' } } : {}),
      ...(type === 'image' ? { metadata: { imageWidth: 100 } } : {}),
      ...(type === 'table'
        ? {
            metadata: {
              tableData: [
                ['Header 1', 'Header 2'],
                ['Row 1', 'Row 2'],
              ],
            },
          }
        : {}),
    });

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
      // Code blocks allow newline on Enter, Ctrl/Cmd+Enter creates a new block below
      if (block.type === 'code') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleAddBlock('paragraph', index);
        }
        return;
      }

      if (!e.shiftKey) {
        e.preventDefault();

        // Bulleted and Numbered list continuation
        if (block.type === 'list' || block.type === 'list-ordered') {
          if (block.content.trim() === '') {
            handleUpdateBlock(block.id, { type: 'paragraph' });
          } else {
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
                {/* Notion Side Handle in clear left gutter */}
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
                    /* (1) Callout with Variant Selector and straight accent line */
                    <div
                      className={`sp-block-editor__callout-card sp-block-editor__callout-card--${
                        block.metadata?.calloutType || 'info'
                      }`}
                    >
                      <div className="sp-block-editor__callout-header">
                        <div className="sp-block-editor__callout-main">
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
                        {isInteractive && (
                          <div style={{ width: 110 }}>
                            <Select
                              options={CALLOUT_VARIANTS}
                              value={block.metadata?.calloutType || 'info'}
                              onChange={(val) => {
                                const selectedVal = (Array.isArray(val) ? val[0] : val) as 'info' | 'warning' | 'danger' | 'success';
                                handleUpdateBlock(block.id, {
                                  metadata: { ...block.metadata, calloutType: selectedVal },
                                });
                              }}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : block.type === 'code' ? (
                    /* (2 & 3) Theme-Aware Code Block with Real-Time Syntax Highlighting */
                    <div className="sp-block-editor__code-card">
                      <div className="sp-block-editor__code-header">
                        <div className="sp-block-editor__code-lang-wrap">
                          <Select
                            options={CODE_LANGUAGES}
                            value={block.metadata?.language || 'typescript'}
                            onChange={(val) => {
                              const selectedLang = Array.isArray(val) ? val[0] : val;
                              handleUpdateBlock(block.id, {
                                metadata: { ...block.metadata, language: selectedLang },
                              });
                            }}
                            disabled={!isInteractive}
                            size="sm"
                          />
                        </div>
                        <button
                          type="button"
                          className="sp-block-editor__code-copy-btn"
                          onClick={() => handleCopyCode(block.id, block.content)}
                        >
                          <Icon name={copiedCodeId === block.id ? 'check' : 'copy'} size={12} />
                          {copiedCodeId === block.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="sp-block-editor__code-body">
                        <pre
                          className="sp-block-editor__code-highlight"
                          dangerouslySetInnerHTML={{ __html: highlightCode(block.content) }}
                        />
                        <textarea
                          ref={(el) => { inputRefs.current[block.id] = el; }}
                          className="sp-block-editor__code-textarea"
                          value={block.content}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            adjustTextareaHeight(e.target);
                            handleInputChange(block.id, e.target.value);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, block, index)}
                          placeholder="// Type code here..."
                          disabled={!isInteractive}
                        />
                      </div>
                    </div>
                  ) : block.type === 'image' ? (
                    /* (5) Resizable Image Block */
                    <div className="sp-block-editor__image-card">
                      {block.content ? (
                        <div
                          className="sp-block-editor__image-wrap"
                          style={{ width: `${block.metadata?.imageWidth || 100}%` }}
                        >
                          <img
                            src={block.content}
                            alt="Block image preview"
                            className="sp-block-editor__image-img"
                          />
                        </div>
                      ) : null}
                      <input
                        ref={(el) => { inputRefs.current[block.id] = el; }}
                        type="text"
                        className="sp-block-editor__input sp-block-editor__input--paragraph"
                        value={block.content}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(block.id, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        placeholder="Enter image URL (e.g. https://images.unsplash.com/...)"
                        disabled={!isInteractive}
                      />
                      {isInteractive && block.content && (
                        <div className="sp-block-editor__image-toolbar">
                          <span style={{ fontSize: 11, color: 'var(--sp-text-subtle)' }}>Width:</span>
                          {[25, 50, 75, 100].map((w) => (
                            <button
                              key={w}
                              type="button"
                              className={`sp-block-editor__image-size-btn${
                                (block.metadata?.imageWidth || 100) === w
                                  ? ' sp-block-editor__image-size-btn--active'
                                  : ''
                              }`}
                              onClick={() =>
                                handleUpdateBlock(block.id, {
                                  metadata: { ...block.metadata, imageWidth: w },
                                })
                              }
                            >
                              {w}%
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : block.type === 'table' ? (
                    /* (6) Interactive Table Block with Add/Remove Rows and Columns */
                    <div className="sp-block-editor__table-card">
                      <table className="sp-block-editor__table">
                        <thead>
                          <tr>
                            {(block.metadata?.tableData?.[0] || ['Header 1', 'Header 2']).map(
                              (cell, colIdx) => (
                                <th key={colIdx}>
                                  <input
                                    type="text"
                                    className="sp-block-editor__table-cell"
                                    value={cell}
                                    onChange={(e) =>
                                      handleTableCellChange(block.id, 0, colIdx, e.target.value)
                                    }
                                    disabled={!isInteractive}
                                  />
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(block.metadata?.tableData?.slice(1) || [['Cell 1', 'Cell 2']]).map(
                            (row, rIdx) => (
                              <tr key={rIdx + 1}>
                                {row.map((cell, colIdx) => (
                                  <td key={colIdx}>
                                    <input
                                      type="text"
                                      className="sp-block-editor__table-cell"
                                      value={cell}
                                      onChange={(e) =>
                                        handleTableCellChange(
                                          block.id,
                                          rIdx + 1,
                                          colIdx,
                                          e.target.value,
                                        )
                                      }
                                      disabled={!isInteractive}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>

                      {isInteractive && (
                        <div className="sp-block-editor__table-toolbar">
                          <button
                            type="button"
                            className="sp-block-editor__table-btn"
                            onClick={() => handleTableAddRow(block.id)}
                          >
                            <Icon name="plus" size={12} /> Row
                          </button>
                          <button
                            type="button"
                            className="sp-block-editor__table-btn"
                            onClick={() => handleTableRemoveRow(block.id)}
                          >
                            <Icon name="minus" size={12} /> Row
                          </button>
                          <button
                            type="button"
                            className="sp-block-editor__table-btn"
                            onClick={() => handleTableAddCol(block.id)}
                          >
                            <Icon name="plus" size={12} /> Column
                          </button>
                          <button
                            type="button"
                            className="sp-block-editor__table-btn"
                            onClick={() => handleTableRemoveCol(block.id)}
                          >
                            <Icon name="minus" size={12} /> Column
                          </button>
                        </div>
                      )}
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

      {/* Smart Positioned Portal: Slash Command Menu Popover with Click-Outside Dismissal */}
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

      {/* Smart Positioned Portal: Context Menu Popover with Click-Outside Dismissal */}
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
