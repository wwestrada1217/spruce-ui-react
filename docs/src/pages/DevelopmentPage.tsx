import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, CardHeader } from 'spruce-react';
import { CodePreview } from '../components/CodePreview';

/* ── Snippets ───────────────────────────────────────────────────────────── */

const INSTALL_NPM = `npm install spruce-react`;

const SETUP_CODE = `// main.tsx
import 'spruce-react/style.css';
import { createRoot } from 'react-dom/client';
import { SpruceProvider } from 'spruce-react';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <SpruceProvider defaultTheme="system">
    <App />
  </SpruceProvider>,
);`;

const USAGE_CODE = `import { Alert, Badge, Button, Card, CardHeader } from 'spruce-react';

export function Example() {
  return (
    <Card>
      <CardHeader>Welcome to Spruce</CardHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Alert variant="info">Everything is themeable via design tokens.</Alert>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="success">Ready</Badge>
          <Button variant="primary" iconLeft="check">Get started</Button>
        </div>
      </div>
    </Card>
  );
}`;

const THEMING_CODE = `// Initial theme: 'light' | 'dark' | 'system'
<SpruceProvider defaultTheme="dark">
  <App />
</SpruceProvider>

// Read or change the theme anywhere below the provider
import { useTheme } from 'spruce-react';

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <Button variant="outline" onClick={toggle}>
      Switch to {resolved === 'dark' ? 'light' : 'dark'} mode
    </Button>
  );
}

// Register a custom icon set (name → SVG string)
<SpruceProvider icons={MY_ICONS}>
  <App />
</SpruceProvider>`;

const DEV_SETUP = `git clone https://github.com/wwestrada1217/spruce-ui-react.git
cd spruce-ui-react

# one install covers the library and the docs site (npm workspaces)
npm install

# start the docs site — the live playground for the library
npm run dev`;

const CONTRIBUTE_FLOW = `# 1. fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/spruce-ui-react.git
cd spruce-ui-react
npm install

# 2. create a feature branch
git checkout -b feat/my-change

# 3. develop against the live docs playground
npm run dev

# 4. make sure everything passes before opening a pull request
npm run build
npm run docs:build
npm run lint`;

const REPO_URL = 'https://github.com/wwestrada1217/spruce-ui-react';
const ISSUES_URL = `${REPO_URL}/issues`;

/* ── Data ───────────────────────────────────────────────────────────────── */

const SCRIPTS: { command: string; description: string }[] = [
  { command: 'npm run dev', description: 'Start the docs site dev server at http://localhost:5173 (imports the library from src/, so changes hot-reload)' },
  { command: 'npm run build', description: 'Type-check and build the library into dist/ (ES, UMD, CSS, .d.ts)' },
  { command: 'npm run docs:build', description: 'Type-check and build the docs site for deployment' },
  { command: 'npm run docs:preview', description: 'Serve the production docs build locally' },
  { command: 'npm run lint', description: 'Lint the whole repository with ESLint' },
];

const LAYOUT: { path: string; description: string }[] = [
  { path: 'src/', description: 'The component library — components, design tokens, icons, theme' },
  { path: 'docs/', description: 'This documentation site — a Vite app with live demos for every component' },
  { path: 'dist/', description: 'Build output — ES + UMD bundles, stylesheet, and TypeScript declarations' },
];

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'installation', label: 'Installation' },
  { id: 'setup',        label: 'Set Up Your App' },
  { id: 'usage',        label: 'Use The Components' },
  { id: 'theming',      label: 'Theming' },
  { id: 'developing',   label: 'Developing' },
  { id: 'contributing', label: 'Contributing' },
  { id: 'issues',       label: 'Reporting An Issue' },
];

/* ── Page ───────────────────────────────────────────────────────────────── */

