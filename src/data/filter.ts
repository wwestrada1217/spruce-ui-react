import { FilterOperator, type FilterCondition, type FilterExpression } from './types.js';

// ============================================================================
// Operator Normalization
// ============================================================================

const OPERATOR_ALIASES: Record<string, string> = {
  eq: '=',
  ne: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  contains: 'CONTAINS',
  startswith: 'STARTSWITH',
  endswith: 'ENDSWITH',
  isnull: 'IS NULL',
  isnotnull: 'IS NOT NULL',
  isblank: 'IS BLANK',
  isnotblank: 'IS NOT BLANK',
};

function normalizeOperator(op: string): string {
  return OPERATOR_ALIASES[op.toLowerCase()] ?? op;
}

// ============================================================================
// In-Memory Operator Evaluation
// ============================================================================

const OPERATOR_FN: Record<string, (a: unknown, b: unknown) => boolean> = {
  '=': (a, b) => a === b,
  '!=': (a, b) => a !== b,
  '<': (a, b) => (a as number) < (b as number),
  '<=': (a, b) => (a as number) <= (b as number),
  '>': (a, b) => (a as number) > (b as number),
  '>=': (a, b) => (a as number) >= (b as number),
  CONTAINS: (a, b) => String(a).toLowerCase().includes(String(b).toLowerCase()),
  STARTSWITH: (a, b) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
  ENDSWITH: (a, b) => String(a).toLowerCase().endsWith(String(b).toLowerCase()),
  'IS NULL': (a) => a === null || a === undefined,
  'IS NOT NULL': (a) => a !== null && a !== undefined,
  'IS BLANK': (a) => a === null || a === undefined || String(a).trim() === '',
  'IS NOT BLANK': (a) => a !== null && a !== undefined && String(a).trim() !== '',
};

// ============================================================================
// Filter Expression Evaluation (in-memory)
// ============================================================================

export function evaluateFilterExpression<T>(item: T, expr: FilterExpression): boolean {
  const logic = expr.logic ?? 'and';
  const results: boolean[] = [];

  if (expr.filters) {
    for (const cond of expr.filters) {
      const fieldValue = (item as Record<string, unknown>)[cond.field];
      const normalizedOp = normalizeOperator(cond.operator);
      const compareFn = OPERATOR_FN[normalizedOp];
      results.push(compareFn ? compareFn(fieldValue, cond.value) : true);
    }
  }

  if (expr.groups) {
    for (const group of expr.groups) {
      results.push(evaluateFilterExpression(item, group));
    }
  }

  if (results.length === 0) return true;
  return logic === 'or' ? results.some(Boolean) : results.every(Boolean);
}

// ============================================================================
// String Filter Parser
// ============================================================================

const enum TokenType {
  Identifier,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral,
  NullLiteral,
  Operator,
  And,
  Or,
  LParen,
  RParen,
  Is,
  Not,
  Null,
  Blank,
  Contains,
  StartsWith,
  EndsWith,
}

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS: Record<string, TokenType> = {
  AND: TokenType.And,
  OR: TokenType.Or,
  IS: TokenType.Is,
  NOT: TokenType.Not,
  NULL: TokenType.Null,
  BLANK: TokenType.Blank,
  CONTAINS: TokenType.Contains,
  STARTSWITH: TokenType.StartsWith,
  ENDSWITH: TokenType.EndsWith,
  TRUE: TokenType.BooleanLiteral,
  FALSE: TokenType.BooleanLiteral,
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    if (/\s/.test(input[i])) { i++; continue; }

    if (input[i] === '(') { tokens.push({ type: TokenType.LParen, value: '(' }); i++; continue; }
    if (input[i] === ')') { tokens.push({ type: TokenType.RParen, value: ')' }); i++; continue; }

    if (input[i] === "'" || input[i] === '"') {
      const quote = input[i];
      i++;
      let str = '';
      while (i < input.length && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < input.length) { i++; str += input[i]; }
        else { str += input[i]; }
        i++;
      }
      i++;
      tokens.push({ type: TokenType.StringLiteral, value: str });
      continue;
    }

    if (input[i] === '!' && input[i + 1] === '=') { tokens.push({ type: TokenType.Operator, value: '!=' }); i += 2; continue; }
    if (input[i] === '<' && input[i + 1] === '=') { tokens.push({ type: TokenType.Operator, value: '<=' }); i += 2; continue; }
    if (input[i] === '>' && input[i + 1] === '=') { tokens.push({ type: TokenType.Operator, value: '>=' }); i += 2; continue; }
    if (input[i] === '=' || input[i] === '<' || input[i] === '>') { tokens.push({ type: TokenType.Operator, value: input[i] }); i++; continue; }

    if (/\d/.test(input[i]) || (input[i] === '-' && i + 1 < input.length && /\d/.test(input[i + 1]))) {
      let num = input[i]; i++;
      while (i < input.length && (/\d/.test(input[i]) || input[i] === '.')) { num += input[i]; i++; }
      tokens.push({ type: TokenType.NumberLiteral, value: num });
      continue;
    }

    if (/[a-zA-Z_]/.test(input[i])) {
      let word = '';
      while (i < input.length && /[a-zA-Z0-9_.]/.test(input[i])) { word += input[i]; i++; }
      const upper = word.toUpperCase();
      if (upper === 'NULL') {
        tokens.push({ type: TokenType.NullLiteral, value: 'null' });
      } else if (KEYWORDS[upper] !== undefined) {
        tokens.push({ type: KEYWORDS[upper], value: upper });
      } else {
        tokens.push({ type: TokenType.Identifier, value: word });
      }
      continue;
    }

    i++;
  }

  return tokens;
}

