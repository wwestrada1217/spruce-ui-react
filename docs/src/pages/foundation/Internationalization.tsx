import { useState } from 'react'
import {
  Alert,
  Button,
  Pager,
  SP_I18N_LOCALES,
  SpruceI18nProvider,
  useI18n,
} from 'spruce-react'

function InternationalizationDemo({ onLocaleChange }: { onLocaleChange: (locale: string) => void }) {
  const { locale, direction, isRtl, t, formatDate, formatNumber, setLabels } = useI18n()

  return (
    <div dir={direction} className="demo-card" style={{ display: 'grid', gap: 'var(--sp-space-4)' }}>
      <div style={{ display: 'flex', gap: 'var(--sp-space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          Locale{' '}
          <select value={locale} onChange={e => onLocaleChange(e.target.value)}>
            {SP_I18N_LOCALES.map(item => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}
          </select>
        </label>
        <span><code>{direction}</code>{isRtl ? ' · right to left' : ' · left to right'}</span>
      </div>
      <Alert dismissible title={t('notifications')}>{t('loading')}</Alert>
      <div style={{ display: 'flex', gap: 'var(--sp-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button onClick={() => setLabels({ save: 'Keep changes' })}>{t('save')}</Button>
        <span>{formatDate('2026-08-24')} · {formatNumber(1234567.89)}</span>
      </div>
      <Pager totalItems={42} page={2} pageSize={10} />
    </div>
  )
}

export function InternationalizationPage() {
  const [locale, setLocale] = useState('en-US')

  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Internationalization</h1>
        <p className="page-lead">
          Configure locale, component labels, formatting, and document direction once. Spruce
          component chrome and assistive labels follow the active locale while product-owned copy
          remains controlled by your component props.
        </p>
      </div>

      <section className="doc-section">
        <h2>Setup</h2>
        <p className="section-desc">
          <code>SpruceProvider</code> includes the i18n provider. Use <code>locale</code>,{' '}
          <code>direction</code>, and <code>labels</code> at the application boundary.
        </p>
        <div className="code-block"><pre><code>{`import { SpruceProvider } from 'spruce-react'

<SpruceProvider locale="fr-FR">
  <App />
</SpruceProvider>`}</code></pre></div>
      </section>

      <section className="doc-section">
        <h2>Live locale and RTL preview</h2>
        <p className="section-desc">
          Locale packs provide labels, direction, and the first day of the week. Arabic is shipped
          as an RTL pack; explicit <code>direction</code> can override a pack when an application
          needs a different document direction.
        </p>
        <SpruceI18nProvider key={locale} locale={locale} syncDocument={false}>
          <InternationalizationDemo onLocaleChange={setLocale} />
        </SpruceI18nProvider>
      </section>

      <section className="doc-section">
        <h2>Locale packs</h2>
        <p className="section-desc">
          The package ships typed packs for every locale below. <code>findSpruceLocale('fr-CA')</code>{' '}
          resolves to the French pack while preserving the requested Intl locale.
        </p>
        <table className="token-table" aria-label="Spruce locale packs">
          <thead><tr><th>Locale</th><th>Language</th><th>Direction</th><th>Week starts</th></tr></thead>
          <tbody>
            {SP_I18N_LOCALES.map(item => (
              <tr key={item.code}>
                <td><code>{item.code}</code></td>
                <td>{item.label} · {item.nativeLabel}</td>
                <td>{item.direction}</td>
                <td>{item.firstDayOfWeek === 0 ? 'Sunday' : item.firstDayOfWeek === 1 ? 'Monday' : 'Saturday'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Labels and interpolation</h2>
        <p className="section-desc">
          Use the typed <code>useI18n</code> hook for reusable component chrome. Explicit labels are
          merged over the locale pack and remain in effect when the locale changes.
        </p>
        <div className="code-block"><pre><code>{`import { useI18n } from 'spruce-react'

function Status() {
  const { t, setLabels } = useI18n()
  return (
    <>
      <span>{t('moreNotifications', { count: 3 })}</span>
      <button onClick={() => setLabels({ save: 'Keep changes' })}>
        {t('save')}
      </button>
    </>
  )
}`}</code></pre></div>
        <p className="section-desc">
          Product-specific titles, field labels, and domain messages should still be passed as
          props. Shared actions, picker chrome, empty states, and ARIA names belong to Spruce i18n.
        </p>
      </section>

      <section className="doc-section">
        <h2>Formatting and direction</h2>
        <div className="code-block"><pre><code>{`const {
  formatDate,
  formatTime,
  formatNumber,
  formatRange,
  leadingBlankDays,
  direction,
} = useI18n()

<div dir={direction}>
  {formatDate('2026-08-24')}
  {formatNumber(1234567.89)}
</div>`}</code></pre></div>
        <p className="section-desc">
          The provider synchronizes <code>html[lang]</code> and <code>html[dir]</code> by default.
          Use logical CSS properties such as <code>margin-inline</code> and{' '}
          <code>inset-inline-start</code> in reusable components so RTL layouts preserve reading
          order, focus behavior, and accessible names.
        </p>
      </section>
    </>
  )
}
