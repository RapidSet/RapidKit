# Theme Playground

Use this page to preview how Mezmer components and composed building blocks react to theme changes in real time.

## Live Preview

<ThemePlayground />

## What This Demonstrates

- Theme stylesheet switching (`default` and `slate`) at runtime
- Theme stylesheet switching across built-ins (`corporate`, `default`, `forest`, `midnight`, `ocean`, `sand`, `slate`, `sunset`)
- A visual theme gallery for quick palette comparison and one-click apply
- Gallery preview controls for `Light`, `Dark`, or `Follow Active Mode`
- Light and dark mode toggling with the `.dark` class
- Primitive component updates (`Button`, `Input`, `DatePicker`, `Search`, `Chip`)
- A composed card-style building block that inherits the same semantic tokens
- AI-assisted brand theme generation from user-provided brand inputs
- Generated CLI and contract snippets that map to the repository theme workflow
- Export actions for generated CSS, contract JSON, and a packaged handoff markdown

## Implementation Notes

- The playground is mounted through a VitePress custom theme component.
- Theme stylesheets are loaded from `docs/public/themes`.
- Selection persists in `localStorage` for quick iteration while documenting.
- Generated AI theme CSS is injected as runtime styles and can be promoted to `src/themes/<theme-id>.css`.
- Exported files can be dropped into `src/themes` and `ai/contracts/themes` before running `pnpm validate:contracts`.
