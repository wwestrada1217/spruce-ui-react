import { useState, useEffect, useRef } from 'react'
import { Lightbox, Button } from 'spruce-react'
import type { LightboxImage } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const demoImages: LightboxImage[] = [
  { src: 'https://picsum.photos/seed/sp1/800/600', alt: 'Sample landscape 1' },
  { src: 'https://picsum.photos/seed/sp2/800/600', alt: 'Sample landscape 2' },
  { src: 'https://picsum.photos/seed/sp3/800/600', alt: 'Sample landscape 3' },
  { src: 'https://picsum.photos/seed/sp4/800/600', alt: 'Sample landscape 4' },
]

const captionImages: LightboxImage[] = [
  { src: 'https://picsum.photos/seed/c1/800/600', alt: 'Mountain view', caption: 'A serene mountain landscape at sunrise' },
  { src: 'https://picsum.photos/seed/c2/800/600', alt: 'Ocean waves', caption: 'Waves crashing against the rocky shore' },
  { src: 'https://picsum.photos/seed/c3/800/600', alt: 'Forest path', caption: 'An enchanting path through the old growth forest' },
]

const singleImage: LightboxImage[] = [
  { src: 'https://picsum.photos/seed/single/800/600', alt: 'Single image view' },
]

const BASIC_CODE = `import { Lightbox, LightboxImage } from 'spruce-react';

const images: LightboxImage[] = [
  { src: 'photo1.jpg', alt: 'Photo 1' },
  { src: 'photo2.jpg', alt: 'Photo 2' },
  { src: 'photo3.jpg', alt: 'Photo 3' },
];

// In your component:
const [open, setOpen] = useState(false);
const [startIdx, setStartIdx] = useState(0);

<div className="gallery">
  {images.map((img, i) => (
    <button key={img.src} onClick={() => { setStartIdx(i); setOpen(true); }}>
      <img src={img.src} alt={img.alt} />
    </button>
  ))}
</div>
<Lightbox images={images} open={open} startIndex={startIdx} onClose={() => setOpen(false)} />`

const CAPTIONS_CODE = `<Lightbox images={[
  { src: 'photo1.jpg', caption: 'A mountain view' },
  { src: 'photo2.jpg', caption: 'Ocean waves' },
]} open={open} onClose={() => setOpen(false)} />`

const NO_THUMB_CODE = `<Button onClick={() => setOpen(true)}>Open Lightbox</Button>
<Lightbox images={images} open={open} showThumbnails={false} onClose={() => setOpen(false)} />`

const SINGLE_CODE = `<Button onClick={() => setOpen(true)}>View Image</Button>
<Lightbox images={[{ src: 'photo.jpg' }]} open={open} onClose={() => setOpen(false)} />`

