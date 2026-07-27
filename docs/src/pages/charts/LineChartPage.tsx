/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LineChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function LineChartPage() {
  const lineData = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 210 },
    { label: 'Mar', value: 180 },
    { label: 'Apr', value: 340 },
    { label: 'May', value: 310 },
    { label: 'Jun', value: 450 },
  ];

  const series = [
    { name: '2025', data: [150, 230, 220, 310, 290, 390] },
    { name: '2026', data: [210, 320, 310, 420, 480, 560] },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Line Chart</h1>
        <p>
          Native SVG line chart component for visualizing continuous trends over time with smooth Bezier curves and multi-series support.
        </p>
      </div>

      <section className="doc-section">
        <h2>Single Series Line Chart</h2>
        <CodePreview
          code={`import { LineChart } from 'spruce-react';

const data = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 210 },
  { label: 'Mar', value: 180 },
  { label: 'Apr', value: 340 },
  { label: 'May', value: 310 },
  { label: 'Jun', value: 450 },
];

export function Example() {
  return (
    <LineChart
      title="User Signups Trend"
      subtitle="Monthly active user signups in 2026"
      data={data}
      height={300}
    />
  );
}`}
        >
          <LineChart
            title="User Signups Trend"
            subtitle="Monthly active user signups in 2026"
            data={lineData}
            height={300}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Multi-Series Line Comparison</h2>
        <CodePreview
          code={`import { LineChart } from 'spruce-react';

const series = [
  { name: '2025', data: [150, 230, 220, 310, 290, 390] },
  { name: '2026', data: [210, 320, 310, 420, 480, 560] },
];
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function Example() {
  return (
    <LineChart
      title="Year-over-Year Growth Comparison"
      subtitle="Comparing 2025 vs 2026 performance"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
        >
          <LineChart
            title="Year-over-Year Growth Comparison"
            subtitle="Comparing 2025 vs 2026 performance"
            series={series}
            categories={categories}
            height={320}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>API Reference</h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>data</code></td>
              <td><code>ChartDataItem[]</code></td>
              <td><code>undefined</code></td>
              <td>Single-series data array.</td>
            </tr>
            <tr>
              <td><code>series</code></td>
              <td><code>ChartSeries[]</code></td>
              <td><code>undefined</code></td>
              <td>Multi-series data array.</td>
            </tr>
            <tr>
              <td><code>curved</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Render smooth cubic Bezier curve lines.</td>
            </tr>
            <tr>
              <td><code>showDots</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Show interactive data point dots.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
