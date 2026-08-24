/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Pager.css';
import { useMemo, useCallback } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type PagerSize = 'sm' | 'md' | 'lg';
export type PagerVariant = 'default' | 'outline' | 'ghost';

export interface PagerState {
  page: number;
  pageSize: number;
}

export interface PagerProps {
  totalItems: number;
  page?: number;
  pageSize?: number;
  size?: PagerSize;
  variant?: PagerVariant;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPages?: boolean;
  showTotal?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  ariaLabel?: string;
  disabled?: boolean;
  onStateChange?: (state: PagerState) => void;
  onPageChange?: (page: number) => void;
}

const ICON_SIZES: Record<PagerSize, number> = { sm: 12, md: 14, lg: 16 };

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) result.push(i);
  return result;
}

function computeVisiblePages(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const totalSlots = siblingCount * 2 + 5; // siblings + first + last + 2 ellipsis + current

  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = siblingCount * 2 + 3;
    const leftRange = range(1, leftCount);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblingCount * 2 + 3;
    const rightRange = range(totalPages - rightCount + 1, totalPages);
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

export function Pager({
  totalItems,
  page = 1,
  pageSize = 10,
  size = 'md',
  variant = 'default',
  siblingCount = 1,
  showFirstLast = true,
  showPages = true,
  showTotal = true,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  ariaLabel = 'Pagination',
  disabled = false,
  onStateChange,
  onPageChange,
}: PagerProps) {
  const { t, rangeInfo } = useI18n();
  const resolvedAriaLabel = ariaLabel === 'Pagination' ? t('pagination') : ariaLabel;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const iconSize = ICON_SIZES[size];

  const visiblePages = useMemo(
    () => computeVisiblePages(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );

  const goTo = useCallback(
    (newPage: number) => {
      const clamped = Math.min(Math.max(1, newPage), totalPages);
      if (clamped === currentPage) return;
      onPageChange?.(clamped);
      onStateChange?.({ page: clamped, pageSize });
    },
    [currentPage, totalPages, pageSize, onPageChange, onStateChange],
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      const newTotalPages = Math.max(1, Math.ceil(totalItems / newSize));
      const newPage = Math.min(currentPage, newTotalPages);
      onStateChange?.({ page: newPage, pageSize: newSize });
      onPageChange?.(newPage);
    },
    [currentPage, totalItems, onStateChange, onPageChange],
  );

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const classes = [
    'sp-pager',
    `sp-pager--${variant}`,
    size !== 'md' && `sp-pager--${size}`,
    disabled && 'sp-pager--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classes} aria-label={resolvedAriaLabel}>
      {showTotal && (
        <span className="sp-pager__total">
          {rangeInfo(rangeStart, rangeEnd, totalItems)}
        </span>
      )}

      <div className="sp-pager__controls">
        {showFirstLast && (
          <button
            className="sp-pager__btn sp-pager__btn--nav"
            type="button"
            disabled={disabled || currentPage <= 1}
            aria-label={t('firstPage')}
            onClick={() => goTo(1)}
          >
            <Icon name="chevrons-left" size={iconSize} />
          </button>
        )}

        <button
          className="sp-pager__btn sp-pager__btn--nav"
          type="button"
          disabled={disabled || currentPage <= 1}
          aria-label={t('previousPage')}
          onClick={() => goTo(currentPage - 1)}
        >
          <Icon name="chevron-left" size={iconSize} />
        </button>

        {showPages &&
          visiblePages.map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="sp-pager__ellipsis"
                aria-hidden="true"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                className={[
                  'sp-pager__btn',
                  'sp-pager__btn--page',
                  item === currentPage && 'sp-pager__btn--active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="button"
                disabled={disabled}
                aria-label={`${t('page')} ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                onClick={() => goTo(item)}
              >
                {item}
              </button>
            ),
          )}

        <button
          className="sp-pager__btn sp-pager__btn--nav"
          type="button"
          disabled={disabled || currentPage >= totalPages}
          aria-label={t('nextPage')}
          onClick={() => goTo(currentPage + 1)}
        >
          <Icon name="chevron-right" size={iconSize} />
        </button>

        {showFirstLast && (
          <button
            className="sp-pager__btn sp-pager__btn--nav"
            type="button"
            disabled={disabled || currentPage >= totalPages}
            aria-label={t('lastPage')}
            onClick={() => goTo(totalPages)}
          >
            <Icon name="chevrons-right" size={iconSize} />
          </button>
        )}
      </div>

      {showPageSize && (
        <div className="sp-pager__page-size">
          <label className="sp-pager__page-size-label">
            Rows per page
            <select
              className="sp-pager__page-size-select"
              value={pageSize}
              disabled={disabled}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </nav>
  );
}
