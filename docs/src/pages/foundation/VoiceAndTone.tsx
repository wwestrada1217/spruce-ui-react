const PRINCIPLES = [
  {
    title: 'Clarity over cleverness',
    description:
      'Users scan interfaces, they do not read them. Choose the simplest phrasing that conveys the meaning. If a sentence needs re-reading, rewrite it.',
  },
  {
    title: 'Concise by default',
    description:
      'Every word must earn its place. Trim filler words, redundant phrases, and unnecessary qualifiers. Short copy loads faster in the brain.',
  },
  {
    title: 'Helpful, not bossy',
    description:
      'Guide users toward actions without commanding them. Offer context where it reduces uncertainty, and stay out of the way when it does not.',
  },
  {
    title: 'Consistent everywhere',
    description:
      'The same action should use the same label across every screen. Consistent terminology builds trust and reduces cognitive overhead.',
  },
]

const VOICE_TRAITS = [
  {
    name: 'Professional',
    description:
      'We sound competent and trustworthy. Our language inspires confidence without being stiff or corporate.',
    do: 'Your changes have been saved.',
    dont: 'Awesome! Your stuff is all good now!',
  },
  {
    name: 'Direct',
    description:
      'We get to the point. We front-load the most important information and avoid unnecessary preamble.',
    do: '3 items could not be deleted.',
    dont: 'We wanted to let you know that unfortunately, it was not possible to delete 3 of the items you selected.',
  },
  {
    name: 'Approachable',
    description:
      'We use plain language that feels human. Technical jargon is replaced with simple terms where possible.',
    do: 'Something went wrong. Try again in a few minutes.',
    dont: 'Error 503: Service temporarily unavailable. Retry after backoff.',
  },
  {
    name: 'Respectful',
    description:
      'We never blame the user. When something goes wrong, we focus on the solution, not the cause.',
    do: 'That password is too short. Use at least 8 characters.',
    dont: 'You entered an invalid password.',
  },
]

const TONE_SPECTRUM = [
  { context: 'Error', mood: 'Calm & clear', position: 25, example: 'Could not save. Check your connection and try again.' },
  { context: 'Warning', mood: 'Attentive', position: 35, example: 'This action will remove all filters. Continue?' },
  { context: 'Informational', mood: 'Neutral', position: 50, example: '12 results match your search.' },
  { context: 'Success', mood: 'Reassuring', position: 70, example: 'Report exported successfully.' },
  { context: 'Onboarding', mood: 'Encouraging', position: 80, example: 'Great start. Add your first team member to continue.' },
  { context: 'Empty state', mood: 'Inviting', position: 75, example: 'No projects yet. Create one to get started.' },
]

const GUIDELINES = [
  {
    title: 'Use active voice',
    description: 'Active voice is shorter, clearer, and puts the user in control.',
    examples: [
      { do: 'Save your changes before leaving.', dont: 'Changes should be saved before leaving.' },
      { do: 'The system archived 5 records.', dont: '5 records were archived by the system.' },
    ],
  },
  {
    title: 'Lead with the action',
    description: 'Start sentences and labels with the verb or the most important information.',
    examples: [
      { do: 'Delete this project?', dont: 'Are you sure you want to delete this project?' },
      { do: 'Export as CSV', dont: 'Click here to export data as CSV' },
    ],
  },
  {
    title: 'Avoid jargon',
    description: 'Replace technical terms with plain equivalents unless the audience is developers.',
    examples: [
      { do: 'Session expired. Sign in again.', dont: 'Auth token invalidated. Re-authenticate.' },
      { do: 'No internet connection.', dont: 'Network request failed: ERR_NETWORK.' },
    ],
  },
  {
    title: 'Be specific',
    description: 'Vague copy creates uncertainty. Give users the details they need to make decisions.',
    examples: [
      { do: '2 fields need attention.', dont: 'There are errors in the form.' },
      { do: 'Uploads up to 25 MB.', dont: 'Large files may not be supported.' },
    ],
  },
]