export function DevelopmentPage() {
  const [activeSection, setActiveSection] = useState('requirements');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 },
    );
    const sections = mainRef.current?.querySelectorAll('section[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Development</h1>
        <p className="docs-desc">
          How to install <code>spruce-react</code> in your application, wire up
          the provider and stylesheet, and work on the design system itself.
        </p>

        <section id="requirements" className="demo-section" aria-labelledby="requirements-heading">
          <h2 id="requirements-heading">Requirements</h2>
          <p className="section-desc">
            Spruce has zero runtime dependencies — it only asks for{' '}
            <code>react</code> and <code>react-dom</code> 19 or newer as peers.
            Every component ships fully typed, so TypeScript works out of the
            box with no extra <code>@types</code> packages.
          </p>
        </section>

        <section id="installation" className="demo-section" aria-labelledby="installation-heading">
          <h2 id="installation-heading">Installation</h2>
          <p className="section-desc">
            Releases are published to the public npm registry as{' '}
            <code>spruce-react</code> — no registry configuration or auth
            required:
          </p>
          <CodePreview codeOnly code={INSTALL_NPM} language="markdown" />
        </section>

        <section id="setup" className="demo-section" aria-labelledby="setup-heading">
          <h2 id="setup-heading">Set Up Your App</h2>
          <p className="section-desc">
            Import the stylesheet once and wrap your application (or the
            subtree that uses Spruce components) with{' '}
            <code>SpruceProvider</code>. The provider activates theme
            management and the icon registry.
          </p>
          <CodePreview codeOnly code={SETUP_CODE} language="typescript" />
        </section>

        <section id="usage" className="demo-section" aria-labelledby="usage-heading">
          <h2 id="usage-heading">Use The Components</h2>
          <p className="section-desc">
            Everything is a named export from <code>spruce-react</code> —
            start composing:
          </p>
          <CodePreview code={USAGE_CODE} language="typescript">
            <Card>
              <CardHeader>Welcome to Spruce</CardHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Alert variant="info">Everything is themeable via design tokens.</Alert>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge variant="success">Ready</Badge>
                  <Button variant="primary" iconLeft="check">Get started</Button>
                </div>
              </div>
            </Card>
          </CodePreview>
        </section>

        <section id="theming" className="demo-section" aria-labelledby="theming-heading">
          <h2 id="theming-heading">Theming</h2>
          <p className="section-desc">
            <code>SpruceProvider</code> controls the initial theme and accepts
            a custom icon registry. Components read design tokens (CSS custom
            properties), so the whole tree re-themes instantly — see the{' '}
            <a href="#/foundation/theming">Theming</a> foundation page for
            presets and token overrides.
          </p>
          <CodePreview codeOnly code={THEMING_CODE} language="typescript" />
        </section>

        <section id="developing" className="demo-section" aria-labelledby="developing-heading">
          <h2 id="developing-heading">Developing The Design System</h2>
          <p className="section-desc">
            The repository is an npm workspace: one install covers both the
            library (<code>src/</code>) and this docs site (<code>docs/</code>).
            The docs site imports the library straight from source, so it
            doubles as a live playground while you build components.
          </p>
          <CodePreview codeOnly code={DEV_SETUP} language="markdown" />

          <h3>Scripts</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {SCRIPTS.map((s) => (
                  <tr key={s.command}>
                    <td><code>{s.command}</code></td>
                    <td>{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Repository Layout</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>What it is</th>
                </tr>
              </thead>
              <tbody>
                {LAYOUT.map((l) => (
                  <tr key={l.path}>
                    <td><code>{l.path}</code></td>
                    <td>{l.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="contributing" className="demo-section" aria-labelledby="contributing-heading">
          <h2 id="contributing-heading">Contributing</h2>
          <p className="section-desc">
            Contributions are welcome — bug fixes, new components, and docs
            improvements alike. The flow is the standard fork-and-pull-request
            model:
          </p>
          <CodePreview codeOnly code={CONTRIBUTE_FLOW} language="markdown" />

          <h3>Conventions</h3>
          <p className="section-desc">
            Keep changes consistent with the codebase: function components with
            exported <code>Props</code> interfaces (no <code>any</code>, no
            classes), co-located plain CSS with <code>sp-</code> prefixed BEM
            classes and design tokens only (no hard-coded colors), components
            own internal padding but no outer margin, form controls are
            controlled and pass the <em>value</em> to <code>onChange</code>,
            and accessibility is non-negotiable — WCAG AA, keyboard support,
            and visible focus.
          </p>

          <h3>Definition Of Done</h3>
          <p className="section-desc">
            A library change is complete when the component and its types are
            exported from <code>src/index.ts</code>, a docs page exists and is
            registered in the app routes and sidebar, <code>npm run build</code>{' '}
            and <code>npm run docs:build</code> pass with no new lint warnings,
            and the change is visually verified in the docs dev server in both
            light and dark themes.
          </p>
          <p className="section-desc">
            When that checks out, open a pull request against <code>main</code>{' '}
            on{' '}
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>{' '}
            with a short description of what changed and why.
          </p>
        </section>

        <section id="issues" className="demo-section" aria-labelledby="issues-heading">
          <h2 id="issues-heading">Reporting An Issue</h2>
          <p className="section-desc">
            Found a bug or unexpected behavior? Open an issue on the{' '}
            <a href={ISSUES_URL} target="_blank" rel="noreferrer">
              GitHub issue tracker
            </a>
            . A good report makes the fix fast — please include:
          </p>
          <ul className="demo-list">
            <li>
              The <code>spruce-react</code> version you are using (see{' '}
              <code>package.json</code> or the badge in this site&rsquo;s
              sidebar).
            </li>
            <li>
              Steps to reproduce — ideally a minimal snippet or a link to a
              reproduction.
            </li>
            <li>What you expected to happen versus what actually happened.</li>
            <li>Browser and operating system.</li>
            <li>
              For visual issues: a screenshot and whether it occurs in light,
              dark, or both themes.
            </li>
          </ul>
          <p className="section-desc">
            Feature requests are welcome through the same tracker — describe
            the use case, not just the solution, so alternatives can be
            considered.
          </p>
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
  );
}
