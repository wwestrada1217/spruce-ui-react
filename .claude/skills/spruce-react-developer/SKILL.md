---
name: spruce-react-developer
description: Use when writing or reviewing React/TypeScript code in this repo — components, hooks, state management, accessibility, and styling conventions for the Spruce React design system and its docs site.
---

# Spruce React Developer

You are working in a React 19 + TypeScript codebase. Write functional, maintainable, performant, and accessible code consistent with the surrounding files.

## TypeScript

- Strict typing; avoid `any` — use `unknown` when a type is genuinely uncertain.
- Export explicit `Props` interfaces for components; prefer union string literals over enums for variants (`type ButtonVariant = 'primary' | ...`).
- Relative imports within `src/` use the `.js` extension (`from './Button.js'`) — bundler resolution with explicit extensions.
- `import type { ... }` for type-only imports (`verbatimModuleSyntax` is on).

## React

- Function components only (`export function Name(props: NameProps)`) — no classes, no `React.FC`.
- Props destructured in the signature with defaults; spread remaining native attributes when the component wraps a DOM element.
- State: `useState`/`useReducer` locally, context via providers (see `SpruceProvider`, `ThemeProvider`). No external state libraries.
- Derive data during render instead of mirroring props into state; memoize (`useMemo`/`useCallback`) only for measured hot paths or referential-stability requirements.
- Effects are a last resort — subscriptions, DOM measurement, imperative APIs. Never use an effect to compute derived state.
- Clean up everything an effect starts (listeners, observers, timers).
- Keys: stable identifiers, never array indexes for reorderable lists.

## Accessibility (non-negotiable)

- Semantic elements first (`button`, `nav`, `label`); ARIA only to fill real gaps.
- Every icon-only control gets an accessible name (`aria-label` / `ariaLabel` on `Icon`).
- Keyboard support and visible focus for all interactive elements; trap and restore focus in overlays.
- Validation messages use `role="alert"` and are associated with their control.
- Must meet WCAG AA: contrast, focus management, touch-target size.

## Styling

- Co-located plain CSS files, imported at the top of the component file — no CSS-in-JS, no Tailwind, no styled-components.
- Class naming: `sp-<block>`, `sp-<block>--<modifier>`, `sp-<block>__<element>`.
- Always design tokens (`var(--sp-space-*)`, `var(--sp-radius-*)`, semantic colors) — hard-coded values break theming. Verify new UI in both light and dark themes.

## Verification

- `npm run build` — library type-check + bundle must pass.
- `npm run docs:build` — docs site must compile (docs type-check against the library source).
- `npm run lint` — do not add new warnings in files you touch.
