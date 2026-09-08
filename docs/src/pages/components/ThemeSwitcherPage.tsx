import { useState } from 'react';
import { Button, HarmonyWheel, ThemeSwitcher, ThemeSwitcherPanel } from 'spruce-react';
import type { HarmonySelection, ThemeSwitcherView } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const SWITCHER_CODE = `<ThemeSwitcher trigger="icon" />
<ThemeSwitcher trigger="button" label="Appearance" />
<ThemeSwitcher trigger="menu" label="Theme" />
<ThemeSwitcher trigger="custom">
  <Button variant="outline">Custom trigger</Button>
</ThemeSwitcher>`;

const PANEL_CODE = `<ThemeSwitcherPanel
  heading="Workspace appearance"
  description="Brand, contrast, density, and motion"
  defaultView="list"
  onApply={() => savePreferences()}
/>`;

export function ThemeSwitcherPage() {
  const [view, setView] = useState<ThemeSwitcherView>('grid');
  const [base, setBase] = useState('#2563eb');
  const [selection, setSelection] = useState<HarmonySelection>('triadic');

  return (
    <div className="features-layout">
      <main className="features-main">
        <h1>Theme Switcher &amp; Harmony Wheel</h1>
        <p className="docs-desc">Reusable appearance controls for choosing themes, accents, generated color harmonies, density, and reduced motion.</p>

        <section className="demo-section" id="triggers">
          <h2>ThemeSwitcher triggers</h2>
          <p className="section-desc">Use the convenience wrapper in headers, toolbars, and menus. Open state can be controlled with <code>open</code> and <code>onOpenChange</code>.</p>
          <CodePreview code={SWITCHER_CODE}>
            <div className="demo-row">
              <ThemeSwitcher trigger="icon" />
              <ThemeSwitcher trigger="button" label="Appearance" />
              <div style={{ width: 220 }}><ThemeSwitcher trigger="menu" label="Theme" /></div>
              <ThemeSwitcher trigger="custom"><Button variant="outline">Custom trigger</Button></ThemeSwitcher>
            </div>
          </CodePreview>
        </section>

        <section className="demo-section" id="panel">
          <h2>Standalone panel</h2>
          <p className="section-desc">Embed the panel directly in a settings page, drawer, or modal. Header, footer, labels, view, density, and motion state are configurable or controllable.</p>
          <CodePreview code={PANEL_CODE}>
            <ThemeSwitcherPanel showFooter={false} dismissible={false} view={view} onViewChange={setView} />
          </CodePreview>
        </section>

        <section className="demo-section" id="wheel">
          <h2>HarmonyWheel</h2>
          <p className="section-desc">Drag any marker, or focus one and use Arrow, Shift+Arrow, Page Up/Down, Home, and End. Companion markers snap to named schemes within <code>snapTolerance</code>.</p>
          <CodePreview code={`<HarmonyWheel base={base} selection={selection}\n  onBaseChange={setBase} onSelectionChange={setSelection} />`}>
            <HarmonyWheel base={base} selection={selection} onBaseChange={setBase} onSelectionChange={setSelection} />
          </CodePreview>
        </section>

        <section className="demo-section" id="api">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Component</th><th>Key props</th><th>Notes</th></tr></thead><tbody>
            <tr><td><code>ThemeSwitcher</code></td><td><code>trigger</code>, <code>open</code>, <code>onOpenChange</code>, panel props</td><td>Icon, button, menu, or custom trigger plus Popover.</td></tr>
            <tr><td><code>ThemeSwitcherPanel</code></td><td><code>showHeader</code>, <code>showFooter</code>, <code>dismissible</code>, <code>view</code>, <code>density</code>, <code>reducedMotion</code>, callbacks</td><td>Reusable controlled/uncontrolled settings surface.</td></tr>
            <tr><td><code>HarmonyWheel</code></td><td><code>base</code>, <code>selection</code>, callbacks, <code>disabled</code>, <code>showReadout</code>, <code>snapTolerance</code></td><td>Three accessible slider markers.</td></tr>
          </tbody></table></div>
          <p className="section-desc"><strong>Accessibility:</strong> all choices expose selected state, the wheel is keyboard operable, and reduced-motion/high-contrast preferences retain visible focus and token-driven contrast. Logical properties preserve RTL layout.</p>
        </section>
      </main>
    </div>
  );
}
