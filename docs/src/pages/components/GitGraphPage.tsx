import { useState, useEffect, useRef } from 'react'
import { GitGraph } from 'spruce-react'
import type { GitGraphCommit, GitGraphBranch } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

/* ── Example data ───────────────────────────────────────────────────────── */

const basicCommits: GitGraphCommit[] = [
  { hash: 'f4e8a12', message: 'Fix login validation bug', author: 'Alice', date: '2 hours ago', branch: 'main', parents: ['c3d7b09'], refs: ['HEAD', 'main'] },
  { hash: 'c3d7b09', message: 'Add user dashboard page', author: 'Bob', date: '5 hours ago', branch: 'main', parents: ['a1e6f34'] },
  { hash: 'a1e6f34', message: 'Update project dependencies', author: 'Alice', date: 'yesterday', branch: 'main', parents: ['9b2c4d8'] },
  { hash: '9b2c4d8', message: 'Initial project setup', author: 'Alice', date: '3 days ago', branch: 'main', parents: [] },
]

const branchCommits: GitGraphCommit[] = [
  { hash: 'aa11bb', message: 'Merge feature/auth into main', author: 'Alice', date: '1 hour ago', branch: 'main', parents: ['bb22cc', 'dd44ee'], refs: ['HEAD', 'main'] },
  { hash: 'bb22cc', message: 'Fix typo in readme', author: 'Bob', date: '2 hours ago', branch: 'main', parents: ['ff66aa'] },
  { hash: 'dd44ee', message: 'Add OAuth2 support', author: 'Carol', date: '3 hours ago', branch: 'feature/auth', parents: ['ee55ff'], refs: ['feature/auth'] },
  { hash: 'ee55ff', message: 'Implement login page', author: 'Carol', date: '5 hours ago', branch: 'feature/auth', parents: ['ff66aa'] },
  { hash: 'ff66aa', message: 'Configure CI pipeline', author: 'Alice', date: '1 day ago', branch: 'main', parents: ['0011ab'] },
  { hash: '0011ab', message: 'Initial commit', author: 'Alice', date: '2 days ago', branch: 'main', parents: [] },
]

const tagCommits: GitGraphCommit[] = [
  { hash: 'ta11', message: 'Bump version to 2.1.0', author: 'Alice', date: '1 hour ago', branch: 'main', parents: ['ta22'], refs: ['HEAD', 'main'], tags: ['v2.1.0'] },
  { hash: 'ta22', message: 'Fix pagination offset', author: 'Bob', date: '4 hours ago', branch: 'main', parents: ['ta33'] },
  { hash: 'ta33', message: 'Release 2.0', author: 'Alice', date: '2 days ago', branch: 'main', parents: ['ta44'], tags: ['v2.0.0'] },
  { hash: 'ta44', message: 'Add search feature', author: 'Carol', date: '3 days ago', branch: 'main', parents: ['ta55'] },
  { hash: 'ta55', message: 'Initial release', author: 'Alice', date: '1 week ago', branch: 'main', parents: [], tags: ['v1.0.0'] },
]

