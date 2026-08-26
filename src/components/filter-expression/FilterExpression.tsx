/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable react-refresh/only-export-components */

import { useMemo, useCallback } from 'react';
import { Icon } from '../../icons/Icon';
import { useI18n } from '../../i18n/i18n-context.js';
import './FilterExpression.css';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';

// -- Types ------------------------------------------------------------------

export type FilterLogic = 'and' | 'or';
export type FieldType = 'text' | 'number' | 'date' | 'datetime' | 'time' | 'boolean';

export interface FilterField {
  label: string;
  value: string;
  /** Controls which input component is rendered for the value field. Defaults to 'text'. */
  type?: FieldType;
  operators?: FilterOperatorOption[];
}

export interface FilterOperatorOption {
  label: string;
  value: string;
  /** Set to false for operators that need no value (e.g. "is blank"). Defaults to true. */
  needsValue?: boolean;
  /** Set to true for range operators that need a second value (e.g. "between"). */
  needsSecondValue?: boolean;
}

export interface FilterRule {
  type: 'rule';
  field: string;
  operator: string;
  value: string;
  value2?: string;
}

export interface FilterGroup {
  type: 'group';
  logic: FilterLogic;
  children: FilterExpressionType[];
}

export type FilterExpressionType = FilterRule | FilterGroup;

// -- Operator defaults ------------------------------------------------------

export const TEXT_OPERATORS: FilterOperatorOption[] = [
  { label: 'Contains', value: 'contains' },
  { label: 'Does not contain', value: 'notContains' },
  { label: 'Equals', value: 'equals' },
  { label: 'Not equals', value: 'notEquals' },
  { label: 'Starts with', value: 'startsWith' },
  { label: 'Ends with', value: 'endsWith' },
  { label: 'Is blank', value: 'blank', needsValue: false },
  { label: 'Is not blank', value: 'notBlank', needsValue: false },
];

export const NUMBER_OPERATORS: FilterOperatorOption[] = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not equals', value: 'notEquals' },
  { label: 'Greater than', value: 'greaterThan' },
  { label: 'Less than', value: 'lessThan' },
  { label: 'Between', value: 'between', needsSecondValue: true },
  { label: 'Is blank', value: 'blank', needsValue: false },
  { label: 'Is not blank', value: 'notBlank', needsValue: false },
];

export const DATE_OPERATORS: FilterOperatorOption[] = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not equals', value: 'notEquals' },
  { label: 'After', value: 'greaterThan' },
  { label: 'Before', value: 'lessThan' },
  { label: 'Between', value: 'between', needsSecondValue: true },
  { label: 'Is blank', value: 'blank', needsValue: false },
  { label: 'Is not blank', value: 'notBlank', needsValue: false },
];

export const BOOLEAN_OPERATORS: FilterOperatorOption[] = [
  { label: 'Is', value: 'equals' },
  { label: 'Is not', value: 'notEquals' },
];

function getDefaultOperatorsByType(type: FieldType = 'text'): FilterOperatorOption[] {
  switch (type) {
    case 'number':
      return NUMBER_OPERATORS;
    case 'date':
    case 'datetime':
    case 'time':
      return DATE_OPERATORS;
    case 'boolean':
      return BOOLEAN_OPERATORS;
    default:
      return TEXT_OPERATORS;
  }
}

function getFieldOperators(
  fields: FilterField[],
  fieldValue: string,
): FilterOperatorOption[] {
  const field = fields.find((f) => f.value === fieldValue);
  return field?.operators ?? getDefaultOperatorsByType(field?.type);
}

function createEmptyRule(fields: FilterField[]): FilterRule {
  const field = fields[0]?.value ?? '';
  const ops = getFieldOperators(fields, field);
  return {
    type: 'rule',
    field,
    operator: ops[0]?.value ?? 'contains',
    value: '',
  };
}

// -- FilterRuleRow ----------------------------------------------------------

