/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable react-refresh/only-export-components */

import { useCallback, useMemo } from 'react';
import { Button } from '../button/Button.js';
import { DatePicker } from '../date-picker/DatePicker.js';
import { DateTimePicker } from '../datetime-picker/DateTimePicker.js';
import { Input } from '../input/Input.js';
import { Select } from '../select/Select.js';
import { TimePicker } from '../time-picker/TimePicker.js';
import { useI18n, type SpI18nLabelKey } from '../../i18n/i18n-context.js';
import './FilterExpression.css';
import type { SelectOption } from '../select/Select.js';
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
  /** Localized label key. When provided, it takes precedence over label. */
  labelKey?: SpI18nLabelKey;
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
  children: FilterExpression[];
}

export type FilterExpression = FilterRule | FilterGroup;
/** @deprecated Use FilterExpression. */
export type FilterExpressionType = FilterExpression;

// -- Operator defaults ------------------------------------------------------

function localizedOperator(label: string, value: string, labelKey: SpI18nLabelKey): FilterOperatorOption {
  return { label, labelKey, value };
}

/** @deprecated Use the type-specific operator sets. */
export const DEFAULT_FILTER_OPERATORS: FilterOperatorOption[] = [
  localizedOperator('Contains', 'contains', 'opContains'),
  localizedOperator('Does not contain', 'notContains', 'opDoesNotContain'),
  localizedOperator('Equals', 'equals', 'opEquals'),
  localizedOperator('Not equals', 'notEquals', 'opNotEquals'),
  localizedOperator('Starts with', 'startsWith', 'opStartsWith'),
  localizedOperator('Ends with', 'endsWith', 'opEndsWith'),
  localizedOperator('Greater than', 'greaterThan', 'opGreaterThan'),
  localizedOperator('Less than', 'lessThan', 'opLessThan'),
  { label: 'Between', labelKey: 'opBetween', value: 'between', needsSecondValue: true },
  { label: 'Is blank', labelKey: 'opIsBlank', value: 'blank', needsValue: false },
  { label: 'Is not blank', labelKey: 'opIsNotBlank', value: 'notBlank', needsValue: false },
];

export const TEXT_OPERATORS: FilterOperatorOption[] = [
  localizedOperator('Contains', 'contains', 'opContains'),
  localizedOperator('Does not contain', 'notContains', 'opDoesNotContain'),
  localizedOperator('Equals', 'equals', 'opEquals'),
  localizedOperator('Not equals', 'notEquals', 'opNotEquals'),
  localizedOperator('Starts with', 'startsWith', 'opStartsWith'),
  localizedOperator('Ends with', 'endsWith', 'opEndsWith'),
  { label: 'Is blank', labelKey: 'opIsBlank', value: 'blank', needsValue: false },
  { label: 'Is not blank', labelKey: 'opIsNotBlank', value: 'notBlank', needsValue: false },
];

export const NUMBER_OPERATORS: FilterOperatorOption[] = [
  localizedOperator('Equals', 'equals', 'opEquals'),
  localizedOperator('Not equals', 'notEquals', 'opNotEquals'),
  localizedOperator('Greater than', 'greaterThan', 'opGreaterThan'),
  localizedOperator('Less than', 'lessThan', 'opLessThan'),
  { label: 'Between', labelKey: 'opBetween', value: 'between', needsSecondValue: true },
  { label: 'Is blank', labelKey: 'opIsBlank', value: 'blank', needsValue: false },
  { label: 'Is not blank', labelKey: 'opIsNotBlank', value: 'notBlank', needsValue: false },
];

export const DATE_OPERATORS: FilterOperatorOption[] = [
  localizedOperator('Equals', 'equals', 'opEquals'),
  localizedOperator('Not equals', 'notEquals', 'opNotEquals'),
  localizedOperator('After', 'greaterThan', 'opAfter'),
  localizedOperator('Before', 'lessThan', 'opBefore'),
  { label: 'Between', labelKey: 'opBetween', value: 'between', needsSecondValue: true },
  { label: 'Is blank', labelKey: 'opIsBlank', value: 'blank', needsValue: false },
  { label: 'Is not blank', labelKey: 'opIsNotBlank', value: 'notBlank', needsValue: false },
];

export const BOOLEAN_OPERATORS: FilterOperatorOption[] = [
  localizedOperator('Is', 'equals', 'opIs'),
  localizedOperator('Is not', 'notEquals', 'opIsNot'),
];

