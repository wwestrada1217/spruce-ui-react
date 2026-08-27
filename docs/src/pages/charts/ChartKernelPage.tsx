import { BarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function ChartKernelPage() {
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Chart Kernel</h1>
        <p className="docs-desc">
          All Spruce charts share the same responsive, theme-aware interaction kernel. Chart-specific props remain available, while common behavior is configured through <code>config</code>.
        </p>

        <section className="demo-section" aria-labelledby="kernel-example-heading">
          <h2 id="kernel-example-heading">Interactive chart configuration</h2>
          <CodePreview
            code={`import { BarChart } from 'spruce-react';

<BarChart
  series={series}
  categories={['Q1', 'Q2', 'Q3']}
  config={{
    palette: 'harmony',
    interactiveLegend: true,
    zoomEnabled: true,
    animate: true,
  }}
  onLegendClick={({ label, hidden }) => console.log(label, hidden)}
  onZoomChange={(zoom) => console.log(zoom.scale)}
/>`}
          >
            <BarChart
              title="Quarterly results"
              series={[
                { name: 'Revenue', data: [440, 550, 570] },
                { name: 'Expenses', data: [350, 410, 360] },
              ]}
              categories={['Q1', 'Q2', 'Q3']}
              config={{ palette: 'harmony', interactiveLegend: true, zoomEnabled: true }}
            />
          </CodePreview>
        </section>

        <section className="demo-section" aria-labelledby="kernel-contract-heading">
          <h2 id="kernel-contract-heading">Shared contract</h2>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Option</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>responsive</code></td><td><code>boolean</code></td><td>Measures the chart wrapper with ResizeObserver and refreshes its rendering width.</td></tr>
                <tr><td><code>palette</code></td><td><code>string</code></td><td>Uses a shared named palette or the active theme harmony ramp.</td></tr>
                <tr><td><code>interactiveLegend</code></td><td><code>boolean</code></td><td>Turns legend entries into keyboard-accessible series visibility controls.</td></tr>
                <tr><td><code>zoomEnabled</code> / <code>panEnabled</code></td><td><code>boolean</code></td><td>Enables wheel zoom, pointer drag panning, and a localized reset action.</td></tr>
                <tr><td><code>tooltip</code></td><td><code>ChartTooltipConfig</code></td><td>Controls visibility, value formatting, and custom tooltip rendering.</td></tr>
                <tr><td><code>onDataPointClick</code> / <code>onDataPointHover</code></td><td><code>ChartPointEvent</code></td><td>Receives normalized chart id, index, label, series, value, and original DOM event.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
