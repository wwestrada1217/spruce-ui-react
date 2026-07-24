import { useState, useEffect, useRef } from 'react'
import { Fab } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const VARIANTS_CODE = `<Fab icon="plus"  variant="primary"   position="none" />
<Fab icon="edit"  variant="secondary" position="none" />
<Fab icon="trash" variant="danger"    position="none" />
<Fab icon="check" variant="success"   position="none" />`

const SIZES_CODE = `<Fab icon="plus" size="sm" position="none" />
<Fab icon="plus" size="md" position="none" />
<Fab icon="plus" size="lg" position="none" />`

const EXTENDED_CODE = `<Fab icon="plus"   variant="primary"   position="none" label="New Item" />
<Fab icon="edit"   variant="secondary" position="none" label="Edit" />
<Fab icon="upload" variant="success"   position="none" label="Upload" size="lg" />`

const SPEED_DIAL_CODE = `const [open, setOpen] = useState(false)

const actions = [
  { id: 'share', icon: 'share', label: 'Share' },
  { id: 'email', icon: 'mail', label: 'Send Email' },
  { id: 'download', icon: 'download', label: 'Download' },
]

<Fab
  icon="plus"
  position="none"
  actions={actions}
  open={open}
  actionsAbove
  onOpenChange={setOpen}
  onActionClick={(action) => console.log(action.label)}
/>`

