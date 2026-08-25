import { useState, useEffect, useRef } from 'react';
import { Popover, Tooltip, Button, Badge } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const POPOVER_BASIC_CODE = `<Popover trigger={<Button>Bottom</Button>} placement="bottom">
  <p>Popover content</p>
</Popover>
<Popover trigger={<Button variant="outline">Top</Button>} placement="top">
  <p>Popover content</p>
</Popover>
<Popover trigger={<Button variant="outline">Right</Button>} placement="right">
  <p>Popover content</p>
</Popover>
<Popover trigger={<Button variant="outline">Left</Button>} placement="left">
  <p>Popover content</p>
</Popover>`;

const POPOVER_DISMISS_CODE = `<Popover
  trigger={<Button>Click outside to close</Button>}
  placement="bottom-start"
  dismissOnClickOutside
>
  <p>Click anywhere outside to dismiss.</p>
</Popover>`;

const POPOVER_HOVER_CODE = `<Popover
  trigger={<Badge variant="info">Hover me</Badge>}
  triggerType="hover"
  placement="top"
  padding="8px 12px"
>
  <p style={{ margin: 0, fontSize: 13 }}>Opens on hover.</p>
</Popover>
<Popover
  trigger={<Button variant="outline" size="sm">Hover</Button>}
  triggerType="hover"
  placement="bottom"
  arrow
>
  <p style={{ margin: 0, fontSize: 13 }}>With arrow on hover.</p>
</Popover>`;

const POPOVER_ARROW_CODE = `<Popover trigger={<Button variant="secondary">Bottom</Button>} placement="bottom" arrow>
  <p>Arrow points up.</p>
</Popover>
<Popover trigger={<Button variant="secondary">Top</Button>} placement="top" arrow>
  <p>Arrow points down.</p>
</Popover>
<Popover trigger={<Button variant="secondary">Right</Button>} placement="right" arrow>
  <p>Arrow points left.</p>
</Popover>
<Popover trigger={<Button variant="secondary">Left</Button>} placement="left" arrow>
  <p>Arrow points right.</p>
</Popover>`;

const TOOLTIP_BASIC_CODE = `<Tooltip content="Top tooltip" placement="top">
  <Button variant="outline" size="sm">Top</Button>
</Tooltip>
<Tooltip content="Bottom tooltip" placement="bottom">
  <Button variant="outline" size="sm">Bottom</Button>
</Tooltip>
<Tooltip content="Left tooltip" placement="left">
  <Button variant="outline" size="sm">Left</Button>
</Tooltip>
<Tooltip content="Right tooltip" placement="right">
  <Button variant="outline" size="sm">Right</Button>
</Tooltip>`;

const TOOLTIP_PLACEMENTS_CODE = `<Tooltip content="Top start" placement="top-start">
  <Button variant="outline" size="sm">top-start</Button>
</Tooltip>
<Tooltip content="Top" placement="top">
  <Button variant="outline" size="sm">top</Button>
</Tooltip>
<Tooltip content="Top end" placement="top-end">
  <Button variant="outline" size="sm">top-end</Button>
</Tooltip>`;

const TOOLTIP_ICONS_CODE = `<Tooltip content="Bold" placement="top">
  <Button variant="ghost" size="sm">B</Button>
</Tooltip>
<Tooltip content="Italic" placement="top">
  <Button variant="ghost" size="sm">I</Button>
</Tooltip>
<Tooltip content="Underline" placement="top">
  <Button variant="ghost" size="sm">U</Button>
</Tooltip>`;

