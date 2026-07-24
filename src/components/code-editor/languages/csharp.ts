/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { LanguageDefinition } from '../tokenizer.js';

const keywords = [
  'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char',
  'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate',
  'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'finally',
  'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit', 'in', 'int',
  'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'object',
  'operator', 'out', 'override', 'params', 'private', 'protected', 'public',
  'readonly', 'record', 'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof',
  'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw',
  'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using',
  'var', 'virtual', 'void', 'volatile', 'while', 'yield', 'async', 'await',
  'where', 'select', 'from', 'orderby', 'group', 'into', 'join', 'let',
  'on', 'equals', 'ascending', 'descending', 'when', 'init', 'required',
  'with', 'not', 'and', 'or', 'global', 'file', 'scoped',
];

const builtins = [
  'true', 'false', 'null', 'nameof', 'sizeof', 'typeof',
  'Console', 'Math', 'String', 'DateTime', 'Task', 'List',
  'Dictionary', 'IEnumerable', 'IDisposable', 'Action', 'Func',
  'Exception', 'Nullable', 'Guid', 'TimeSpan',
];

const types = [
  'int', 'long', 'short', 'byte', 'float', 'double', 'decimal', 'bool',
  'char', 'string', 'object', 'void', 'var', 'dynamic',
];

export const csharp: LanguageDefinition = {
  name: 'csharp',
  rules: [
    { pattern: /\/\/\/[^\n]*/gy, type: 'comment' },
    { pattern: /\/\*[\s\S]*?\*\//gy, type: 'comment' },
    { pattern: /\/\/[^\n]*/gy, type: 'comment' },
    { pattern: /#\s*(?:if|elif|else|endif|define|undef|region|endregion|pragma|nullable|error|warning|line)\b[^\n]*/gy, type: 'keyword' },
    { pattern: /@"(?:[^"]|"")*"/gy, type: 'string' },
    { pattern: /\$@"(?:[^"{]|""|\{\{|\}\}|\{[^}]*\})*"/gy, type: 'string' },
    { pattern: /\$"(?:[^"\\{]|\\.|\{\{|\}\}|\{[^}]*\})*"/gy, type: 'string' },
    { pattern: /"(?:[^"\\]|\\.)*"/gy, type: 'string' },
    { pattern: /'(?:[^'\\]|\\.)*'/gy, type: 'string' },
    { pattern: /\[[\w.]+(?:\([^\]]*\))?\]/gy, type: 'decorator' },
    { pattern: /0[xX][\da-fA-F_]+[UuLlFfDdMm]?|0[bB][01_]+[UuLlFfDdMm]?|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d[\d_]*)?[UuLlFfDdMm]?/gy, type: 'number' },
    { pattern: new RegExp(`\\b(?:${types.join('|')})\\b`, 'gy'), type: 'type' },
    { pattern: new RegExp(`\\b(?:${builtins.join('|')})\\b`, 'gy'), type: 'builtin' },
    { pattern: new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'gy'), type: 'keyword' },
    { pattern: /\b[A-Z]\w*(?=\s*[<({.])/gy, type: 'type' },
    { pattern: /\b([a-zA-Z_]\w*)\s*(?=\()/gy, type: 'function' },
    { pattern: /[a-zA-Z_]\w*/gy, type: 'plain' },
    { pattern: /[!=<>]=?|&&|\|\||[+\-*/%&|^~]=?|\?\?=?|=>|\.{2}/gy, type: 'operator' },
    { pattern: /[{}()\[\];:,.]/gy, type: 'punctuation' },
  ],
};
