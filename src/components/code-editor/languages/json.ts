/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
