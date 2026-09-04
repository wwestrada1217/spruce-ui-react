import { useState } from 'react';
import { Badge, Button, Icon } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import type { CodeFile } from '../../components/CodePreview';
import { BlockPageLayout, type BlockPageSection } from './BlockPageLayout';

export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface PrivacyPreferences {
  readonly status: ConsentStatus;
  readonly analytics: boolean;
  readonly timestamp: string;
}

const STORAGE_KEY = 'sp_privacy_consent';
const SECTIONS: readonly BlockPageSection[] = [
  { id: 'banner-block', label: 'Consent Banner' },
  { id: 'implementation', label: 'Implementation' },
];

const COOKIE_FILES: CodeFile[] = [
  {
    label: 'PrivacyConsentBanner.tsx',
    language: 'typescript',
    code: `import { Badge, Button, Icon } from 'spruce-react';

export type ConsentStatus = 'granted' | 'denied' | 'pending';

export function PrivacyConsentBanner({
  status,
  onAcceptAll,
  onEssentialOnly,
}: {
  status: ConsentStatus;
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
}) {
  return (
    <section aria-label="Privacy consent">
      <Icon name="shield" aria-hidden="true" />
      <h2>Privacy & Cookies</h2>
      <p>Choose whether optional analytics telemetry may be stored.</p>
      <Badge variant={status === 'granted' ? 'success' : 'warning'}>{status}</Badge>
      <Button variant="ghost" onClick={onEssentialOnly}>Essential Only</Button>
      <Button variant="primary" onClick={onAcceptAll}>Accept All</Button>
    </section>
  );
}`,
  },
  {
    label: 'privacy-consent.ts',
    language: 'typescript',
    code: `export interface PrivacyPreferences {
  status: 'granted' | 'denied' | 'pending';
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'sp_privacy_consent';

export function saveConsent(analytics: boolean): PrivacyPreferences {
  const preferences = {
    status: analytics ? 'granted' : 'denied',
    analytics,
    timestamp: new Date().toISOString(),
  } as const;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  return preferences;
}`,
  },
  {
    label: 'usage.tsx',
    language: 'typescript',
    code: `<PrivacyConsentBanner
  status={preferences.status}
  onAcceptAll={() => setPreferences(saveConsent(true))}
  onEssentialOnly={() => setPreferences(saveConsent(false))}
/>`,
  },
];

function readStoredPreferences(): PrivacyPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) throw new Error('No consent preference');
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid consent preference');
    const candidate = parsed as Partial<PrivacyPreferences>;
    if (candidate.status !== 'granted' && candidate.status !== 'denied') throw new Error('Invalid consent status');
    return {
      status: candidate.status,
      analytics: candidate.analytics === true,
      timestamp: typeof candidate.timestamp === 'string' ? candidate.timestamp : new Date().toISOString(),
    };
  } catch {
    return { status: 'pending', analytics: false, timestamp: new Date().toISOString() };
  }
}

function statusLabel(status: ConsentStatus): string {
  if (status === 'granted') return 'Granted (All Cookies)';
  if (status === 'denied') return 'Denied (Essential Only)';
  return 'Pending Choice';
}

export function CookieConsentBlockPage() {
  const [preferences, setPreferences] = useState<PrivacyPreferences>(readStoredPreferences);
  const [showDetails, setShowDetails] = useState(false);

  function updateConsent(status: Exclude<ConsentStatus, 'pending'>): void {
    const next: PrivacyPreferences = {
      status,
      analytics: status === 'granted',
      timestamp: new Date().toISOString(),
    };
    setPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Privacy controls remain usable when storage is blocked or unavailable.
    }
  }

  function resetConsent(): void {
    const next: PrivacyPreferences = { status: 'pending', analytics: false, timestamp: new Date().toISOString() };
    setPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the in-memory state as the source of truth for this preview.
    }
  }

  const badgeVariant = preferences.status === 'granted'
    ? 'success'
    : preferences.status === 'denied' ? 'default' : 'warning';

  return (
    <BlockPageLayout
      title="Privacy & Cookie Consent Block"
      description="An enterprise-ready privacy consent banner for GDPR/CCPA compliance, featuring essential versus analytics consent options and persistent storage."
      sections={SECTIONS}
    >
      <div className="sp-block-cookie__status" role="status" aria-live="polite">
        <span className="sp-block-cookie__status-label">Current Privacy Consent:</span>
        <Badge variant={badgeVariant} size="sm">{statusLabel(preferences.status)}</Badge>
        <Button variant="ghost" size="sm" onClick={resetConsent}>Reset Consent State</Button>
      </div>

      <section id="banner-block" className="demo-section" aria-labelledby="banner-heading">
        <h2 id="banner-heading">Interactive Consent Banner Preview</h2>
        <div className="sp-block-cookie__preview">
          <section className="sp-block-cookie__banner" aria-label="Privacy Consent Block">
            <div className="sp-block-cookie__heading">
              <div className="sp-block-cookie__icon"><Icon name="shield" size={20} aria-hidden="true" /></div>
              <div>
                <h3>Privacy &amp; Cookies</h3>
                <p>We use cookies and telemetry analytics to evaluate usage, measure performance, and personalize documentation tools.</p>
              </div>
            </div>

            {showDetails && (
              <div id="cookie-preferences" className="sp-block-cookie__details">
                <div className="sp-block-cookie__detail"><span><strong>Essential Storage</strong> (Theme, locale, navigation)</span><Badge variant="success" size="sm">Required</Badge></div>
                <div className="sp-block-cookie__detail"><span><strong>Analytics Telemetry</strong> (Pageviews and usage logs)</span><Badge size="sm">Optional</Badge></div>
              </div>
            )}

            <div className="sp-block-cookie__actions">
              <Button variant="ghost" size="sm" aria-expanded={showDetails} aria-controls="cookie-preferences" onClick={() => setShowDetails((visible) => !visible)}>
                {showDetails ? 'Hide details' : 'Preferences'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => updateConsent('denied')}>Essential Only</Button>
              <Button variant="primary" size="sm" onClick={() => updateConsent('granted')}>Accept All</Button>
            </div>
          </section>
        </div>
      </section>

      <section id="implementation" className="demo-section" aria-labelledby="implementation-heading">
        <h2 id="implementation-heading">Implementation Code</h2>
        <p className="section-desc">Keep essential storage available for theme, locale, and navigation while writing the optional analytics decision to a durable preference store.</p>
        <CodePreview files={COOKIE_FILES} codeOnly title="Consent state and banner" />
      </section>
    </BlockPageLayout>
  );
}
