/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { GroupedBarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function GroupedBarChartPage() {
  const series = [
    { name: '2024', data: [320, 450, 510, 600] },
    { name: '2025', data: [410, 520, 640, 750] },
    { name: '2026', data: [490, 610, 780, 920] },
  ];
  const categories = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Grouped Bar Chart</h1>
        <p>
          Native SVG grouped bar chart component for side-by-side comparative analysis of multi-series metrics across categories.
        </p>
      </div>

      <section className="doc-section">
        <h2>Vertical Grouped Bar Chart</h2>
        <CodePreview
          code={`import { GroupedBarChart } from 'spruce-react';

const series = [
  { name: '2024', data: [320, 450, 510, 600] },
  { name: '2025', data: [410, 520, 640, 750] },
  { name: '2026', data: [490, 610, 780, 920] },
];
const categories = ['Q1', 'Q2', 'Q3', 'Q4'];

export function Example() {
  return (
    <GroupedBarChart
      title="Quarterly Growth Comparison"
      subtitle="Side-by-side revenue per quarter over 3 years"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
        >
          <GroupedBarChart
            title="Quarterly Growth Comparison"
            subtitle="Side-by-side revenue per quarter over 3 years"
            series={series}
            categories={categories}
            height={320}
          />
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Horizontal Grouped Bar Chart</h2>
        <CodePreview
          code={`import { GroupedBarChart } from 'spruce-react';

export function Example() {
  return (
    <GroupedBarChart
      title="Regional Performance"
      subtitle="Horizontal side-by-side comparison"
      series={series}
      categories={categories}
      orientation="horizontal"
      height={320}
    />
  );
}`}
        >
          <GroupedBarChart
            title="Regional Performance"
            subtitle="Horizontal side-by-side comparison"
            series={series}
            categories={categories}
            orientation="horizontal"
            height={320}
          />
        </CodePreview>
      </section>
    </div>
  );
}
