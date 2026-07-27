/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function BarChartPage() {
  const singleData = [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 300 },
    { label: 'Mar', value: 600 },
    { label: 'Apr', value: 800 },
    { label: 'May', value: 500 },
    { label: 'Jun', value: 950 },
  ];

  const multiSeriesData = [
    { name: 'Revenue', data: [440, 550, 570, 560, 610, 580] },
    { name: 'Expenses', data: [350, 410, 360, 260, 450, 480] },
  ];
  const categories = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Bar Chart</h1>
        <p>
          Native SVG bar chart component for displaying comparative metrics across discrete categories with multi-series support.
        </p>
      </div>

      <section className="doc-section">
        <h2>Single Series Bar Chart</h2>
        <CodePreview
          code={`import { BarChart } from 'spruce-react';

const data = [
  { label: 'Jan', value: 400 },
  { label: 'Feb', value: 300 },
  { label: 'Mar', value: 600 },
  { label: 'Apr', value: 800 },
  { label: 'May', value: 500 },
  { label: 'Jun', value: 950 },
];

export function Example() {
  return (
    <BarChart
      title="Monthly Sales Overview"
      subtitle="Total units sold per month in 2026"
      data={data}
      height={300}
    />
  );
}`}
        >
          <BarChart
            title="Monthly Sales Overview"
            subtitle="Total units sold per month in 2026"
            data={singleData}
            height={300}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Multi-Series Grouped Bar Chart</h2>
        <CodePreview
          code={`import { BarChart } from 'spruce-react';

const series = [
  { name: 'Revenue', data: [440, 550, 570, 560, 610, 580] },
  { name: 'Expenses', data: [350, 410, 360, 260, 450, 480] },
];
const categories = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];

export function Example() {
  return (
    <BarChart
      title="Quarterly Revenue vs Expenses"
      subtitle="Financial breakdown comparison"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
        >
          <BarChart
            title="Quarterly Revenue vs Expenses"
            subtitle="Financial breakdown comparison"
            series={multiSeriesData}
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
              <td>Single-series data items array.</td>
            </tr>
            <tr>
              <td><code>series</code></td>
              <td><code>ChartSeries[]</code></td>
              <td><code>undefined</code></td>
              <td>Multi-series data array.</td>
            </tr>
            <tr>
              <td><code>categories</code></td>
              <td><code>string[]</code></td>
              <td><code>[]</code></td>
              <td>Category names for multi-series charts.</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Chart title string.</td>
            </tr>
            <tr>
              <td><code>subtitle</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Chart subtitle string.</td>
            </tr>
            <tr>
              <td><code>height</code></td>
              <td><code>number | string</code></td>
              <td><code>300</code></td>
              <td>Chart container height.</td>
            </tr>
            <tr>
              <td><code>showGrid</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Show background grid lines.</td>
            </tr>
            <tr>
              <td><code>showLegend</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Show chart legend.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
