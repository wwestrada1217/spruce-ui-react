/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PieChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function PieChartPage() {
  const browserData = [
    { label: 'Chrome', value: 65 },
    { label: 'Safari', value: 18 },
    { label: 'Edge', value: 9 },
    { label: 'Firefox', value: 5 },
    { label: 'Other', value: 3 },
  ];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Pie Chart</h1>
        <p>
          Native SVG pie & donut chart component for visualizing proportions and percentage shares of a whole.
        </p>
      </div>

      <section className="doc-section">
        <h2>Standard Pie Chart</h2>
        <CodePreview
          code={`import { PieChart } from 'spruce-react';

const data = [
  { label: 'Chrome', value: 65 },
  { label: 'Safari', value: 18 },
  { label: 'Edge', value: 9 },
  { label: 'Firefox', value: 5 },
  { label: 'Other', value: 3 },
];

export function Example() {
  return (
    <PieChart
      title="Global Browser Market Share"
      subtitle="Desktop browser usage distribution"
      data={data}
      height={300}
    />
  );
}`}
        >
          <PieChart
            title="Global Browser Market Share"
            subtitle="Desktop browser usage distribution"
            data={browserData}
            height={300}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Donut Chart Variant</h2>
        <CodePreview
          code={`import { PieChart } from 'spruce-react';

export function Example() {
  return (
    <PieChart
      title="Traffic Source Breakdown"
      subtitle="Percentage of visitors by channel"
      data={[
        { label: 'Direct', value: 40 },
        { label: 'Organic Search', value: 35 },
        { label: 'Referral', value: 15 },
        { label: 'Social', value: 10 },
      ]}
      donut={true}
      innerRadius={60}
      height={320}
    />
  );
}`}
        >
          <PieChart
            title="Traffic Source Breakdown"
            subtitle="Percentage of visitors by channel"
            data={[
              { label: 'Direct', value: 40 },
              { label: 'Organic Search', value: 35 },
              { label: 'Referral', value: 15 },
              { label: 'Social', value: 10 },
            ]}
            donut={true}
            innerRadius={60}
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
              <td><code>[]</code></td>
              <td>Array of pie slice data items.</td>
            </tr>
            <tr>
              <td><code>donut</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Render as donut chart cutout.</td>
            </tr>
            <tr>
              <td><code>innerRadius</code></td>
              <td><code>number</code></td>
              <td><code>55</code></td>
              <td>Cutout inner radius percentage for donut mode.</td>
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
          </tbody>
        </table>
      </section>
    </div>
  );
}