const STATES_CODE = `<Fab icon="plus" position="none" />
<Fab icon="plus" position="none" disabled />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'variants', label: 'Variants' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'extended', label: 'Extended FAB' },
  { id: 'speed-dial', label: 'Speed Dial' },
  { id: 'states', label: 'States' },
  { id: 'api', label: 'API' },
]

const DIAL_ACTIONS = [
  { id: 'share', icon: 'share', label: 'Share' },
  { id: 'email', icon: 'mail', label: 'Send Email' },
  { id: 'download', icon: 'download', label: 'Download' },
]

export function FabPage() {
  const [activeSection, setActiveSection] = useState('variants')
  const [dialOpen, setDialOpen] = useState(false)
  const [lastAction, setLastAction] = useState('')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Floating Action Button</h1>
        <p className="docs-desc">
          A FAB surfaces the primary action of a screen. It can be fixed to a viewport corner,
          placed as an inline element, or expanded into a speed-dial menu with secondary actions.
        </p>

        {/* Variants */}
        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">Four color variants to communicate intent.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="demo-row">
              <Fab icon="plus" variant="primary" position="none" label="" />
              <Fab icon="edit" variant="secondary" position="none" label="" />
              <Fab icon="trash" variant="danger" position="none" label="" />
              <Fab icon="check" variant="success" position="none" label="" />
            </div>
          </CodePreview>
          <div className="demo-labels">
            <span>Primary</span>
            <span>Secondary</span>
            <span>Danger</span>
            <span>Success</span>
          </div>
        </section>

        {/* Sizes */}
        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">
            Three sizes — small (40 px), medium (56 px, default), and large (68 px).
          </p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Fab icon="plus" size="sm" position="none" label="" />
              <Fab icon="plus" size="md" position="none" label="" />
              <Fab icon="plus" size="lg" position="none" label="" />
            </div>
          </CodePreview>
          <div className="demo-labels">
            <span>sm</span>
            <span>md</span>
            <span>lg</span>
          </div>
        </section>

        {/* Extended */}
        <section id="extended" className="demo-section" aria-labelledby="extended-heading">
          <h2 id="extended-heading">Extended FAB</h2>
          <p className="section-desc">
            Provide a <code>label</code> to render a pill-shaped button with both icon and text —
            ideal for prominent CTAs that need extra context.
          </p>
          <CodePreview code={EXTENDED_CODE}>
            <div className="demo-row">
              <Fab icon="plus" variant="primary" position="none" label="New Item" />
              <Fab icon="edit" variant="secondary" position="none" label="Edit" />
              <Fab icon="upload" variant="success" position="none" label="Upload" size="lg" />
            </div>
          </CodePreview>
        </section>

        {/* Speed Dial */}
        <section id="speed-dial" className="demo-section" aria-labelledby="speed-dial-heading">
          <h2 id="speed-dial-heading">Speed Dial</h2>
          <p className="section-desc">
            Pass an <code>actions</code> array to create a speed-dial. Clicking the main button
            toggles the menu. Track open state with <code>useState</code> and bind to <code>open</code> and
            <code>onOpenChange</code>.
          </p>
          <CodePreview code={SPEED_DIAL_CODE}>
            <div style={{ position: 'relative', height: 200, width: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Fab
                icon="plus"
                position="none"
                actions={DIAL_ACTIONS}
                open={dialOpen}
                actionsAbove
                onOpenChange={setDialOpen}
                onActionClick={(action: { id: string; icon: string; label: string }) => setLastAction(action.label)}
              />
            </div>
          </CodePreview>
          {lastAction && (
            <p className="demo-feedback">
              Last action: <strong>{lastAction}</strong>
            </p>
          )}
        </section>

        {/* States */}
        <section id="states" className="demo-section" aria-labelledby="states-heading">
          <h2 id="states-heading">States</h2>
          <p className="section-desc">FABs support disabled styling.</p>
          <CodePreview code={STATES_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Fab icon="plus" position="none" label="" />
              <Fab icon="plus" position="none" label="" disabled />
            </div>
          </CodePreview>
          <div className="demo-labels">
            <span>Default</span>
            <span>Disabled</span>
          </div>
        </section>

        {/* API */}
        <section id="api" className="demo-section" aria-labelledby="api-heading">
          <h2 id="api-heading">API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>icon</code></td>
                  <td><code>string</code></td>
                  <td><code>'plus'</code></td>
                  <td>Icon name for the main button</td>
                </tr>
                <tr>
                  <td><code>closeIcon</code></td>
                  <td><code>string | null</code></td>
                  <td><code>null</code></td>
                  <td>Icon shown when speed-dial is open. When null the main icon rotates 45&deg;</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Text label — renders extended pill when non-empty (md/lg sizes)</td>
                </tr>
                <tr>
                  <td><code>variant</code></td>
                  <td><code>'primary' | 'secondary' | 'danger' | 'success'</code></td>
                  <td><code>'primary'</code></td>
                  <td>Color variant</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'sm' | 'md' | 'lg'</code></td>
                  <td><code>'md'</code></td>
                  <td>Button size</td>
                </tr>
                <tr>
                  <td><code>position</code></td>
                  <td><code>'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center' | 'none'</code></td>
                  <td><code>'bottom-right'</code></td>
                  <td>Fixed viewport position. Use <code>'none'</code> for inline flow</td>
                </tr>
                <tr>
                  <td><code>actions</code></td>
                  <td><code>FabAction[]</code></td>
                  <td><code>[]</code></td>
                  <td>Speed-dial action items</td>
                </tr>
                <tr>
                  <td><code>open</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Controls whether the speed-dial is open</td>
                </tr>
                <tr>
                  <td><code>actionsAbove</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Whether actions appear above (true) or below (false) the button</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disable the button</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>onFabClick</code></td>
                  <td><code>{'() => void'}</code></td>
                  <td>Called when the main button is clicked (no speed-dial)</td>
                </tr>
                <tr>
                  <td><code>onOpenChange</code></td>
                  <td><code>{'(open: boolean) => void'}</code></td>
                  <td>Called with the new open state when the speed-dial should toggle</td>
                </tr>
                <tr>
                  <td><code>onActionClick</code></td>
                  <td><code>{'(action: FabAction) => void'}</code></td>
                  <td>Called when a speed-dial action is clicked</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>FabAction</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>id</code></td>
                  <td><code>string</code></td>
                  <td>Unique identifier</td>
                </tr>
                <tr>
                  <td><code>icon</code></td>
                  <td><code>string</code></td>
                  <td>Icon name</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>Accessible label shown as tooltip</td>
                </tr>
                <tr>
                  <td><code>color</code></td>
                  <td><code>string</code></td>
                  <td>Optional CSS color override for the action button</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td>Disable this action</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* TOC */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
