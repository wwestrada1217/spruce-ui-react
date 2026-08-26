import { useState } from 'react'
import { CompanySwitcher, type CompanyOption, AppHeader } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const COMPANIES: readonly CompanyOption[] = [
  { id: 'acme-ph', name: 'Acme Manufacturing PH', code: 'ACME-PH', role: 'owner' },
  { id: 'acme-sg', name: 'Acme Distribution SG', code: 'ACME-SG', role: 'manager' },
  { id: 'northwind', name: 'Northwind Logistics', code: 'NWL', role: 'member' },
]

const BASIC_CODE = `const [companyId, setCompanyId] = useState<string | null>('acme-ph')

<CompanySwitcher
  companies={companies}
  activeCompanyId={companyId}
  onCompanyChange={setCompanyId}
/>`

const HEADER_CODE = `<AppHeader showToggle={false} headerEnd={
  <CompanySwitcher
    companies={companies}
    activeCompanyId={companyId}
    onCompanyChange={setCompanyId}
  />
}>
  Inventory
</AppHeader>`

export function CompanySwitcherPage() {
  const [companyId, setCompanyId] = useState<string | null>('acme-ph')
  const activeName = COMPANIES.find((company) => company.id === companyId)?.name ?? 'none'

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Company Switcher</h1>
        <p className="docs-desc">A presentational, controlled company selector for app headers and workspace shells. The host owns the active company and reacts to <code>onCompanyChange</code>.</p>

        <section className="demo-section" aria-labelledby="company-basic-heading">
          <h2 id="company-basic-heading">Basic</h2>
          <p className="section-desc">Multiple companies render a listbox popover with code, role, and selected state.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <div className="company-demo-frame">
              <CompanySwitcher companies={COMPANIES} activeCompanyId={companyId} onCompanyChange={setCompanyId} />
              <p className="company-demo-note">Active: {activeName}</p>
            </div>
          </CodePreview>
        </section>

        <section className="demo-section" aria-labelledby="company-single-heading">
          <h2 id="company-single-heading">Single Company</h2>
          <p className="section-desc">A single option becomes a non-interactive label; an empty list renders nothing.</p>
          <CodePreview code={'<CompanySwitcher companies={[{ id: \'acme\', name: \'Acme Inc.\' }]} />'} language="typescript">
            <div className="company-demo-frame"><CompanySwitcher companies={[{ id: 'acme', name: 'Acme Inc.' }]} activeCompanyId="acme" /></div>
          </CodePreview>
        </section>

        <section className="demo-section" aria-labelledby="company-header-heading">
          <h2 id="company-header-heading">In an App Header</h2>
          <CodePreview code={HEADER_CODE} language="typescript">
            <AppHeader showToggle={false} headerEnd={<CompanySwitcher companies={COMPANIES} activeCompanyId={companyId} onCompanyChange={setCompanyId} />}>
              Inventory
            </AppHeader>
          </CodePreview>
        </section>

        <section className="demo-section" aria-labelledby="company-api-heading">
          <h2 id="company-api-heading">API</h2>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>companies</code></td><td><code>readonly CompanyOption[]</code></td><td><code>[]</code></td><td>Companies available to the viewer.</td></tr>
                <tr><td><code>activeCompanyId</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Controlled active company id.</td></tr>
                <tr><td><code>onCompanyChange</code></td><td><code>(id: string) =&gt; void</code></td><td>—</td><td>Called only when a different company is selected.</td></tr>
                <tr><td><code>label</code></td><td><code>string</code></td><td>localized</td><td>Accessible name for the trigger and listbox.</td></tr>
                <tr><td><code>open</code> / <code>onOpenChange</code></td><td><code>boolean</code> / callback</td><td>uncontrolled</td><td>Optional controlled popover visibility.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="section-desc">The trigger exposes <code>aria-haspopup="listbox"</code>; options use <code>aria-selected</code> and support Arrow, Home, and End keys. Placement follows the active RTL direction.</p>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list"><li><a className="toc-link" href="#company-basic-heading">Basic</a></li><li><a className="toc-link" href="#company-single-heading">Single Company</a></li><li><a className="toc-link" href="#company-header-heading">In an App Header</a></li><li><a className="toc-link" href="#company-api-heading">API</a></li></ul>
      </nav>
    </div>
  )
}
