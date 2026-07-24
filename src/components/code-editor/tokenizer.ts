/** Token types for syntax highlighting */
export type TokenType =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'operator'
  | 'function'
  | 'type'
  | 'property'
  | 'tag'
  | 'attribute'
  | 'punctuation'
  | 'builtin'
  | 'variable'
  | 'decorator'
  | 'plain';

/** A single token produced by the tokenizer */
export interface Token {
  type: TokenType;
  value: string;
}

/** A rule mapping a regex pattern to a token type */
export interface TokenRule {
  pattern: RegExp;
  type: TokenType;
}

/** Definition for a language's tokenization rules */
export interface LanguageDefinition {
  name: string;
  rules: TokenRule[];
}

/**
 * Tokenize source code using the given language definition.
 * Matches rules in order at each position; unmatched chars become 'plain' tokens.
 */
export function tokenize(code: string, language: LanguageDefinition): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let plainBuf = '';

  const flushPlain = () => {
    if (plainBuf) {
      tokens.push({ type: 'plain', value: plainBuf });
      plainBuf = '';
    }
  };

  while (pos < code.length) {
    let matched = false;

    for (const rule of language.rules) {
      rule.pattern.lastIndex = pos;
      const m = rule.pattern.exec(code);
      if (m && m.index === pos) {
        flushPlain();
        tokens.push({ type: rule.type, value: m[0] });
        pos += m[0].length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      plainBuf += code[pos];
      pos++;
    }
  }

  flushPlain();
  return tokens;
}

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

/**
 * Render tokens into syntax-highlighted HTML.
 * Plain tokens are escaped but not wrapped in a span.
 */
export function renderTokens(tokens: Token[]): string {
  let html = '';
  for (const token of tokens) {
    const escaped = escapeHtml(token.value);
    if (token.type === 'plain') {
      html += escaped;
    } else {
      html += `<span class="sp-ce-${token.type}">${escaped}</span>`;
    }
  }
  return html;
}
