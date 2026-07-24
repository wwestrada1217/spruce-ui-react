/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import './AspectRatio.css';

export interface AspectRatioProps {
  /**
   * Aspect ratio expressed as `width / height`.
   * Accepts a number (e.g. 1.777 for 16:9) or a string like "16/9", "4/3", "1/1".
   */
  ratio?: number | string;
  /** Content to render inside the aspect ratio container */
  children?: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export function AspectRatio({
  ratio = 16 / 9,
  children,
  className = '',
  style,
}: AspectRatioProps) {
  const paddingBottom = useMemo(() => {
    let numeric: number;

    if (typeof ratio === 'string') {
      const parts = ratio.split('/').map((s) => parseFloat(s.trim()));
      numeric = parts.length === 2 && parts[1] !== 0 ? parts[0] / parts[1] : 16 / 9;
    } else {
      numeric = ratio;
    }

    if (!numeric || numeric <= 0) numeric = 16 / 9;
    return (1 / numeric) * 100 + '%';
  }, [ratio]);

  const rootClasses = ['sp-aspect-ratio', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses} style={{ ...style, paddingBottom }}>
      <div className="sp-aspect-ratio__content">{children}</div>
    </div>
  );
}
