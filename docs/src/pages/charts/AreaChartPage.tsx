/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AreaChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function AreaChartPage() {
  const areaData = [
    { label: 'Jan', value: 2400 },
    { label: 'Feb', value: 1398 },
    { label: 'Mar', value: 9800 },
    { label: 'Apr', value: 3908 },
    { label: 'May', value: 4800 },
    { label: 'Jun', value: 3800 },
    { label: 'Jul', value: 4300 },
  ];

  const series = [
    { name: 'Desktop Views', data: [3000, 4200, 5100, 6800, 7200, 8900] },
    { name: 'Mobile Views',  data: [1800, 2400, 3100, 4500, 5200, 6400] },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Area Chart</h1>
        <p>
          Native SVG area chart component for emphasizing volume and quantitative change over time with smooth gradient fills.
        </p>
      </div>

      <section className="doc-section">
        <h2>Single Series Gradient Area Chart</h2>
        <CodePreview
          code={`import { AreaChart } from 'spruce-react';

const data = [
  { label: 'Jan', value: 2400 },
  { label: 'Feb', value: 1398 },
  { label: 'Mar', value: 9800 },
  { label: 'Apr', value: 3908 },
  { label: 'May', value: 4800 },
  { label: 'Jun', value: 3800 },
  { label: 'Jul', value: 4300 },
];

export function Example() {
  return (
    <AreaChart
      title="Monthly Website Traffic"
      subtitle="Total pageviews per month"
      data={data}
      height={300}
    />
  );
}`}
        >
          <AreaChart
            title="Monthly Website Traffic"
            subtitle="Total pageviews per month"
            data={areaData}
            height={300}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Multi-Series Area Comparison</h2>
        <CodePreview
          code={`import { AreaChart } from 'spruce-react';

const series = [
  { name: 'Desktop Views', data: [3000, 4200, 5100, 6800, 7200, 8900] },
  { name: 'Mobile Views',  data: [1800, 2400, 3100, 4500, 5200, 6400] },
];
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function Example() {
  return (
    <AreaChart
      title="Desktop vs Mobile Pageviews"
      subtitle="Volume trend breakdown by device type"
      series={series}
      categories={categories}
      fillOpacity={0.4}
      height={320}
    />
  );
}`}
        >
          <AreaChart
            title="Desktop vs Mobile Pageviews"
            subtitle="Volume trend breakdown by device type"
            series={series}
            categories={categories}
            fillOpacity={0.4}
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
              <td><code>fillOpacity</code></td>
              <td><code>number</code></td>
              <td><code>0.35</code></td>
              <td>Opacity of the gradient area fill.</td>
            </tr>
            <tr>
              <td><code>curved</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Render smooth cubic Bezier curve area boundaries.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