interface FilterRuleRowProps {
  fields: FilterField[];
  rule: FilterRule;
  onChanged: (rule: FilterRule) => void;
  onRemoved: () => void;
}

function FilterRuleRow({ fields, rule, onChanged, onRemoved }: FilterRuleRowProps) {
  const { t } = useI18n();
  const fieldType = useMemo<FieldType>(() => {
    const f = fields.find((f) => f.value === rule.field);
    return f?.type ?? 'text';
  }, [fields, rule.field]);

  const fieldOptions = useMemo(
    () => fields.map((f) => ({ label: f.label, value: f.value })),
    [fields],
  );

  const operatorOptions = useMemo(
    () =>
      getFieldOperators(fields, rule.field).map((o) => ({
        label: o.label,
        value: o.value,
      })),
    [fields, rule.field],
  );

  const currentOp = useMemo(
    () =>
      getFieldOperators(fields, rule.field).find((o) => o.value === rule.operator),
    [fields, rule.field, rule.operator],
  );

  const showValue = currentOp?.needsValue !== false;
  const showSecondValue = currentOp?.needsSecondValue === true;

  const onFieldChange = useCallback(
    (field: string) => {
      const ops = getFieldOperators(fields, field);
      const op = ops.find((o) => o.value === rule.operator)
        ? rule.operator
        : (ops[0]?.value ?? 'contains');
      onChanged({ ...rule, field, operator: op, value: '', value2: undefined });
    },
    [fields, rule, onChanged],
  );

  const onOperatorChange = useCallback(
    (operator: string) => {
      onChanged({ ...rule, operator });
    },
    [rule, onChanged],
  );

  const onValueChange = useCallback(
    (value: string) => {
      onChanged({ ...rule, value });
    },
    [rule, onChanged],
  );

  const onValue2Change = useCallback(
    (value2: string) => {
      onChanged({ ...rule, value2 });
    },
    [rule, onChanged],
  );

  const inputType = fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : fieldType === 'datetime' ? 'datetime-local' : fieldType === 'time' ? 'time' : 'text';

  return (
    <div className="sp-filter-expr__rule" role="group" aria-label={t('filterCondition')}>
      <select
        className="sp-filter-expr__field"
        value={rule.field}
        onChange={(e) => onFieldChange(e.target.value)}
      >
        {fieldOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className="sp-filter-expr__op"
        value={rule.operator}
        onChange={(e) => onOperatorChange(e.target.value)}
      >
        {operatorOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {showValue && (
        fieldType === 'boolean' ? (
          <select
            className="sp-filter-expr__val"
            value={rule.value}
            onChange={(e) => onValueChange(e.target.value)}
          >
            <option value="">{t('value')}</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <input
            className="sp-filter-expr__val"
            type={inputType}
            value={rule.value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={t('value')}
          />
        )
      )}

      {showSecondValue && (
        <input
          className="sp-filter-expr__val"
          type={inputType}
          value={rule.value2 ?? ''}
          onChange={(e) => onValue2Change(e.target.value)}
          placeholder={t('to')}
        />
      )}

      <button
        type="button"
        className="sp-filter-expr__rm"
        onClick={onRemoved}
        aria-label={t('remove')}
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

// -- FilterGroupBlock -------------------------------------------------------

interface FilterGroupBlockProps {
  fields: FilterField[];
  group: FilterGroup;
  depth: number;
  maxDepth: number;
  removable: boolean;
  onChanged: (group: FilterGroup) => void;
  onRemoved: () => void;
}

function FilterGroupBlock({
  fields,
  group,
  depth,
  maxDepth,
  removable,
  onChanged,
  onRemoved,
}: FilterGroupBlockProps) {
  const { t } = useI18n();
  const setLogic = useCallback(
    (logic: FilterLogic) => {
      onChanged({ ...group, logic });
    },
    [group, onChanged],
  );

  const addRule = useCallback(() => {
    onChanged({
      ...group,
      children: [...group.children, createEmptyRule(fields)],
    });
  }, [group, fields, onChanged]);

  const addGroup = useCallback(() => {
    const newGroup: FilterGroup = {
      type: 'group',
      logic: 'and',
      children: [createEmptyRule(fields)],
    };
    onChanged({
      ...group,
      children: [...group.children, newGroup],
    });
  }, [group, fields, onChanged]);

  const updateChild = useCallback(
    (index: number, child: FilterExpressionType) => {
      const children = [...group.children];
      children[index] = child;
      onChanged({ ...group, children });
    },
    [group, onChanged],
  );

  const removeChild = useCallback(
    (index: number) => {
      onChanged({
        ...group,
        children: group.children.filter((_, i) => i !== index),
      });
    },
    [group, onChanged],
  );

  const groupClasses = [
    'sp-filter-expr__group',
    group.logic === 'or' && 'sp-filter-expr__group--or',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={groupClasses}
      role="group"
      aria-label={`${group.logic === 'and' ? 'AND' : 'OR'} ${t('filterLogic')}`}
    >
      <div className="sp-filter-expr__bar">
        <div className="sp-filter-expr__logic" role="radiogroup" aria-label={t('filterLogic')}>
          <button
            type="button"
            className={`sp-filter-expr__logic-btn${group.logic === 'and' ? ' active' : ''}`}
            aria-pressed={group.logic === 'and'}
            onClick={() => setLogic('and')}
          >
            AND
          </button>
          <button
            type="button"
            className={`sp-filter-expr__logic-btn${group.logic === 'or' ? ' active' : ''}`}
            aria-pressed={group.logic === 'or'}
            onClick={() => setLogic('or')}
          >
            OR
          </button>
        </div>
        <div className="sp-filter-expr__actions">
          <button type="button" className="sp-filter-expr__action-btn" onClick={addRule}>
            <Icon name="plus" size={14} />
            <span>{t('rule')}</span>
          </button>
          {depth < maxDepth && (
            <button type="button" className="sp-filter-expr__action-btn" onClick={addGroup}>
              <Icon name="layers" size={14} />
              <span>{t('group')}</span>
            </button>
          )}
          {removable && (
            <button
              type="button"
              className="sp-filter-expr__action-btn sp-filter-expr__action-btn--icon"
              onClick={onRemoved}
              aria-label={t('remove')}
            >
              <Icon name="trash" size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="sp-filter-expr__body">
        {group.children.map((child, index) =>
          child.type === 'rule' ? (
            <FilterRuleRow
              key={index}
              fields={fields}
              rule={child}
              onChanged={(updated) => updateChild(index, updated)}
              onRemoved={() => removeChild(index)}
            />
          ) : (
            <FilterGroupBlock
              key={index}
              fields={fields}
              group={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              removable={true}
              onChanged={(updated) => updateChild(index, updated)}
              onRemoved={() => removeChild(index)}
            />
          ),
        )}
        {group.children.length === 0 && (
          <p className="sp-filter-expr__empty">
            {t('noConditions')}. <strong>+ {t('rule')}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

// -- Main FilterExpression component ----------------------------------------

export interface FilterExpressionProps {
  /** Available fields for filter rules */
  fields: FilterField[];
  /** The filter expression tree */
  expression: FilterGroup;
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  /** Called when the expression changes */
  onChange: (expression: FilterGroup) => void;
  /** Maximum nesting depth for groups */
  maxDepth?: number;
}

export function FilterExpression({
  fields,
  expression,
  chrome = 'default',
  radius,
  border = 'default',
  onChange,
  maxDepth = 5,
}: FilterExpressionProps) {
  return (
    <div
      className={[
        'sp-filter-expr',
        `sp-chrome--${chrome}`,
        radius && `sp-radius--${radius}`,
        `sp-border--${border}`,
      ].filter(Boolean).join(' ')}
    >
      <FilterGroupBlock
        fields={fields}
        group={expression}
        depth={0}
        maxDepth={maxDepth}
        removable={false}
        onChanged={onChange}
        onRemoved={() => {}}
      />
    </div>
  );
}
