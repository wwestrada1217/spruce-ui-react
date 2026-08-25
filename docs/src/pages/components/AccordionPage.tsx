import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `<Accordion>
  <AccordionItem header="What is Spruce?">
    Spruce is a design system for enterprise web applications, built with
    Angular and React. It provides a comprehensive set of components,
    design tokens, and utilities.
  </AccordionItem>
  <AccordionItem header="How do I install it?">
    Run <code>npm install spruce-react</code> and wrap your app with
    <code>&lt;SpruceProvider&gt;</code>.
  </AccordionItem>
  <AccordionItem header="Is it accessible?">
    Yes. Every component passes WCAG AA checks and ships with proper
    ARIA attributes, focus management, and keyboard navigation.
  </AccordionItem>
</Accordion>`;

const MULTIPLE_CODE = `<Accordion multiple>
  <AccordionItem header="Section A" defaultOpen>
    Content for section A.
  </AccordionItem>
  <AccordionItem header="Section B" defaultOpen>
    Content for section B.
  </AccordionItem>
  <AccordionItem header="Section C">
    Content for section C.
  </AccordionItem>
</Accordion>`;

const DISABLED_CODE = `<Accordion>
  <AccordionItem header="Available">Active panel.</AccordionItem>
  <AccordionItem header="Locked" disabled>This panel is disabled.</AccordionItem>
  <AccordionItem header="Also available">Another active panel.</AccordionItem>
</Accordion>`;

const STANDALONE_CODE = `<AccordionItem header="Standalone item">
  Works without a parent Accordion wrapper.
</AccordionItem>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic usage' },
  { id: 'multiple',   label: 'Multiple open' },
  { id: 'disabled',   label: 'Disabled item' },
  { id: 'standalone', label: 'Standalone' },
  { id: 'api',        label: 'API' },
];

export function AccordionPage() {
  const [activeSection, setActiveSection] = useState('basic');
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
          Collapsible content panels with accessible keyboard navigation and ARIA attributes.
          Supports single-open (default) and multi-open modes.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic usage</h2>
          <p className="section-desc">
            Wrap <code>{'<AccordionItem>'}</code> elements in an <code>{'<Accordion>'}</code>.
            Only one panel can be open at a time by default.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 560, width: '100%' }}>
              <Accordion>
                <AccordionItem header="What is Spruce?">
                  Spruce is a design system for enterprise web applications, built with Angular and React.
                  It provides a comprehensive set of components, design tokens, and utilities.
                </AccordionItem>
                <AccordionItem header="How do I install it?">
                  Run <code>npm install spruce-react</code> and wrap your app with{' '}
                  <code>{'<SpruceProvider>'}</code>.
                </AccordionItem>
                <AccordionItem header="Is it accessible?">
                  Yes. Every component passes WCAG AA checks and ships with proper ARIA attributes,
                  focus management, and keyboard navigation.
                </AccordionItem>
              </Accordion>
            </div>
          </CodePreview>
        </section>

        <section id="multiple" className="demo-section" aria-labelledby="multiple-heading">
          <h2 id="multiple-heading">Multiple open</h2>
          <p className="section-desc">
            Add the <code>multiple</code> prop to allow more than one panel to be open simultaneously.
            Use <code>defaultOpen</code> on <code>AccordionItem</code> to pre-expand a panel.
          </p>
          <CodePreview code={MULTIPLE_CODE}>
            <div style={{ maxWidth: 560, width: '100%' }}>
              <Accordion multiple>
                <AccordionItem header="Section A" defaultOpen>Content for section A.</AccordionItem>
                <AccordionItem header="Section B" defaultOpen>Content for section B.</AccordionItem>
                <AccordionItem header="Section C">Content for section C.</AccordionItem>
              </Accordion>
            </div>
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

        <section id="standalone" className="demo-section" aria-labelledby="standalone-heading">
          <h2 id="standalone-heading">Standalone</h2>
          <p className="section-desc">
            <code>AccordionItem</code> manages its own open state when used outside an{' '}
            <code>{'<Accordion>'}</code> container.
          </p>
          <CodePreview code={STANDALONE_CODE}>
            <div style={{ maxWidth: 560, width: '100%' }}>
              <AccordionItem header="Standalone item">
                Works without a parent Accordion wrapper.
              </AccordionItem>
            </div>
          </CodePreview>
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
                <tr><td><code>onValueChange</code></td><td><code>(value: string[]) =&gt; void</code></td><td>—</td><td>Controlled open-value callback.</td></tr>
                <tr><td><code>collapsible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the active item can be closed in single mode.</td></tr>
                <tr><td><code>variant</code> / <code>size</code></td><td><code>AccordionVariant</code> / <code>AccordionSize</code></td><td><code>'contained'</code> / <code>'md'</code></td><td>Surface treatment and density.</td></tr>
                <tr><td><code>indicator</code> / <code>indicatorPosition</code></td><td><code>'chevron' | 'plus' | 'none'</code> / <code>'start' | 'end'</code></td><td><code>'chevron'</code> / <code>'end'</code></td><td>Disclosure affordance and placement.</td></tr>
                <tr><td><code>lazy</code> / <code>findable</code></td><td><code>boolean</code></td><td><code>false</code> / <code>true</code></td><td>Lazy body mounting and find-in-page support.</td></tr>
                <tr><td><code>allToggle</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show localized expand-all/collapse-all control.</td></tr>
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
                <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>Content of the clickable header row.</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>generated</td><td>Stable controlled item identifier.</td></tr>
                <tr><td><code>open</code> / <code>onOpenChange</code></td><td><code>boolean</code> / callback</td><td>—</td><td>Optional controlled standalone item state.</td></tr>
                <tr><td><code>description</code> / <code>icon</code></td><td><code>ReactNode</code> / <code>string</code></td><td>—</td><td>Optional header metadata.</td></tr>
                <tr><td><code>trigger</code></td><td><code>'row' | 'indicator'</code></td><td><code>'row'</code></td><td>Choose whether the whole row or only the indicator toggles.</td></tr>
                <tr><td><code>defaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Open on first render.</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevent toggling.</td></tr>
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
