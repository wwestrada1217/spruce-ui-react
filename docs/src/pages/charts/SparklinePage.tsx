/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Sparkline } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function SparklinePage() {
  const lineData = [12, 18, 14, 26, 22, 35, 30, 42, 38, 50];
  const barData = [40, 25, 55, 30, 75, 45, 90, 60, 80];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Sparkline</h1>
        <p>
          Compact, inline SVG micro-chart component designed for embedding in tables, stat cards, and dashboard metrics.
        </p>
      </div>

      <section className="doc-section">
        <h2>Area & Line Sparklines</h2>
        <CodePreview
          code={`import { Sparkline } from 'spruce-react';

const data = [12, 18, 14, 26, 22, 35, 30, 42, 38, 50];

export function Example() {
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div>
        <span>Area: </span>
        <Sparkline data={data} type="area" color="#0f766e" width={140} height={36} />
      </div>
      <div>
        <span>Line: </span>
        <Sparkline data={data} type="line" color="#0284c7" width={140} height={36} />
      </div>
    </div>
  );
}`}
        >
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginRight: 8 }}>Area:</span>
              <Sparkline data={lineData} type="area" color="#0f766e" width={140} height={36} />
            </div>
            <div>
              <span style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginRight: 8 }}>Line:</span>
              <Sparkline data={lineData} type="line" color="#0284c7" width={140} height={36} />
            </div>
          </div>
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Bar Sparkline</h2>
        <CodePreview
          code={`import { Sparkline } from 'spruce-react';

const barData = [40, 25, 55, 30, 75, 45, 90, 60, 80];

export function Example() {
  return (
    <Sparkline data={barData} type="bar" color="#d97706" width={140} height={36} />
  );
}`}
        >
          <Sparkline data={barData} type="bar" color="#d97706" width={140} height={36} />
        </CodePreview>
      </section>
    </div>
  );
}