const complexCommits: GitGraphCommit[] = [
  { hash: 'h1a2b3', message: 'Release v2.0', branch: 'main', parents: ['h2c4d5'], author: 'Alice', date: '30 min ago', refs: ['HEAD', 'main'], tags: ['v2.0.0'] },
  { hash: 'h2c4d5', message: 'Merge feature/dashboard', branch: 'main', parents: ['h3e6f7', 'f3k2l3'], author: 'Alice', date: '1 hour ago' },
  { hash: 'f3k2l3', message: 'Add chart widgets', branch: 'feature/dashboard', parents: ['f2j1k2'], author: 'Dave', date: '2 hours ago', refs: ['feature/dashboard'] },
  { hash: 'h3e6f7', message: 'Merge hotfix/security', branch: 'main', parents: ['h4g8h9', 'x1m3n4'], author: 'Bob', date: '3 hours ago' },
  { hash: 'x1m3n4', message: 'Patch XSS vulnerability', branch: 'hotfix/security', parents: ['h4g8h9'], author: 'Bob', date: '4 hours ago', refs: ['hotfix/security'] },
  { hash: 'f2j1k2', message: 'Add data grid view', branch: 'feature/dashboard', parents: ['f1i0j1'], author: 'Dave', date: '5 hours ago' },
  { hash: 'h4g8h9', message: 'Update API endpoints', branch: 'main', parents: ['h5a1b2'], author: 'Alice', date: '6 hours ago' },
  { hash: 'f1i0j1', message: 'Create dashboard layout', branch: 'feature/dashboard', parents: ['h5a1b2'], author: 'Dave', date: '1 day ago' },
  { hash: 'h5a1b2', message: 'Refactor auth module', branch: 'main', parents: ['h6c3d4'], author: 'Carol', date: '2 days ago', tags: ['v1.9.0'] },
  { hash: 'h6c3d4', message: 'Initial commit', branch: 'main', parents: [], author: 'Alice', date: '1 week ago' },
]

const customBranches: GitGraphBranch[] = [
  { name: 'main', color: '#6366f1' },
  { name: 'feature/auth', color: '#f43f5e' },
]

/* ── Code snippets ──────────────────────────────────────────────────────── */

const basicCode = `<GitGraph commits={commits} />

// commits: GitGraphCommit[] = [
//   { hash: 'f4e8a12', message: 'Fix login validation',
//     author: 'Alice', date: '2 hours ago',
//     branch: 'main', parents: ['c3d7b09'],
//     refs: ['HEAD', 'main'] },
//   { hash: 'c3d7b09', message: 'Add user dashboard',
//     author: 'Bob', date: '5 hours ago',
//     branch: 'main', parents: ['a1e6f34'] },
//   ...
// ];`

const branchCode = `<GitGraph commits={commits} />

// Merge commits have multiple parents:
// { hash: 'aa11bb',
//   message: 'Merge feature/auth into main',
//   branch: 'main',
//   parents: ['bb22cc', 'dd44ee'],
//   refs: ['HEAD', 'main'] }`

const tagsCode = `<GitGraph commits={commits} />

// Add tags and refs to commits:
// { hash: 'ta11',
//   message: 'Bump version to 2.1.0',
//   branch: 'main', parents: ['ta22'],
//   refs: ['HEAD', 'main'],
//   tags: ['v2.1.0'] }`

const complexCode = `<GitGraph commits={commits} />

// Supports multiple branches, merges,
// hotfixes, tags and refs in a single graph.`

const colorsCode = `<GitGraph
  commits={commits}
  branches={customBranches}
/>

// customBranches: GitGraphBranch[] = [
//   { name: 'main', color: '#6366f1' },
//   { name: 'feature/auth', color: '#f43f5e' },
// ];`

/* ── Sections ───────────────────────────────────────────────────────────── */

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'branches', label: 'Branches & Merges' },
  { id: 'tags', label: 'Tags & Refs' },
  { id: 'complex', label: 'Complex History' },
  { id: 'colors', label: 'Custom Colors' },
  { id: 'api', label: 'API' },
]

/* ── Page component ─────────────────────────────────────────────────────── */

