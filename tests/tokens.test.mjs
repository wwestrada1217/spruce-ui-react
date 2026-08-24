import { readFileSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import test from 'node:test'
import { applyThemeToDocument } from '../src/theme/theme-dom.ts'

const css = readFileSync(new URL('../src/tokens/tokens.css', import.meta.url), 'utf8')
const typeSource = readFileSync(new URL('../src/tokens/types.ts', import.meta.url), 'utf8')
const tokenKeys = [...typeSource.matchAll(/'(--sp-[a-z0-9_-]+)'/g)].map(match => match[1])

test('every typed token key has a CSS declaration', () => {
  for (const token of tokenKeys) {
    const escapedToken = token.replaceAll('-', '\\-')
    assert.match(css, new RegExp('^\\s*' + escapedToken + '\\s*:', 'm'), token)
  }
})

test('the strict token contract has no open-ended union escape hatch', () => {
  assert.doesNotMatch(typeSource, /string\s*&\s*\{\}/)
  assert.match(typeSource, /SpruceCustomTokenKey/)
})

test('theme switching applies the light and dark document contract', () => {
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
  }

  applyThemeToDocument({ documentElement: root }, 'dark')
  assert.equal(attributes.get('data-theme'), 'dark')
  assert.equal(classes.has('dark'), true)

  applyThemeToDocument({ documentElement: root }, 'light')
  assert.equal(attributes.get('data-theme'), 'light')
  assert.equal(classes.has('dark'), false)
})

test('density aliases are scoped by all supported selectors', () => {
  assert.match(css, /:root,\s*\[data-density='default'\]/)
  assert.match(css, /\[data-density='dense'\]/)
  assert.match(css, /\[data-density='comfortable'\]/)
  assert.match(css, /--sp-density-control-height:\s*var\(--sp-density-dense-control-height\)/)
  assert.match(css, /--sp-density-control-height:\s*var\(--sp-density-comfortable-control-height\)/)
})

test('static token bundle is emitted by the package build', () => {
  const staticCss = readFileSync(new URL('../dist/tokens-static.css', import.meta.url), 'utf8')
  assert.match(staticCss, /color-scheme:\s*light/)
  assert.doesNotMatch(staticCss, /data-theme=['"]dark/)
  assert.match(staticCss, /--sp-font-size-6xl:/)
})
