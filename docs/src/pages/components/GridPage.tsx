import { useState, useEffect, useRef } from 'react'
import { Container, Row, Col } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Container>
  <Row cols={12} gap={4}>
    <Col span={4}><div>4 cols</div></Col>
    <Col span={4}><div>4 cols</div></Col>
    <Col span={4}><div>4 cols</div></Col>
  </Row>
</Container>`

const SPAN_CODE = `<Row cols={12} gap={4}>
  <Col span={3}>3</Col>
  <Col span={6}>6</Col>
  <Col span={3}>3</Col>
</Row>`

const OFFSET_CODE = `<Row cols={12} gap={4}>
  <Col span={4} offset={2}>offset 2, span 4</Col>
  <Col span={4}>span 4</Col>
</Row>`

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  background: 'var(--sp-primary-subtle, rgba(37,99,235,0.08))',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--sp-primary, #2563eb)',
  textAlign: 'center',
}

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',  label: 'Basic' },
  { id: 'span',   label: 'Column Spans' },
  { id: 'offset', label: 'Offsets' },
  { id: 'api',    label: 'API' },
]

export function GridPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const v = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (v.length > 0) setActiveSection(v[0].target.id) }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 })
    mainRef.current?.querySelectorAll('section[id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Grid</h1>
        <p className="docs-desc">CSS Grid-based layout system with Container, Row, and Col components. Uses a 12-column grid by default with configurable gaps and spans.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A 12-column grid with equal columns.</p>
          <CodePreview code={BASIC_CODE}>
            <Row cols={12} gap={4}>
              <Col span={4}><div style={cellStyle}>4 cols</div></Col>
              <Col span={4}><div style={cellStyle}>4 cols</div></Col>
              <Col span={4}><div style={cellStyle}>4 cols</div></Col>
            </Row>
          </CodePreview>
        </section>

        <section id="span" className="demo-section" aria-labelledby="span-heading">
          <h2 id="span-heading">Column Spans</h2>
          <p className="section-desc">Control column widths with the <code>span</code> prop.</p>
          <CodePreview code={SPAN_CODE}>
            <Row cols={12} gap={4}>
              <Col span={3}><div style={cellStyle}>3</div></Col>
              <Col span={6}><div style={cellStyle}>6</div></Col>
              <Col span={3}><div style={cellStyle}>3</div></Col>
            </Row>
          </CodePreview>
        </section>

        <section id="offset" className="demo-section" aria-labelledby="offset-heading">
          <h2 id="offset-heading">Offsets</h2>
          <p className="section-desc">Push columns with <code>offset</code> to skip grid positions.</p>
          <CodePreview code={OFFSET_CODE}>
            <Row cols={12} gap={4}>
              <Col span={4} offset={2}><div style={cellStyle}>offset 2, span 4</div></Col>
              <Col span={4}><div style={cellStyle}>span 4</div></Col>
            </Row>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Container Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Remove max-width constraint</td></tr>
          </tbody></table></div>
          <h3 style={{ marginTop: 16 }}>Row Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>cols</code></td><td><code>number</code></td><td><code>12</code></td><td>Number of grid columns</td></tr>
            <tr><td><code>gap</code></td><td><code>number</code></td><td><code>4</code></td><td>Gap spacing scale</td></tr>
            <tr><td><code>align</code></td><td><code>'start' | 'center' | 'end' | 'stretch'</code></td><td><code>'stretch'</code></td><td>Vertical alignment</td></tr>
          </tbody></table></div>
          <h3 style={{ marginTop: 16 }}>Col Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>span</code></td><td><code>number</code></td><td><code>1</code></td><td>Columns to span</td></tr>
            <tr><td><code>offset</code></td><td><code>number</code></td><td><code>0</code></td><td>Columns to skip before</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
