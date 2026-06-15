---
'@rapidset/rapidkit': minor
---

Tailwind v4 compatibility and control-focus polish.

- **Preflight cascade fix**: `styles.css` now ships defensive `revert-layer` rules for typographic margins and list margin/padding so Tailwind v4 consumers' layered utilities (`mt-*`, `pl-*`, …) and Tailwind v4's own layered preflight win against rapidkit's unlayered Tailwind v3 preflight. No more silent margin/padding loss in v4 host apps.
- **Monday theme shadow neutralized**: `--rk-shadow-color` in `themes/monday.css` light mode shifts from `220 13% 40%` (saturated cool-blue at 40% lightness) to `220 13% 12%` (near-black, faint cool undertone). Modal and toast elevations now read as elevation, not a blue glow. Dark mode was already neutral.
- **SideBar omits empty footer**: `<SidebarFooter>` is now skipped entirely when neither `footer` nor `user` is provided, instead of emitting an empty padded wrapper at the bottom of the sidebar.
- **Focus border = ring color on form controls**: `Input`, `Textarea`, `DropDown` (SelectTrigger), and `DatePicker` trigger pick up `--rk-ring` on `:focus-visible`/`:focus` so focus reads as a brand-colored border, not stale resting gray. Matches shadcn's ring contract and the monday.com focus idiom.
