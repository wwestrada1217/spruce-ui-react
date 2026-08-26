import { useEffect, useRef, useState } from 'react'
import { ImageEditor } from 'spruce-react'
import type { ImageEditorAspect, ImageEditorChange } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<ImageEditor
  src="assets/product-photo.jpg"
  alt="Editable product photo"
/>`

const CROP_CODE = `const [crop, setCrop] = useState<ImageEditorChange | null>(null)

<ImageEditor
  src="assets/product-photo.jpg"
  format="image/webp"
  initialQuality={0.86}
  onCrop={setCrop}
/>`

const CONTROLLED_CODE = `const [aspect, setAspect] = useState<ImageEditorAspect>('1:1')

<ImageEditor
  src={imageUrl}
  aspect={aspect}
  onAspectChange={setAspect}
  onChange={(change) => savePreview(change.dataUrl)}
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'crop', label: 'Crop and export' },
  { id: 'controlled', label: 'Controlled state' },
  { id: 'api', label: 'API' },
]

export function ImageEditorPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [lastChange, setLastChange] = useState<ImageEditorChange | null>(null)
  const [controlledAspect, setControlledAspect] = useState<ImageEditorAspect>('1:1')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-80px 0px -40% 0px' },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Image Editor</h1>
        <p className="docs-desc">
          Crop, transform, draw, annotate, adjust, and export images from one reusable editor surface.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">
            Upload an image or provide a source URL. Drag on the image to create a crop region, resize it from the handles, or choose a fixed ratio.
          </p>
          <CodePreview code={BASIC_CODE}>
            <ImageEditor
              className="editor-demo"
              src="https://picsum.photos/seed/editor-workbench/960/640"
              alt="Desk with design materials"
            />
          </CodePreview>
        </section>

        <section id="crop" className="demo-section">
          <h2>Crop and export</h2>
          <p className="section-desc">
            Use circle mode for profile images, adjust the output quality, and receive the rendered result before a crop is applied in place.
          </p>
          <CodePreview code={CROP_CODE}>
            <div>
              <ImageEditor
                className="editor-demo"
                src="https://picsum.photos/seed/editor-ratio/900/600"
                format="image/webp"
                initialQuality={0.86}
                onChange={setLastChange}
                onCrop={setLastChange}
              />
              <p className="editor-output" aria-live="polite">
                {lastChange
                  ? `${lastChange.format} · ${Math.round(lastChange.quality * 100)}% quality · ${lastChange.selection ? `${Math.round(lastChange.selection.width)} × ${Math.round(lastChange.selection.height)}px selection` : 'full image'}`
                  : 'Make an edit or export to inspect the output metadata.'}
              </p>
            </div>
          </CodePreview>
        </section>

        <section id="controlled" className="demo-section">
          <h2>Controlled state</h2>
          <p className="section-desc">
            Tool, aspect, zoom, quality, transforms, selection, adjustments, and annotations can be controlled with React props and callbacks.
          </p>
          <CodePreview code={CONTROLLED_CODE}>
            <ImageEditor
              className="editor-demo"
              src="https://picsum.photos/seed/editor-controlled/800/600"
              aspect={controlledAspect}
              onAspectChange={setControlledAspect}
            />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>ImageEditor</h3>
          <h4>Core props</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>src</code></td><td><code>string</code></td><td><code>''</code></td><td>Image URL or data URL to edit.</td></tr>
                <tr><td><code>alt</code></td><td><code>string</code></td><td><code>'Editable image'</code></td><td>Accessible source description.</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>Localized <code>Image editor</code></td><td>Accessible label for the editing workspace.</td></tr>
                <tr><td><code>format</code></td><td><code>'image/png' | 'image/jpeg' | 'image/webp'</code></td><td><code>'image/jpeg'</code></td><td>Output MIME type used by crop and export.</td></tr>
                <tr><td><code>initialQuality</code></td><td><code>number</code></td><td><code>0.92</code></td><td>Initial and reset quality, clamped from 0.1 to 1.</td></tr>
                <tr><td><code>annotationColor</code></td><td><code>string</code></td><td>Surface token</td><td>Color for new text and drawing annotations.</td></tr>
              </tbody>
            </table>
          </div>

          <h4>Controlled props and callbacks</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>State</th><th>Controlled prop</th><th>Callback</th></tr></thead>
              <tbody>
                <tr><td>Tool</td><td><code>tool</code></td><td><code>onToolChange</code></td></tr>
                <tr><td>Aspect / selection</td><td><code>aspect</code>, <code>selection</code>, <code>selectionShape</code></td><td><code>onAspectChange</code>, <code>onSelectionChange</code>, <code>onSelectionShapeChange</code></td></tr>
                <tr><td>Zoom / quality</td><td><code>zoom</code>, <code>quality</code></td><td><code>onZoomChange</code>, <code>onQualityChange</code></td></tr>
                <tr><td>Adjustments</td><td><code>adjustments</code></td><td><code>onAdjustmentsChange</code></td></tr>
                <tr><td>Transforms</td><td><code>rotation</code>, <code>flipX</code>, <code>flipY</code></td><td><code>onRotationChange</code>, <code>onFlipXChange</code>, <code>onFlipYChange</code></td></tr>
                <tr><td>Annotations</td><td><code>annotations</code></td><td><code>onAnnotationsChange</code></td></tr>
              </tbody>
            </table>
          </div>

          <h4>Output callbacks</h4>
          <p className="section-desc"><code>onChange</code> receives <code>ImageEditorChange</code> after edits and export. <code>onCrop</code> receives the same payload before the crop is loaded in place. The payload includes <code>dataUrl</code>, <code>blob</code>, selection, selection shape, adjustments, format, and quality.</p>

          <h4>Keyboard behavior</h4>
          <p className="section-desc">Focus the workspace and use Arrow keys to move the selection by 1px, Shift + Arrow for 10px, and Ctrl/Cmd + Z, Ctrl/Cmd + Shift + Z, or Ctrl/Cmd + Y for history.</p>
        </section>
      </div>

      <nav className="features-toc" aria-label="On this page">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button className={`toc-link${activeSection === section.id ? ' active' : ''}`} onClick={() => scrollTo(section.id)}>{section.label}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
