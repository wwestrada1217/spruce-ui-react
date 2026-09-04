import { useEffect, useRef, useState, type ReactNode } from 'react'

type FoundationVariant =
  | 'accessibility'
  | 'borders'
  | 'colors'
  | 'density'
  | 'iconography'
  | 'illustrations'
  | 'internationalization'
  | 'motifs'
  | 'motion'
  | 'shadows'
  | 'spacing'
  | 'theming'
  | 'typography'
  | 'voice'
  | 'harmony'

interface FoundationSection {
  id: string
  label: string
}

export interface FoundationPageShellProps {
  title: string
  description: ReactNode
  variant: FoundationVariant
  children: ReactNode
}

function FoundationInstrument({ variant }: { variant: FoundationVariant }) {
  return (
    <svg className={`foundation-instrument foundation-instrument--${variant}`} viewBox="0 0 520 300" aria-hidden="true" focusable="false">
      <rect className="foundation-instrument__frame" x="0.5" y="0.5" width="519" height="299" rx="10" />
      <path className="foundation-instrument__grid" d="M36 42h448M36 258h448M74 24v252" />
      {variant === 'accessibility' && <>
        <rect className="foundation-instrument__surface" x="110" y="64" width="300" height="152" rx="6" />
        <rect className="foundation-instrument__focus" x="128" y="82" width="104" height="42" rx="4" />
        <rect className="foundation-instrument__surface-strong" x="250" y="82" width="142" height="42" rx="4" />
        <rect className="foundation-instrument__ink" x="128" y="144" width="168" height="10" rx="5" />
        <rect className="foundation-instrument__muted" x="128" y="166" width="230" height="7" rx="3.5" />
        <circle className="foundation-instrument__success" cx="392" cy="184" r="11" />
        <path className="foundation-instrument__frame" d="m386 184 4 4 8-9" fill="none" strokeWidth="2" />
      </>}
      {variant === 'borders' && <>
        <rect className="foundation-instrument__surface" x="112" y="62" width="120" height="72" rx="2" />
        <rect className="foundation-instrument__surface" x="256" y="62" width="120" height="72" rx="10" />
        <rect className="foundation-instrument__accent-line" x="256" y="62" width="120" height="72" rx="10" />
        <path className="foundation-instrument__rule" d="M112 174h264M112 202h264" />
        <path className="foundation-instrument__accent-line" d="M112 232h264" strokeWidth="3" />
      </>}
      {variant === 'colors' && <>
        <rect className="foundation-instrument__surface-strong" x="112" y="52" width="126" height="46" rx="4" />
        <rect className="foundation-instrument__surface" x="112" y="108" width="126" height="46" rx="4" />
        <rect className="foundation-instrument__ink" x="112" y="164" width="126" height="46" rx="4" />
        <rect className="foundation-instrument__accent" x="250" y="52" width="54" height="158" rx="4" />
        <rect className="foundation-instrument__success" x="316" y="52" width="54" height="46" rx="4" />
        <rect className="foundation-instrument__warning" x="316" y="108" width="54" height="46" rx="4" />
        <rect className="foundation-instrument__danger" x="316" y="164" width="54" height="46" rx="4" />
      </>}
      {variant === 'density' && <>
        <path className="foundation-instrument__rule" d="M112 70h280M112 120h280M112 170h280M112 220h280" />
        <path className="foundation-instrument__accent-line" d="M112 70h92M112 120h150M112 170h212M112 220h264" />
        <circle className="foundation-instrument__accent" cx="424" cy="70" r="8" /><circle className="foundation-instrument__accent" cx="424" cy="120" r="8" /><circle className="foundation-instrument__accent" cx="424" cy="170" r="8" />
      </>}
      {variant === 'iconography' && <>
        <circle className="foundation-instrument__surface-strong" cx="185" cy="123" r="48" />
        <path className="foundation-instrument__accent-line" d="m157 123 18 18 38-42" strokeWidth="7" />
        <rect className="foundation-instrument__surface" x="296" y="78" width="96" height="96" rx="18" />
        <path className="foundation-instrument__rule--strong" d="M320 126h48M344 102v48" />
      </>}
      {variant === 'illustrations' && <>
        <circle className="foundation-instrument__surface-strong" cx="196" cy="142" r="68" />
        <path className="foundation-instrument__accent-line" d="M154 164c20-38 42-38 62 0 20-38 42-38 62 0" />
        <path className="foundation-instrument__ink" d="M330 92h108v12H330zM330 122h82v8h-82zM330 148h96v8h-96z" />
      </>}
      {variant === 'motifs' && <>
        <circle className="foundation-instrument__surface" cx="240" cy="150" r="82" />
        <circle className="foundation-instrument__accent-line" cx="240" cy="150" r="58" />
        <circle className="foundation-instrument__accent-line" cx="240" cy="150" r="32" />
        <path className="foundation-instrument__accent-line" d="M378 68v164M378 68h62M378 232h62" />
      </>}
      {variant === 'motion' && <>
        <path className="foundation-instrument__rule" d="M48 224h424M48 152h424M48 80h424" />
        <path className="foundation-instrument__accent-line" d="M48 224C126 224 122 152 218 152S302 80 472 80" />
        <circle className="foundation-instrument__accent" cx="48" cy="224" r="8" /><circle className="foundation-instrument__accent" cx="218" cy="152" r="8" /><circle className="foundation-instrument__accent" cx="472" cy="80" r="8" />
      </>}
      {variant === 'shadows' && <>
        <rect className="foundation-instrument__surface" x="104" y="150" width="112" height="68" rx="5" />
        <rect className="foundation-instrument__surface-strong" x="218" y="108" width="122" height="86" rx="6" />
        <rect className="foundation-instrument__frame" x="342" y="62" width="112" height="102" rx="7" />
        <path className="foundation-instrument__accent-line" d="M474 218V74" />
      </>}
      {variant === 'spacing' && <>
        <path className="foundation-instrument__rule" d="M106 78h308M106 118h308M106 158h308M106 198h308" />
        <path className="foundation-instrument__accent-line" d="M106 78h34M106 118h74M106 158h132M106 198h204" />
        <path className="foundation-instrument__accent-line" d="M106 238h308" />
      </>}
      {variant === 'typography' && <>
        <path className="foundation-instrument__ink" d="M116 203 171 67h25l55 136h-25l-13-35h-62l-13 35Zm43-56h46l-23-62Z" />
        <path className="foundation-instrument__accent" d="M294 203V91h22v112Zm0-130V51h22v22Z" />
        <path className="foundation-instrument__muted" d="M350 88h110v9H350zM350 116h86v7H350zM350 146h104v5H350zM350 174h72v4H350z" />
      </>}
      {variant === 'theming' && <>
        <rect className="foundation-instrument__surface" x="104" y="78" width="130" height="132" rx="8" />
        <rect className="foundation-instrument__accent" x="126" y="100" width="86" height="16" rx="4" />
        <rect className="foundation-instrument__surface-strong" x="126" y="132" width="86" height="54" rx="5" />
        <path className="foundation-instrument__accent-line" d="M286 112h130M286 150h86M286 188h154" />
      </>}
      {variant === 'harmony' && <>
        <circle className="foundation-instrument__surface" cx="220" cy="150" r="92" />
        <circle className="foundation-instrument__accent" cx="220" cy="58" r="12" /><circle className="foundation-instrument__success" cx="300" cy="196" r="12" /><circle className="foundation-instrument__warning" cx="140" cy="196" r="12" />
        <path className="foundation-instrument__accent-line" d="M220 58 300 196 140 196Z" />
      </>}
      {variant === 'internationalization' && <>
        <rect className="foundation-instrument__surface" x="104" y="80" width="310" height="132" rx="8" />
        <path className="foundation-instrument__ink" d="M136 112h126v12H136zM136 144h194v8H136zM136 170h150v8H136z" />
        <path className="foundation-instrument__accent-line" d="M350 118h38m-12-12 12 12-12 12M388 174h-38m12-12-12 12 12 12" />
      </>}
      {variant === 'voice' && <>
        <path className="foundation-instrument__rule" d="M104 86h312M104 126h312M104 166h312M104 206h312" />
        <path className="foundation-instrument__ink" d="M126 76h150v10H126zM126 116h222v10H126zM126 156h108v10H126z" />
        <path className="foundation-instrument__accent-line" d="m362 106 26 20m0-20-26 20M280 146v20m-10-10h20" />
      </>}
    </svg>
  )
}

