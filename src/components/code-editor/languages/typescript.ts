import type { LanguageDefinition } from '../tokenizer.js';

const keywords = [
  'abstract', 'as', 'async', 'await', 'break', 'case', 'catch', 'class', 'const',
  'continue', 'debugger', 'declare', 'default', 'delete', 'do', 'else', 'enum',
  'export', 'extends', 'finally', 'for', 'from', 'function', 'get', 'if',
  'implements', 'import', 'in', 'instanceof', 'interface', 'is', 'keyof', 'let',
  'module', 'namespace', 'new', 'of', 'override', 'private', 'protected', 'public',
  'readonly', 'return', 'satisfies', 'set', 'static', 'super', 'switch', 'this',
  'throw', 'try', 'type', 'typeof', 'var', 'void', 'while', 'with', 'yield',
];

const builtins = [
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
  'console', 'window', 'document', 'Promise', 'Array', 'Object',
  'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'BigInt',
  'Math', 'JSON', 'Date', 'RegExp', 'Error',
];

const types = [
  'string', 'number', 'boolean', 'any', 'unknown', 'never', 'void', 'object',
  'Record', 'Partial', 'Required', 'Readonly', 'Pick', 'Omit', 'Exclude',
  'Extract', 'NonNullable', 'ReturnType', 'Parameters', 'InstanceType',
];

export const typescript: LanguageDefinition = {
  name: 'typescript',
  rules: [
    { pattern: /\/\*[\s\S]*?\*\//gy, type: 'comment' },
    { pattern: /\/\/[^\n]*/gy, type: 'comment' },
    { pattern: /`(?:[^`\\]|\\.)*`/gy, type: 'string' },
    { pattern: /"(?:[^"\\]|\\.)*"/gy, type: 'string' },
    { pattern: /'(?:[^'\\]|\\.)*'/gy, type: 'string' },
    { pattern: /@[a-zA-Z_$][\w$]*/gy, type: 'decorator' },
    { pattern: /0[xX][\da-fA-F_]+n?|0[oO][0-7_]+n?|0[bB][01_]+n?|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d[\d_]*)?n?/gy, type: 'number' },
    { pattern: new RegExp(`\\b(?:${types.join('|')})\\b`, 'gy'), type: 'type' },
    { pattern: new RegExp(`\\b(?:${builtins.join('|')})\\b`, 'gy'), type: 'builtin' },
    { pattern: new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'gy'), type: 'keyword' },
    { pattern: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/gy, type: 'function' },
    { pattern: /[a-zA-Z_$][\w$]*/gy, type: 'plain' },
    { pattern: /[!=<>]=?=?|&&|\|\||[+\-*/%]=?|\?\?|\.{3}|=>|[?:]/gy, type: 'operator' },
    { pattern: /[{}()\[\];,.]/gy, type: 'punctuation' },
  ],
};
