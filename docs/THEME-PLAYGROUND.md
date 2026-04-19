# Theme Playground

Use this page to preview how Mezmer components and composed building blocks react to theme changes in real time.

## Live Preview

<ThemePlayground />

## What This Demonstrates

- Runtime theme stylesheet switching across built-ins (`corporate`, `default`, `forest`, `midnight`, `ocean`, `sand`, `slate`, `sunset`)
- shadcn-style split preview with always-visible side-by-side light and dark surfaces
- One-click theme cards with palette swatches and active-state feedback
- Keyboard navigation for theme selection (`Arrow` keys, `Home`, `End`)
- Primitive component updates (`Button`, `Input`, `Search`, `Chip`) against the selected token set
- Token swatch rows for semantic slots (`Background`, `Primary`, `Muted`, `Accent`, and others)
- Persistent state in `localStorage` for selected theme

## Implementation Notes

- The playground is mounted through a VitePress custom theme component.
- Theme stylesheets are loaded from `docs/public/themes`.
- Selection persists in `localStorage` for quick iteration while documenting.
- The preview uses explicit component-scoped CSS in `docs/.vitepress/theme/components/ThemePlayground.css` for stable rendering in VitePress.
