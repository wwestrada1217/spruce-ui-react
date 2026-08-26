/* eslint-disable react-refresh/only-export-components */
import './TextDiff.css';
import { useMemo, type CSSProperties } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

export type TextDiffGranularity = 'word' | 'character';
export type TextDiffAppearance = 'inline' | 'block' | 'plain';
export type TextDiffDeletionStyle = 'strike' | 'highlight' | 'none';
export type TextDiffInsertionStyle = 'underline' | 'highlight' | 'none';

export interface TextDiffSegment {
  kind: 'equal' | 'delete' | 'insert';
  text: string;
}

export interface TextDiffProps {
  oldText?: string;
  newText?: string;
  granularity?: TextDiffGranularity;
  appearance?: TextDiffAppearance;
  deletionStyle?: TextDiffDeletionStyle;
  insertionStyle?: TextDiffInsertionStyle;
  showSummary?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

function tokenize(text: string, granularity: TextDiffGranularity): string[] {
  if (!text) return [];
  return granularity === 'character' ? Array.from(text) : text.match(/\s+|[^\s]+/g) ?? [];
}

/** Computes an ordered LCS diff while preserving whitespace in each segment. */
export function diffText(
  oldText: string,
  newText: string,
  granularity: TextDiffGranularity = 'word',
): TextDiffSegment[] {
  const oldTokens = tokenize(oldText, granularity);
  const newTokens = tokenize(newText, granularity);
  const table: number[][] = Array.from({ length: oldTokens.length + 1 }, () =>
    Array<number>(newTokens.length + 1).fill(0),
  );

  for (let oldIndex = oldTokens.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newTokens.length - 1; newIndex >= 0; newIndex -= 1) {
      table[oldIndex][newIndex] = oldTokens[oldIndex] === newTokens[newIndex]
        ? table[oldIndex + 1][newIndex + 1] + 1
        : Math.max(table[oldIndex + 1][newIndex], table[oldIndex][newIndex + 1]);
    }
  }

  const segments: TextDiffSegment[] = [];
  const push = (kind: TextDiffSegment['kind'], text: string) => {
    const previous = segments.at(-1);
    if (previous?.kind === kind) previous.text += text;
    else segments.push({ kind, text });
  };
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < oldTokens.length && newIndex < newTokens.length) {
    if (oldTokens[oldIndex] === newTokens[newIndex]) {
      push('equal', oldTokens[oldIndex]);
      oldIndex += 1;
      newIndex += 1;
    } else if (table[oldIndex + 1][newIndex] >= table[oldIndex][newIndex + 1]) {
      push('delete', oldTokens[oldIndex]);
      oldIndex += 1;
    } else {
      push('insert', newTokens[newIndex]);
      newIndex += 1;
    }
  }
  while (oldIndex < oldTokens.length) push('delete', oldTokens[oldIndex++]);
  while (newIndex < newTokens.length) push('insert', newTokens[newIndex++]);
  return segments;
}

function countMeaningfulUnits(text: string, granularity: TextDiffGranularity): number {
  return granularity === 'character'
    ? Array.from(text).filter((unit) => unit.trim().length > 0).length
    : text.match(/\S+/g)?.length ?? 0;
}

/** Presents a compact, accessible comparison of two text values. */
export function TextDiff({
  oldText = '',
  newText = '',
  granularity = 'word',
  appearance = 'inline',
  deletionStyle = 'strike',
  insertionStyle = 'underline',
  showSummary = false,
  ariaLabel,
  className = '',
  style,
}: TextDiffProps) {
  const { t } = useI18n();
  const segments = useMemo(() => diffText(oldText, newText, granularity), [oldText, newText, granularity]);
  const stats = useMemo(() => ({
    insertions: segments
      .filter((segment) => segment.kind === 'insert')
      .reduce((total, segment) => total + countMeaningfulUnits(segment.text, granularity), 0),
    deletions: segments
      .filter((segment) => segment.kind === 'delete')
      .reduce((total, segment) => total + countMeaningfulUnits(segment.text, granularity), 0),
  }), [granularity, segments]);
  const classes = [
    'sp-text-diff',
    `sp-text-diff--${appearance}`,
    `sp-text-diff--delete-${deletionStyle}`,
    `sp-text-diff--insert-${insertionStyle}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} style={style} aria-label={ariaLabel ?? t('textDifference')}>
      <span className="sp-text-diff__content">
        {segments.map((segment, index) => (
          segment.text ? (
            <span
              key={`${segment.kind}-${index}`}
              className={['sp-text-diff__part', `sp-text-diff__part--${segment.kind}`].join(' ')}
            >
              {segment.text}
            </span>
          ) : null
        ))}
      </span>
      {showSummary && (
        <span className="sp-text-diff__summary" aria-live="polite">
          <span className="sp-text-diff__summary-value sp-text-diff__summary-value--insert">{stats.insertions}</span>
          {' '}{t('insertions')},{' '}
          <span className="sp-text-diff__summary-value sp-text-diff__summary-value--delete">{stats.deletions}</span>
          {' '}{t('deletions')}
        </span>
      )}
    </span>
  );
}

export type SpTextDiffProps = TextDiffProps;
