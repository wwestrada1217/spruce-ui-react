# Codex Instructions For Spruce React

This repository is the **Spruce React design system**:

- `src/` — the `spruce-react` component library (80+ React 19 + TypeScript components, design tokens, icons, theming).
- `docs/` — the documentation site (Vite app, one live-demo page per component). It imports the library from `src/` via the `spruce-react` alias.

Prefer project-local conventions over new abstractions. Inspect neighboring files before editing, keep changes scoped, and do not rewrite unrelated files.

## Skills

Detailed, task-specific guidance lives in `.codex/skills/*/SKILL.md`. Consult the matching skill before working on:

- `spruce-react-design-system` — consuming the library: imports, `SpruceProvider`, theming, icons, tokens, component inventory.
- `spruce-react-developer` — general React/TypeScript/accessibility/styling conventions for this codebase.
- `spruce-react-components` — authoring a new library component (folder layout, CSS naming, export wiring, docs page).
- `spruce-react-buttons` — button usage rules.
- `spruce-react-alerts` — alert usage and spacing rules.
- `spruce-react-forms` — form controls, the value-not-event `onChange` contract, validation.
- `spruce-react-code-preview` — docs examples with the `CodePreview` component.

## Quick Rules

- Function components with typed `Props` interfaces; no `any`, no classes, no `React.FC`.
- Relative imports inside `src/` use the `.js` extension; type-only imports use `import type`.
- Styling: co-located plain CSS with `sp-` prefixed BEM classes and design tokens (`var(--sp-space-*)` etc.) — never hard-coded colors, no CSS-in-JS.
- Spruce form controls pass the **value** to `onChange`, not the event.
- Components own internal padding, never outer margin — parents own spacing.
- Accessibility is required: WCAG AA, keyboard support, `aria-label` on icon-only controls.
- New/changed components must be exported (with types) from `src/index.ts` and have a docs page registered in `docs/src/App.tsx` + `docs/src/components/Sidebar.tsx`.

## Verification

- `npm install` once at the root (npm workspaces cover `docs/` too).
- `npm run build` — library type-check + bundle.
- `npm run docs:build` — docs site build (type-checks against library source).
- `npm run dev` — docs dev server for visual verification (check light AND dark themes).
- `npm run lint` — no new warnings in touched files.
