import { strict as assert } from 'node:assert'
import test from 'node:test'
import { createRequire } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

globalThis.require = createRequire(import.meta.url)

const {
  Alert,
  SP_I18N_LOCALES,
  SpruceProvider,
  applyI18nToDocument,
  findSpruceLocale,
  useI18n,
} = await import('../dist/spruce-react.es.js')

test('ships the Angular core locale inventory and metadata', () => {
  assert.equal(SP_I18N_LOCALES.length, 15)
  assert.deepEqual(SP_I18N_LOCALES.map(locale => locale.code), [
    'en-US', 'en-GB', 'fr-FR', 'es-ES', 'fil-PH', 'ar', 'de-DE', 'nl-NL',
    'it-IT', 'pt-BR', 'ko-KR', 'hi-IN', 'ja-JP', 'zh-CN', 'zh-TW',
  ])
  assert.equal(findSpruceLocale('fr-CA')?.code, 'fr-FR')
  assert.equal(findSpruceLocale('ar-EG')?.direction, 'rtl')
  assert.equal(findSpruceLocale('ar')?.firstDayOfWeek, 6)
})

test('provider exposes localized labels, interpolation, and Intl formatting', () => {
  function Probe() {
    const { t, formatDate, formatNumber, direction, firstDayOfWeek } = useI18n()
    return createElement(
      'div',
      { dir: direction, 'data-first-day': firstDayOfWeek },
      `${t('moreNotifications', { count: 3 })}|${formatDate('2026-08-24')}|${formatNumber(1234567.89)}`,
    )
  }

  const markup = renderToStaticMarkup(
    createElement(SpruceProvider, { persist: false, locale: 'fr-FR' }, createElement(Probe)),
  )
  assert.match(markup, /dir="ltr"/)
  assert.match(markup, /data-first-day="1"/)
  assert.match(markup, />3 [^<]+\|/)
  assert.match(markup, /2026/)
  assert.match(markup, /1[\s\u00a0.]234/)
})

test('localized component chrome keeps accessible names and controlled content', () => {
  const markup = renderToStaticMarkup(
    createElement(
      SpruceProvider,
      { persist: false, locale: 'fr-FR' },
      createElement(Alert, { dismissible: true, title: 'Product title' }, 'Product message'),
    ),
  )
  assert.match(markup, /role="alert"/)
  assert.match(markup, /aria-label="[^"]+"/)
  assert.match(markup, /Product title/)
  assert.match(markup, /Product message/)
})

test('document synchronization applies lang and direction for assistive technology', () => {
  const documentLike = { documentElement: {} }
  applyI18nToDocument(documentLike, { locale: 'ar', direction: 'rtl' })
  assert.equal(documentLike.documentElement.lang, 'ar')
  assert.equal(documentLike.documentElement.dir, 'rtl')
})
