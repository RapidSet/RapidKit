# Dashboard Flow

Dashboard Flow is a reference implementation for an analytics workspace overview page that composes the package `SideBar` shell (with a collapsible nav rail), a sticky app bar, KPI tiles, charts, goal trackers, a top-performers list, and a recent-activity table — entirely from RapidKit components.

## Includes

- App shell composition via `SideBar` (`collapsible="icon"`) with its `mainContent` slot and `SideBarTrigger` for the collapse toggle
- Sticky app bar built from `SideBarTrigger`, `Search`, a notification `<button>` with a `Bell` + dot indicator, and `Avatar`
- KPI summary tiles built from the `StatCard` component (interactive `onClick` drill-down with up/down/neutral trend chips and a focus ring for the selected tile)
- Time-series `Chart` (`ChartVariant.Area`) for sessions and sign-ups
- Distribution `Chart` (`ChartVariant.Pie`) for traffic sources
- Horizontal `Chart` (`ChartVariant.Bar`, `layout="vertical"`) for top channels by conversions
- Quarter goals tracker with progress bars composed from semantic theme tokens (`bg-muted` track, `bg-primary` fill, `bg-amber-500` for at-risk goals)
- Top performers list using `Avatar`, `Text`, and `Chip` to render team standings
- `DropDown` date-range control that swaps the time-series data
- Recent-activity `BaseTable` with `AVATAR`, `TEXT`, `STATUS`, and `DATE` cells; `Search` filters the data, `onRowClicked` selects, and `activeItem` highlights
- `Button` actions (`Outlined` + `Text` variants) and themed `Chip`s throughout

## Why This Flow Exists

- It gives consumers a reusable starting point for analytics overview screens and admin workspaces.
- It demonstrates the end-to-end `SideBar` + main-content shell composition through the `mainContent` slot, and the `SideBarTrigger` collapse-button pattern.
- It shows how `StatCard` composes a label, value, icon, trend chip, and drill-down click target without any custom KPI markup at the call site.
- It shows how three `Chart` variants (area, pie, horizontal bar) coexist on one page and react to shared state — the `DropDown` date-range value.
- It documents how to compose progress trackers and avatar lists from primitives (`Text`, `Avatar`, `Chip`) without introducing new components.
- It documents how `Column<T>` with `CellType.STATUS` accepts a `styler` to map status values to semantic-token-friendly classes that work across light and dark themes.

## Theme Reactivity

All surfaces use semantic theme tokens (`bg-card`, `bg-background`, `bg-muted`, `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-destructive`) so the dashboard automatically reflects any theme applied via `@rapidset/rapidkit/themes/*.css`. Status colors (`emerald`, `amber`, `rose`, `sky`) use opacity-modified backgrounds (e.g. `bg-emerald-500/15`) with `dark:` text variants so they remain legible in both light and dark themes.

## Interactive Behavior

- **Collapsible sidebar** — `SideBar` is mounted with `collapsible="icon"`; clicking `SideBarTrigger` in the app bar toggles the rail between expanded and icon-only state. The keyboard shortcut `Cmd/Ctrl + B` also toggles it.
- **Sidebar navigation** — `useState` tracks the active nav key; each `SideBarMenuItem` provides `onSelect` and `isActive`. Switching items updates the page header copy.
- **Global search** — `Search` value lives in component state; typing filters the recent-activity table and updates the summary line above it.
- **Date range** — `DropDown` value is held in component state; the area chart series, both chart card titles, and the header chip react to the selected range.
- **KPI drill-down** — each `StatCard` is interactive via `onClick`; the focused KPI shows a "Selected" description and a `ring-primary/30` focus ring.
- **Notification button** — clicking it clears the unread `bg-destructive` dot.
- **Activity table** — clicking a row stores its id, highlights the row through `activeItem`, and surfaces the selection summary above the table.

## Next Adaptations

- Replace the mock arrays with live data from your query layer (RTK Query, TanStack Query, etc.).
- Wire each `StatCard.onClick` to your routing layer for true drill-down.
- Wire each `SideBarMenuItem.href` (or keep `onSelect`) to your route handling.
- Replace the notification `<button>` with a `DropDown` or `BaseModal` of unread items.
- Add `access` and `canAccess` on individual sections (KPIs, charts, table) to gate sensitive views per role.
- Extend the date-range options with a `DatePicker`-driven custom range.
