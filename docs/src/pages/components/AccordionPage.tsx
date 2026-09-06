import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionItem, Badge, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { DocsPackageBadge } from '../../components/DocsPackageBadge';

const BASIC_CODE = `<Accordion>
  <AccordionItem label="Shipping and delivery">
    Orders leave the warehouse within one business day.
  </AccordionItem>
  <AccordionItem label="Returns">
    Unopened items can be returned for 30 days.
  </AccordionItem>
  <AccordionItem label="Warranty">
    Hardware carries a two year limited warranty.
  </AccordionItem>
</Accordion>`;

const MULTIPLE_CODE = `<Accordion multiple allToggle variant="separated">
  <AccordionItem label="Identity" icon="users" description="Sign-in and directory">
    Configure the identity provider, session lifetime, and directory sync.
  </AccordionItem>
  <AccordionItem label="Security" icon="shield" description="Policies and keys">
    Rotate API keys and require multi-factor sign-in.
  </AccordionItem>
</Accordion>`;

const VARIANTS_CODE = `<Accordion variant="contained">...</Accordion>
<Accordion variant="separated">...</Accordion>
<Accordion variant="flush">...</Accordion>`;

const SIZES_CODE = `<Accordion size="sm">...</Accordion>
<Accordion size="lg">...</Accordion>`;

const INDICATORS_CODE = `<Accordion indicator="plus">...</Accordion>
<Accordion indicatorPosition="start">...</Accordion>`;

const RICH_HEADERS_CODE = `<Accordion multiple>
  <AccordionItem
    header={<><span>Pending invitations</span> <Badge size="sm" variant="warning">3</Badge></>}
    actions={<Button size="sm" variant="ghost" iconLeft="refresh-cw">Resend</Button>}
  >Invitations expire after seven days.</AccordionItem>
  <AccordionItem trigger="indicator" header="Deployment keys">
    Read-only keys can be scoped to a single repository.
  </AccordionItem>
</Accordion>`;

const CONTROLLED_CODE = `const [open, setOpen] = useState(['a'])
const accordionRef = useRef<AccordionHandle>(null)
<Accordion ref={accordionRef} multiple value={open} onValueChange={setOpen}>...</Accordion>`;

const LAZY_CODE = `<Accordion multiple lazy>
  <AccordionItem header="Usage report">Built after first open.</AccordionItem>
</Accordion>`;