export function FoundationPageShell({ title, description, variant, children }: FoundationPageShellProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [sections, setSections] = useState<FoundationSection[]>([])
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const discovered = Array.from(shell.querySelectorAll<HTMLElement>('section[id]')).map(section => ({
      id: section.id,
      label: section.querySelector('h2')?.textContent?.trim() ?? section.id,
    }))
    setSections(discovered)
    setActiveSection(discovered[0]?.id ?? '')
    const scrollRoot = shell.closest('.docs-main')
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveSection((visible[0].target as HTMLElement).id)
    }, { root: scrollRoot, rootMargin: '-10% 0px -72% 0px', threshold: [0, 1] })
    discovered.forEach(section => {
      const element = shell.querySelector(`#${CSS.escape(section.id)}`)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    shellRef.current?.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    setActiveSection(id)
    const hash = window.location.hash
    const route = hash.indexOf('#', 1) >= 0 ? hash.slice(0, hash.indexOf('#', 1)) : hash
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${route}#${id}`)
  }

  return <div ref={shellRef} className={`foundation-editorial foundation-editorial--${variant}`}>
    <div className="features-main">
      <header className="foundation-hero">
        <div className="foundation-hero__copy"><h1>{title}</h1><p className="docs-desc">{description}</p></div>
        <FoundationInstrument variant={variant} />
      </header>
      {children}
    </div>
    {sections.length > 0 && <nav className="features-toc" aria-label="On this page">
      <p className="features-toc__title">On this page</p>
      <ul className="toc-list">{sections.map(section => <li key={section.id}><button type="button" className={`toc-link${activeSection === section.id ? ' active' : ''}`} onClick={() => scrollTo(section.id)}>{section.label}</button></li>)}</ul>
    </nav>}
  </div>
}
