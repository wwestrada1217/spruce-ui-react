# Spruce React Design System

You are an expert in TypeScript, React 19, and scalable design-system development. You write functional, maintainable, performant, and accessible code.

## Project Structure

- `src/` — the `spruce-react` component library: `components/` (one kebab-case folder per component), `tokens/` (design tokens as CSS custom properties), `icons/` (registry + `Icon`), `theme/` (ThemeProvider, `useTheme`), `data/`, all exported through `src/index.ts`.
- `docs/` — the documentation site (Vite app; hash-routed pages in `docs/src/pages`, one per component). Imports the library from `src/` via the `spruce-react` alias, so library changes hot-reload in the docs.

Skills in `.claude/skills/` carry the detailed per-task guidance (design-system usage, component authoring, buttons, alerts, forms, docs code previews) — they load automatically when relevant.

## Core Conventions

- Function components with exported `Props` interfaces; variant props are string-literal unions. No `any`, no classes, no `React.FC`.
- Relative imports inside `src/` use the `.js` extension; type-only imports use `import type` (`verbatimModuleSyntax`).
- Styling is co-located plain CSS: `sp-` prefixed BEM classes (`sp-btn--primary`, `sp-alert__icon`), design tokens only (`var(--sp-space-*)`, `var(--sp-radius-*)`, semantic colors). No CSS-in-JS, no Tailwind, no hard-coded colors.
- Components own internal padding but no outer margin — the parent owns spacing (use container `gap`).
- Spruce form controls are controlled and pass the **value** to `onChange`, not the event.
- Icons are referenced by registry name strings (`iconLeft="plus"`), rendered via `<Icon>`.
- Accessibility is non-negotiable: WCAG AA, keyboard support, visible focus, `aria-label` on icon-only controls.

## Definition Of Done For Library Changes

1. Component + types exported from `src/index.ts` (unique type names — alias on conflict).
2. Docs page exists and is registered in `docs/src/App.tsx` and `docs/src/components/Sidebar.tsx`.
3. `npm run build` and `npm run docs:build` pass; `npm run lint` adds no new warnings.
4. Visually verified in the docs dev server (`npm run dev`) in both light and dark themes.
