import type { LanguageDefinition } from '../tokenizer.js';
import { typescript } from './typescript.js';
import { html } from './html.js';
import { css } from './css.js';
import { json } from './json.js';
import { csharp } from './csharp.js';
import { sql } from './sql.js';
import { python } from './python.js';
import { markdown } from './markdown.js';

/** Supported language identifiers */
export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'css'
  | 'scss'
  | 'json'
  | 'csharp'
  | 'sql'
  | 'python'
  | 'markdown';

/** Map of language identifiers to their tokenization definitions */
export const LANGUAGES: Record<CodeLanguage, LanguageDefinition> = {
  typescript,
  javascript: { ...typescript, name: 'javascript' },
  html,
  css,
  scss: { ...css, name: 'scss' },
  json,
  csharp,
  sql,
  python,
  markdown,
};
