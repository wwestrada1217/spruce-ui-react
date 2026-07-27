/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StackedAreaChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function StackedAreaChartPage() {
  const series = [
    { name: 'Direct', data: [1200, 1800, 2400, 3100, 3900, 4800] },
    { name: 'Organic Search', data: [900, 1400, 2100, 2900, 3600, 4200] },
    { name: 'Social', data: [400, 600, 900, 1200, 1700, 2100] },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1>Stacked Area Chart</h1>
        <p>
          Native SVG stacked area chart component for visualizing cumulative volume trends and component composition over time.
        </p>
      </div>

      <section className="doc-section">
        <h2>Cumulative Traffic Source Area</h2>
        <CodePreview
          code={`import { StackedAreaChart } from 'spruce-react';

const series = [
  { name: 'Direct', data: [1200, 1800, 2400, 3100, 3900, 4800] },
  { name: 'Organic Search', data: [900, 1400, 2100, 2900, 3600, 4200] },
  { name: 'Social', data: [400, 600, 900, 1200, 1700, 2100] },
];
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function Example() {
  return (
    <StackedAreaChart
      title="Cumulative Traffic Volume Growth"
      subtitle="Stacked monthly pageview accumulation by source"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
        >
          <StackedAreaChart
            title="Cumulative Traffic Volume Growth"
            subtitle="Stacked monthly pageview accumulation by source"
            series={series}
            categories={categories}
            height={320}
          />
        </CodePreview>
      </section>
    </div>
  );
}
