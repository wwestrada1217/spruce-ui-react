import { useState } from 'react';
import { Button, NumberCounter, NumberTicker } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'counter', label: 'Counting Text' }, { id: 'ticker', label: 'Flip Reels' }, { id: 'formatting', label: 'Formatting' }, { id: 'api', label: 'API' }];
const COUNTER_CODE = `const [users, setUsers] = useState(1248);
<Button onClick={() => setUsers((value) => value + 137)}>Add users</Button>
<NumberCounter value={users} suffix=" users" />`;
const TICKER_CODE = `<NumberTicker value={98765.43} prefix="$" decimals={2} />`;
const FORMATTING_CODE = `<NumberTicker value={98.6} suffix="%" />
<NumberTicker value={42} prefix="+" suffix=" pts" separator={false} />`;

export function NumberTickerPage() {
  const [users, setUsers] = useState(1248);
  return (
    <EffectDocsLayout title="Number Ticker" description="Accessible numeric animation with smooth cubic counting and vertical split-flap / odometer reels. Supports prefixes, suffixes, decimals, and separators." sections={SECTIONS} packageName="spruce-react" packageSymbols={['NumberCounter', 'NumberTicker', 'useNumberCounter']}>
      <section id="counter" className="demo-section"><h2>Counting Text</h2><p className="section-desc"><code>NumberCounter</code> animates any value change while exposing <code>aria-live="polite"</code>.</p><CodePreview code={COUNTER_CODE} language="tsx"><div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 24 }}><Button onClick={() => setUsers((value) => value + 137)}>Add users</Button><strong style={{ fontSize: 24 }}><NumberCounter value={users} suffix=" users" /></strong></div></CodePreview></section>
      <section id="ticker" className="demo-section"><h2>Flip Reels</h2><CodePreview code={TICKER_CODE} language="tsx"><div style={{ padding: 24, fontSize: 32, fontWeight: 700 }}><NumberTicker value={98765.43} prefix="$" decimals={2} /></div></CodePreview></section>
      <section id="formatting" className="demo-section"><h2>Formatting</h2><CodePreview code={FORMATTING_CODE} language="tsx"><div style={{ display: 'flex', gap: 24, padding: 24, fontSize: 24, fontWeight: 600 }}><NumberTicker value={98.6} suffix="%" /><NumberTicker value={42} prefix="+" suffix=" pts" separator={false} /></div></CodePreview></section>
      <section id="api" className="demo-section"><h2>API</h2><EffectApiTable rows={[
        { name: 'value', type: 'number', defaultValue: 'required', description: 'Numeric target value.' },
        { name: 'duration', type: 'number', defaultValue: '1000', description: 'Animation duration in milliseconds.' },
        { name: 'decimals', type: 'number', defaultValue: '0', description: 'Number of decimal places.' },
        { name: 'prefix / suffix', type: 'string', defaultValue: "'' / ''", description: 'Text displayed before or after the number.' },
        { name: 'separator', type: 'boolean', defaultValue: 'true', description: 'Use comma thousands separators.' },
        { name: 'useNumberCounter', type: 'hook', defaultValue: '—', description: 'Attach counting text to any existing HTMLElement via ref.' },
      ]} /></section>
    </EffectDocsLayout>
  );
}
