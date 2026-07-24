import { useState, useCallback, useRef } from 'react';
import type { ReactNode, DragEvent, KeyboardEvent } from 'react';
import './Kanban.css';

/* ── Public types ──────────────────────────────────────────────────────── */

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

export interface KanbanCardMoveEvent {
  card: KanbanCard;
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
}

export interface KanbanColumnMoveEvent {
  columnId: string;
  fromIndex: number;
  toIndex: number;
}

/* ── Props ─────────────────────────────────────────────────────────────── */

export interface KanbanProps {
  columns: KanbanColumn[];
  columnDraggable?: boolean;
  ariaLabel?: string;
  cardRenderer?: (card: KanbanCard, column: KanbanColumn) => ReactNode;
  columnHeaderRenderer?: (column: KanbanColumn, count: number) => ReactNode;
  onCardMoved?: (event: KanbanCardMoveEvent) => void;
  onColumnMoved?: (event: KanbanColumnMoveEvent) => void;
  onCardClicked?: (event: { card: KanbanCard; column: KanbanColumn }) => void;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function Kanban({
  columns,
  columnDraggable = true,
  ariaLabel = 'Kanban board',
  cardRenderer,
  columnHeaderRenderer,
  onCardMoved,
  onColumnMoved,
  onCardClicked,
}: KanbanProps) {
  /* ── Internal drag state ──────────────────────────────────────────────── */

  const [dragType, setDragType] = useState<'card' | 'column' | null>(null);

  // Card drag state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragSourceColumnId, setDragSourceColumnId] = useState<string | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number>(-1);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dropTargetCardId, setDropTargetCardId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);

  // Column drag state
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [dragSourceColIndex, setDragSourceColIndex] = useState<number>(-1);
  const [colDropTarget, setColDropTarget] = useState<number>(-1);

  // Refs to hold current drop state for use in drop handler
  // (avoids stale closure issues with batched state updates)
  const dropTargetCardIdRef = useRef<string | null>(null);
  const dropPositionRef = useRef<'above' | 'below' | null>(null);
  const dragTypeRef = useRef<'card' | 'column' | null>(null);

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  const resetCardDragState = useCallback(() => {
    setDragType(null);
    dragTypeRef.current = null;
    setDraggingCardId(null);
    setDragSourceColumnId(null);
    setDragSourceIndex(-1);
    setDragOverColumnId(null);
    setDropTargetCardId(null);
    dropTargetCardIdRef.current = null;
    setDropPosition(null);
    dropPositionRef.current = null;
  }, []);

  const resetColumnDragState = useCallback(() => {
    setDragType(null);
    dragTypeRef.current = null;
    setDraggingColumnId(null);
    setDragSourceColIndex(-1);
    setColDropTarget(-1);
  }, []);

  /* ── Card drag & drop ─────────────────────────────────────────────────── */

  const onCardDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, card: KanbanCard, col: KanbanColumn, idx: number) => {
      event.stopPropagation();
      if (!event.dataTransfer) return;

      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.id);

