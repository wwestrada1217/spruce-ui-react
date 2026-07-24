/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ColumnFilter, FilterOperator } from './grid-types';
import { FILTER_OPERATORS } from './grid-utils';

export interface GridColumnFilterProps {
  field: string;
  headerName: string;
  current: ColumnFilter | null;
  onFilterChange: (filter: ColumnFilter) => void;
  onClear: () => void;
  onClose: () => void;
}

const NO_VALUE_OPERATORS: FilterOperator[] = ['blank', 'notBlank'];

export function GridColumnFilter({
  field,
  headerName,
  current,
  onFilterChange,
  onClear,
  onClose,
}: GridColumnFilterProps) {
  const [operator, setOperator] = useState<FilterOperator>(
    current?.operator ?? 'contains',
  );
  const [value, setValue] = useState<string>(
    current?.value != null ? String(current.value) : '',
  );
  const [value2, setValue2] = useState<string>(
    current?.value2 != null ? String(current.value2) : '',
  );

  const valueInputRef = useRef<HTMLInputElement>(null);

  const hideValueInputs = NO_VALUE_OPERATORS.includes(operator);
  const showSecondValue = operator === 'between';

  useEffect(() => {
    if (!hideValueInputs) {
      valueInputRef.current?.focus();
    }
  }, [hideValueInputs]);

  const handleOperatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setOperator(e.target.value as FilterOperator);
    },
    [],
  );

  const handleApply = useCallback(() => {
    const filter: ColumnFilter = {
      operator,
      value: hideValueInputs ? '' : value,
    };
    if (showSecondValue) {
      filter.value2 = value2;
    }
    onFilterChange(filter);
  }, [operator, value, value2, hideValueInputs, showSecondValue, onFilterChange]);

  const handleClear = useCallback(() => {
    setOperator('contains');
    setValue('');
    setValue2('');
    onClear();
  }, [onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApply();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [handleApply, onClose],
  );

  return (
    <div
      className="sp-grid-column-filter"
      role="dialog"
      aria-label={`Filter ${headerName}`}
      onKeyDown={handleKeyDown}
    >
      <div className="sp-grid-column-filter__header">
        <span className="sp-grid-column-filter__title">
          Filter: {headerName}
        </span>
      </div>

      <div className="sp-grid-column-filter__body">
        <label
          className="sp-grid-column-filter__label"
          htmlFor={`filter-op-${field}`}
        >
          Operator
        </label>
        <select
          id={`filter-op-${field}`}
          className="sp-grid-column-filter__select"
          value={operator}
          onChange={handleOperatorChange}
        >
          {FILTER_OPERATORS.map((fo) => (
            <option key={fo.op} value={fo.op}>
              {fo.label}
            </option>
          ))}
        </select>

        {!hideValueInputs && (
          <>
            <label
              className="sp-grid-column-filter__label"
              htmlFor={`filter-val-${field}`}
            >
              Value
            </label>
            <input
              id={`filter-val-${field}`}
              ref={valueInputRef}
              className="sp-grid-column-filter__input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Filter value..."
            />
          </>
        )}

        {showSecondValue && (
          <>
            <label
              className="sp-grid-column-filter__label"
              htmlFor={`filter-val2-${field}`}
            >
              And
            </label>
            <input
              id={`filter-val2-${field}`}
              className="sp-grid-column-filter__input"
              type="text"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Second value..."
            />
          </>
        )}
      </div>

      <div className="sp-grid-column-filter__footer">
        <button
          className="sp-grid-column-filter__btn sp-grid-column-filter__btn--clear"
          type="button"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="sp-grid-column-filter__btn sp-grid-column-filter__btn--apply"
          type="button"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