export function GitGraphPage() {
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
        <h1>Git Graph</h1>
        <p className="docs-desc">
          Visualize git commit history as an interactive graph with branches, merges, tags, and refs.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A simple linear commit history on a single branch.</p>
          <CodePreview code={basicCode}>
            <GitGraph commits={basicCommits} />
          </CodePreview>
        </section>

        <section id="branches" className="demo-section" aria-labelledby="branches-heading">
          <h2 id="branches-heading">Branches &amp; Merges</h2>
          <p className="section-desc">
            Commits across multiple branches with merge points. Merge commits are displayed as
            ring-shaped nodes to distinguish them from regular commits.
          </p>
          <CodePreview code={branchCode}>
            <GitGraph commits={branchCommits} />
          </CodePreview>
        </section>

        <section id="tags" className="demo-section" aria-labelledby="tags-heading">
          <h2 id="tags-heading">Tags &amp; Refs</h2>
          <p className="section-desc">
            Display branch refs and version tags alongside commit messages.
            Refs are colored to match their branch; tags use a distinct warning accent.
          </p>
          <CodePreview code={tagsCode}>
            <GitGraph commits={tagCommits} />
          </CodePreview>
        </section>

        <section id="complex" className="demo-section" aria-labelledby="complex-heading">
          <h2 id="complex-heading">Complex History</h2>
          <p className="section-desc">
            A realistic repository history with multiple feature branches, hotfixes, merges, tags,
            and refs.
          </p>
          <CodePreview code={complexCode}>
            <GitGraph commits={complexCommits} />
          </CodePreview>
        </section>

        <section id="colors" className="demo-section" aria-labelledby="colors-heading">
          <h2 id="colors-heading">Custom Branch Colors</h2>
          <p className="section-desc">
            Override the default palette by passing a <code>branches</code> array with custom colors.
          </p>
          <CodePreview code={colorsCode}>
            <GitGraph commits={branchCommits} branches={customBranches} />
          </CodePreview>
        </section>

        {/* ── API ─────────────────────────────────────────────────────── */}

        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>GitGraph</h3>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>commits</code></td><td><code>GitGraphCommit[]</code></td><td><em>required</em></td><td>Commits in display order (newest first)</td></tr>
                <tr><td><code>branches</code></td><td><code>GitGraphBranch[]</code></td><td><code>[]</code></td><td>Optional per-branch color overrides</td></tr>
                <tr><td><code>rowHeight</code></td><td><code>number</code></td><td><code>48</code></td><td>Height of each commit row in pixels</td></tr>
                <tr><td><code>laneWidth</code></td><td><code>number</code></td><td><code>28</code></td><td>Width of each branch lane in pixels</td></tr>
                <tr><td><code>nodeRadius</code></td><td><code>number</code></td><td><code>5</code></td><td>Radius of commit dot in pixels</td></tr>
                <tr><td><code>selectedHash</code></td><td><code>string | null</code></td><td>-</td><td>Controlled selected commit hash</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Git commit history'</code></td><td>Accessible history label</td></tr>
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
                  <td><code>onCommitClick</code>, <code>onCommitSelect</code></td>
                  <td><code>{'(commit: GitGraphCommit) => void'}</code></td>
                  <td>Called when a commit row is activated</td>
                </tr>
                <tr><td><code>onCommitContextMenu</code></td><td><code>&#123; commit, event &#125;</code></td><td>Called for a commit context-menu request</td></tr>
              </tbody>
            </table>
          </div>

          <h3>GitGraphCommit</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>hash</code></td><td><code>string</code></td><td>Full SHA hash</td></tr>
                <tr><td><code>abbreviatedHash</code></td><td><code>string?</code></td><td>Short hash for display (defaults to first 7 chars)</td></tr>
                <tr><td><code>message</code></td><td><code>string</code></td><td>First line of the commit message</td></tr>
                <tr><td><code>author</code></td><td><code>string?</code></td><td>Author name</td></tr>
                <tr><td><code>date</code></td><td><code>string?</code></td><td>Formatted date string</td></tr>
                <tr><td><code>branch</code></td><td><code>string</code></td><td>Branch this commit belongs to</td></tr>
                <tr><td><code>parents</code></td><td><code>string[]?</code></td><td>Parent commit hashes (merge commits have 2+)</td></tr>
                <tr><td><code>tags</code></td><td><code>string[]?</code></td><td>Tag names pointing at this commit</td></tr>
                <tr><td><code>refs</code></td><td><code>string[]?</code></td><td>Branch ref labels (e.g. HEAD, main)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>GitGraphBranch</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>name</code></td><td><code>string</code></td><td>Branch name (must match commit.branch)</td></tr>
                <tr><td><code>color</code></td><td><code>string?</code></td><td>CSS color value</td></tr>
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
