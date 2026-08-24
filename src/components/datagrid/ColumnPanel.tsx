/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useCallback, useRef } from 'react';
import type { ColumnDef, ColumnState } from './grid-types';
import { useI18n } from '../../i18n/i18n-context.js';

export interface ColumnPanelProps<T = unknown> {
  columns: ColumnDef<T>[];
  columnStates: ColumnState[];
  reorder: boolean;
  onVisibilityChange: (change: { field: string; visible: boolean }) => void;
  onReorderChange: (fields: string[]) => void;
}

interface DragState {
  dragField: string | null;
  overField: string | null;
  dropPosition: 'before' | 'after' | null;
}

const INITIAL_DRAG: DragState = {
  dragField: null,
  overField: null,
  dropPosition: null,
};

export function ColumnPanel<T = unknown>({
  columns,
  columnStates,
  reorder,
  onVisibilityChange,
  onReorderChange,
}: ColumnPanelProps<T>) {
  const { t } = useI18n();
  const [drag, setDrag] = useState<DragState>(INITIAL_DRAG);
  const listRef = useRef<HTMLUListElement>(null);

  // Build an ordered list of columns based on columnStates order
  const orderedFields = [...columnStates]
    .sort((a, b) => a.order - b.order)
    .map((cs) => cs.field);

  const stateMap = new Map(columnStates.map((cs) => [cs.field, cs]));
  const defMap = new Map(columns.map((c) => [c.field, c]));

  const orderedItems = orderedFields
    .map((field) => ({
      field,
      label: defMap.get(field)?.headerName ?? field,
      visible: stateMap.get(field)?.visible ?? true,
    }))
    .filter((item) => defMap.has(item.field));

  const allVisible = orderedItems.every((item) => item.visible);
  const noneVisible = orderedItems.every((item) => !item.visible);

  const handleShowAll = useCallback(() => {
    for (const item of orderedItems) {
      if (!item.visible) {
        onVisibilityChange({ field: item.field, visible: true });
      }
    }
  }, [orderedItems, onVisibilityChange]);

  const handleHideAll = useCallback(() => {
    for (const item of orderedItems) {
      if (item.visible) {
        onVisibilityChange({ field: item.field, visible: false });
      }
    }
  }, [orderedItems, onVisibilityChange]);

  const handleToggle = useCallback(
    (field: string, currentlyVisible: boolean) => {
      onVisibilityChange({ field, visible: !currentlyVisible });
    },
    [onVisibilityChange],
  );

  // --- Drag handlers ---
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>, field: string) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', field);
      setDrag({ dragField: field, overField: null, dropPosition: null });
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLLIElement>, field: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (field === drag.dragField) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const position: 'before' | 'after' =
        e.clientY < midY ? 'before' : 'after';

      setDrag((prev) => ({
        ...prev,
        overField: field,
        dropPosition: position,
      }));
    },
    [drag.dragField],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      // Only clear if truly leaving the item (not entering a child)
      if (
        e.relatedTarget &&
        e.currentTarget.contains(e.relatedTarget as Node)
      ) {
        return;
      }
      setDrag((prev) => ({
        ...prev,
        overField: null,
        dropPosition: null,
      }));
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();

      const { dragField, overField, dropPosition } = drag;
      if (!dragField || !overField || dragField === overField) {
        setDrag(INITIAL_DRAG);
        return;
      }

      const newOrder = orderedFields.filter((f) => f !== dragField);
      const targetIdx = newOrder.indexOf(overField);
      const insertIdx =
        dropPosition === 'after' ? targetIdx + 1 : targetIdx;

      newOrder.splice(insertIdx, 0, dragField);
      onReorderChange(newOrder);
      setDrag(INITIAL_DRAG);
    },
    [drag, orderedFields, onReorderChange],
  );

  const handleDragEnd = useCallback(() => {
    setDrag(INITIAL_DRAG);
  }, []);

  return (
    <div
      className="sp-grid-column-panel"
      role="dialog"
      aria-label={t('columnVisibility')}
    >
      <div className="sp-grid-column-panel__header">
        <span className="sp-grid-column-panel__title">{t('columns')}</span>
        <div className="sp-grid-column-panel__actions">
          <button
            type="button"
            className="sp-grid-column-panel__btn"
            onClick={handleShowAll}
            disabled={allVisible}
          >
            {t('showAll')}
          </button>
          <button
            type="button"
            className="sp-grid-column-panel__btn"
            onClick={handleHideAll}
            disabled={noneVisible}
          >
            {t('hideAll')}
          </button>
        </div>
      </div>

      <ul
        ref={listRef}
        className="sp-grid-column-panel__list"
        role="list"
        aria-label={t('columns')}
      >
        {orderedItems.map((item) => {
          const isDragging = drag.dragField === item.field;
          const isOver = drag.overField === item.field;
          const showDropBefore =
            isOver && drag.dropPosition === 'before' && !isDragging;
          const showDropAfter =
            isOver && drag.dropPosition === 'after' && !isDragging;

          const itemClasses = [
            'sp-grid-column-panel__item',
            isDragging && 'sp-grid-column-panel__item--dragging',
            showDropBefore && 'sp-grid-column-panel__item--drop-before',
            showDropAfter && 'sp-grid-column-panel__item--drop-after',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li
              key={item.field}
              className={itemClasses}
              draggable={reorder}
              onDragStart={
                reorder ? (e) => handleDragStart(e, item.field) : undefined
              }
              onDragOver={
                reorder ? (e) => handleDragOver(e, item.field) : undefined
              }
              onDragLeave={reorder ? handleDragLeave : undefined}
              onDrop={reorder ? handleDrop : undefined}
              onDragEnd={reorder ? handleDragEnd : undefined}
              role="listitem"
            >
              {reorder && (
                <span
                  className="sp-grid-column-panel__drag-handle"
                  aria-hidden="true"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                </span>
              )}
              <label className="sp-grid-column-panel__label">
                <input
                  type="checkbox"
                  className="sp-grid-column-panel__checkbox"
                  checked={item.visible}
                  onChange={() => handleToggle(item.field, item.visible)}
                />
                <span className="sp-grid-column-panel__column-name">
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
