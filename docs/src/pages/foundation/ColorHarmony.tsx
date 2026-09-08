import { useMemo, useState } from 'react'
import {
  HARMONY_PRESETS,
  HARMONY_SCHEMES,
  HarmonyWheel,
  buildHarmonyPalette,
  useTheme,
} from 'spruce-react'
import type { HarmonySchemeId, HarmonySelection } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

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
  const [wheelSelection, setWheelSelection] = useState<HarmonySelection>('triadic')

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
    <FoundationPageShell variant="harmony" title="Color harmony" description="An accent paints one hue. A harmony derives companion hues from that same brand color — where they sit on the wheel is the scheme's job — and publishes them as secondary and tertiary roles plus a categorical ramp for charts. Every generated color is contrast-checked before it ships, so the scheme chooses hue and the token contract chooses lightness.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Color Harmony</h1>
        <p className="page-lead">
          An accent paints one hue. A harmony derives companion hues from that same brand color —
          where they sit on the wheel is the scheme's job — and publishes them as secondary and
          tertiary roles plus a categorical ramp for charts. Every generated color is contrast-checked
          before it ships, so the scheme chooses hue and the token contract chooses lightness.
        </p>
      </div>

      <section id="overview" className="doc-section">
        <h2>How it works</h2>
        <div className="principles-grid">
          <article className="principle-card"><h3>Hue comes from the scheme</h3><p>Rotation happens in OKLCH, not HSL. Rotating in HSL gives siblings that claim the same lightness but read up to eight times brighter or darker than each other; OKLCH holds perceived lightness steady while hue moves.</p></article>
          <article className="principle-card"><h3>Lightness comes from the contract</h3><p>Each fill is pushed until it clears 4.5:1 against its mode's background, and its label is whichever of white or ink reads better. A very pale brand hex comes back darker than it went in — that is the generator refusing to emit an illegible fill.</p></article>
          <article className="principle-card"><h3>Semantic hues stay reserved</h3><p>Success, warning, and danger own their corners of the wheel. A companion landing on one gets nudged aside, unless the brand hue itself lives there — then there is no second meaning to protect.</p></article>
        </div>
      </section>

      <section id="playground" className="doc-section">
        <h2>Playground</h2>
        <p className="section-desc">These controls drive this documentation site. Pick a base color and a scheme, or start from a preset and nudge from there.</p>
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

      <section id="wheel" className="doc-section">
        <h2>Build your own</h2>
        <p className="section-desc">Drag the primary marker to rotate the brand while preserving the harmony. Drag companion markers to edit their offsets; near a canonical arrangement they snap back to the named scheme.</p>
        <CodePreview code={`<HarmonyWheel
  base={baseColor}
  selection={selection}
  onBaseChange={setBaseColor}
  onSelectionChange={setSelection}
/>`}>
          <HarmonyWheel base={baseColor} selection={wheelSelection} onBaseChange={setBaseColor} onSelectionChange={setWheelSelection} />
        </CodePreview>
      </section>

      <section id="roles" className="doc-section">
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

      <section id="series" className="doc-section">
        <h2>Categorical ramp</h2>
        <p className="section-desc">Eight series colors are published for chart integrations. Hues cycle before lightness steps so neighboring legend items differ by the attribute people read fastest.</p>
        {displayedPalette && <div className="harmony-page__series" aria-label="Chart series colors">{displayedPalette.light.series.map((color, index) => <span key={color + index} style={{ background: color }} title={color} />)}</div>}
      </section>

      <section id="tokens" className="doc-section">
        <h2>Tokens</h2>
        <p className="section-desc">A harmony writes secondary, tertiary, focus, and chart-series values on top of the plain accent layer.</p>
        <table className="token-table" aria-label="Harmony token roles"><thead><tr><th>Token</th><th>Role</th></tr></thead><tbody><tr><td><code>--sp-secondary</code></td><td>Generated companion accent</td></tr><tr><td><code>--sp-tertiary</code></td><td>Generated third accent</td></tr><tr><td><code>--sp-chart-series-1</code> → <code>--sp-chart-series-8</code></td><td>Categorical chart ramp</td></tr></tbody></table>
      </section>

      <section className="doc-section">
        <h3>Presets</h3>
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

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <CodePreview codeOnly language="typescript" code={`import { useTheme } from 'spruce-react'

const { setCustomAccentColor, setAccentHarmony, harmonyPalette } = useTheme()
setCustomAccentColor('#2563eb')
setAccentHarmony('split-complementary')

// Read the generated values for a chart or canvas integration.
harmonyPalette?.light.series[0]
`} />
      </section>
    </FoundationPageShell>
  )
}
