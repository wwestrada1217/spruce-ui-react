import { useState } from 'react'
import { Alert, Button, Pager, SP_I18N_LOCALES, SpruceI18nProvider, useI18n } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

const PRINCIPLES = [
  ['One Application Contract', 'Configure locale, labels, formatting, and direction once at the application boundary so every component reads the same language context.'],
  ['Local Copy Still Wins', 'Product-specific titles, field labels, and domain messages remain controlled by the consuming application.'],
  ['Accessible By Default', 'Shared labels include component chrome and assistive-technology text, keeping reusable controls localizable.'],
]

const GUIDANCE = [
  ['No Hard-Coded Strings', 'Resolve every user-visible string through i18n, including aria-label, title, placeholder, and empty states. A component that hard-codes English cannot be localized.'],
  ['Locale-Resolved Input Defaults', 'Use locale defaults for shared component labels while allowing an explicit prop to override product-specific copy.'],
  ['Expose Meaningful Inputs', 'Let consumers provide labels and descriptions when the surrounding workflow gives a phrase more meaning than a generic default.'],
  ['Use The Provider For Chrome', 'Shared actions, picker chrome, empty states, and ARIA names belong to Spruce i18n.'],
  ['Design For Expansion', 'Allow translated labels to grow; avoid fixed widths and truncation that only work for English.'],
  ['Prefer Logical Layout', 'Use logical CSS properties such as margin-inline and inset-inline-start so RTL layouts preserve reading order and placement.'],
]

const I18N_DEMO_CODE = `const { locale, direction, t, formatDate, formatNumber } = useI18n()

<div dir={direction}>
  <Alert title={t('notifications')}>{t('loading')}</Alert>
  <Button>{t('save')}</Button>
  <span>{formatDate('2026-08-24')} · {formatNumber(1234567.89)}</span>
  <Pager totalItems={42} page={2} pageSize={10} />
</div>`

function InternationalizationDemo({ onLocaleChange }: { onLocaleChange: (locale: string) => void }) {
  const { locale, direction, isRtl, t, formatDate, formatNumber, setLabels } = useI18n()
  return <div dir={direction} className="demo-card" style={{ display: 'grid', gap: 'var(--sp-space-4)' }}>
    <div style={{ display: 'flex', gap: 'var(--sp-space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
      <label>Locale <select value={locale} onChange={e => onLocaleChange(e.target.value)}>{SP_I18N_LOCALES.map(item => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}</select></label>
      <span><code>{direction}</code>{isRtl ? ' · right to left' : ' · left to right'}</span>
    </div>
    <Alert dismissible title={t('notifications')}>{t('loading')}</Alert>
    <div style={{ display: 'flex', gap: 'var(--sp-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button onClick={() => setLabels({ save: 'Keep changes' })}>{t('save')}</Button>
      <span>{formatDate('2026-08-24')} · {formatNumber(1234567.89)}</span>
    </div>
    <Pager totalItems={42} page={2} pageSize={10} />
  </div>
}

export function InternationalizationPage() {
  const [locale, setLocale] = useState('en-US')
  return <FoundationPageShell variant="internationalization" title="Internationalization" description="Every Spruce component resolves its own text through Spruce i18n: visible labels, placeholders, empty states, tooltips, and assistive-technology labels. Pick a language and the whole library follows, including document direction and date formatting.">
    <div className="page-header"><p className="page-tag">Foundation</p><h1>Internationalization</h1><p className="page-lead">Every Spruce component resolves its own text through Spruce i18n: visible labels, placeholders, empty states, tooltips, and assistive-technology labels. Pick a language and the whole library follows, including document direction and date formatting.</p></div>

    <section id="overview" className="doc-section"><h2>Overview</h2><p className="section-desc">Configure i18n once at the application boundary. Components use the shared SpruceI18nProvider for default labels, date formatting, calendar labels, and direction-aware document metadata while still allowing local inputs for product-specific copy.</p><div className="principles-grid">{PRINCIPLES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>

    <section id="languages" className="doc-section"><h2>Languages</h2><p className="section-desc">These languages ship with Spruce. Each one carries a complete set of component labels, its writing direction, and the day its week starts on. Selecting a locale applies all three, and individual labels can still be overridden on top.</p><table className="token-table" aria-label="Spruce locale packs"><thead><tr><th>Locale</th><th>Language</th><th>Direction</th><th>Week starts</th></tr></thead><tbody>{SP_I18N_LOCALES.map(item => <tr key={item.code}><td><code>{item.code}</code></td><td>{item.label} · {item.nativeLabel}</td><td>{item.direction}</td><td>{item.firstDayOfWeek === 0 ? 'Sunday' : item.firstDayOfWeek === 1 ? 'Monday' : 'Saturday'}</td></tr>)}</tbody></table><p className="section-desc">Add a language by providing a typed pack with the component labels, direction, and first day of week, then register it with the locale list.</p></section>

    <section id="setup" className="doc-section"><h2>Setup</h2><p className="section-desc">Wrap the application with <code>SpruceI18nProvider</code> next to your application providers. Naming a locale that ships with Spruce also applies that language's labels, direction, and first day of week. The provider keeps <code>html lang</code> and <code>dir</code> synchronized for assistive technology.</p><div className="code-block"><pre><code>{`import { SpruceI18nProvider } from 'spruce-react'

<SpruceI18nProvider locale="fr-FR">
  <App />
</SpruceI18nProvider>`}</code></pre></div></section>

    <section id="labels" className="doc-section"><h2>Labels</h2><p className="section-desc"><code>SpruceI18nLabels</code> covers every string the components own. Override only the shared chrome that needs product-specific wording; product titles and domain messages should remain in the consuming component.</p><div className="code-block"><pre><code>{`import { useI18n } from 'spruce-react'

function Status() {
  const { t, setLabels } = useI18n()
  return <>
    <span>{t('moreNotifications', { count: 3 })}</span>
    <button type="button" onClick={() => setLabels({ save: 'Keep changes' })}>
      {t('save')}
    </button>
  </>
}`}</code></pre></div></section>

    <section id="formatting" className="doc-section"><h2>Formatting</h2><p className="section-desc">Use the locale's Intl configuration for dates, times, numbers, and ranges so formatting follows the selected language rather than a browser-specific default.</p><div className="code-block"><pre><code>{`const { formatDate, formatTime, formatNumber, formatRange } = useI18n()

formatDate('2026-08-24')
formatTime('14:30')
formatNumber(1234567.89)
formatRange(startDate, endDate)`}</code></pre></div></section>

    <section id="rtl" className="doc-section"><h2>Direction</h2><p className="section-desc">Set <code>direction: 'rtl'</code> for right-to-left locales. Spruce synchronizes the document direction and component layout. Use logical CSS properties instead of hard-coded left and right positioning so navigation, focus behavior, and reading order remain correct.</p><CodePreview code={I18N_DEMO_CODE} language="typescript"><SpruceI18nProvider key={locale} locale={locale} syncDocument={false}><InternationalizationDemo onLocaleChange={setLocale} /></SpruceI18nProvider></CodePreview></section>

    <section id="component-guidance" className="doc-section"><h2>Component Guidance</h2><div className="principles-grid">{GUIDANCE.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>
  </FoundationPageShell>
}