const NO_ZOOM_CODE = `<Lightbox images={images} open={open} zoomable={false} onClose={() => setOpen(false)} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'captions', label: 'With Captions' },
  { id: 'no-thumbnails', label: 'Without Thumbnails' },
  { id: 'single', label: 'Single Image' },
  { id: 'no-zoom', label: 'Without Zoom' },
  { id: 'api', label: 'API' },
]

const thumbStyle: React.CSSProperties = {
  width: 120,
  height: 80,
  borderRadius: 'var(--sp-radius-md, 6px)',
  overflow: 'hidden',
  border: '2px solid var(--sp-border, rgba(0,0,0,0.08))',
  padding: 0,
  background: 'none',
  cursor: 'pointer',
}

const thumbImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}

export function LightboxPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  // Lightbox state per demo
  const [basicOpen, setBasicOpen] = useState(false)
  const [basicStart, setBasicStart] = useState(0)

  const [captionOpen, setCaptionOpen] = useState(false)
  const [captionStart, setCaptionStart] = useState(0)

  const [noThumbOpen, setNoThumbOpen] = useState(false)
  const [singleOpen, setSingleOpen] = useState(false)
  const [noZoomOpen, setNoZoomOpen] = useState(false)

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
        <h1>Lightbox</h1>
        <p className="docs-desc">A full-screen overlay for viewing images with navigation, zoom controls, captions, and thumbnail strip.</p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">Click any thumbnail to open the lightbox. Navigate with arrows or keyboard.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-space-2, 8px)' }}>
              {demoImages.map((img, i) => (
                <button
                  key={img.src}
                  style={thumbStyle}
                  onClick={() => { setBasicStart(i); setBasicOpen(true); }}
                >
                  <img src={img.src} alt={img.alt || ''} style={thumbImgStyle} />
                </button>
              ))}
            </div>
            <Lightbox
              images={demoImages}
              open={basicOpen}
              startIndex={basicStart}
              onClose={() => setBasicOpen(false)}
            />
          </CodePreview>
        </section>

        <section id="captions" className="demo-section">
          <h2>With Captions</h2>
          <p className="section-desc">Images can include captions displayed below the image.</p>
          <CodePreview code={CAPTIONS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-space-2, 8px)' }}>
              {captionImages.map((img, i) => (
                <button
                  key={img.src}
                  style={thumbStyle}
                  onClick={() => { setCaptionStart(i); setCaptionOpen(true); }}
                >
                  <img src={img.src} alt={img.alt || ''} style={thumbImgStyle} />
                </button>
              ))}
            </div>
            <Lightbox
              images={captionImages}
              open={captionOpen}
              startIndex={captionStart}
              onClose={() => setCaptionOpen(false)}
            />
          </CodePreview>
        </section>

        <section id="no-thumbnails" className="demo-section">
          <h2>Without Thumbnails</h2>
          <p className="section-desc">Hide the thumbnail strip for a cleaner view.</p>
          <CodePreview code={NO_THUMB_CODE}>
            <Button variant="outline" onClick={() => setNoThumbOpen(true)}>Open Lightbox</Button>
            <Lightbox
              images={demoImages}
              open={noThumbOpen}
              showThumbnails={false}
              onClose={() => setNoThumbOpen(false)}
            />
          </CodePreview>
        </section>

        <section id="single" className="demo-section">
          <h2>Single Image</h2>
          <p className="section-desc">When only one image is provided, navigation arrows and thumbnails are hidden.</p>
          <CodePreview code={SINGLE_CODE}>
            <Button variant="outline" onClick={() => setSingleOpen(true)}>View Image</Button>
            <Lightbox
              images={singleImage}
              open={singleOpen}
              onClose={() => setSingleOpen(false)}
            />
          </CodePreview>
        </section>

        <section id="no-zoom" className="demo-section">
          <h2>Without Zoom</h2>
          <p className="section-desc">Disable the zoom controls.</p>
          <CodePreview code={NO_ZOOM_CODE}>
            <Button variant="outline" onClick={() => setNoZoomOpen(true)}>Open without zoom</Button>
            <Lightbox
              images={demoImages}
              open={noZoomOpen}
              zoomable={false}
              onClose={() => setNoZoomOpen(false)}
            />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Lightbox</h3>
          <h4>Props</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>images</code></td><td><code>LightboxImage[]</code></td><td><code>[]</code></td><td>Array of images to display</td></tr>
                <tr><td><code>open</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the lightbox is open</td></tr>
                <tr><td><code>startIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>Starting image index when opened</td></tr>
                <tr><td><code>showThumbnails</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show thumbnail strip at the bottom</td></tr>
                <tr><td><code>zoomable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow zoom in / zoom out</td></tr>
                <tr><td><code>closeOnBackdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close when clicking backdrop area</td></tr>
                <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td><code>-</code></td><td>Called when the lightbox requests to close</td></tr>
                <tr><td><code>onIndexChange</code></td><td><code>(index: number) =&gt; void</code></td><td><code>-</code></td><td>Called when the active image changes</td></tr>
              </tbody>
            </table>
          </div>

          <h3>LightboxImage</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>src</code></td><td><code>string</code></td><td>Yes</td><td>Image source URL</td></tr>
                <tr><td><code>alt</code></td><td><code>string</code></td><td>No</td><td>Alt text for accessibility</td></tr>
                <tr><td><code>caption</code></td><td><code>string</code></td><td>No</td><td>Caption displayed below the image</td></tr>
                <tr><td><code>thumbnail</code></td><td><code>string</code></td><td>No</td><td>Thumbnail URL (falls back to src)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Keyboard</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Key</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><code>Escape</code></td><td>Close lightbox</td></tr>
                <tr><td><code>ArrowLeft</code></td><td>Previous image</td></tr>
                <tr><td><code>ArrowRight</code></td><td>Next image</td></tr>
                <tr><td><code>+</code></td><td>Zoom in</td></tr>
                <tr><td><code>-</code></td><td>Zoom out</td></tr>
                <tr><td><code>0</code></td><td>Reset zoom</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

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
