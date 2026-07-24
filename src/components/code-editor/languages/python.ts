import type { LanguageDefinition } from '../tokenizer.js';

const keywords = [
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield',
];

const builtins = [
  'print', 'len', 'range', 'type', 'int', 'float', 'str', 'bool', 'list',
  'dict', 'tuple', 'set', 'frozenset', 'bytes', 'bytearray', 'memoryview',
  'complex', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed',
  'min', 'max', 'sum', 'abs', 'round', 'all', 'any', 'bin', 'hex', 'oct',
  'chr', 'ord', 'id', 'hash', 'isinstance', 'issubclass', 'callable',
  'getattr', 'setattr', 'hasattr', 'delattr', 'property', 'staticmethod',
  'classmethod', 'super', 'object', 'open', 'input', 'repr', 'format',
  'iter', 'next', 'slice', 'vars', 'dir', 'help', 'exec', 'eval',
  'compile', 'globals', 'locals', 'breakpoint', 'Exception', 'ValueError',
  'TypeError', 'KeyError', 'IndexError', 'AttributeError', 'RuntimeError',
  'StopIteration', 'NotImplementedError', 'FileNotFoundError',
  'self', 'cls',
];

export const python: LanguageDefinition = {
  name: 'python',
  rules: [
    { pattern: /"""[\s\S]*?"""/gy, type: 'comment' },
    { pattern: /'''[\s\S]*?'''/gy, type: 'comment' },
    { pattern: /#[^\n]*/gy, type: 'comment' },
    { pattern: /[fFrRbBuU]{0,2}"""(?:[^"\\]|\\.)*"""/gy, type: 'string' },
    { pattern: /[fFrRbBuU]{0,2}'''(?:[^'\\]|\\.)*'''/gy, type: 'string' },
    { pattern: /[fFrRbBuU]{0,2}"(?:[^"\\]|\\.)*"/gy, type: 'string' },
    { pattern: /[fFrRbBuU]{0,2}'(?:[^'\\]|\\.)*'/gy, type: 'string' },
    { pattern: /@[\w.]+/gy, type: 'decorator' },
    { pattern: /0[xX][\da-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d[\d_]*)?[jJ]?/gy, type: 'number' },
    { pattern: new RegExp(`\\b(?:${builtins.join('|')})\\b`, 'gy'), type: 'builtin' },
    { pattern: new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'gy'), type: 'keyword' },
    { pattern: /\b([a-zA-Z_]\w*)\s*(?=\()/gy, type: 'function' },
    { pattern: /[a-zA-Z_]\w*/gy, type: 'plain' },
    { pattern: /[!=<>]=?|[+\-*/%@&|^~]=?|\*\*=?|\/\/=?|<<=?|>>=?|:=|->/gy, type: 'operator' },
    { pattern: /[{}()\[\];:,.]/gy, type: 'punctuation' },
  ],
};
