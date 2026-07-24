import { useState, useEffect, useRef, useMemo } from 'react'
import { Barcode, QrCode } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const barcodeBasicCode = `<Barcode value="SPRUCE-2024" />`

const barcodeVariantsCode = `<Barcode value="ABC-123" width={150} height={40} />
<Barcode value="HELLO" width={250} height={80} color="#2563eb" />
<Barcode value="DARK" width={180} height={50} color="#7c3aed" />`

const barcodeBorderedCode = `<Barcode value="SKU-00481" bordered />
<Barcode value="INV-90712" bordered showText={false} />`

const barcodeRetailCode = `<Barcode format="upc-a" value="03600029145" width={240} />
<Barcode format="ean-13" value="590123412345" width={240} />`

const qrBasicCode = `<QrCode value="https://example.com" />`

const qrSizesCode = `<QrCode value="Small" size={80} />
<QrCode value="Medium" size={128} />
<QrCode value="Large" size={200} />`

const qrColorsCode = `<QrCode value="Blue theme" color="#2563eb" />
<QrCode value="Dark mode" color="#e2e8f0" background="#1e293b" />`

const qrContentCode = `<QrCode value="https://spruce.dev" />
<QrCode value="mailto:hello@spruce.dev" />
<QrCode value="tel:+1234567890" />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'barcode-basic', label: 'Barcode -- Basic' },
  { id: 'barcode-variants', label: 'Sizes & Colors' },
  { id: 'barcode-bordered', label: 'Bordered' },
  { id: 'barcode-retail', label: 'UPC-A & EAN-13' },
  { id: 'barcode-interactive', label: 'Barcode Interactive' },
  { id: 'qr-basic', label: 'QR Code -- Basic' },
  { id: 'qr-sizes', label: 'QR Sizes' },
  { id: 'qr-colors', label: 'QR Colors' },
  { id: 'qr-content', label: 'QR Content' },
  { id: 'qr-interactive', label: 'QR Interactive' },
  { id: 'api', label: 'API' },
]

export function BarcodeQrPage() {
  const [activeSection, setActiveSection] = useState('barcode-basic')
  const mainRef = useRef<HTMLDivElement>(null)

  /* ---- interactive barcode state ---- */
  const [barcodeFormat, setBarcodeFormat] = useState<'code128' | 'upc-a' | 'ean-13'>('code128')
  const [barcodeValue, setBarcodeValue] = useState('PACK-45873-SHELF-A3')
  const [barcodeWidth, setBarcodeWidth] = useState(280)
  const [barcodeHeight, setBarcodeHeight] = useState(72)
  const [barcodeColor, setBarcodeColor] = useState('#0f172a')
  const [barcodeBordered, setBarcodeBordered] = useState(true)
  const [barcodeShowValue, setBarcodeShowValue] = useState(true)

  /* ---- interactive QR state ---- */
  const [qrValue, setQrValue] = useState('https://spruce.dev/docs/components/barcode-qr?campaign=launch')
  const [qrSize, setQrSize] = useState(168)
  const [qrFgColor, setQrFgColor] = useState('#0f172a')
  const [qrBgColor, setQrBgColor] = useState('#ffffff')

  const qrSummary = useMemo(() => {
    const value = qrValue.trim()
    if (!value) return 'Empty payload'
    if (value.startsWith('mailto:')) return 'Email handoff'
    if (value.startsWith('tel:')) return 'Phone handoff'
    if (value.startsWith('http://') || value.startsWith('https://')) return 'URL handoff'
    return 'Text payload'
  }, [qrValue])

  function onBarcodeFormatChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const format = e.target.value as 'code128' | 'upc-a' | 'ean-13'
    setBarcodeFormat(format)
    if (format === 'upc-a') { setBarcodeValue('03600029145'); return }
    if (format === 'ean-13') { setBarcodeValue('590123412345'); return }
    setBarcodeValue('PACK-45873-SHELF-A3')
  }

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
        <h1>Barcode &amp; QR Code</h1>
        <p className="docs-desc">
          SVG-based barcode and QR code generators with zero external dependencies.
          Supports Code128, UPC-A, and EAN-13 barcodes plus QR codes up to version 6.
        </p>

        {/* ── Barcode ─────────────────────────────────────────────────── */}

        <section id="barcode-basic" className="demo-section">
          <h2>Barcode -- Basic</h2>
          <p className="section-desc">A simple barcode with default size and color settings.</p>
          <CodePreview code={barcodeBasicCode}>
            <Barcode value="SPRUCE-2024" />
          </CodePreview>
        </section>

        <section id="barcode-variants" className="demo-section">
          <h2>Barcode -- Sizes &amp; Colors</h2>
          <p className="section-desc">Customize barcode dimensions and bar color to fit your design.</p>
          <CodePreview code={barcodeVariantsCode}>
            <Barcode value="ABC-123" width={150} height={40} />
            <Barcode value="HELLO" width={250} height={80} color="#2563eb" />
            <Barcode value="DARK" width={180} height={50} color="#7c3aed" />
          </CodePreview>
        </section>

        <section id="barcode-bordered" className="demo-section">
          <h2>Barcode -- Bordered</h2>
          <p className="section-desc">Add a border around the barcode, with or without the value text.</p>
          <CodePreview code={barcodeBorderedCode}>
            <Barcode value="SKU-00481" bordered />
            <Barcode value="INV-90712" bordered showText={false} />
          </CodePreview>
        </section>

        <section id="barcode-retail" className="demo-section">
          <h2>Barcode -- UPC-A &amp; EAN-13</h2>
          <p className="section-desc">
            Retail formats validate checksum digits and auto-complete the check digit when omitted.
          </p>
          <CodePreview code={barcodeRetailCode}>
            <div className="demo-row">
              <div className="docs-field">
                <Barcode format="upc-a" value="03600029145" width={240} />
                <span className="docs-label">UPC-A (11 digits, check digit auto-added)</span>
              </div>
              <div className="docs-field">
                <Barcode format="ean-13" value="590123412345" width={240} />
                <span className="docs-label">EAN-13 (12 digits, check digit auto-added)</span>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="barcode-interactive" className="demo-section">
          <h2>Barcode -- Interactive</h2>
          <p className="section-desc">
            Edit the encoded value, dimensions, and display settings to preview barcode output in real time.
          </p>
          <div className="playground">
            <div className="playground__preview playground__preview--stacked">
              <Barcode
                format={barcodeFormat}
                value={barcodeValue}
                width={barcodeWidth}
                height={barcodeHeight}
                color={barcodeColor}
                bordered={barcodeBordered}
                showText={barcodeShowValue}
              />
              <div className="docs-field">
                <span className="docs-label">Current payload</span>
                <code className="docs-code">{barcodeValue}</code>
              </div>
            </div>
            <div className="playground__controls">
              <div className="control-row control-row--wide">
                <label className="control-label" htmlFor="barcode-format">Format</label>
                <select
                  id="barcode-format"
                  className="control-input"
                  value={barcodeFormat}
                  onChange={onBarcodeFormatChange}
                >
                  <option value="code128">Code128</option>
                  <option value="upc-a">UPC-A</option>
                  <option value="ean-13">EAN-13</option>
                </select>
              </div>
              <div className="control-row control-row--wide">
                <label className="control-label" htmlFor="barcode-value">Value</label>
                <input
                  id="barcode-value"
                  className="control-input"
                  type="text"
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                />
              </div>
              <div className="control-grid">
                <div className="control-row">
                  <label className="control-label" htmlFor="barcode-width">Width</label>
                  <input
                    id="barcode-width"
                    className="control-input"
                    type="range"
                    min={120}
                    max={360}
                    step={10}
                    value={barcodeWidth}
                    onChange={(e) => setBarcodeWidth(Number(e.target.value))}
                  />
                  <span className="control-value">{barcodeWidth}px</span>
                </div>
                <div className="control-row">
                  <label className="control-label" htmlFor="barcode-height">Height</label>
                  <input
                    id="barcode-height"
                    className="control-input"
                    type="range"
                    min={36}
                    max={120}
                    step={4}
                    value={barcodeHeight}
                    onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                  />
                  <span className="control-value">{barcodeHeight}px</span>
                </div>
              </div>
              <div className="control-row control-row--wide">
                <label className="control-label" htmlFor="barcode-color">Bar Color</label>
                <div className="control-inline">
                  <input
                    id="barcode-color"
                    className="control-color"
                    type="color"
                    value={barcodeColor}
                    onChange={(e) => setBarcodeColor(e.target.value)}
                  />
                  <input
                    className="control-input"
                    type="text"
                    value={barcodeColor}
                    onChange={(e) => setBarcodeColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="control-checks">
                <label className="control-check">
                  <input
                    type="checkbox"
                    checked={barcodeBordered}
                    onChange={() => setBarcodeBordered(!barcodeBordered)}
                  />
                  Bordered
                </label>
                <label className="control-check">
                  <input
                    type="checkbox"
                    checked={barcodeShowValue}
                    onChange={() => setBarcodeShowValue(!barcodeShowValue)}
                  />
                  Show Value
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* ── QR Code ─────────────────────────────────────────────────── */}

        <section id="qr-basic" className="demo-section">
          <h2>QR Code -- Basic</h2>
          <p className="section-desc">A standard QR code encoding a URL with default settings.</p>
          <CodePreview code={qrBasicCode}>
            <QrCode value="https://example.com" />
          </CodePreview>
        </section>

        <section id="qr-sizes" className="demo-section">
          <h2>QR Code -- Sizes</h2>
          <p className="section-desc">Control the QR code dimensions with the <code>size</code> prop.</p>
          <CodePreview code={qrSizesCode}>
            <QrCode value="Small" size={80} />
            <QrCode value="Medium" size={128} />
            <QrCode value="Large" size={200} />
          </CodePreview>
        </section>

        <section id="qr-colors" className="demo-section">
          <h2>QR Code -- Colors</h2>
          <p className="section-desc">Customize foreground and background colors for branded or dark-mode QR codes.</p>
          <CodePreview code={qrColorsCode}>
            <QrCode value="Blue theme" color="#2563eb" />
            <QrCode value="Dark mode" color="#e2e8f0" background="#1e293b" />
          </CodePreview>
        </section>

        <section id="qr-content" className="demo-section">
          <h2>QR Code -- Different Content</h2>
          <p className="section-desc">QR codes can encode URLs, email addresses, phone numbers, and other text data.</p>
          <CodePreview code={qrContentCode}>
            <div className="demo-col">
              <div className="demo-row">
                <QrCode value="https://spruce.dev" />
                <div className="docs-field">
                  <span className="docs-label">URL</span>
                  <code className="docs-code">https://spruce.dev</code>
                </div>
              </div>
              <div className="demo-row">
                <QrCode value="mailto:hello@spruce.dev" />
                <div className="docs-field">
                  <span className="docs-label">Email</span>
                  <code className="docs-code">mailto:hello@spruce.dev</code>
                </div>
              </div>
              <div className="demo-row">
                <QrCode value="tel:+1234567890" />
                <div className="docs-field">
                  <span className="docs-label">Phone</span>
                  <code className="docs-code">tel:+1234567890</code>
                </div>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="qr-interactive" className="demo-section">
          <h2>QR Code -- Interactive</h2>
          <p className="section-desc">
            Tune content, size, and colors for previewing links, tickets, handoff flows, or branded QR treatments.
          </p>
          <div className="playground">
            <div className="playground__preview">
              <QrCode
                value={qrValue}
                size={qrSize}
                color={qrFgColor}
                background={qrBgColor}
              />
              <div className="docs-field">
                <span className="docs-label">Suggested use</span>
                <code className="docs-code">{qrSummary}</code>
              </div>
            </div>
            <div className="playground__controls">
              <div className="control-row control-row--wide">
                <label className="control-label" htmlFor="qr-value">Value</label>
                <textarea
                  id="qr-value"
                  className="control-textarea"
                  rows={3}
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                />
              </div>
              <div className="control-row">
                <label className="control-label" htmlFor="qr-size">Size</label>
                <input
                  id="qr-size"
                  className="control-input"
                  type="range"
                  min={80}
                  max={240}
                  step={8}
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                />
                <span className="control-value">{qrSize}px</span>
              </div>
              <div className="control-grid">
                <div className="control-row control-row--wide">
                  <label className="control-label" htmlFor="qr-fg-color">Foreground</label>
                  <div className="control-inline">
                    <input
                      id="qr-fg-color"
                      className="control-color"
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                    />
                    <input
                      className="control-input"
                      type="text"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="control-row control-row--wide">
                  <label className="control-label" htmlFor="qr-bg-color">Background</label>
                  <div className="control-inline">
                    <input
                      id="qr-bg-color"
                      className="control-color"
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                    />
                    <input
                      className="control-input"
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── API ─────────────────────────────────────────────────────── */}

        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Barcode</h3>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>format</code></td><td><code>{"'code128' | 'upc-a' | 'ean-13'"}</code></td><td><code>{"'code128'"}</code></td><td>Barcode format to generate</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>{"''"}</code></td><td>Data to encode</td></tr>
                <tr><td><code>width</code></td><td><code>number</code></td><td><code>200</code></td><td>Barcode width in pixels</td></tr>
                <tr><td><code>height</code></td><td><code>number</code></td><td><code>60</code></td><td>Barcode height in pixels</td></tr>
                <tr><td><code>color</code></td><td><code>string</code></td><td><code>{"''"}</code></td><td>Bar color. Defaults to the current theme text color when empty.</td></tr>
                <tr><td><code>bordered</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show border around barcode</td></tr>
                <tr><td><code>showText</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Display the value text below barcode</td></tr>
              </tbody>
            </table>
          </div>

          <h3>QrCode</h3>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>{"''"}</code></td><td>Data to encode</td></tr>
                <tr><td><code>size</code></td><td><code>number</code></td><td><code>200</code></td><td>QR code size in pixels</td></tr>
                <tr><td><code>color</code></td><td><code>string</code></td><td><code>{"''"}</code></td><td>Foreground color. Defaults to the current theme text color when empty.</td></tr>
                <tr><td><code>background</code></td><td><code>string</code></td><td><code>{"''"}</code></td><td>Background color. Defaults to the current theme surface color when empty.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className={`toc-link${activeSection === section.id ? ' active' : ''}`}
                onClick={() => scrollTo(section.id)}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