function getDefaultOperatorsByType(type: FieldType = 'text'): FilterOperatorOption[] {
  switch (type) {
    case 'number': return NUMBER_OPERATORS;
    case 'date':
    case 'datetime':
    case 'time': return DATE_OPERATORS;
    case 'boolean': return BOOLEAN_OPERATORS;
    default: return TEXT_OPERATORS;
  }
}

function getFieldOperators(fields: FilterField[], fieldValue: string): FilterOperatorOption[] {
  const field = fields.find((candidate) => candidate.value === fieldValue);
  return field?.operators ?? getDefaultOperatorsByType(field?.type);
}

function createEmptyRule(fields: FilterField[]): FilterRule {
  const field = fields[0]?.value ?? '';
  const operators = getFieldOperators(fields, field);
  return { type: 'rule', field, operator: operators[0]?.value ?? 'contains', value: '' };
}

function singleValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? '' : value;
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
  const field = fields.find((candidate) => candidate.value === rule.field);
  const fieldType = field?.type ?? 'text';
  const fieldOptions = useMemo<SelectOption[]>(
    () => fields.map((candidate) => ({ label: candidate.label, value: candidate.value })),
    [fields],
  );
  const operatorOptions = useMemo<SelectOption[]>(
    () => getFieldOperators(fields, rule.field).map((operator) => ({
      label: operator.labelKey ? t(operator.labelKey) : operator.label,
      value: operator.value,
    })),
    [fields, rule.field, t],
  );
  const currentOperator = getFieldOperators(fields, rule.field).find(
    (operator) => operator.value === rule.operator,
  );
  const showValue = currentOperator?.needsValue !== false;
  const showSecondValue = currentOperator?.needsSecondValue === true;

  const onFieldChange = useCallback((nextField: string | string[]) => {
    const fieldValue = singleValue(nextField);
    const operators = getFieldOperators(fields, fieldValue);
    const operator = operators.some((candidate) => candidate.value === rule.operator)
      ? rule.operator
      : operators[0]?.value ?? 'contains';
    onChanged({ ...rule, field: fieldValue, operator, value: '', value2: undefined });
  }, [fields, onChanged, rule]);

  const onOperatorChange = useCallback((operator: string | string[]) => {
    onChanged({ ...rule, operator: singleValue(operator) });
  }, [onChanged, rule]);

  const onValueChange = useCallback((value: string | null) => {
    onChanged({ ...rule, value: value ?? '' });
  }, [onChanged, rule]);

  const onValue2Change = useCallback((value2: string | null) => {
    onChanged({ ...rule, value2: value2 ?? '' });
  }, [onChanged, rule]);

  function renderValue(value: string, onChange: (next: string | null) => void, placeholder: string) {
    switch (fieldType) {
      case 'date':
        return <DatePicker className="sp-filter-expr__val" inputMode value={value || null} onChange={onChange} size="sm" placeholder={placeholder} />;
      case 'datetime':
        return <DateTimePicker className="sp-filter-expr__val" inputMode value={value || null} onChange={onChange} size="sm" placeholder={placeholder} />;
      case 'time':
        return <TimePicker className="sp-filter-expr__val" inputMode value={value || null} onChange={onChange} size="sm" placeholder={placeholder} />;
      case 'boolean':
        return <Select className="sp-filter-expr__val" options={[{ label: t('valueTrue'), value: 'true' }, { label: t('valueFalse'), value: 'false' }]} value={value} onChange={(next) => onChange(singleValue(next))} size="sm" ariaLabel={placeholder} />;
      default:
        return <Input className="sp-filter-expr__val" type={fieldType === 'number' ? 'number' : 'text'} value={value} onChange={onChange} placeholder={placeholder} size="sm" ariaLabel={placeholder} />;
    }
  }

  return (
    <div className="sp-filter-expr__rule" role="group" aria-label={t('filterCondition')}>
      <Select className="sp-filter-expr__field" options={fieldOptions} value={rule.field} onChange={onFieldChange} size="sm" ariaLabel={t('fields')} />
      <Select className="sp-filter-expr__op" options={operatorOptions} value={rule.operator} onChange={onOperatorChange} size="sm" ariaLabel={t('condition')} />
      {showValue && renderValue(rule.value, onValueChange, t('value'))}
      {showSecondValue && renderValue(rule.value2 ?? '', onValue2Change, t('to'))}
      <Button className="sp-filter-expr__rm" variant="ghost" size="sm" iconOnly iconLeft="x" onClick={onRemoved} aria-label={t('remove')} />
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

function FilterGroupBlock({ fields, group, depth, maxDepth, removable, onChanged, onRemoved }: FilterGroupBlockProps) {
  const { t } = useI18n();
  const updateChild = useCallback((index: number, child: FilterExpression) => {
    const children = [...group.children];
    children[index] = child;
    onChanged({ ...group, children });
  }, [group, onChanged]);
  const removeChild = useCallback((index: number) => {
    onChanged({ ...group, children: group.children.filter((_, childIndex) => childIndex !== index) });
  }, [group, onChanged]);
  const addRule = useCallback(() => {
    onChanged({ ...group, children: [...group.children, createEmptyRule(fields)] });
  }, [fields, group, onChanged]);
  const addGroup = useCallback(() => {
    const newGroup: FilterGroup = { type: 'group', logic: 'and', children: [createEmptyRule(fields)] };
    onChanged({ ...group, children: [...group.children, newGroup] });
  }, [fields, group, onChanged]);

  return (
    <div
      className={['sp-filter-expr__group', group.logic === 'or' && 'sp-filter-expr__group--or'].filter(Boolean).join(' ')}
      role="group"
      aria-label={`${group.logic === 'and' ? t('and') : t('or')} ${t('filterLogic')}`}
    >
      <div className="sp-filter-expr__bar">
        <div className="sp-filter-expr__logic" role="radiogroup" aria-label={t('filterLogic')}>
          <button type="button" className={group.logic === 'and' ? 'sp-filter-expr__logic-btn active' : 'sp-filter-expr__logic-btn'} aria-pressed={group.logic === 'and'} onClick={() => onChanged({ ...group, logic: 'and' })}>{t('and').toUpperCase()}</button>
          <button type="button" className={group.logic === 'or' ? 'sp-filter-expr__logic-btn active' : 'sp-filter-expr__logic-btn'} aria-pressed={group.logic === 'or'} onClick={() => onChanged({ ...group, logic: 'or' })}>{t('or').toUpperCase()}</button>
        </div>
        <div className="sp-filter-expr__actions">
          <Button variant="ghost" size="sm" iconLeft="plus" onClick={addRule}>{t('rule')}</Button>
          {depth < maxDepth && <Button variant="ghost" size="sm" iconLeft="layers" onClick={addGroup}>{t('group')}</Button>}
          {removable && <Button variant="ghost" size="sm" iconOnly iconLeft="trash" onClick={onRemoved} aria-label={t('remove')} />}
        </div>
      </div>
      <div className="sp-filter-expr__body">
        {group.children.map((child, index) => child.type === 'rule' ? (
          <FilterRuleRow key={index} fields={fields} rule={child} onChanged={(updated) => updateChild(index, updated)} onRemoved={() => removeChild(index)} />
        ) : (
          <FilterGroupBlock key={index} fields={fields} group={child} depth={depth + 1} maxDepth={maxDepth} removable onChanged={(updated) => updateChild(index, updated)} onRemoved={() => removeChild(index)} />
        ))}
        {group.children.length === 0 && <p className="sp-filter-expr__empty">{t('noConditions')} <strong>+ {t('rule')}</strong></p>}
      </div>
    </div>
  );
}

// -- Main FilterExpression component ---------------------------------------

export interface FilterExpressionProps {
  /** Available fields for filter rules. */
  fields: FilterField[];
  /** Controlled filter expression tree. */
  expression: FilterGroup;
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  /** Called whenever a rule, group, logic operator, or removal changes the tree. */
  onChange: (expression: FilterGroup) => void;
  /** Maximum nesting depth for groups. */
  maxDepth?: number;
}

export function FilterExpression({ fields, expression, chrome = 'default', radius, border = 'default', onChange, maxDepth = 5 }: FilterExpressionProps) {
  const { t } = useI18n();
  return (
    <div
      className={['sp-filter-expr', `sp-chrome--${chrome}`, radius && `sp-radius--${radius}`, `sp-border--${border}`].filter(Boolean).join(' ')}
      role="group"
      aria-label={t('filter')}
    >
      <FilterGroupBlock fields={fields} group={expression} depth={0} maxDepth={maxDepth} removable={false} onChanged={onChange} onRemoved={() => undefined} />
    </div>
  );
}
