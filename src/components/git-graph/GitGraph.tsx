/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useMemo, useCallback } from 'react';
import { Icon } from '../../icons/Icon';
import './GitGraph.css';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';

// ── Types ───────────────────────────────────────────────────────────────────

/** A single commit in the graph. */
export interface GitGraphCommit {
  /** Full SHA hash. */
  hash: string;
  /** Optional abbreviated hash for display (defaults to first 7 chars). */
  abbreviatedHash?: string;
  /** First line of the commit message. */
  message: string;
  /** Author name. */
  author?: string;
  /** Formatted date string. */
  date?: string;
  /** Branch this commit belongs to. */
  branch: string;
  /** Parent commit hashes. Merge commits have two or more parents. */
  parents?: string[];
  /** Tag names pointing at this commit. */
  tags?: string[];
  /** Branch ref names visible at this commit (e.g. HEAD, main). */
  refs?: string[];
}

/** Optional per-branch color override. */
export interface GitGraphBranch {
  /** Branch name — must match GitGraphCommit.branch. */
  name: string;
  /** Any valid CSS color value. */
  color?: string;
}

export interface GitGraphProps {
  /** Commits in display order (newest first). */
  commits: GitGraphCommit[];
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  /** Optional branch color overrides. */
  branches?: GitGraphBranch[];
  /** Height of each commit row in pixels. */
  rowHeight?: number;
  /** Width of each branch lane in pixels. */
  laneWidth?: number;
  /** Radius of commit dot in pixels. */
  nodeRadius?: number;
  /** Called when a commit row is clicked. */
  onCommitClick?: (commit: GitGraphCommit) => void;
  /** Controlled selected commit hash. */
  selectedHash?: string | null;
  /** Called when the selected commit changes. */
  onCommitSelect?: (commit: GitGraphCommit) => void;
  /** Called for a commit context-menu request. */
  onCommitContextMenu?: (payload: { commit: GitGraphCommit; event: React.MouseEvent<HTMLDivElement> }) => void;
  /** Accessible label for the history log. */
  ariaLabel?: string;
  /** Additional CSS class name(s). */
  className?: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const BRANCH_COLORS = [
  'var(--sp-primary, #2563eb)',
  'var(--sp-success, #16a34a)',
  'var(--sp-danger, #dc2626)',
  '#8b5cf6',
  'var(--sp-warning, #d97706)',
  'var(--sp-info, #0891b2)',
  '#ec4899',
  '#f97316',
];

// ── Internal types ──────────────────────────────────────────────────────────

interface LayoutNode {
  commit: GitGraphCommit;
  x: number;
  y: number;
  color: string;
  isMerge: boolean;
}

interface LayoutEdge {
  path: string;
  color: string;
}

// ── Component ───────────────────────────────────────────────────────────────

export function GitGraph({
  commits,
  chrome = 'default',
  radius,
  border = 'default',
  branches = [],
  rowHeight = 48,
  laneWidth = 28,
  nodeRadius = 5,
  onCommitClick,
  selectedHash: controlledSelectedHash,
  onCommitSelect,
  onCommitContextMenu,
  ariaLabel = 'Git commit history',
  className = '',
}: GitGraphProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selected = controlledSelectedHash !== undefined ? controlledSelectedHash : internalSelected;

  const layout = useMemo(() => {
    if (commits.length === 0) {
      return { nodes: [] as LayoutNode[], edges: [] as LayoutEdge[], graphWidth: 0, totalHeight: 0 };
    }

    /* ---- lane & colour assignment ---- */
    const branchLane = new Map<string, number>();
    const branchColor = new Map<string, string>();
    const commitRow = new Map<string, number>();
    let nextLane = 0;

    for (let i = 0; i < commits.length; i++) {
      const c = commits[i];
      commitRow.set(c.hash, i);
      if (!branchLane.has(c.branch)) {
        const def = branches.find((b) => b.name === c.branch);
        branchColor.set(
          c.branch,
          def?.color ?? BRANCH_COLORS[nextLane % BRANCH_COLORS.length],
        );
        branchLane.set(c.branch, nextLane++);
      }
    }

    const graphWidth = nextLane * laneWidth + laneWidth / 2;
    const totalHeight = commits.length * rowHeight;

    /* ---- nodes ---- */
    const nodes: LayoutNode[] = commits.map((commit, row) => ({
      commit,
      x: branchLane.get(commit.branch)! * laneWidth + laneWidth / 2,
      y: row * rowHeight + rowHeight / 2,
      color: branchColor.get(commit.branch)!,
      isMerge: (commit.parents?.length ?? 0) > 1,
    }));

    /* ---- edges ---- */
    const edges: LayoutEdge[] = [];

    for (const node of nodes) {
      const parents = node.commit.parents;
      if (!parents) continue;

      for (let p = 0; p < parents.length; p++) {
        const parentIdx = commitRow.get(parents[p]);
        if (parentIdx === undefined) continue;
        const parent = nodes[parentIdx];

        const color = p === 0 ? node.color : parent.color;
        const x1 = node.x;
        const y1 = node.y;
        const x2 = parent.x;
        const y2 = parent.y;

        const path =
          x1 === x2
            ? `M${x1} ${y1}L${x2} ${y2}`
            : `M${x1} ${y1}C${x1} ${(y1 + y2) / 2},${x2} ${(y1 + y2) / 2},${x2} ${y2}`;

        edges.push({ path, color });
      }
    }

    return { nodes, edges, graphWidth, totalHeight };
  }, [commits, branches, rowHeight, laneWidth]);

  const selectRow = useCallback(
    (commit: GitGraphCommit) => {
      if (controlledSelectedHash === undefined) setInternalSelected(commit.hash);
      onCommitClick?.(commit);
      onCommitSelect?.(commit);
    },
    [controlledSelectedHash, onCommitClick, onCommitSelect],
  );

  const commitLabel = (c: GitGraphCommit): string => {
    const hash = c.abbreviatedHash ?? c.hash.substring(0, 7);
    return `${c.message} (${hash})${c.author ? ' by ' + c.author : ''}`;
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, commit: GitGraphCommit) => {
    if (e.key === 'Enter') {
      selectRow(commit);
    } else if (e.key === ' ') {
      e.preventDefault();
      selectRow(commit);
    }
  };

  const classes = [
    'sp-git-graph',
    `sp-chrome--${chrome}`,
    radius && `sp-radius--${radius}`,
    `sp-border--${border}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role="log"
      aria-label={`${ariaLabel} with ${commits.length} commits`}
    >
      <svg
        className="sp-git-graph__svg"
        width={layout.graphWidth}
        height={layout.totalHeight}
        aria-hidden="true"
      >
        {layout.edges.map((edge, idx) => (
          <path
            key={idx}
            d={edge.path}
            stroke={edge.color}
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}
        {layout.nodes.map((node) =>
          node.isMerge ? (
            <g key={node.commit.hash}>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 1}
                fill={node.color}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius - 2}
                fill="var(--sp-surface-0, #fff)"
              />
            </g>
          ) : (
            <circle
              key={node.commit.hash}
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill={node.color}
            />
          ),
        )}
      </svg>

      <div className="sp-git-graph__rows">
        {layout.nodes.map((node) => (
          <div
            key={node.commit.hash}
            className={`sp-git-graph__row${selected === node.commit.hash ? ' sp-git-graph__row--selected' : ''}`}
            style={{ height: rowHeight }}
            onClick={() => selectRow(node.commit)}
            onContextMenu={(event) => {
              event.preventDefault();
              onCommitContextMenu?.({ commit: node.commit, event });
            }}
            onKeyDown={(e) => handleRowKeyDown(e, node.commit)}
            tabIndex={0}
            role="button"
            aria-current={selected === node.commit.hash ? 'true' : undefined}
            aria-label={commitLabel(node.commit)}
          >
            <div className="sp-git-graph__top-line">
              {(node.commit.refs ?? []).map((ref) => {
                const isTag = ref.startsWith('tag:');
                const label = isTag ? ref.slice(4) : ref;
                return (
                  <span
                    key={ref}
                    className={isTag ? 'sp-git-graph__tag' : 'sp-git-graph__ref'}
                    style={!isTag ? { '--_ref': node.color } as React.CSSProperties : undefined}
                  >
                    <Icon name={isTag ? 'tag' : 'git-branch'} size={11} />
                    {label}
                  </span>
                );
              })}
              {(node.commit.tags ?? []).map((tag) => (
                <span key={tag} className="sp-git-graph__tag">
                  <Icon name="tag" size={11} />
                  {tag}
                </span>
              ))}
              <span className="sp-git-graph__message">{node.commit.message}</span>
            </div>
            <div className="sp-git-graph__bottom-line">
              <code className="sp-git-graph__hash">
                {node.commit.abbreviatedHash ?? node.commit.hash.substring(0, 7)}
              </code>
              {node.commit.author && (
                <span className="sp-git-graph__author">{node.commit.author}</span>
              )}
              {node.commit.date && (
                <span className="sp-git-graph__date">{node.commit.date}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
