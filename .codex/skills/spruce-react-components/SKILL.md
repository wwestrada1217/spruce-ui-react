---
name: spruce-react-components
description: Use when creating a new component in the Spruce React library (`src/components/`) or changing an existing component's public API. Covers the folder conventions, CSS/class naming, export wiring, and the docs page every component needs.
---

# Authoring Spruce React Components

Every library component follows the same layout. Match it exactly — consistency is the contract.

## Folder Convention

```
src/components/<kebab-name>/
  <PascalName>.tsx    # component + its Props interface
  <PascalName>.css    # co-located styles, imported first in the .tsx
```

Rules inside the component file:

- First line: `import './<PascalName>.css';`
- Relative imports use the `.js` extension (`import { Icon } from '../../icons/Icon.js';`) — the tsconfig uses bundler resolution with explicit extensions.
- Export a typed `<Name>Props` interface plus any variant unions (e.g. `export type ButtonVariant = 'primary' | ...`).
- Function component (`export function Name({...}: NameProps)`), props destructured with defaults — no `React.FC`, no class components.
- Accept `className` and merge it into the root element's class list; accept `style` when consumers plausibly need one-off sizing.

## CSS Naming

- Block class `sp-<name>` with BEM-style modifiers and elements: `sp-btn`, `sp-btn--primary`, `sp-btn--sm`, `sp-alert__icon`.
- Only apply modifier classes for non-default values (see `Button.tsx`: `size !== 'md' && 'sp-btn--sm'`).
- Style exclusively with design tokens (`var(--sp-space-*)`, `var(--sp-radius-*)`, semantic color tokens) so the component tracks light/dark themes automatically. Hard-coded colors are a review-blocker; a fallback in `var(--sp-x, #hex)` form is acceptable.
- Components own internal padding but **no outer margin** — the parent owns spacing between siblings.

## Export Wiring (required — the component doesn't exist without it)

Add the component *and its types* to `src/index.ts`, using the `.js` extension:

```ts
export { Widget } from './components/widget/Widget.js';
export type { WidgetProps, WidgetVariant } from './components/widget/Widget.js';
```

Type names must be unique across the whole barrel — alias on conflict (`SelectOption as DatagridSelectOption`).

## Docs Page (every component has one)

1. Create `docs/src/pages/components/<Name>Page.tsx` with live examples in `CodePreview` blocks and a props table (copy the structure of a similar existing page).
2. Register the route in `docs/src/App.tsx` (`case '#/components/<kebab-name>':`).
3. Add the sidebar entry in `docs/src/components/Sidebar.tsx` (icon, label, route).

## Verify

`npm run build` (library type-check + bundle) and `npm run docs:build` must both pass. Check the component visually in the docs dev server (`npm run dev`) in both light and dark themes.
