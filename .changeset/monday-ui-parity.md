---
'@rapidset/rapidkit': minor
---

Monday.com UI parity: new chrome primitives and sidebar tinting.

**New components**

- `<TopBar>` — workspace canvas header with title/subtitle, leading + trailing action clusters, a primary quick-action button, an avatar dropdown user menu, and access-aware action gating. Suitable for the monday-style top chrome (notifications, inbox, invite, search, help, apps, avatar).
- `<OnboardingChecklist>` — right-rail card with checkable items, optional descriptions, dismiss control, and a derived progress bar (primary / success tones). Items are individually interactive via `onSelect` or `href`.
- `<BoardCard>` — tile for recent-item grids: title + optional icon, preview slot with a default colorful skeleton, breadcrumb footer, and a star toggle that doesn't intercept the card's primary click. Renders as `<button>` when `onClick` is given, `<a>` when `href` is given, plain `<div>` otherwise.

**SideBar extensions**

- New `workspace` prop renders a workspace switcher row (avatar + name + subtitle, optional dropdown actions) below the brand.
- New `favorites` prop renders a collapsible Favorites section above the main nav, sharing `SideBarMenuItem` shape.
- New `itemVariant` prop on `<SideBar>` and `<SideBarNavMenu>`: `'minimal'` (default, current behavior) or `'pill'` (filled hover/active background using the new sidebar accent tokens — matches monday's selected-item treatment).

**Theme token surface**

- New `--rk-sidebar-background`, `--rk-sidebar-foreground`, `--rk-sidebar-primary`, `--rk-sidebar-primary-foreground`, `--rk-sidebar-accent`, `--rk-sidebar-accent-foreground`, `--rk-sidebar-border`, `--rk-sidebar-ring` tokens. The shadcn-side `--sidebar-*` slots now read from these, defaulting to the existing `--rk-card` / `--rk-accent` / `--rk-border` / `--rk-ring` values — themes that don't override the new family render unchanged.
- The `monday` theme uses the new tokens to set a mint sidebar tint (light + dark), refines the primary blue (`210 100% 46%`) to match monday.com exactly, lifts radius to `0.75rem`, and softens the button/control shadows. Other themes are untouched.

**Backward compatibility**

All new props are optional; existing `<SideBar>` consumers and existing themes render unchanged. The pill item variant is opt-in.
