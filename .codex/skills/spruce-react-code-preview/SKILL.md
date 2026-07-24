---
name: spruce-react-code-preview
description: Use when adding or updating Spruce React docs examples that use the CodePreview component in `docs/src` — live previews, multi-file code previews, and code-only snippets on component documentation pages.
---

# Spruce React Code Preview

Use `CodePreview` for documentation examples in `docs/src/pages`.

## Import

```tsx
import { CodePreview } from '../../components/CodePreview';
```

Adjust the relative path for the page location (component pages live at `docs/src/pages/components/`).

## Choose The Preview Mode

- **Live preview + code** (default): pass the demo as `children` and the source as `code`. The reader sees the rendered demo and can flip to the code tab.
- **Multi-file**: pass `files` (array of `{ label, language, code }`) when the example needs more than one file — component plus CSS, supporting data, etc. `files` overrides `code`/`language`.
- **Code-only**: `codeOnly` when the section only needs a snippet with no rendered preview. Combine `codeOnly` with `files` for multi-tab code-only examples.
- `compact` reduces preview padding for small demos; `title` adds a toolbar caption.

## Language Values (this catches everyone)

`language` must be a `CodeLanguage`: `typescript`, `javascript`, `html`, `css`, `scss`, `json`, `csharp`, `sql`, `python`, or `markdown`. **There is no `tsx`/`jsx`** — use `typescript` for React/TSX snippets. An unsupported value is a type error that fails `npm run docs:build`.

## Pattern

```tsx
const BASIC_CODE = `<Button variant="primary" iconLeft="plus">New item</Button>`;

<CodePreview code={BASIC_CODE} language="typescript">
  <DemoCard>
    <Button variant="primary" iconLeft="plus">New item</Button>
  </DemoCard>
</CodePreview>
```

- Keep the `code` string and the rendered children in sync — the demo IS the documentation.
- Include every file needed to understand or reproduce the demo (styles, data) via `files`.
- New pages must be registered in `docs/src/App.tsx` (hash route) and `docs/src/components/Sidebar.tsx` (nav entry) — see the spruce-react-components skill.