const DISABLED_CODE = `<Accordion>
  <AccordionItem header="Available">Active panel.</AccordionItem>
  <AccordionItem header="Locked" disabled>This panel is disabled.</AccordionItem>
  <AccordionItem header="Also available">Another active panel.</AccordionItem>
</Accordion>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'variants', label: 'Variants' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'indicators', label: 'Indicators' },
  { id: 'multiple', label: 'Multiple' },
  { id: 'rich-headers', label: 'Rich headers' },
  { id: 'controlled', label: 'Controlled' },
  { id: 'lazy', label: 'Deferred panels' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'api', label: 'API' },
];

export function AccordionPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [open, setOpen] = useState<string[]>(['a']);
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
    mainRef.current?.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Accordion</h1>
        <p className="docs-desc">
          Stacked disclosure panels for long-form content. Each header is a heading with a real
          toggle button, so the group reads correctly in a screen reader and responds to the
          keyboard.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['Accordion', 'AccordionItem']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic usage</h2>
          <p className="section-desc">
            Wrap <code>{'<AccordionItem>'}</code> elements in an <code>{'<Accordion>'}</code>.
            Only one panel can be open at a time by default.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 560, width: '100%' }}>
              <Accordion>
                <AccordionItem label="Shipping and delivery">
                  Orders leave the warehouse within one business day.
                </AccordionItem>
                <AccordionItem label="Returns">
                  Unopened items can be returned for 30 days.
                </AccordionItem>
                <AccordionItem label="Warranty">
                  Hardware carries a two year limited warranty.
                </AccordionItem>
              </Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">
            <code>contained</code> frames the group, <code>separated</code> gives each item its own
            surface, and <code>flush</code> removes outer chrome.
          </p>
          <CodePreview code={VARIANTS_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Accordion variant="contained"><AccordionItem label="Contained" defaultOpen>One framed surface.</AccordionItem><AccordionItem label="Second item">Hairline dividers.</AccordionItem></Accordion>
              <Accordion variant="separated"><AccordionItem label="Separated" defaultOpen>Each item is its own card.</AccordionItem><AccordionItem label="Second item">Cards are spaced apart.</AccordionItem></Accordion>
              <Accordion variant="flush"><AccordionItem label="Flush" defaultOpen>No outer border or background.</AccordionItem><AccordionItem label="Second item">Only a hairline rule remains.</AccordionItem></Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">
            Use <code>sm</code> for dense layouts, <code>md</code> for the default density, or{' '}
            <code>lg</code> when the headers need more breathing room.
          </p>
          <CodePreview code={SIZES_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Accordion size="sm"><AccordionItem label="Small" defaultOpen>Compact row padding for dense interfaces.</AccordionItem></Accordion>
              <Accordion size="lg"><AccordionItem label="Large" defaultOpen>More generous row padding for prominent content.</AccordionItem></Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="indicators" className="demo-section" aria-labelledby="indicators-heading">
          <h2 id="indicators-heading">Indicators</h2>
          <p className="section-desc">
            Choose <code>chevron</code>, <code>plus</code>, or <code>none</code>, and place the
            indicator at the start or end of the row.
          </p>
          <CodePreview code={INDICATORS_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Accordion indicator="plus">
                <AccordionItem label="Plus indicator" defaultOpen>The plus changes to a minus when open.</AccordionItem>
                <AccordionItem label="Second item">Closed items show a plus.</AccordionItem>
              </Accordion>
              <Accordion indicatorPosition="start">
                <AccordionItem label="Leading chevron" defaultOpen>The indicator can lead the title.</AccordionItem>
              </Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="multiple" className="demo-section" aria-labelledby="multiple-heading">
          <h2 id="multiple-heading">Multiple open panels</h2>
          <p className="section-desc">
            Add the <code>multiple</code> prop to allow more than one panel to be open simultaneously.
            Use <code>allToggle</code> to provide expand-all and collapse-all controls, and{' '}
            <code>defaultOpen</code> to pre-expand a panel.
          </p>
          <CodePreview code={MULTIPLE_CODE}>
            <div style={{ maxWidth: 560, width: '100%' }}>
              <Accordion multiple allToggle variant="separated">
                <AccordionItem label="Identity" icon="users" description="Sign-in and directory" defaultOpen>
                  Configure the identity provider, session lifetime, and directory sync.
                </AccordionItem>
                <AccordionItem label="Security" icon="shield" description="Policies and keys" defaultOpen>
                  Rotate API keys and require multi-factor sign-in.
                </AccordionItem>
                <AccordionItem label="Billing" description="Plans and invoices">
                  Review plans, payment methods, and invoices.
                </AccordionItem>
              </Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="rich-headers" className="demo-section" aria-labelledby="rich-headers-heading">
          <h2 id="rich-headers-heading">Rich Headers &amp; Row Actions</h2>
          <p className="section-desc">
            Headers accept React content and <code>actions</code> keeps a command outside the
            disclosure trigger.
          </p>
          <CodePreview code={RICH_HEADERS_CODE} language="typescript">
            <Accordion multiple>
              <AccordionItem
                header={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Pending invitations <Badge size="sm" variant="warning">3</Badge></span>}
                actions={<Button size="sm" variant="ghost" iconLeft="refresh-cw">Resend</Button>}
              >Invitations expire after seven days. Resending issues a fresh link.</AccordionItem>
              <AccordionItem header="Deployment keys" actions={<Button size="sm" variant="ghost" iconLeft="plus">Add key</Button>} trigger="indicator">
                Read-only keys can be scoped to a single repository.
              </AccordionItem>
            </Accordion>
          </CodePreview>
        </section>

        <section id="controlled" className="demo-section" aria-labelledby="controlled-heading">
          <h2 id="controlled-heading">Controlled State</h2>
          <p className="section-desc">Drive open panels from application state with <code>value</code> and <code>onValueChange</code>.</p>
          <CodePreview code={CONTROLLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button size="sm" variant="outline" onClick={() => setOpen(['a', 'c'])}>Open first and last</Button>
                <Button size="sm" variant="outline" onClick={() => setOpen([])}>Close all</Button>
                <span style={{ fontSize: 'var(--sp-text-sm)', color: 'var(--sp-text-muted)' }}>Open: {open.length ? open.join(', ') : 'none'}</span>
              </div>
              <Accordion multiple value={open} onValueChange={setOpen}>
                <AccordionItem value="a" header="Region">Primary region and failover.</AccordionItem>
                <AccordionItem value="b" header="Networking">Peering and egress rules.</AccordionItem>
                <AccordionItem value="c" header="Backups">Snapshot schedule and retention.</AccordionItem>
              </Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="lazy" className="demo-section" aria-labelledby="lazy-heading">
          <h2 id="lazy-heading">Deferred Panels</h2>
          <p className="section-desc"><code>lazy</code> holds panel content back until it first opens, useful for heavy charts, grids, and editors.</p>
          <CodePreview code={LAZY_CODE} language="typescript">
            <Accordion multiple lazy>
              <AccordionItem header="Usage report">Built only after the first open.</AccordionItem>
              <AccordionItem header="Audit log">Built only after the first open.</AccordionItem>
            </Accordion>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled item</h2>
          <p className="section-desc">
            Set <code>disabled</code> on an <code>AccordionItem</code> to prevent it from being toggled.
          </p>
          <CodePreview code={DISABLED_CODE}>
            <div style={{ maxWidth: 560, width: '100%' }}>
              <Accordion>
                <AccordionItem header="Available">Active panel.</AccordionItem>
                <AccordionItem header="Locked" disabled>This panel is disabled.</AccordionItem>
                <AccordionItem header="Also available">Another active panel.</AccordionItem>
              </Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section" aria-labelledby="accessibility-heading">
          <h2 id="accessibility-heading">Accessibility</h2>
          <p className="section-desc">
            Accordion headers use heading semantics and real buttons with <code>aria-expanded</code>{' '}
            and <code>aria-controls</code>. Closed panels are inert so their content is not reachable
            by keyboard or assistive technology.
          </p>
          <ul>
            <li>Use <code>headingLevel</code> to match the surrounding page hierarchy.</li>
            <li>Use <code>trigger="indicator"</code> when row actions or non-interactive header space should not toggle the panel.</li>
            <li>Arrow keys move between triggers; Home and End jump to the first and last trigger.</li>
            <li>Find-in-page can reveal a closed panel when <code>findable</code> is enabled.</li>
            <li>Expand and collapse transitions respect the user&apos;s reduced-motion preference.</li>
          </ul>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Accordion Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allow multiple panels open simultaneously.</td></tr>
                <tr><td><code>value</code> / <code>defaultValue</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Controlled or initial open item values.</td></tr>
                <tr><td><code>onValueChange</code> / <code>onChange</code></td><td><code>(value: string[]) =&gt; void</code></td><td>—</td><td>Controlled open-value callbacks.</td></tr>
                <tr><td><code>onItemToggle</code></td><td><code>(event: AccordionToggleEvent) =&gt; void</code></td><td>—</td><td>Called when an item changes its open state.</td></tr>
                <tr><td><code>collapsible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the active item can be closed in single mode.</td></tr>
                <tr><td><code>variant</code> / <code>size</code></td><td><code>AccordionVariant</code> / <code>AccordionSize</code></td><td><code>'contained'</code> / <code>'md'</code></td><td>Surface treatment and density.</td></tr>
                <tr><td><code>indicator</code> / <code>indicatorPosition</code></td><td><code>'chevron' | 'plus' | 'none'</code> / <code>'start' | 'end'</code></td><td><code>'chevron'</code> / <code>'end'</code></td><td>Disclosure affordance and placement.</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable every item and the all-toggle control.</td></tr>
                <tr><td><code>headingLevel</code></td><td><code>number</code></td><td><code>3</code></td><td>ARIA heading level applied to each item header, clamped from 1 to 6.</td></tr>
                <tr><td><code>lazy</code> / <code>findable</code></td><td><code>boolean</code></td><td><code>false</code> / <code>true</code></td><td>Lazy body mounting and find-in-page support.</td></tr>
                <tr><td><code>allToggle</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show localized expand-all/collapse-all control in multiple mode.</td></tr>
                <tr><td><code>ariaLabel</code> / <code>className</code></td><td><code>string</code> / <code>string</code></td><td>—</td><td>Accessible group label and custom root class.</td></tr>
                <tr><td><code>ref</code></td><td><code>AccordionHandle</code></td><td>—</td><td>Imperative <code>isOpen</code>, <code>setOpen</code>, <code>toggle</code>, <code>expandAll</code>, and <code>collapseAll</code> methods.</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td><code>AccordionItem</code> elements.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 24 }}>AccordionItem Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>header</code> / <code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Content of the header; <code>label</code> is an Angular-compatible alias.</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>generated</td><td>Stable controlled item identifier.</td></tr>
                <tr><td><code>open</code> / <code>onOpenChange</code></td><td><code>boolean</code> / callback</td><td>—</td><td>Optional controlled standalone item state.</td></tr>
                <tr><td><code>description</code> / <code>icon</code></td><td><code>ReactNode</code> / <code>string</code></td><td>—</td><td>Optional header metadata.</td></tr>
                <tr><td><code>trigger</code></td><td><code>'row' | 'indicator'</code></td><td><code>'row'</code></td><td>Choose whether the whole row or only the indicator toggles.</td></tr>
                <tr><td><code>defaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Open on first render.</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevent toggling.</td></tr>
                <tr><td><code>lazy</code> / <code>actions</code></td><td><code>boolean</code> / <code>ReactNode</code></td><td>—</td><td>Defer body mounting and render controls outside the disclosure trigger.</td></tr>
                <tr><td><code>indicator</code> / <code>indicatorPosition</code></td><td><code>AccordionIndicator</code> / <code>AccordionIndicatorPosition</code></td><td>group</td><td>Override the group disclosure affordance for one item.</td></tr>
                <tr><td><code>className</code> / <code>onOpenChange</code></td><td><code>string</code> / callback</td><td>—</td><td>Custom item class and open-state callback.</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Collapsible body content.</td></tr>
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
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
