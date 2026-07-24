/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { LanguageDefinition } from '../tokenizer.js';

export const markdown: LanguageDefinition = {
  name: 'markdown',
  rules: [
    { pattern: /```[\s\S]*?```/gy, type: 'string' },
    { pattern: /`[^`\n]+`/gy, type: 'string' },
    { pattern: /^#{1,6}\s+[^\n]*/gmy, type: 'keyword' },
    { pattern: /^(?:---|\*\*\*|___)\s*$/gmy, type: 'punctuation' },
    { pattern: /\*\*\*[^*]+\*\*\*/gy, type: 'keyword' },
    { pattern: /\*\*[^*]+\*\*/gy, type: 'keyword' },
    { pattern: /__[^_]+__/gy, type: 'keyword' },
    { pattern: /\*[^*\n]+\*/gy, type: 'variable' },
    { pattern: /_[^_\n]+_/gy, type: 'variable' },
    { pattern: /~~[^~]+~~/gy, type: 'comment' },
    { pattern: /\[[^\]]*\]\([^)]*\)/gy, type: 'attribute' },
    { pattern: /!\[[^\]]*\]\([^)]*\)/gy, type: 'tag' },
    { pattern: /\[[^\]]*\]\[[^\]]*\]/gy, type: 'attribute' },
    { pattern: /^>\s+[^\n]*/gmy, type: 'comment' },
    { pattern: /^[\t ]*[-*+]\s/gmy, type: 'punctuation' },
    { pattern: /^[\t ]*\d+\.\s/gmy, type: 'punctuation' },
    { pattern: /<\/?[a-zA-Z][\w-]*[^>]*>/gy, type: 'tag' },
  ],
};
