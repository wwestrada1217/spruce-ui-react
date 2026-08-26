import { useState } from 'react';
import { Button, EntitlementsProvider, FeatureGate, FeatureLocked } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function FeatureGatePage() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Entitlements and Feature Gate</h1>
        <p className="docs-desc">Fail-closed feature access for plan-aware interfaces, with a provider, hooks, a gate, and a themed locked state.</p>

        <section id="gate" className="demo-section">
          <h2>Controlled entitlement gate</h2>
          <CodePreview code={'<EntitlementsProvider features={features}><FeatureGate feature="advancedReports" fallback={<FeatureLocked>...</FeatureLocked>}>...</FeatureGate></EntitlementsProvider>'}>
            <EntitlementsProvider features={enabled ? [{ key: 'advancedReports', limit: null }] : []} plan={enabled ? 'Growth' : 'Starter'}>
              <FeatureGate feature="advancedReports" fallback={<FeatureLocked><Button size="sm" onClick={() => setEnabled(true)}>Upgrade plan</Button></FeatureLocked>}>
                <div className="docs-callout"><strong>Advanced reports unlocked</strong><p>Query, export, and schedule reports for your team.</p></div>
              </FeatureGate>
            </EntitlementsProvider>
          </CodePreview>
        </section>

        <section id="provider" className="demo-section">
          <h2>Loading from an API</h2>
          <p className="section-desc">Use <code>EntitlementsProvider</code> with <code>url</code> or a custom <code>fetcher</code> when entitlements come from a session service. The gate remains closed until the response is loaded.</p>
          <CodePreview code={'<EntitlementsProvider url="/api/v1/me/entitlements"><FeatureGate feature="exports">...</FeatureGate></EntitlementsProvider>'}>
            <p>Use the provider's <code>load</code>, <code>refresh</code>, and <code>error</code> state to connect host-level retry UI.</p>
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility and security</h2>
          <p className="section-desc">Gated content is removed from the tree when unavailable; locked content is a labelled note with a clear action. Access checks are UI affordances, not authorization—enforce the entitlement again on the server.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>API</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>EntitlementsProvider.features</code></td><td><code>EntitlementFeature[]</code></td><td>—</td><td>Controlled feature set; each item can include a limit.</td></tr>
            <tr><td><code>EntitlementsProvider.url</code> / <code>fetcher</code></td><td><code>string</code> / async callback</td><td><code>/api/v1/me/entitlements</code> / fetch</td><td>Load entitlement data from a service.</td></tr>
            <tr><td><code>useEntitlements()</code></td><td>context value</td><td>fail-closed</td><td>Read features, plan, status, loading/error, <code>has</code>, <code>limitFor</code>, and <code>load</code>.</td></tr>
            <tr><td><code>useHasFeature(feature)</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Convenience access check.</td></tr>
            <tr><td><code>FeatureGate</code> / <code>FeatureLocked</code></td><td>components</td><td>—</td><td>Render gated content or an upgrade affordance.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#gate">Gate</a></li><li><a className="toc-link" href="#provider">Provider</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
