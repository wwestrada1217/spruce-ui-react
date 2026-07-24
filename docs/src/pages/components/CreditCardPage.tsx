import { useState, useEffect, useRef } from 'react'
import { CreditCard } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<CreditCard
  number="4532 1234 5678 9012"
  holderName="JOHN DOE"
  expiry="12/28"
  network="visa"
/>`

const NETWORKS_CODE = `<CreditCard number="4111 1111 1111 1111" holderName="JANE SMITH" expiry="03/27" network="visa" color="blue" />
<CreditCard number="5500 0000 0000 0004" holderName="ALEX CHEN" expiry="08/26" network="mastercard" color="dark" />
<CreditCard number="3782 822463 10005" holderName="SAM WILSON" expiry="11/29" network="amex" color="green" />
<CreditCard number="6011 0000 0000 0004" holderName="PAT TAYLOR" expiry="06/27" network="discover" color="gold" />`

const COLORS_CODE = `<CreditCard color="dark" holderName="DARK" />
<CreditCard color="blue" holderName="BLUE" />
<CreditCard color="purple" holderName="PURPLE" />
<CreditCard color="green" holderName="GREEN" />
<CreditCard color="gold" holderName="GOLD" />
<CreditCard color="red" holderName="RED" />`

const MASKED_CODE = `<CreditCard
  number="**** **** **** 4242"
  holderName="CARD HOLDER"
  expiry="09/26"
  network="visa"
  color="purple"
/>`

const NO_CONTACTLESS_CODE = `<CreditCard
  number="4000 1234 5678 9010"
  holderName="LEGACY CARD"
  expiry="01/25"
  contactless={false}
  network="visa"
  color="red"
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'networks', label: 'Card Networks' },
  { id: 'colors', label: 'Color Themes' },
  { id: 'masked', label: 'Masked Number' },
  { id: 'no-contactless', label: 'No Contactless' },
  { id: 'api', label: 'API' },
]

export function CreditCardPage() {
  const [activeSection, setActiveSection] = useState('basic')
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
        <h1>Credit Card</h1>
        <p className="docs-desc">
          A realistic credit card display component with chip, contactless icon, card network logos, holographic shimmer, and 6 gradient color themes.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">
            A fully configured credit card with number, holder name, expiry, and network logo.
          </p>
          <CodePreview code={BASIC_CODE}>
            <CreditCard number="4532 1234 5678 9012" holderName="JOHN DOE" expiry="12/28" network="visa" />
          </CodePreview>
        </section>

        <section id="networks" className="demo-section">
          <h2>Card Networks</h2>
          <p className="section-desc">
            Supports Visa, Mastercard, Amex, and Discover network logos.
          </p>
          <CodePreview code={NETWORKS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CreditCard number="4111 1111 1111 1111" holderName="JANE SMITH" expiry="03/27" network="visa" color="blue" />
              <CreditCard number="5500 0000 0000 0004" holderName="ALEX CHEN" expiry="08/26" network="mastercard" color="dark" />
              <CreditCard number="3782 822463 10005" holderName="SAM WILSON" expiry="11/29" network="amex" color="green" />
              <CreditCard number="6011 0000 0000 0004" holderName="PAT TAYLOR" expiry="06/27" network="discover" color="gold" />
            </div>
          </CodePreview>
        </section>

        <section id="colors" className="demo-section">
          <h2>Color Themes</h2>
          <p className="section-desc">
            Six gradient color themes to match your application branding.
          </p>
          <CodePreview code={COLORS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CreditCard color="dark" holderName="DARK" />
              <CreditCard color="blue" holderName="BLUE" />
              <CreditCard color="purple" holderName="PURPLE" />
              <CreditCard color="green" holderName="GREEN" />
              <CreditCard color="gold" holderName="GOLD" />
              <CreditCard color="red" holderName="RED" />
            </div>
          </CodePreview>
        </section>

        <section id="masked" className="demo-section">
          <h2>Masked Number</h2>
          <p className="section-desc">
            Display a partially masked card number to protect sensitive data.
          </p>
          <CodePreview code={MASKED_CODE}>
            <CreditCard number="**** **** **** 4242" holderName="CARD HOLDER" expiry="09/26" network="visa" color="purple" />
          </CodePreview>
        </section>

        <section id="no-contactless" className="demo-section">
          <h2>Without Contactless</h2>
          <p className="section-desc">
            Hide the contactless payment icon for cards that do not support tap-to-pay.
          </p>
          <CodePreview code={NO_CONTACTLESS_CODE}>
            <CreditCard number="4000 1234 5678 9010" holderName="LEGACY CARD" expiry="01/25" contactless={false} network="visa" color="red" />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>number</code></td><td><code>string</code></td><td><code>'**** **** **** ****'</code></td><td>Card number</td></tr>
                <tr><td><code>holderName</code></td><td><code>string</code></td><td><code>'CARD HOLDER'</code></td><td>Cardholder name</td></tr>
                <tr><td><code>expiry</code></td><td><code>string</code></td><td><code>'MM/YY'</code></td><td>Expiration date</td></tr>
                <tr><td><code>color</code></td><td><code>'dark' | 'blue' | 'purple' | 'green' | 'gold' | 'red'</code></td><td><code>'dark'</code></td><td>Card color theme</td></tr>
                <tr><td><code>network</code></td><td><code>'visa' | 'mastercard' | 'amex' | 'discover' | ''</code></td><td><code>''</code></td><td>Card network logo</td></tr>
                <tr><td><code>contactless</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show contactless icon</td></tr>
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
