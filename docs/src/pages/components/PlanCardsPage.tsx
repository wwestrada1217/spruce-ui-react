import { useState } from 'react';
import { PlanCards, type PlanCardModel } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const PLANS: PlanCardModel[] = [
  { value: 'starter', name: 'Starter', tagline: 'For small teams getting moving.', capacity: '5 users', groups: [{ label: 'Includes', features: ['Shared workspace', 'Basic reporting'] }], ctaLabel: 'Choose Starter' },
  { value: 'growth', name: 'Growth', badge: 'Popular', recommended: true, tagline: 'For teams shipping every week.', capacity: '25 users', groups: [{ label: 'Everything in Starter, plus', features: ['Advanced reporting', 'Priority support'] }], ctaLabel: 'Choose Growth' },
  { value: 'scale', name: 'Scale', tagline: 'For organizations with complex needs.', capacity: 'Unlimited users', groups: [{ label: 'Includes', features: ['SAML SSO', 'Audit exports'] }], ctaLabel: 'Talk to sales' },
];

export function PlanCardsPage() {
  const [selected, setSelected] = useState<string | number | null>(null);
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Plan Cards</h1>
        <p className="docs-desc">Responsive pricing and plan-selection cards with recommended treatment, grouped features, actions, icons, and loading skeletons.</p>

        <section id="overview" className="demo-section">
          <h2>Overview and selection</h2>
          <CodePreview code={'<PlanCards plans={plans} onPlanSelect={(plan) => setSelected(plan.value)} />'}>
            <PlanCards plans={PLANS} onPlanSelect={(plan) => setSelected(plan.value ?? plan.name)} />
            <p className="section-desc" role="status">{selected ? `Selected: ${selected}` : 'Select a plan to continue.'}</p>
          </CodePreview>
        </section>

        <section id="loading" className="demo-section">
          <h2>Loading state</h2>
          <CodePreview code={'<PlanCards loading skeletonCount={3} />'}>
            <PlanCards loading skeletonCount={3} />
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">Plan cards use article headings, visible recommended status, native buttons, responsive logical layout, and reduced-motion-safe skeletons. Provide concise localized labels in the plan model when your product language changes.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>plans</code></td><td><code>PlanCardModel[]</code></td><td><code>[]</code></td><td>Plan names, taglines, capacity, groups, badge, and CTA data.</td></tr>
            <tr><td><code>onPlanSelect</code></td><td><code>(plan) =&gt; void</code></td><td>—</td><td>Selection callback with the full plan model.</td></tr>
            <tr><td><code>loading</code> / <code>skeletonCount</code></td><td><code>boolean</code> / <code>number</code></td><td><code>false</code> / <code>4</code></td><td>Responsive loading skeleton mode.</td></tr>
            <tr><td><code>recommendedLabel</code></td><td><code>string</code></td><td>localized</td><td>Accessible/localized label for recommended plans.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#overview">Overview</a></li><li><a className="toc-link" href="#loading">Loading</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
