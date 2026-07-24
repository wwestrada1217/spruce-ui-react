import type { LanguageDefinition } from '../tokenizer.js';

export const html: LanguageDefinition = {
  name: 'html',
  rules: [
    { pattern: /<!--[\s\S]*?-->/gy, type: 'comment' },
    { pattern: /<!DOCTYPE\b[^>]*>/giy, type: 'keyword' },
    { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/gy, type: 'comment' },
    { pattern: /<\/\s*([a-zA-Z][\w-]*)\s*>/gy, type: 'tag' },
    { pattern: /<([a-zA-Z][\w-]*)(?=[\s/>])/gy, type: 'tag' },
    { pattern: /\b([a-zA-Z_:][\w:.-]*)\s*(?==)/gy, type: 'attribute' },
    { pattern: /"[^"]*"/gy, type: 'string' },
    { pattern: /'[^']*'/gy, type: 'string' },
    { pattern: /\/?>/gy, type: 'tag' },
    { pattern: /&[a-zA-Z]+;|&#\d+;|&#x[\da-fA-F]+;/gy, type: 'builtin' },
    { pattern: /@(?:if|else|for|switch|case|default|defer|placeholder|loading|error|empty|let)\b/gy, type: 'keyword' },
    { pattern: /\[[\w.()-]+\]|\([\w.]+\)|\*\w+/gy, type: 'attribute' },
    { pattern: /\{\{[^}]*\}\}/gy, type: 'variable' },
  ],
};
