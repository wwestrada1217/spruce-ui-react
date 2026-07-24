/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { LanguageDefinition } from '../tokenizer.js';

const properties = [
  'align-content', 'align-items', 'align-self', 'animation', 'background',
  'border', 'border-radius', 'bottom', 'box-shadow', 'box-sizing', 'color',
  'content', 'cursor', 'display', 'flex', 'flex-direction', 'flex-wrap',
  'float', 'font', 'font-family', 'font-size', 'font-weight', 'gap', 'grid',
  'height', 'justify-content', 'left', 'line-height', 'margin', 'max-height',
  'max-width', 'min-height', 'min-width', 'opacity', 'outline', 'overflow',
  'padding', 'position', 'right', 'text-align', 'text-decoration',
  'text-transform', 'top', 'transform', 'transition', 'visibility',
  'white-space', 'width', 'z-index',
];

const keywords = [
  'inherit', 'initial', 'unset', 'revert', 'none', 'auto', 'block',
  'inline', 'inline-block', 'flex', 'grid', 'absolute', 'relative',
  'fixed', 'sticky', 'static', 'hidden', 'visible', 'scroll',
  'solid', 'dashed', 'dotted', 'normal', 'bold', 'italic',
  'center', 'left', 'right', 'top', 'bottom', 'nowrap', 'wrap',
  'pointer', 'transparent', 'important',
];

export const css: LanguageDefinition = {
  name: 'css',
  rules: [
    { pattern: /\/\*[\s\S]*?\*\//gy, type: 'comment' },
    { pattern: /\/\/[^\n]*/gy, type: 'comment' },
    { pattern: /"(?:[^"\\]|\\.)*"/gy, type: 'string' },
    { pattern: /'(?:[^'\\]|\\.)*'/gy, type: 'string' },
    { pattern: /@(?:import|media|keyframes|mixin|include|extend|use|forward|if|else|for|each|while|function|return|charset|font-face|supports|layer|property|container)\b/gy, type: 'keyword' },
    { pattern: /\$[\w-]+/gy, type: 'variable' },
    { pattern: /--[\w-]+/gy, type: 'variable' },
    { pattern: /#(?:[\da-fA-F]{3,4}){1,2}\b/gy, type: 'number' },
    { pattern: /-?\d[\d.]*(?:px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|s|ms|deg|rad|grad|turn|fr|dpi|dpcm|dppx)?\b/gy, type: 'number' },
    { pattern: /\b(?:var|calc|min|max|clamp|rgb|rgba|hsl|hsla|url|linear-gradient|radial-gradient|conic-gradient|repeat|minmax|fit-content|env|attr)\s*(?=\()/gy, type: 'function' },
    { pattern: new RegExp(`\\b(?:${properties.join('|')})\\s*(?=:)`, 'gy'), type: 'property' },
    { pattern: new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'gy'), type: 'keyword' },
    { pattern: /::?[\w-]+/gy, type: 'builtin' },
    { pattern: /\.[\w-]+/gy, type: 'tag' },
    { pattern: /#[\w-]+/gy, type: 'attribute' },
    { pattern: /\b(?:html|body|div|span|p|a|h[1-6]|ul|ol|li|table|tr|td|th|form|input|button|img|section|article|nav|header|footer|main|aside)\b/gy, type: 'tag' },
    { pattern: /[+~>*=|^$]/gy, type: 'operator' },
    { pattern: /#\{[^}]*\}/gy, type: 'variable' },
    { pattern: /[{}();:,]/gy, type: 'punctuation' },
    { pattern: /[\w-]+/gy, type: 'plain' },
  ],
};