      setDragType('card');
      dragTypeRef.current = 'card';
      setDraggingCardId(card.id);
      setDragSourceColumnId(col.id);
      setDragSourceIndex(idx);
    },
    [],
  );

  const onCardDragEnd = useCallback(() => {
    resetCardDragState();
  }, [resetCardDragState]);

  const onCardDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>, card: KanbanCard, _cardIdx: number, currentDraggingCardId: string | null) => {
      if (dragTypeRef.current !== 'card') return;
      event.preventDefault();
      event.stopPropagation();

      if (card.id === currentDraggingCardId) return;

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const pos = event.clientY < midY ? 'above' : 'below';

      setDropTargetCardId(card.id);
      dropTargetCardIdRef.current = card.id;
      setDropPosition(pos);
      dropPositionRef.current = pos;
    },
    [],
  );

  const onCardListDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>, col: KanbanColumn) => {
      if (dragTypeRef.current !== 'card') return;
      event.preventDefault();
      setDragOverColumnId(col.id);
    },
    [],
  );

  const onCardListDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (dragTypeRef.current !== 'card') return;
    const related = event.relatedTarget as HTMLElement | null;
    const currentTarget = event.currentTarget as HTMLElement;
    if (related && currentTarget.contains(related)) return;

    setDragOverColumnId(null);
    setDropTargetCardId(null);
    dropTargetCardIdRef.current = null;
    setDropPosition(null);
    dropPositionRef.current = null;
  }, []);

  const onCardListDrop = useCallback(
    (
      event: DragEvent<HTMLDivElement>,
      targetCol: KanbanColumn,
      fromColId: string | null,
      fromIdx: number,
      cardId: string | null,
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (dragTypeRef.current !== 'card') return;

      if (!fromColId || fromIdx < 0 || !cardId) {
        resetCardDragState();
        return;
      }

      const fromCol = columns.find((c) => c.id === fromColId);
      const card = fromCol?.cards.find((c) => c.id === cardId);
      if (!fromCol || !card) {
        resetCardDragState();
        return;
      }

      let toIndex: number;
      const targetCardId = dropTargetCardIdRef.current;
      const pos = dropPositionRef.current;

      if (targetCardId && pos) {
        const targetIdx = targetCol.cards.findIndex((c) => c.id === targetCardId);
        toIndex = pos === 'above' ? targetIdx : targetIdx + 1;
        // Adjust index if moving within the same column and from a lower position
        if (fromColId === targetCol.id && fromIdx < toIndex) {
          toIndex--;
        }
      } else {
        toIndex = targetCol.cards.length;
        if (fromColId === targetCol.id) {
          toIndex = targetCol.cards.length - 1;
        }
      }

      onCardMoved?.({
        card,
        fromColumnId: fromColId,
        toColumnId: targetCol.id,
        fromIndex: fromIdx,
        toIndex: Math.max(0, toIndex),
      });

      resetCardDragState();
    },
    [columns, onCardMoved, resetCardDragState],
  );

  /* ── Column drag & drop ───────────────────────────────────────────────── */

  const onColumnDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, col: KanbanColumn, idx: number) => {
      if (!columnDraggable || !event.dataTransfer) return;
      // Don't start column drag if a card drag is in progress
      if (dragTypeRef.current === 'card') return;

      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', col.id);

      setDragType('column');
      dragTypeRef.current = 'column';
      setDraggingColumnId(col.id);
      setDragSourceColIndex(idx);
    },
    [columnDraggable],
  );

  const onColumnDragEnd = useCallback(() => {
    resetColumnDragState();
  }, [resetColumnDragState]);

  const onColumnDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>, col: KanbanColumn, colIdx: number, currentDraggingColumnId: string | null) => {
      if (dragTypeRef.current !== 'column') return;
      if (col.id === currentDraggingColumnId) return;
      event.preventDefault();
      setColDropTarget(colIdx);
    },
    [],
  );

  const onColumnDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (dragTypeRef.current !== 'column') return;
    const related = event.relatedTarget as HTMLElement | null;
    const currentTarget = event.currentTarget as HTMLElement;
    if (related && currentTarget.contains(related)) return;
    setColDropTarget(-1);
  }, []);

  const onColumnDrop = useCallback(
    (
      event: DragEvent<HTMLDivElement>,
      _targetCol: KanbanColumn,
      targetIdx: number,
      fromIdx: number,
      columnId: string | null,
    ) => {
      if (dragTypeRef.current !== 'column') return;
      event.preventDefault();

      if (fromIdx < 0 || !columnId || fromIdx === targetIdx) {
        resetColumnDragState();
        return;
      }

      onColumnMoved?.({ columnId, fromIndex: fromIdx, toIndex: targetIdx });
      resetColumnDragState();
    },
    [onColumnMoved, resetColumnDragState],
  );

  /* ── Keyboard support ─────────────────────────────────────────────────── */

  const onCardKeydown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, card: KanbanCard, col: KanbanColumn, cardIdx: number) => {
      const colIdx = columns.findIndex((c) => c.id === col.id);

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onCardClicked?.({ card, column: col });
        return;
      }

      // Move card up within column
      if (event.key === 'ArrowUp' && event.altKey) {
        event.preventDefault();
        if (cardIdx > 0) {
          onCardMoved?.({
            card,
            fromColumnId: col.id,
            toColumnId: col.id,
            fromIndex: cardIdx,
            toIndex: cardIdx - 1,
          });
        }
        return;
      }

      // Move card down within column
      if (event.key === 'ArrowDown' && event.altKey) {
        event.preventDefault();
        if (cardIdx < col.cards.length - 1) {
          onCardMoved?.({
            card,
            fromColumnId: col.id,
            toColumnId: col.id,
            fromIndex: cardIdx,
            toIndex: cardIdx + 1,
          });
        }
        return;
      }

      // Move card to previous column
      if (event.key === 'ArrowLeft' && event.altKey) {
        event.preventDefault();
        if (colIdx > 0) {
          const prevCol = columns[colIdx - 1];
          onCardMoved?.({
            card,
            fromColumnId: col.id,
            toColumnId: prevCol.id,
            fromIndex: cardIdx,
            toIndex: prevCol.cards.length,
          });
        }
        return;
      }

      // Move card to next column
      if (event.key === 'ArrowRight' && event.altKey) {
        event.preventDefault();
        if (colIdx < columns.length - 1) {
          const nextCol = columns[colIdx + 1];
          onCardMoved?.({
            card,
            fromColumnId: col.id,
            toColumnId: nextCol.id,
            fromIndex: cardIdx,
            toIndex: nextCol.cards.length,
          });
        }
        return;
      }
    },
    [columns, onCardMoved, onCardClicked],
  );

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="sp-kanban" role="region" aria-label={ariaLabel}>
      {columns.map((col, colIdx) => {
        const columnClasses = [
          'sp-kanban__column',
          dragOverColumnId === col.id && dragType === 'card' && 'sp-kanban__column--drag-over',
          draggingColumnId === col.id && 'sp-kanban__column--dragging',
          colDropTarget === colIdx && dragType === 'column' && 'sp-kanban__column--col-drag-over',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={col.id}
            className={columnClasses}
            data-column-id={col.id}
            aria-label={`${col.title} column, ${col.cards.length} cards`}
            role="list"
            draggable={columnDraggable}
            onDragStart={(e) => onColumnDragStart(e, col, colIdx)}
            onDragEnd={onColumnDragEnd}
            onDragOver={(e) => onColumnDragOver(e, col, colIdx, draggingColumnId)}
            onDragLeave={onColumnDragLeave}
            onDrop={(e) => onColumnDrop(e, col, colIdx, dragSourceColIndex, draggingColumnId)}
          >
            {/* Column header */}
            <div className="sp-kanban__column-header">
              {columnHeaderRenderer ? (
                columnHeaderRenderer(col, col.cards.length)
              ) : (
                <div className="sp-kanban__column-title-row">
                  {col.color && (
                    <span
                      className="sp-kanban__column-dot"
                      style={{ background: col.color }}
                    />
                  )}
                  <span className="sp-kanban__column-title">{col.title}</span>
                  <span className="sp-kanban__column-count">{col.cards.length}</span>
                </div>
              )}
            </div>

            {/* Card list */}
            <div
              className="sp-kanban__card-list"
              onDragOver={(e) => onCardListDragOver(e, col)}
              onDragLeave={onCardListDragLeave}
              onDrop={(e) => onCardListDrop(e, col, dragSourceColumnId, dragSourceIndex, draggingCardId)}
            >
              {col.cards.map((card, cardIdx) => {
                const cardClasses = [
                  'sp-kanban__card',
                  draggingCardId === card.id && 'sp-kanban__card--dragging',
                  dropTargetCardId === card.id && dropPosition === 'above' && 'sp-kanban__card--drop-above',
                  dropTargetCardId === card.id && dropPosition === 'below' && 'sp-kanban__card--drop-below',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={card.id}
                    className={cardClasses}
                    role="listitem"
                    draggable
                    aria-label={card.title}
                    aria-roledescription="Draggable card"
                    tabIndex={0}
                    onDragStart={(e) => onCardDragStart(e, card, col, cardIdx)}
                    onDragEnd={onCardDragEnd}
                    onDragOver={(e) => onCardDragOver(e, card, cardIdx, draggingCardId)}
                    onKeyDown={(e) => onCardKeydown(e, card, col, cardIdx)}
                  >
                    {cardRenderer ? (
                      cardRenderer(card, col)
                    ) : (
                      <>
                        <div className="sp-kanban__card-title">{card.title}</div>
                        {card.description && (
                          <div className="sp-kanban__card-desc">{card.description}</div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              {/* Empty column drop zone */}
              {col.cards.length === 0 && (
                <div className="sp-kanban__empty-zone">Drop cards here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
