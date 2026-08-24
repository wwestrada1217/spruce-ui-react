import { strict as assert } from 'node:assert'
import { createRequire } from 'node:module'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
globalThis.require = createRequire(import.meta.url)
const {
  ACCENT_OPTIONS,
  HARMONY_PRESETS,
  HARMONY_SCHEMES,
  SPRUCE_THEME_PRESETS,
  SpruceProvider,
  applyThemeToDocument,
  buildAccentStylesheet,
  buildHarmonyPalette,
  buildHarmonyStylesheet,
  harmonyContrastReport,
  normalizeAccentHex,
  spruceTheme,
  useTheme,
} = await import('../dist/spruce-react.es.js')

test('all Angular theme presets are available as React exports', () => {
  assert.equal(SPRUCE_THEME_PRESETS.length, 34)
  assert.equal(new Set(SPRUCE_THEME_PRESETS.map(theme => theme.name)).size, 34)
  for (const theme of SPRUCE_THEME_PRESETS) {
    assert.ok(theme.displayName)
    assert.ok(theme.tokens['--sp-primary'])
    assert.ok(theme.base === 'light' || theme.base === 'dark')
  }
})

test('light and dark theme document state includes the preset contract', () => {
  const attributes = new Map()
  const classes = new Set()
  const root = {
    classList: {
      toggle(name, force) {
        if (force) classes.add(name)
        else classes.delete(name)
      },
    },
    setAttribute(name, value) {
      attributes.set(name, value)
    },
    removeAttribute(name) {
      attributes.delete(name)
    },
  }

  applyThemeToDocument({ documentElement: root }, 'dark', 'material-dark')
  assert.equal(attributes.get('data-theme'), 'dark')
  assert.equal(attributes.get('data-theme-preset'), 'material-dark')
  assert.equal(classes.has('dark'), true)

  applyThemeToDocument({ documentElement: root }, 'light')
  assert.equal(attributes.get('data-theme'), 'light')
  assert.equal(attributes.has('data-theme-preset'), false)
  assert.equal(classes.has('dark'), false)
})

test('accent presets and custom colors produce both mode blocks', () => {
  assert.ok(ACCENT_OPTIONS.some(option => option.id === 'default'))
  assert.ok(ACCENT_OPTIONS.some(option => option.id === 'blue'))
  assert.equal(normalizeAccentHex('3a9bdc'), '#3a9bdc')
  assert.equal(normalizeAccentHex('#ABC'), '#aabbcc')
  assert.equal(normalizeAccentHex('not-a-color'), null)
  const css = buildAccentStylesheet('indigo')
  assert.match(css, /--sp-primary: #4f46e5/)
  assert.match(css, /data-theme='dark'/)
  const customCss = buildAccentStylesheet('custom', '#7c3aed')
  assert.match(customCss, /--sp-primary: #7c3aed/)
  assert.match(customCss, /--sp-focus-ring-color/)
})

test('named and custom harmony palettes expose accessible roles and chart ramp', () => {
  for (const scheme of HARMONY_SCHEMES) {
    const palette = buildHarmonyPalette('#2563eb', scheme.id)
    assert.ok(palette)
    assert.equal(palette.light.series.length, 8)
    assert.equal(palette.dark.series.length, 8)
    assert.ok(harmonyContrastReport(palette).every(row => row.passes))
    const css = buildHarmonyStylesheet('#2563eb', scheme.id)
    assert.match(css, /--sp-secondary:/)
    assert.match(css, /--sp-chart-series-8:/)
    assert.match(css, /data-theme='dark'/)
  }

  const custom = buildHarmonyPalette('#f97316', { secondary: 72, tertiary: 216 })
  assert.ok(custom)
  assert.equal(custom.scheme, 'custom')
  assert.notEqual(custom.light.secondary.base, custom.light.tertiary.base)
})

test('harmony presets are ready for the switcher and docs', () => {
  assert.equal(HARMONY_PRESETS.length, 12)
  for (const preset of HARMONY_PRESETS) {
    assert.ok(buildHarmonyPalette(preset.base, preset.scheme))
  }
})

test('provider exposes light, dark, system, custom, accent, and harmony state', () => {
  function Probe() {
    const state = useTheme()
    return createElement(
      'output',
      null,
      [state.preference, state.resolved, state.accentPreference, state.accentHarmony, state.harmonyPalette ? 'palette' : 'none'].join('|'),
    )
  }

  const render = props => renderToStaticMarkup(
    createElement(SpruceProvider, { persist: false, ...props }, createElement(Probe)),
  )

  assert.match(render({ defaultTheme: 'light' }), /light\|light\|default\|none\|none/)
  assert.match(render({ defaultTheme: 'dark' }), /dark\|dark\|default\|none\|none/)
  assert.match(render({ defaultTheme: 'system' }), /system\|light\|default\|none\|none/)
  assert.match(render({ theme: spruceTheme }), /spruce\|light\|default\|none\|none/)
  assert.match(render({ defaultAccent: 'indigo' }), /system\|light\|indigo\|none\|none/)
  assert.match(render({ defaultAccentCustomColor: '#7c3aed', defaultAccent: 'custom', defaultAccentHarmony: 'triadic' }), /system\|light\|custom\|triadic\|palette/)
})
