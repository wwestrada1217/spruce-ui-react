/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StackedBarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function StackedBarChartPage() {
  const series = [
    { name: 'Product A', data: [400, 300, 500, 280, 600] },
    { name: 'Product B', data: [240, 190, 320, 210, 410] },
    { name: 'Product C', data: [150, 210, 180, 310, 250] },
  ];
  const categories = ['2022', '2023', '2024', '2025', '2026'];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Stacked Bar Chart</h1>
        <p>
          Native SVG stacked bar chart component for displaying cumulative totals and component share across categories.
        </p>
      </div>

      <section className="doc-section">
        <h2>Standard Stacked Bar Chart</h2>
        <CodePreview
          code={`import { StackedBarChart } from 'spruce-react';

const series = [
  { name: 'Product A', data: [400, 300, 500, 280, 600] },
  { name: 'Product B', data: [240, 190, 320, 210, 410] },
  { name: 'Product C', data: [150, 210, 180, 310, 250] },
];
const categories = ['2022', '2023', '2024', '2025', '2026'];

export function Example() {
  return (
    <StackedBarChart
      title="Annual Product Sales Breakdown"
      subtitle="Cumulative revenue per product line"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
        >
          <StackedBarChart
            title="Annual Product Sales Breakdown"
            subtitle="Cumulative revenue per product line"
            series={series}
            categories={categories}
            height={320}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>100% Normalized Stacked Bar Chart</h2>
        <CodePreview
          code={`import { StackedBarChart } from 'spruce-react';

export function Example() {
  return (
    <StackedBarChart
      title="Market Share Share-of-Wallet"
      subtitle="Normalized 100% stacked percentage distribution"
      series={series}
      categories={categories}
      percentage={true}
      height={320}
    />
  );
}`}
        >
          <StackedBarChart
            title="Market Share Share-of-Wallet"
            subtitle="Normalized 100% stacked percentage distribution"
            series={series}
            categories={categories}
            percentage={true}
            height={320}
          />
        </CodePreview>
      </section>
    </div>
  );
}
