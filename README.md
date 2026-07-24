# 🌲 Spruce React

**Spruce** is a modern, comprehensive React design system — a library of 80+ production-ready components built with React 19 and TypeScript, styled with handcrafted CSS on top of a rich design-token foundation.

From the everyday essentials (buttons, inputs, cards, dialogs) to advanced application building blocks (data grid, Gantt chart, command palette, code editor, date-range pickers, filter expression builder), Spruce gives you a consistent, themeable toolkit for building polished product UIs.

## Highlights

- **React 19 + TypeScript** — fully typed props for every component, shipped with declaration files.
- **Design tokens** — colors, spacing, typography, and motion patterns exposed as CSS custom properties, bundled into a single stylesheet.
- **Theming built in** — light, dark, and system theme support via `SpruceProvider`.
- **80+ components** — accordion to wizard, including heavyweights like `Datagrid`, `GanttChart`, `CommandPalette`, and `CodeEditor`.
- **Zero runtime dependencies** — only `react` and `react-dom` as peers.
- **Living documentation** — an interactive docs site at [designsystem-react.sprucestack.com](https://designsystem-react.sprucestack.com) with live demos and copy-paste examples for every component.

## Using Spruce in your app

Install the package (from your registry, or directly from this repository):

```bash
npm install spruce-react
```

Then wrap your application with `SpruceProvider` and import the stylesheet once:

```tsx
// main.tsx
import 'spruce-react/style.css';
import { SpruceProvider } from 'spruce-react';

createRoot(document.getElementById('root')!).render(
  <SpruceProvider defaultTheme="system">
    <App />
  </SpruceProvider>
);
```

That's it — start composing:

```tsx
import { Button, Card, CardHeader, Alert, Badge } from 'spruce-react';

export function Example() {
  return (
    <Card>
      <CardHeader>Welcome to Spruce</CardHeader>
      <Alert variant="info">Everything is themeable via design tokens.</Alert>
      <Badge variant="success">Ready</Badge>
      <Button variant="primary" onClick={() => console.log('planted 🌲')}>
        Get started
      </Button>
    </Card>
  );
}
```

`SpruceProvider` also lets you register a custom icon set and control the initial theme:

```tsx
<SpruceProvider icons={MY_ICONS} defaultTheme="dark">
  <App />
</SpruceProvider>
```

## Repository layout

| Path | What it is |
|------|------------|
| [src/](src/) | The component library (`spruce-react`) — components, tokens, icons, theme |
| [docs/](docs/) | The documentation site — a Vite app with live demos for every component |
| [dist/](dist/) | Build output — ES + UMD bundles, CSS, and TypeScript declarations |

The repo uses **npm workspaces**: a single `npm install` at the root installs everything for both the library and the docs site.

## Development

```bash
# 1. Install all dependencies (library + docs)
npm install

# 2. Start the documentation site with live reload
npm run dev
```

The docs site runs at **http://localhost:5173** and imports the library straight from [src/](src/), so component changes hot-reload instantly in the docs.

### All scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the docs site dev server (live playground for the library) |
| `npm run build` | Type-check and build the library into `dist/` (ES, UMD, CSS, `.d.ts`) |
| `npm run docs:build` | Type-check and build the docs site for deployment |
| `npm run docs:preview` | Serve the production docs build locally |
| `npm run lint` | Lint the whole repository with ESLint |

## Previewing the documentation

For the full production docs experience:

```bash
npm install
npm run docs:build
npm run docs:preview
```

Then open the printed URL to browse the complete component gallery — every component page includes live examples, prop tables, and ready-to-copy code snippets.

## Documentation site

The full documentation is available online at **https://designsystem-react.sprucestack.com** — browse every component with live examples, prop tables, and ready-to-copy code snippets.
