You are an expert in TypeScript, React 19, and scalable design-system development. You write functional, maintainable, performant, and accessible code following React and TypeScript best practices.

This repository is the **Spruce React design system**: the `spruce-react` component library lives in `src/` (80+ components, design tokens, icons, theming) and the documentation site lives in `docs/` (a Vite app importing the library from `src/` via the `spruce-react` alias).

## TypeScript Best Practices

- Use strict type checking; avoid `any` — use `unknown` when a type is genuinely uncertain
- Export an explicit `Props` interface for every component; use string-literal unions for variants (`type ButtonVariant = 'primary' | ...`), not enums
- Relative imports inside `src/` use the `.js` extension (`from './Button.js'`)
- Use `import type { ... }` for type-only imports (`verbatimModuleSyntax` is enabled)

## React Best Practices

- Function components only (`export function Name(props: NameProps)`) — no classes, no `React.FC`
- Destructure props in the signature with defaults; spread remaining native attributes when wrapping a DOM element
- Local state with `useState`/`useReducer`; shared state via context providers (`SpruceProvider`, `ThemeProvider`) — no external state libraries
- Derive data during render; never mirror props into state; effects are a last resort and must clean up what they start
- Stable keys for lists — never array indexes for reorderable content

## Design System Rules

- Build UI from Spruce components first (all named exports of `spruce-react`); use native HTML only when no primitive fits; never add third-party UI kits for primitives Spruce provides
- Consumers wrap the app in `<SpruceProvider defaultTheme="system">` and import `spruce-react/style.css` once
- Theming via `useTheme()` (`preference`, `resolved`, `setTheme`, `toggle`, `registerTheme`)
- Icons are registry name strings: `<Icon name="plus" size={16} ariaLabel="Add" />`; component icon props take names (`iconLeft="plus"`), never JSX
- Spruce form controls are controlled and pass the **value** to `onChange`, not the event: `<Input value={name} onChange={setName} />`
- Field validation goes on the control (`error`, `hint` props); form-level failures go in an `Alert` above the actions row
- `Button`: variants `primary|secondary|outline|ghost|danger|danger-outline|success|success-outline`, sizes `sm|md|lg`; icon-only buttons need `iconOnly` + `aria-label`; `type` defaults to `"button"` so submit buttons pass `type="submit"` explicitly
- `Alert` has no outer margin — the parent owns spacing: separate from neighbors by `var(--sp-space-4)`, stack alerts with `var(--sp-space-3)`, prefer container `gap` over per-alert margins

## Styling

- Co-located plain CSS imported at the top of the component file — no CSS-in-JS, no Tailwind
- Class naming: `sp-<block>`, `sp-<block>--<modifier>`, `sp-<block>__<element>`
- Style exclusively with design tokens: spacing `var(--sp-space-1..14)` (4px scale), radius `var(--sp-radius-sm..full)`, semantic colors (`--sp-info`, `--sp-success`, `--sp-warning`, `--sp-danger`) — hard-coded colors break theming
- Components own internal padding but no outer margin

## Authoring A Library Component

- Folder: `src/components/<kebab-name>/` containing `<PascalName>.tsx` (first line imports the co-located `<PascalName>.css`)
- Export the component AND its types from `src/index.ts` with the `.js` extension; type names must be unique across the barrel
- Every component needs a docs page: `docs/src/pages/components/<Name>Page.tsx` with `CodePreview` examples, registered in `docs/src/App.tsx` (hash route) and `docs/src/components/Sidebar.tsx` (nav entry)
- Docs `CodePreview` `language` values: `typescript`, `javascript`, `html`, `css`, `scss`, `json`, `csharp`, `sql`, `python`, `markdown` — there is NO `tsx`; use `typescript` for React snippets

## Accessibility Requirements

- Must follow all WCAG AA minimums: color contrast, focus management, keyboard support, ARIA attributes
- Semantic elements first; ARIA only to fill real gaps
- Every icon-only control gets an accessible name
- Overlays trap and restore focus; validation messages use `role="alert"`

## Verification

- `npm install` once at the root (npm workspaces include `docs/`)
- `npm run build` — library type-check + bundle must pass
- `npm run docs:build` — docs site must compile
- `npm run dev` — docs dev server; verify changes in BOTH light and dark themes
- `npm run lint` — add no new warnings in touched files
