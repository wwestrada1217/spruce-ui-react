import type { LanguageDefinition } from '../tokenizer.js';

export const json: LanguageDefinition = {
  name: 'json',
  rules: [
    { pattern: /"(?:[^"\\]|\\.)*"\s*(?=:)/gy, type: 'property' },
    { pattern: /"(?:[^"\\]|\\.)*"/gy, type: 'string' },
    { pattern: /-?\d+\.?\d*(?:[eE][+-]?\d+)?/gy, type: 'number' },
    { pattern: /\b(?:true|false|null)\b/gy, type: 'keyword' },
    { pattern: /[{}[\]:,]/gy, type: 'punctuation' },
  ],
};