const COMPONENT_COPY = [
  {
    component: 'Buttons',
    rules: [
      'Use a verb or verb phrase: "Save", "Create project", "Export CSV".',
      'Avoid generic labels like "OK", "Submit", or "Click here".',
      'Destructive actions should name what is being destroyed: "Delete account".',
      'Keep labels to 1\u20133 words when possible.',
    ],
  },
  {
    component: 'Alerts & Messages',
    rules: [
      'Lead with what happened, then what to do about it.',
      'Error messages must be actionable: tell users how to fix the problem.',
      'Do not use "Oops", "Uh oh", or other filler interjections.',
      'Success messages can be brief: "Saved." or "Report exported."',
    ],
  },
  {
    component: 'Form Labels & Placeholders',
    rules: [
      'Labels describe the field: "Email address", "Start date".',
      'Placeholders show format hints, not duplicate labels: "name@example.com".',
      'Help text goes below the field, not inside it.',
      'Validation messages should state the requirement, not the failure: "Enter at least 8 characters" instead of "Too short".',
    ],
  },
  {
    component: 'Empty States',
    rules: [
      'Describe what will appear here once there is data.',
      'Include a clear call to action when the user can resolve the empty state.',
      'Keep the tone inviting, not apologetic.',
      'Avoid "Nothing here" or "No data found" without context.',
    ],
  },
  {
    component: 'Modals & Dialogs',
    rules: [
      'Title should name the action: "Delete project?" not "Confirm".',
      'Body copy should explain consequences or provide context.',
      'Primary action label should match the title verb: "Delete" not "OK".',
      'Provide a clear escape: "Cancel" is always available.',
    ],
  },
  {
    component: 'Tooltips',
    rules: [
      'Keep to one sentence or a short phrase.',
      'Provide supplementary information, not essential instructions.',
      'Do not repeat the label the tooltip is attached to.',
      'Avoid interactive content inside tooltips.',
    ],
  },
]

const FORMATTING_RULES = [
  { element: 'Headings', convention: 'Sentence case', example: 'Account settings' },
  { element: 'Buttons', convention: 'Sentence case', example: 'Create project' },
  { element: 'Menu items', convention: 'Sentence case', example: 'Export as PDF' },
  { element: 'Column headers', convention: 'Sentence case', example: 'Last modified' },
  { element: 'Tooltips', convention: 'Sentence case, no period', example: 'Copy to clipboard' },
  { element: 'Labels', convention: 'Sentence case, no colon', example: 'Email address' },
  { element: 'Placeholders', convention: 'Sentence case, no period', example: 'Search by name' },
  { element: 'Sentences', convention: 'End with a period', example: 'Your changes have been saved.' },
  { element: 'Lists', convention: 'No periods unless full sentences', example: 'Keyboard shortcuts' },
  { element: 'Dates', convention: 'Use relative when < 7 days, else absolute', example: '2 hours ago / Apr 12, 2026' },
  { element: 'Numbers', convention: 'Use locale-aware formatting', example: '1,234.56' },
]

const INCLUSIVE_RULES = [
  { do: 'They submitted the form.', dont: 'He submitted the form.', why: 'Use gender-neutral pronouns unless the gender is known.' },
  { do: 'Sign in', dont: 'Log in', why: '"Sign in" is clearer and more universally understood.' },
  { do: 'Enter your details.', dont: "It's easy! Just fill this out.", why: 'What feels easy to one person may not feel easy to another.' },
  { do: 'Select a date.', dont: 'Simply pick a date.', why: 'Words like "simply" and "just" can feel dismissive.' },
  { do: 'Requires a keyboard shortcut.', dont: 'Just hit Ctrl+S.', why: 'Not all users interact with keyboards. Describe the action, not the mechanic.' },
  { do: 'Allowlist / Blocklist', dont: 'Whitelist / Blacklist', why: 'Use terminology that does not carry racial connotations.' },
]

