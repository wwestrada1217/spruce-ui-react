import { Fragment, useEffect, useRef, useState } from 'react';
import { Badge, Timeline, TimelineItem } from 'spruce-react';
import type { BadgeVariant, TimelineItemColor } from 'spruce-react';
import changelogRaw from '../../../CHANGELOG.md?raw';

/* ── Changelog parsing (Keep a Changelog format) ────────────────────────── */

interface ReleaseSection {
  heading: string;
  items: string[];
}

interface Release {
  version: string;
  date?: string;
  sections: ReleaseSection[];
}

function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  let release: Release | null = null;
  let section: ReleaseSection | null = null;

  for (const line of md.split('\n')) {
    const releaseMatch = line.match(/^## \[([^\]]+)\](?:\s*-\s*(.+))?/);
    if (releaseMatch) {
      release = {
        version: releaseMatch[1],
        date: releaseMatch[2]?.trim(),
        sections: [],
      };
      releases.push(release);
      section = null;
      continue;
    }

    const sectionMatch = line.match(/^### (.+)/);
    if (sectionMatch && release) {
      section = { heading: sectionMatch[1].trim(), items: [] };
      release.sections.push(section);
      continue;
    }

    const itemMatch = line.match(/^[-*] (.+)/);
    if (itemMatch && section) {
      section.items.push(itemMatch[1].trim());
    }
  }

  return releases;
}

const RELEASES = parseChangelog(changelogRaw);

/* ── Rendering helpers ──────────────────────────────────────────────────── */

const SECTION_VARIANTS: Record<string, BadgeVariant> = {
  Added: 'success',
  Changed: 'info',
  Deprecated: 'warning',
  Removed: 'danger',
  Fixed: 'warning',
  Security: 'danger',
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${MONTHS[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}, ${m[1]}`;
}

/** Renders `code` spans inside a changelog entry. */
function renderInline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function itemColor(release: Release, isLatest: boolean): TimelineItemColor {
  if (release.version === 'Unreleased') return 'warning';
  return isLatest ? 'primary' : 'neutral';
}

function releaseId(version: string): string {
  return version === 'Unreleased' ? 'unreleased' : `v${version.replace(/\./g, '-')}`;
}

function releaseLabel(version: string): string {
  return version === 'Unreleased' ? 'Unreleased' : `v${version}`;
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export function ChangelogPage() {
  const latestVersion = RELEASES.find((r) => r.version !== 'Unreleased')?.version;
  const [activeSection, setActiveSection] = useState(
    RELEASES.length > 0 ? releaseId(RELEASES[0].version) : '',
  );
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
    const sections = mainRef.current?.querySelectorAll('.cl-release[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Changelog</h1>
        <p className="docs-desc">
          All notable changes to <code>spruce-react</code>, following the Keep
          a Changelog format and semantic versioning.
        </p>

        <Timeline>
          {RELEASES.map((release) => {
            const isUnreleased = release.version === 'Unreleased';
            const isLatest = release.version === latestVersion;
            return (
              <TimelineItem
                key={release.version}
                icon={isUnreleased ? 'sparkles' : 'tag'}
                color={itemColor(release, isLatest)}
                dotSize={24}
              >
                <div className="cl-release" id={releaseId(release.version)}>
                  <div className="cl-release__head">
                  <h2 className="cl-release__version">
                    {isUnreleased ? 'Unreleased' : `v${release.version}`}
                  </h2>
                  {isLatest && <Badge variant="primary">Latest</Badge>}
                  {isUnreleased && <Badge variant="warning">In progress</Badge>}
                  {release.date && (
                    <span className="cl-release__date">{formatDate(release.date)}</span>
                  )}
                </div>

                {release.sections.map((section) => (
                  <div key={section.heading} className="cl-section">
                    <Badge variant={SECTION_VARIANTS[section.heading] ?? 'default'}>
                      {section.heading}
                    </Badge>
                    <ul className="cl-list">
                      {section.items.map((item, i) => (
                        <li key={i}>{renderInline(item)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TimelineItem>
          );
        })}
        </Timeline>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {RELEASES.map((r) => {
            const id = releaseId(r.version);
            return (
              <li key={id}>
                <a
                  className={`toc-link${activeSection === id ? ' active' : ''}`}
                  onClick={() => scrollTo(id)}
                >
                  {releaseLabel(r.version)}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
