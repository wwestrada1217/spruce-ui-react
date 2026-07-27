import { useState, useEffect, useRef } from 'react';
import { GaugeChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'gauge',  label: 'Gauge Meter' },
  { id: 'needle', label: 'With Needle' },
  { id: 'api',    label: 'API' },
];

export function GaugeChartPage() {
  const [activeSection, setActiveSection] = useState('gauge');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const GAUGE_CODE = `import { GaugeChart } from 'spruce-react';

export function Example() {
  return (
    <GaugeChart
      title="System Memory Usage"
      subtitle="RAM utilization on primary cluster node"
      value={78}
      min={0}
      max={100}
      unit="%"
      color="#0f766e"
      height={280}
    />
  );
}`;

  const NEEDLE_CODE = `import { GaugeChart } from 'spruce-react';

export function Example() {
  return (
    <GaugeChart
      title="CPU Core Utilization"
      subtitle="Precision dial pointer meter"
      value={65}
      min={0}
      max={100}
      unit="%"
      color="#d97706"
      showNeedle={true}
      height={280}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Gauge Chart</h1>
        <p className="docs-desc">
          Radial semi-circle dial meter for displaying progress, capacity utilization, and KPI targets.
        </p>

        <section id="gauge" className="demo-section">
          <h2>Standard Arc Gauge</h2>
          <CodePreview code={GAUGE_CODE}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <GaugeChart
                title="System Memory Usage"
                subtitle="RAM utilization on cluster node 1"
                value={78}
                min={0}
                max={100}
                unit="%"
                color="#0f766e"
                height={280}
              />
              <GaugeChart
                title="Storage Volume Capacity"
                subtitle="NVMe pool utilization"
                value={42}
                min={0}
                max={100}
                unit="%"
                color="#0284c7"
                height={280}
              />
            </div>
          </CodePreview>
        </section>

        <section id="needle" className="demo-section">
          <h2>Gauge with Needle Indicator</h2>
          <CodePreview code={NEEDLE_CODE}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <GaugeChart
                title="CPU Core Utilization"
                subtitle="Precision dial pointer meter"
                value={65}
                min={0}
                max={100}
                unit="%"
                color="#d97706"
                showNeedle={true}
                height={280}
              />
              <GaugeChart
                title="Network Bandwidth Load"
                subtitle="Real-time throughput indicator"
                value={88}
                min={0}
                max={100}
                unit="%"
                color="#dc2626"
                showNeedle={true}
                height={280}
              />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>number</code></td><td><code>0</code></td><td>Current meter value</td></tr>
                <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum range boundary</td></tr>
                <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum range boundary</td></tr>
                <tr><td><code>unit</code></td><td><code>string</code></td><td><code>'%'</code></td><td>Unit label suffix</td></tr>
                <tr><td><code>showNeedle</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render precision pointer needle</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