/**
 * Parses a string filter expression into a FilterExpression object.
 */
export function parseStringFilter(filterStr: string): FilterExpression {
  const tokens = tokenize(filterStr);
  let pos = 0;

  function peek(): Token | undefined { return tokens[pos]; }
  function advance(): Token { return tokens[pos++]; }

  function expect(type: TokenType): Token {
    const t = advance();
    if (!t || t.type !== type) {
      throw new Error(`Expected token type ${type} but got ${t?.type} (${t?.value}) at position ${pos - 1}`);
    }
    return t;
  }

  function parseValue(token: Token): unknown {
    switch (token.type) {
      case TokenType.StringLiteral: return token.value;
      case TokenType.NumberLiteral: return Number(token.value);
      case TokenType.BooleanLiteral: return token.value === 'TRUE';
      case TokenType.NullLiteral: return null;
      default: return token.value;
    }
  }

  function parseCondition(): FilterCondition | FilterExpression {
    const t = peek();
    if (t?.type === TokenType.LParen) {
      advance();
      const expr = parseOrExpression();
      expect(TokenType.RParen);
      return expr;
    }

    const field = expect(TokenType.Identifier);
    const next = peek();

    if (next?.type === TokenType.Is) {
      advance();
      const maybeNot = peek();
      if (maybeNot?.type === TokenType.Not) {
        advance();
        const what = advance();
        if (what?.type === TokenType.NullLiteral) return { field: field.value, operator: 'IS NOT NULL' };
        if (what?.type === TokenType.Blank) return { field: field.value, operator: 'IS NOT BLANK' };
        throw new Error(`Expected NULL or BLANK after IS NOT, got ${what?.value}`);
      }
      const what = advance();
      if (what?.type === TokenType.NullLiteral) return { field: field.value, operator: 'IS NULL' };
      if (what?.type === TokenType.Blank) return { field: field.value, operator: 'IS BLANK' };
      throw new Error(`Expected NULL or BLANK after IS, got ${what?.value}`);
    }

    if (next?.type === TokenType.Contains || next?.type === TokenType.StartsWith || next?.type === TokenType.EndsWith) {
      const op = advance();
      const val = advance();
      return { field: field.value, operator: op.value, value: parseValue(val) };
    }

    const op = expect(TokenType.Operator);
    const val = advance();
    return { field: field.value, operator: op.value, value: parseValue(val) };
  }

  function parseAndExpression(): FilterExpression {
    const conditions: (FilterCondition | FilterExpression)[] = [];
    conditions.push(parseCondition());
    while (peek()?.type === TokenType.And) { advance(); conditions.push(parseCondition()); }

    if (conditions.length === 1) {
      const single = conditions[0];
      if ('field' in single) return { logic: 'and', filters: [single as FilterCondition] };
      return single as FilterExpression;
    }

    const filters: FilterCondition[] = [];
    const groups: FilterExpression[] = [];
    for (const c of conditions) {
      if ('field' in c) filters.push(c as FilterCondition);
      else groups.push(c as FilterExpression);
    }

    return {
      logic: 'and',
      ...(filters.length > 0 ? { filters } : {}),
      ...(groups.length > 0 ? { groups } : {}),
    };
  }

  function parseOrExpression(): FilterExpression {
    const parts: FilterExpression[] = [];
    parts.push(parseAndExpression());
    while (peek()?.type === TokenType.Or) { advance(); parts.push(parseAndExpression()); }
    if (parts.length === 1) return parts[0];
    return { logic: 'or', groups: parts };
  }

  if (tokens.length === 0) return { logic: 'and', filters: [] };
  return parseOrExpression();
}

