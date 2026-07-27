import { useState, useEffect, useRef } from 'react';
import { CandlestickChart, type CandlestickDataItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'candlestick', label: 'Financial Candlestick' },
  { id: 'api',         label: 'API' },
];

export function CandlestickChartPage() {
  const [activeSection, setActiveSection] = useState('candlestick');
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

  const data: CandlestickDataItem[] = [
    { x: 'Mon', open: 120, high: 135, low: 115, close: 130 },
    { x: 'Tue', open: 130, high: 142, low: 128, close: 125 },
    { x: 'Wed', open: 125, high: 138, low: 122, close: 136 },
    { x: 'Thu', open: 136, high: 145, low: 134, close: 140 },
    { x: 'Fri', open: 140, high: 148, low: 130, close: 132 },
  ];

  const CANDLESTICK_CODE = `import { CandlestickChart } from 'spruce-react';

const data = [
  { x: 'Mon', open: 120, high: 135, low: 115, close: 130 },
  { x: 'Tue', open: 130, high: 142, low: 128, close: 125 },
  { x: 'Wed', open: 125, high: 138, low: 122, close: 136 },
  { x: 'Thu', open: 136, high: 145, low: 134, close: 140 },
  { x: 'Fri', open: 140, high: 148, low: 130, close: 132 },
];

export function Example() {
  return (
    <CandlestickChart
      title="Equity Price Movements (OHLC)"
      subtitle="Daily Open, High, Low, and Close prices"
      data={data}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Candlestick Chart</h1>
        <p className="docs-desc">
          Financial OHLC candlestick chart for tracking price action and market volatility.
        </p>

        <section id="candlestick" className="demo-section">
          <h2>Financial OHLC Price Action</h2>
          <CodePreview code={CANDLESTICK_CODE}>
            <CandlestickChart
              title="Equity Price Movements (OHLC)"
              subtitle="Daily Open, High, Low, and Close prices"
              data={data}
              height={320}
            />
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
                <tr><td><code>data</code></td><td><code>CandlestickDataItem[]</code></td><td><code>[]</code></td><td>OHLC candle items</td></tr>
                <tr><td><code>upColor</code></td><td><code>string</code></td><td><code>'#16a34a'</code></td><td>Bullish candle color</td></tr>
                <tr><td><code>downColor</code></td><td><code>string</code></td><td><code>'#dc2626'</code></td><td>Bearish candle color</td></tr>
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
