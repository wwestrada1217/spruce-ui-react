import { useState, useEffect, useRef } from 'react'
import { MessageBar } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import type { CodeFile } from '../../components/CodePreview'

const enableEditingActions = [
  { label: 'Enable Editing', action: () => alert('Editing enabled') },
]

const updateActions = [
  { label: 'Install Now', action: () => alert('Installing update...') },
  { label: 'Remind Me Later', action: () => alert('Reminder set') },
]

const shareActions = [
  { label: 'Download', action: () => alert('Downloading...') },
  { label: 'Share', action: () => alert('Opening share dialog...') },
]

const renewActions = [
  { label: 'Renew License', action: () => alert('Opening renewal portal...') },
]

const renewSmallActions = [
  { label: 'Start Free Trial', action: () => alert('Starting trial...') },
]

const contactActions = [
  { label: 'Contact Support', action: () => alert('Opening support chat...') },
]

const VARIANTS_CODE = `<MessageBar variant="info">
  Your subscription renews on May 1, 2026.
</MessageBar>
<MessageBar variant="success">
  All changes have been saved and published.
</MessageBar>
<MessageBar variant="warning">
  This document has unsaved changes. Save before closing.
</MessageBar>
<MessageBar variant="danger">
  Authentication failed. Your session will expire in 2 minutes.
</MessageBar>
<MessageBar variant="neutral">
  This file is read-only. Request edit access to make changes.
</MessageBar>`

const WITH_TITLE_CODE = `<MessageBar variant="warning" title="Protected View">
  This file came from an external source. Enable editing only if you trust the source.
</MessageBar>
<MessageBar variant="info" title="Update Available">
  A new version of this application is ready to install.
</MessageBar>
<MessageBar variant="danger" title="Access Denied">
  You do not have permission to view this record.
</MessageBar>`

const actionsFiles: CodeFile[] = [
  {
    label: 'ActionsDemo.tsx',
    language: 'typescript',
    code: `import { MessageBar } from 'spruce-react';

const enableEditingActions = [
  { label: 'Enable Editing', action: () => alert('Editing enabled') },
];

const updateActions = [
  { label: 'Install Now', action: () => alert('Installing update...') },
  { label: 'Remind Me Later', action: () => alert('Reminder set') },
];

const shareActions = [
  { label: 'Download', action: () => alert('Downloading...') },
  { label: 'Share', action: () => alert('Opening share dialog...') },
];

const renewActions = [
  { label: 'Renew License', action: () => alert('Opening renewal portal...') },
];

<MessageBar variant="warning" title="Protected View" actions={enableEditingActions}>
  This file came from an external source. Enable editing only if you trust the source.
</MessageBar>
<MessageBar variant="info" title="Update Available" actions={updateActions}>
  Version 3.4.1 is ready to install with performance improvements and bug fixes.
</MessageBar>
<MessageBar variant="success" actions={shareActions}>
  Your report has been generated and is ready to share.
</MessageBar>
<MessageBar variant="danger" title="License Expired" actions={renewActions}>
  Your license expired 3 days ago. Some features have been disabled.
</MessageBar>`,
  },
]

const dismissibleFiles: CodeFile[] = [
  {
    label: 'DismissibleDemo.tsx',
    language: 'typescript',
    code: `import { useState } from 'react';
import { MessageBar } from 'spruce-react';

const [showInfoBar, setShowInfoBar] = useState(true);
const [showWarningBar, setShowWarningBar] = useState(true);

const renewSmallActions = [
  { label: 'Start Free Trial', action: () => alert('Starting trial...') },
];

{showInfoBar && (
  <MessageBar variant="info" dismissible onClose={() => setShowInfoBar(false)}>
    You can dismiss this bar by clicking the X button.
  </MessageBar>
)}
{showWarningBar && (
  <MessageBar
    variant="warning"
    title="Expiring Soon"
    dismissible
    actions={renewSmallActions}
    onClose={() => setShowWarningBar(false)}
  >
    Your trial ends in 7 days.
  </MessageBar>
)}`,
  },
]

const nonDismissibleFiles: CodeFile[] = [
  {
    label: 'NonDismissibleDemo.tsx',
    language: 'typescript',
    code: `import { MessageBar } from 'spruce-react';

const contactActions = [
  { label: 'Contact Support', action: () => alert('Opening support chat...') },
];

<MessageBar variant="danger" title="Account Suspended" actions={contactActions}>
  Your account has been suspended due to a payment failure. Contact support to restore access.
</MessageBar>`,
  },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'variants', label: 'Variants' },
  { id: 'with-title', label: 'With Title' },
  { id: 'actions', label: 'With Actions' },
  { id: 'dismissible', label: 'Dismissible' },
  { id: 'non-dismissible', label: 'Non-Dismissible' },
  { id: 'api', label: 'API' },
]