// ============================================================================
// Format Condition
// ============================================================================

function formatCondition(field: string, operator: FilterOperator | string, value?: unknown): string {
  const op = operator.toString();

  if (
    op === FilterOperator.IsNull ||
    op === FilterOperator.IsNotNull ||
    op === FilterOperator.IsBlank ||
    op === FilterOperator.IsNotBlank
  ) {
    return `${field} ${op}`;
  }

  let formattedValue: string;
  if (typeof value === 'string') {
    formattedValue = `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  } else if (value === null || value === undefined) {
    formattedValue = 'null';
  } else if (typeof value === 'boolean') {
    formattedValue = value.toString();
  } else {
    formattedValue = String(value);
  }

  return `${field} ${op} ${formattedValue}`;
}

// ============================================================================
// FilterBuilder
// ============================================================================

export class FilterBuilder {
  private parts: string[] = [];

  static create(): FilterBuilder {
    return new FilterBuilder();
  }

  where(field: string, operator: FilterOperator | string, value?: unknown): FilterBuilder {
    this.parts.push(formatCondition(field, operator, value));
    return this;
  }

  and(field: string, operator: FilterOperator | string, value?: unknown): FilterBuilder {
    this.parts.push('AND');
    this.parts.push(formatCondition(field, operator, value));
    return this;
  }

  or(field?: string, operator?: FilterOperator | string, value?: unknown): FilterBuilder {
    if (field && operator !== undefined) {
      this.parts.push('OR');
      this.parts.push(formatCondition(field, operator, value));
    } else {
      this.parts.push('OR');
    }
    return this;
  }

  group(builder: FilterBuilder): FilterBuilder {
    const groupExpression = builder.build();
    if (groupExpression) this.parts.push(`(${groupExpression})`);
    return this;
  }

  build(): string {
    return this.parts.join(' ');
  }
}

// ============================================================================
// Filter Quick Helpers
// ============================================================================

export const Filter = {
  eq(field: string, value: unknown): string {
    return FilterBuilder.create().where(field, FilterOperator.Equal, value).build();
  },
  ne(field: string, value: unknown): string {
    return FilterBuilder.create().where(field, FilterOperator.NotEqual, value).build();
  },
  contains(field: string, value: string): string {
    return FilterBuilder.create().where(field, FilterOperator.Contains, value).build();
  },
  gt(field: string, value: unknown): string {
    return FilterBuilder.create().where(field, FilterOperator.GreaterThan, value).build();
  },
  lt(field: string, value: unknown): string {
    return FilterBuilder.create().where(field, FilterOperator.LessThan, value).build();
  },
  gte(field: string, value: unknown): string {
    return FilterBuilder.create().where(field, FilterOperator.GreaterThanOrEqual, value).build();
  },
  lte(field: string, value: unknown): string {
    return FilterBuilder.create().where(field, FilterOperator.LessThanOrEqual, value).build();
  },
  isNull(field: string): string {
    return FilterBuilder.create().where(field, FilterOperator.IsNull).build();
  },
  isNotNull(field: string): string {
    return FilterBuilder.create().where(field, FilterOperator.IsNotNull).build();
  },
  and(...filters: string[]): string {
    return filters.filter((f) => f).join(' AND ');
  },
  or(...filters: string[]): string {
    return filters.filter((f) => f).join(' OR ');
  },
  group(filter: string): string {
    return `(${filter})`;
  },
};