export function VoiceAndTonePage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Voice &amp; Tone</h1>
        <p className="page-lead">
          Guidelines for writing clear, consistent, and human interface copy
          across the design system.
        </p>
      </div>

      <section id="principles" className="doc-section">
        <h2>Principles</h2>
        <p className="section-desc">
          Every word in the interface is part of the user experience. These
          principles ensure our copy works as hard as the components it lives in.
        </p>
        <div className="vt-principle-grid">
          {PRINCIPLES.map(p => (
            <div key={p.title} className="vt-principle">
              <div className="vt-principle-title">{p.title}</div>
              <div className="vt-principle-desc">{p.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="voice" className="doc-section">
        <h2>Voice</h2>
        <p className="section-desc">
          Voice is the personality behind our words. It stays the same regardless
          of context. Our voice is professional, direct, and approachable.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-space-4, 16px)' }}>
          {VOICE_TRAITS.map(trait => (
            <div key={trait.name} className="vt-trait-card">
              <h3 className="vt-trait-name">{trait.name}</h3>
              <p className="vt-trait-desc">{trait.description}</p>
              <div className="vt-example-grid">
                <div className="vt-example do">
                  <div className="vt-example-badge">Do</div>
                  <div>{trait.do}</div>
                </div>
                <div className="vt-example dont">
                  <div className="vt-example-badge">Don't</div>
                  <div>{trait.dont}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tone-spectrum" className="doc-section">
        <h2>Tone Spectrum</h2>
        <p className="section-desc">
          Tone shifts depending on context. An error message sounds different
          from a success celebration, but both still sound like us.
        </p>
        <div className="vt-spectrum">
          {TONE_SPECTRUM.map(tone => (
            <div key={tone.context} className="vt-spectrum-row">
              <div className="vt-spectrum-label">
                <span className="vt-spectrum-context">{tone.context}</span>
                <span className="vt-spectrum-mood">{tone.mood}</span>
              </div>
              <div className="vt-spectrum-bar" style={{ '--tone-pos': `${tone.position}%` } as React.CSSProperties}>
                <div className="vt-spectrum-track">
                  <div className="vt-spectrum-marker" />
                </div>
              </div>
              <p className="vt-spectrum-example">"{tone.example}"</p>
            </div>
          ))}
          <div className="vt-spectrum-axis">
            <span>Serious</span>
            <span>Neutral</span>
            <span>Encouraging</span>
          </div>
        </div>
      </section>

      <section id="writing-guidelines" className="doc-section">
        <h2>Writing Guidelines</h2>
        <p className="section-desc">
          Practical rules for writing interface copy that is clear, scannable,
          and accessible.
        </p>
        {GUIDELINES.map(guideline => (
          <div key={guideline.title} className="vt-guideline-block">
            <h3>{guideline.title}</h3>
            <p>{guideline.description}</p>
            <table className="token-table">
              <thead>
                <tr>
                  <th>Do</th>
                  <th>Don't</th>
                </tr>
              </thead>
              <tbody>
                {guideline.examples.map(row => (
                  <tr key={row.do}>
                    <td style={{ color: 'var(--success)' }}>{row.do}</td>
                    <td style={{ color: 'var(--danger)' }}>{row.dont}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section id="component-copy" className="doc-section">
        <h2>Component Copy</h2>
        <p className="section-desc">
          Guidance for writing copy within specific UI components.
        </p>
        <div className="vt-component-copy-list">
          {COMPONENT_COPY.map(item => (
            <div key={item.component} className="vt-component-copy-item">
              <h3>{item.component}</h3>
              <ul>
                {item.rules.map(rule => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="formatting" className="doc-section">
        <h2>Formatting</h2>
        <p className="section-desc">
          Conventions for capitalization, punctuation, and structure.
        </p>
        <table className="token-table" aria-label="Formatting conventions">
          <thead>
            <tr>
              <th>Element</th>
              <th>Convention</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {FORMATTING_RULES.map(rule => (
              <tr key={rule.element}>
                <td style={{ fontWeight: 600 }}>{rule.element}</td>
                <td>{rule.convention}</td>
                <td><code>{rule.example}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="inclusive-language" className="doc-section">
        <h2>Inclusive Language</h2>
        <p className="section-desc">
          Write for everyone. Inclusive language is respectful, precise, and
          avoids assumptions.
        </p>
        <table className="token-table" aria-label="Inclusive language guidelines">
          <thead>
            <tr>
              <th>Do</th>
              <th>Don't</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {INCLUSIVE_RULES.map(item => (
              <tr key={item.do}>
                <td style={{ color: 'var(--success)' }}>{item.do}</td>
                <td style={{ color: 'var(--danger)' }}>{item.dont}</td>
                <td>{item.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