export function MessageBarPage() {
  const [activeSection, setActiveSection] = useState('variants')
  const [showInfoBar, setShowInfoBar] = useState(true)
  const [showWarningBar, setShowWarningBar] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = mainRef.current?.closest('.docs-main') as HTMLElement | null

    const checkIfScrolledToBottom = () => {
      if (!scrollContainer) return
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer && Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { root: scrollContainer || null, rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }

    scrollContainer?.addEventListener('scroll', checkIfScrolledToBottom, { passive: true })

    return () => {
      observer.disconnect()
      scrollContainer?.removeEventListener('scroll', checkIfScrolledToBottom)
    }
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Message Bar</h1>
        <p className="docs-desc">
          A full-width contextual banner inspired by Outlook and Microsoft Word. Supports five
          variants, optional inline action buttons, and an optional dismiss button.
        </p>

        {/* Variants */}
        <section id="variants" className="demo-section">
          <h2>Variants</h2>
          <p className="section-desc">
            Five built-in variants convey different levels of intent and severity.
          </p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="docs-stack">
              <MessageBar variant="info">
                Your subscription renews on May 1, 2026.
              </MessageBar>
              <MessageBar variant="success">
                All changes have been saved and published.
              </MessageBar>
              <MessageBar variant="warning">
                This document has unsaved changes. Save before closing.
              </MessageBar>
              <MessageBar variant="danger">
                Authentication failed. Your session will expire in 2 minutes.
              </MessageBar>
              <MessageBar variant="neutral">
                This file is read-only. Request edit access to make changes.
              </MessageBar>
            </div>
          </CodePreview>
        </section>

        {/* With Title */}
        <section id="with-title" className="demo-section">
          <h2>With Title</h2>
          <p className="section-desc">
            Add a bold title before the message text for extra emphasis.
          </p>
          <CodePreview code={WITH_TITLE_CODE}>
            <div className="docs-stack">
              <MessageBar variant="warning" title="Protected View">
                This file came from an external source. Enable editing only if you trust the source.
              </MessageBar>
              <MessageBar variant="info" title="Update Available">
                A new version of this application is ready to install.
              </MessageBar>
              <MessageBar variant="danger" title="Access Denied">
                You do not have permission to view this record.
              </MessageBar>
            </div>
          </CodePreview>
        </section>

        {/* With Actions */}
        <section id="actions" className="demo-section">
          <h2>With Actions</h2>
          <p className="section-desc">
            Provide inline <code>actions</code> to offer quick, contextual operations without
            navigating away.
          </p>
          <CodePreview files={actionsFiles}>
            <div className="docs-stack">
              <MessageBar variant="warning" title="Protected View" actions={enableEditingActions}>
                This file came from an external source. Enable editing only if you trust the source.
              </MessageBar>
              <MessageBar variant="info" title="Update Available" actions={updateActions}>
                Version 3.4.1 is ready to install with performance improvements and bug fixes.
              </MessageBar>
              <MessageBar variant="success" actions={shareActions}>
                Your report has been generated and is ready to share.
              </MessageBar>
              <MessageBar variant="danger" title="License Expired" actions={renewActions}>
                Your license expired 3 days ago. Some features have been disabled.
              </MessageBar>
            </div>
          </CodePreview>
        </section>

        {/* Dismissible */}
        <section id="dismissible" className="demo-section">
          <h2>Dismissible</h2>
          <p className="section-desc">
            Enable the <code>dismissible</code> prop to show a close button. The bar calls the
            <code>onClose</code> callback when dismissed.
          </p>
          <CodePreview files={dismissibleFiles}>
            <div className="docs-stack">
              {showInfoBar ? (
                <MessageBar variant="info" dismissible onClose={() => setShowInfoBar(false)}>
                  You can dismiss this bar by clicking the X button.
                </MessageBar>
              ) : (
                <p className="section-desc">
                  Info bar dismissed.{' '}
                  <button className="reset-btn" onClick={() => setShowInfoBar(true)}>Show again</button>
                </p>
              )}
              {showWarningBar ? (
                <MessageBar
                  variant="warning"
                  title="Expiring Soon"
                  dismissible
                  actions={renewSmallActions}
                  onClose={() => setShowWarningBar(false)}
                >
                  Your trial ends in 7 days.
                </MessageBar>
              ) : (
                <p className="section-desc">
                  Warning bar dismissed.{' '}
                  <button className="reset-btn" onClick={() => setShowWarningBar(true)}>Show again</button>
                </p>
              )}
            </div>
          </CodePreview>
        </section>

        {/* Non-Dismissible */}
        <section id="non-dismissible" className="demo-section">
          <h2>Non-Dismissible</h2>
          <p className="section-desc">
            By default <code>dismissible</code> is <code>false</code>. Use this for persistent
            system messages that must be acknowledged via an action.
          </p>
          <CodePreview files={nonDismissibleFiles}>
            <div className="docs-stack">
              <MessageBar variant="danger" title="Account Suspended" actions={contactActions}>
                Your account has been suspended due to a payment failure. Contact support to restore access.
              </MessageBar>
            </div>
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
                <tr>
                  <td><code>variant</code></td>
                  <td><code>'info' | 'success' | 'warning' | 'danger' | 'neutral'</code></td>
                  <td><code>'info'</code></td>
                  <td>Visual style of the message bar</td>
                </tr>
                <tr>
                  <td><code>title</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Optional bold label before the message text</td>
                </tr>
                <tr>
                  <td><code>dismissible</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Show a close button to let the user dismiss the bar</td>
                </tr>
                <tr>
                  <td><code>actions</code></td>
                  <td><code>MessageBarAction[]</code></td>
                  <td><code>[]</code></td>
                  <td>Inline action buttons rendered after the message content</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>onClose</code></td>
                  <td><code>() =&gt; void</code></td>
                  <td>Called when the user dismisses the bar</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>MessageBarAction</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>Button text</td>
                </tr>
                <tr>
                  <td><code>action</code></td>
                  <td><code>() =&gt; void</code></td>
                  <td>Callback invoked on button click</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
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
