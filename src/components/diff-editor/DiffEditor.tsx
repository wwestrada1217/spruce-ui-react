import './DiffEditor.css';
import { useMemo } from 'react';

export interface DiffEditorProps {
  oldCode: string;
  newCode: string;
  height?: number | string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed';
  oldLineNum?: number;
  newLineNum?: number;
  content: string;
}

export function DiffEditor({
  oldCode = '',
  newCode = '',
  height = 300,
  className = '',
  style,
}: DiffEditorProps) {
  const diffLines = useMemo<DiffLine[]>(() => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');

    const result: DiffLine[] = [];
    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        result.push({
          type: 'unchanged',
          oldLineNum: i + 1,
          newLineNum: j + 1,
          content: oldLines[i],
        });
        i++;
        j++;
      } else if (j < newLines.length && (i >= oldLines.length || !oldLines.includes(newLines[j]))) {
        result.push({
          type: 'added',
          newLineNum: j + 1,
          content: newLines[j],
        });
        j++;
      } else if (i < oldLines.length) {
        result.push({
          type: 'removed',
          oldLineNum: i + 1,
          content: oldLines[i],
        });
        i++;
      }
    }

    return result;
  }, [oldCode, newCode]);

  return (
    <div
      className={['sp-diff-editor', className].filter(Boolean).join(' ')}
      style={{ height, ...style }}
    >
      <div className="sp-diff-container">
        {diffLines.map((line, idx) => (
          <div key={idx} className={`sp-diff-row sp-diff-row--${line.type}`}>
            <div className="sp-diff-num sp-diff-num--old">{line.oldLineNum ?? ''}</div>
            <div className="sp-diff-num sp-diff-num--new">{line.newLineNum ?? ''}</div>
            <div className="sp-diff-sign">
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </div>
            <div className="sp-diff-code">
              <code>{line.content}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
