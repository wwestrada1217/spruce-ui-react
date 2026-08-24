import { useMemo, useState } from 'react'
import {
  HARMONY_PRESETS,
  HARMONY_SCHEMES,
  buildHarmonyPalette,
  useTheme,
} from 'spruce-react'
import type { HarmonySchemeId } from 'spruce-react'

const ROLES = ['primary', 'secondary', 'tertiary'] as const

export function ColorHarmonyPage() {
  const {
    accentCustomColor,
    accentHarmony,
    accentHarmonyBase,
    harmonyPalette,
    setCustomAccentColor,
    setAccentHarmony,
    setHarmonyPreset,
  } = useTheme()
  const [baseColor, setBaseColor] = useState(accentCustomColor)
  const [scheme, setScheme] = useState<HarmonySchemeId | 'none'>(
    accentHarmony === 'custom' ? 'triadic' : accentHarmony,
  )

  const preview = useMemo(
    () => (scheme === 'none' ? null : buildHarmonyPalette(baseColor, scheme)),
    [baseColor, scheme],
  )

  function applySelection() {
    setCustomAccentColor(baseColor)
    setAccentHarmony(scheme)
  }

  function applyPreset(id: string, presetBase: string, presetScheme: HarmonySchemeId) {
    setBaseColor(presetBase)
    setScheme(presetScheme)
    setHarmonyPreset(id)
  }

  const displayedPalette = preview ?? harmonyPalette

  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Color Harmony</h1>
        <p className="page-lead">
          Build a brand palette from one seed color. Spruce derives accessible
          companion accents and an eight-color chart ramp in OKLCH, then writes
          the result through the same provider that controls the theme.
        </p>
      </div>

      <section className="doc-section">
        <h2>Live playground</h2>
        <div className="harmony-page__controls">
          <label>
            Brand color
            <span className="harmony-page__color-input">
              <input
                type="color"
                value={baseColor}
                aria-label="Harmony brand color"
                onChange={event => setBaseColor(event.target.value)}
              />
              <code>{baseColor}</code>
            </span>
          </label>
          <div>
            <span className="harmony-page__label">Scheme</span>
            <div className="harmony-page__schemes" role="radiogroup" aria-label="Harmony scheme">
              <button
                type="button"
                className={scheme === 'none' ? 'harmony-page__active' : ''}
                role="radio"
                aria-checked={scheme === 'none'}
                onClick={() => setScheme('none')}
              >
                Single hue
              </button>
              {HARMONY_SCHEMES.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={scheme === option.id ? 'harmony-page__active' : ''}
                  role="radio"
                  aria-checked={scheme === option.id}
                  title={option.description}
                  onClick={() => setScheme(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="harmony-page__apply" onClick={applySelection}>
            Apply harmony
          </button>
        </div>
        <p className="section-desc">
          Current provider seed: <code>{accentHarmonyBase}</code>. Applying a
          harmony updates secondary, tertiary, focus, and chart-series tokens;
          the generated palette is available to charts through{' '}
          <code>harmonyPalette</code>.
        </p>
      </section>

      <section className="doc-section">
        <h2>Generated roles</h2>
        {displayedPalette ? (
          <>
            <div className="harmony-page__roles">
              {ROLES.map(role => {
                const color = displayedPalette.light[role].base
                return (
                  <div className="harmony-page__role" key={role}>
                    <span style={{ background: color }} aria-hidden="true" />
                    <strong>{role}</strong>
                    <code>{color}</code>
                  </div>
                )
              })}
            </div>
            <div className="harmony-page__series" aria-label="Chart series colors">
              {displayedPalette.light.series.map((color, index) => (
                <span key={color + index} style={{ background: color }} title={color} />
              ))}
            </div>
            <div className="table-scroll">
              <table className="token-table" aria-label="Harmony contrast report">
                <thead><tr><th>Role</th><th>Light fill</th><th>Dark fill</th><th>Light label</th><th>Dark label</th></tr></thead>
                <tbody>
                  {ROLES.map(role => (
                    <tr key={role}>
                      <td>{role}</td>
                      <td><code>{displayedPalette.light[role].base}</code></td>
                      <td><code>{displayedPalette.dark[role].base}</code></td>
                      <td><code>{displayedPalette.light[role].text}</code></td>
                      <td><code>{displayedPalette.dark[role].text}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="section-desc">Choose a harmony scheme to preview companion roles.</p>
        )}
      </section>

      <section className="doc-section">
        <h2>Ready-made pairings</h2>
        <p className="section-desc">
          Each pairing supplies both a seed and a scheme. Applying one switches
          the accent to custom so the seed remains editable.
        </p>
        <div className="harmony-page__presets">
          {HARMONY_PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id, preset.base, preset.scheme)}
            >
              <span style={{ background: preset.base }} aria-hidden="true" />
              <span>{preset.displayName}</span>
              <code>{preset.scheme}</code>
            </button>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Usage</h2>
        <div className="code-block">
          <pre><code>{`import { useTheme } from 'spruce-react'

const { setCustomAccentColor, setAccentHarmony, harmonyPalette } = useTheme()
setCustomAccentColor('#2563eb')
setAccentHarmony('split-complementary')

// Read the generated values for a chart or canvas integration.
harmonyPalette?.light.series[0]
`}</code></pre>
        </div>
      </section>
    </>
  )
}
