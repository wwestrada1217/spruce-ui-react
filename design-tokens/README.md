# Spruce design-tool tokens

These files are generated from the React package's canonical `src/tokens/tokens.css` and `src/theme/presets/*.ts` sources. Do not edit generated JSON, plugin files, or the foundations board directly.

- `npm run tokens:generate` updates all design-tool artifacts.
- `npm run tokens:check` validates structure and fails when checked-in output is stale.
- `figma/` contains DTCG, Tokens Studio, and a local Figma plugin.
- `penpot/` contains the Penpot token payload, plugin shell, and generated foundations board.

Token source ownership remains with the React token/theme modules. Design-tool exports are delivery formats, not a second token source. Pull requests that change tokens or presets must regenerate these files.
