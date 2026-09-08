import { Button, Card, Input } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { DocsApiTable, DocsPageLayout } from '../../components/DocsPageLayout';
import { DocsI18nPicker, useDocsI18n } from '../../components/DocsI18n';
import { DocsMobilePreview } from '../../components/DocsMobilePreview';
import { DocsPackageBadge } from '../../components/DocsPackageBadge';
import { DocsSectionScrubber } from '../../components/DocsSectionScrubber';
import './DocsPlatformPage.css';

const SECTIONS = [
  { id: 'overview', label: 'Overview', description: 'How the docs platform pieces fit together.' },
  { id: 'preview', label: 'Code Preview', description: 'Live previews, source files, and copyable examples.' },
  { id: 'scrubber', label: 'Section navigation', description: 'Deep links with pointer and keyboard navigation.' },
  { id: 'mobile', label: 'Mobile preview', description: 'A fixed phone shell for touch-sized examples.' },
  { id: 'i18n', label: 'Docs i18n', description: 'Locale, direction, first-day, and document synchronization.' },
  { id: 'a11y', label: 'Accessibility', description: 'The minimum checks required for documentation examples.' },
  { id: 'api', label: 'API', description: 'Public contracts for the shared docs helpers.' },
] as const;

const PREVIEW_CODE = `import { Button } from 'spruce-react';

export function Example() {
  return <Button variant="primary">Save changes</Button>;
}`;

const MULTI_FILE_CODE = `export function Demo() {
  return <button className="demo-button">Run</button>;
}`;

const MULTI_FILE_CSS = `.demo-button {
  min-block-size: 32px;
  padding-inline: 12px;
}`;

const PACKAGE_ROWS = [
  { name: 'packageName', type: 'string', defaultValue: '—', description: 'Package entry point displayed below a page heading.' },
  { name: 'symbols', type: 'readonly string[]', defaultValue: '[]', description: 'Named exports used to form the copied import statement.' },
] as const;

const SCRUBBER_ROWS = [
  { name: 'sections', type: 'readonly DocsScrubberSection[]', defaultValue: 'required', description: 'Ordered section ids, labels, and optional preview descriptions.' },
  { name: 'rowHeight / restLength / peakLength', type: 'number', defaultValue: '24 / 14 / 54', description: 'Rail geometry and pointer magnification settings.' },
  { name: 'radius', type: 'number', defaultValue: '4', description: 'Number of rows affected by pointer magnification.' },
] as const;