const TOOLTIP_ARROW_CODE = `<Tooltip content="Arrow top" placement="top" arrow>
  <Button variant="secondary" size="sm">Top</Button>
</Tooltip>
<Tooltip content="Arrow bottom" placement="bottom" arrow>
  <Button variant="secondary" size="sm">Bottom</Button>
</Tooltip>
<Tooltip content="Arrow left" placement="left" arrow>
  <Button variant="secondary" size="sm">Left</Button>
</Tooltip>
<Tooltip content="Arrow right" placement="right" arrow>
  <Button variant="secondary" size="sm">Right</Button>
</Tooltip>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'popover',           label: 'Popover' },
  { id: 'popover-dismiss',   label: 'Click Outside' },
  { id: 'popover-hover',     label: 'Hover Trigger' },
  { id: 'popover-arrow',     label: 'With Arrow' },
  { id: 'tooltip',           label: 'Tooltip' },
  { id: 'tooltip-placements',label: 'Tooltip Placements' },
  { id: 'tooltip-icons',     label: 'Tooltip on Icons' },
  { id: 'tooltip-arrow',     label: 'Tooltip with Arrow' },
  { id: 'api',               label: 'API' },
];

export function PopoverPage() {
  const [activeSection, setActiveSection] = useState('popover');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Popover &amp; Tooltip</h1>
        <p className="docs-desc">
          Floating panels and text labels anchored to trigger elements. Supports click and hover triggers,
          optional arrows, automatic viewport flipping, and controlled state.
        </p>

        {/* ─── Popover ─── */}
        <section id="popover" className="demo-section" aria-labelledby="popover-heading">
          <h2 id="popover-heading">Popover</h2>
          <p className="section-desc">
            Click-triggered floating panel anchored to a trigger element. Supports all placement options.
          </p>
          <CodePreview code={POPOVER_BASIC_CODE}>
            <div className="demo-row" style={{ minHeight: 80, alignItems: 'flex-start', paddingTop: 8 }}>
              {(['bottom', 'top', 'right', 'left'] as const).map((p) => (
                <Popover key={p} trigger={<Button variant="outline" size="sm">{p}</Button>} placement={p}>
                  <p style={{ margin: 0, fontSize: 13 }}>Popover on {p}</p>
                </Popover>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="popover-dismiss" className="demo-section" aria-labelledby="popover-dismiss-heading">
          <h2 id="popover-dismiss-heading">Click Outside</h2>
          <p className="section-desc">
            Popover closes automatically when clicking outside the panel.
          </p>
          <CodePreview code={POPOVER_DISMISS_CODE}>
            <div className="demo-row" style={{ minHeight: 80, alignItems: 'flex-start', paddingTop: 8 }}>
              <Popover
                trigger={<Button>Click outside to close</Button>}
                placement="bottom-start"
                dismissOnClickOutside
              >
                <p style={{ margin: 0 }}>Click anywhere outside to dismiss.</p>
              </Popover>
            </div>
          </CodePreview>
        </section>

        <section id="popover-hover" className="demo-section" aria-labelledby="popover-hover-heading">
          <h2 id="popover-hover-heading">Hover Trigger</h2>
          <p className="section-desc">
            Set <code>triggerType="hover"</code> to open on mouse-enter with configurable delays.
          </p>
          <CodePreview code={POPOVER_HOVER_CODE}>
            <div className="demo-row">
              <Popover
                trigger={<Badge variant="info">Hover me</Badge>}
                triggerType="hover"
                placement="top"
                padding="8px 12px"
              >
                <p style={{ margin: 0, fontSize: 13 }}>Opens on hover.</p>
              </Popover>
              <Popover
                trigger={<Button variant="outline" size="sm">Hover</Button>}
                triggerType="hover"
                placement="bottom"
                arrow
              >
                <p style={{ margin: 0, fontSize: 13 }}>With arrow on hover.</p>
              </Popover>
            </div>
          </CodePreview>
        </section>

        <section id="popover-arrow" className="demo-section" aria-labelledby="popover-arrow-heading">
          <h2 id="popover-arrow-heading">With Arrow</h2>
          <p className="section-desc">
            Add the <code>arrow</code> prop to render a directional pointer connecting the panel to its anchor.
          </p>
          <CodePreview code={POPOVER_ARROW_CODE}>
            <div className="demo-row" style={{ minHeight: 80, alignItems: 'flex-start', paddingTop: 8 }}>
              {(['bottom', 'top', 'right', 'left'] as const).map((p) => (
                <Popover key={p} trigger={<Button variant="secondary" size="sm">{p}</Button>} placement={p} arrow>
                  <p style={{ margin: 0, fontSize: 13 }}>Arrow on {p}.</p>
                </Popover>
              ))}
            </div>
          </CodePreview>
        </section>

        {/* ─── Tooltip ─── */}
        <section id="tooltip" className="demo-section" aria-labelledby="tooltip-heading">
          <h2 id="tooltip-heading">Tooltip</h2>
          <p className="section-desc">
            Lightweight text label that appears on hover or keyboard focus. Wrap any element with <code>{'<Tooltip>'}</code>.
          </p>
          <CodePreview code={TOOLTIP_BASIC_CODE}>
            <div className="demo-row">
              {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
                <Tooltip key={p} content={`${p.charAt(0).toUpperCase() + p.slice(1)} tooltip`} placement={p}>
                  <Button variant="outline" size="sm">{p.charAt(0).toUpperCase() + p.slice(1)}</Button>
                </Tooltip>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="tooltip-placements" className="demo-section" aria-labelledby="tooltip-placements-heading">
          <h2 id="tooltip-placements-heading">Tooltip Placements</h2>
          <p className="section-desc">
            Twelve placement options with automatic viewport-aware flipping.
          </p>
          <CodePreview code={TOOLTIP_PLACEMENTS_CODE}>
            <div className="demo-row" style={{ flexWrap: 'wrap' }}>
              {(['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'] as const).map((p) => (
                <Tooltip key={p} content={p} placement={p}>
                  <Button variant="outline" size="sm">{p}</Button>
                </Tooltip>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="tooltip-icons" className="demo-section" aria-labelledby="tooltip-icons-heading">
          <h2 id="tooltip-icons-heading">Tooltip on Icons</h2>
          <p className="section-desc">
            Use tooltips on icon-only buttons for accessibility, providing a text label for screen readers and sighted users.
          </p>
          <CodePreview code={TOOLTIP_ICONS_CODE}>
            <div className="demo-row">
              <Tooltip content="Bold" placement="top">
                <Button variant="ghost" size="sm"><strong>B</strong></Button>
              </Tooltip>
              <Tooltip content="Italic" placement="top">
                <Button variant="ghost" size="sm"><em>I</em></Button>
              </Tooltip>
              <Tooltip content="Underline" placement="top">
                <Button variant="ghost" size="sm"><u>U</u></Button>
              </Tooltip>
            </div>
          </CodePreview>
        </section>

        <section id="tooltip-arrow" className="demo-section" aria-labelledby="tooltip-arrow-heading">
          <h2 id="tooltip-arrow-heading">Tooltip with Arrow</h2>
          <p className="section-desc">
            Add <code>arrow</code> to render a small directional pointer.
          </p>
          <CodePreview code={TOOLTIP_ARROW_CODE}>
            <div className="demo-row">
              {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
                <Tooltip key={p} content={`Arrow ${p}`} placement={p} arrow>
                  <Button variant="secondary" size="sm">{p.charAt(0).toUpperCase() + p.slice(1)}</Button>
                </Tooltip>
              ))}
            </div>
          </CodePreview>
        </section>

        {/* ─── API ─── */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Popover Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>trigger</code></td><td><code>ReactNode</code></td><td>—</td><td>Element that opens the popover</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Panel content</td></tr>
                <tr><td><code>placement</code></td><td><code>Placement</code></td><td><code>'bottom'</code></td><td>Preferred position</td></tr>
                <tr><td><code>triggerType</code></td><td><code>'click' | 'hover'</code></td><td><code>'click'</code></td><td>Interaction type</td></tr>
                <tr><td><code>offset</code></td><td><code>number</code></td><td><code>6</code></td><td>Gap between trigger and panel</td></tr>
                <tr><td><code>arrow</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show directional arrow</td></tr>
                <tr><td><code>dismissOnClickOutside</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close on outside click</td></tr>
                <tr><td><code>dismissOnScroll</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close on scroll; reposition when false</td></tr>
                <tr><td><code>constrainToModal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Keep the panel inside the nearest modal</td></tr>
                <tr><td><code>anchorRect</code></td><td><code>DOMRectReadOnly | null</code></td><td><code>null</code></td><td>Use an explicit pointer/context-menu anchor rectangle</td></tr>
                <tr><td><code>padding</code></td><td><code>string</code></td><td>—</td><td>Override panel padding</td></tr>
                <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled open state</td></tr>
                <tr><td><code>onOpenChange</code></td><td><code>(open: boolean) =&gt; void</code></td><td>—</td><td>Open state change callback</td></tr>
                <tr><td><code>hoverDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>ms before opening on hover</td></tr>
                <tr><td><code>hoverCloseDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>ms before closing on hover-out</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>Tooltip Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>Tooltip text</td></tr>
                <tr><td><code>placement</code></td><td><code>Placement</code></td><td><code>'top'</code></td><td>Preferred position</td></tr>
                <tr><td><code>offset</code></td><td><code>number</code></td><td><code>6</code></td><td>Gap between anchor and tooltip</td></tr>
                <tr><td><code>arrow</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show directional arrow</td></tr>
                <tr><td><code>delay</code></td><td><code>number</code></td><td><code>200</code></td><td>Initial hover/focus delay in milliseconds</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Trigger element</td></tr>
              </tbody>
            </table>
          </div>

          <p className="section-desc">Wrap related controls in <code>TooltipGroup</code> to warm the delay after the first tooltip and keep one tooltip visible at a time.</p>

          <h3 style={{ marginTop: 16 }}>Placement values</h3>
          <p className="section-desc">
            <code>top</code> | <code>top-start</code> | <code>top-end</code> |{' '}
            <code>bottom</code> | <code>bottom-start</code> | <code>bottom-end</code> |{' '}
            <code>left</code> | <code>left-start</code> | <code>left-end</code> |{' '}
            <code>right</code> | <code>right-start</code> | <code>right-end</code>
          </p>
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