const MOBILE_ROWS = [
  { name: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Touch-sized content rendered inside the phone screen.' },
  { name: 'align', type: "'top' | 'center' | 'bottom' | 'fill'", defaultValue: "'top'", description: 'Vertical alignment for short content.' },
  { name: 'statusBar / time', type: 'boolean / string', defaultValue: 'true / 9:41', description: 'iOS-style status bar visibility and clock text.' },
] as const;

const I18N_ROWS = [
  { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'BCP 47 locale used for labels and Intl formatting.' },
  { name: 'direction', type: "'ltr' | 'rtl'", defaultValue: "'ltr'", description: 'Reading direction for the shell and demos.' },
  { name: 'firstDayOfWeek', type: 'number', defaultValue: '0', description: 'Calendar week start, from Sunday (0) to Saturday (6).' },
  { name: 'syncDocument', type: 'boolean', defaultValue: 'true', description: 'Synchronize document lang and dir attributes.' },
] as const;

const CODE_ROWS = [
  { name: 'code / language', type: 'string / CodeLanguage', defaultValue: "'' / 'typescript'", description: 'Single-file source shorthand.' },
  { name: 'files', type: 'CodeFile[]', defaultValue: '—', description: 'Multi-file source tabs; takes precedence over code and language.' },
  { name: 'title', type: 'string', defaultValue: '—', description: 'Optional toolbar caption.' },
  { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'Reduce preview padding.' },
  { name: 'codeOnly', type: 'boolean', defaultValue: 'false', description: 'Render only the source panel.' },
  { name: 'children', type: 'ReactNode', defaultValue: '—', description: 'Rendered live preview.' },
] as const;

export function DocsPlatformPage() {
  const docs = useDocsI18n();

  return (
    <DocsPageLayout title="Documentation Platform" description="The shared React docs infrastructure for discoverable, copyable, responsive, localized, and accessible examples." sections={SECTIONS} packageName="spruce-react" symbols={['CodePreview', 'DocsMobilePreview']}>
      <section id="overview" className="demo-section" aria-labelledby="docs-platform-overview-heading">
        <h2 id="docs-platform-overview-heading">Overview</h2>
        <p className="section-desc">Every page can expose its entry point, metadata, live source, section deep links, and accessibility guidance without reimplementing the docs shell.</p>
        <div className="demo-row">
          <DocsPackageBadge packageName="spruce-react" symbols={['Button', 'Card']} />
          <span className="docs-platform-meta">Search metadata includes descriptions and aliases.</span>
        </div>
      </section>

      <section id="preview" className="demo-section" aria-labelledby="docs-platform-preview-heading">
        <h2 id="docs-platform-preview-heading">Code Preview</h2>
        <p className="section-desc">Use the live preview for the default case, multi-file tabs when styles or supporting data matter, and code-only mode for API snippets.</p>
        <CodePreview title="Single-file preview" code={PREVIEW_CODE} language="typescript">
          <div className="demo-row"><Button variant="primary">Save changes</Button></div>
        </CodePreview>
        <CodePreview title="Multi-file preview" files={[{ label: 'Demo.tsx', language: 'typescript', code: MULTI_FILE_CODE }, { label: 'Demo.css', language: 'css', code: MULTI_FILE_CSS }]}>
          <button type="button" className="docs-platform-demo-button">Run</button>
        </CodePreview>
        <CodePreview codeOnly code={PREVIEW_CODE} language="typescript" />
      </section>

      <section id="scrubber" className="demo-section" aria-labelledby="docs-platform-scrubber-heading">
        <h2 id="docs-platform-scrubber-heading">Section navigation and deep links</h2>
        <p className="section-desc">The rail tracks visible sections, magnifies around the pointer, roves with Arrow keys/Home/End, and writes the selected section to the URL fragment. Try the navigation rail on the right, then reload a copied <code>#api</code> link.</p>
        <div className="docs-platform-scrubber-demo">
          <DocsSectionScrubber sections={SECTIONS.slice(0, 3)} ariaLabel="Section navigation example" />
          <Card>
            <strong>Keyboard contract</strong>
            <p>Only the active tick is in the tab order. Arrow keys move between sections and preserve focus after scrolling.</p>
          </Card>
        </div>
      </section>

      <section id="mobile" className="demo-section" aria-labelledby="docs-platform-mobile-heading">
        <h2 id="docs-platform-mobile-heading">Mobile preview</h2>
        <p className="section-desc">The device stays at a readable phone scale on desktop, while its content scrolls within the screen. On narrow viewports the shell scales to fit.</p>
        <DocsMobilePreview align="center">
          <div className="docs-platform-mobile-demo">
            <span className="docs-platform-mobile-demo__eyebrow">Spruce Mobile</span>
            <strong>Welcome back</strong>
            <Input aria-label="Email address" placeholder="Email address" />
            <Button fullWidth variant="primary">Continue</Button>
          </div>
        </DocsMobilePreview>
      </section>

      <section id="i18n" className="demo-section" aria-labelledby="docs-platform-i18n-heading">
        <h2 id="docs-platform-i18n-heading">Documentation i18n</h2>
        <p className="section-desc">The docs shell delegates component labels and Intl formatting to SpruceI18nProvider, then adds translated shell strings. Switch locale or direction to verify the document contract.</p>
        <div className="docs-platform-i18n-demo">
          <DocsI18nPicker />
          <output aria-live="polite">{docs.locale} · {docs.direction.toUpperCase()} · {docs.formatNumber(1234567)}</output>
        </div>
      </section>

      <section id="a11y" className="demo-section" aria-labelledby="docs-platform-a11y-heading">
        <h2 id="docs-platform-a11y-heading">Accessibility guidance</h2>
        <ul className="docs-platform-checklist">
          <li><strong>Landmarks:</strong> one main landmark, a labelled navigation, and a skip target.</li>
          <li><strong>Keyboard:</strong> every demo action is operable with Tab, Enter/Space, and documented shortcuts.</li>
          <li><strong>Focus:</strong> use visible focus rings, roving tab stops for rails, and restore focus for overlays.</li>
          <li><strong>Motion:</strong> honor <code>prefers-reduced-motion</code> for scrolling, transitions, and decorative previews.</li>
          <li><strong>Themes:</strong> verify light, dark, RTL, forced colors, and narrow/mobile layouts.</li>
          <li><strong>Verification:</strong> run axe checks and interaction tests for each new docs helper.</li>
        </ul>
      </section>

      <section id="api" className="demo-section" aria-labelledby="docs-platform-api-heading">
        <h2 id="docs-platform-api-heading">API</h2>
        <h3>DocsPackageBadge</h3><DocsApiTable rows={PACKAGE_ROWS} />
        <h3>DocsSectionScrubber</h3><DocsApiTable rows={SCRUBBER_ROWS} />
        <h3>DocsMobilePreview</h3><DocsApiTable rows={MOBILE_ROWS} />
        <h3>DocsI18nProvider</h3><DocsApiTable rows={I18N_ROWS} />
        <h3>CodePreview</h3><DocsApiTable rows={CODE_ROWS} />
      </section>
    </DocsPageLayout>
  );
}
