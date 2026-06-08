---
'@rapidset/rapidkit': patch
---

Fix `BaseTable` not scrolling in place when its parent bounds its height. Previously, the scroll area `<div>` was bounded by its flex parent but had no `overflow` declaration, and the inner shadcn `<Table>` primitive's `overflow-auto` wrapper had no height bound — so the table grew past its container and pushed the pagination footer below the fold. `BaseTable` now owns the scroll container directly (`flex-1 min-h-0 overflow-auto`) and renders the `<table>` element without the extra shadcn wrapper, so vertical scrolling engages, the sticky `<thead>` stays pinned to the top of the visible area, and the pagination footer stays anchored at the bottom. Horizontal scroll and sticky-column behavior are unchanged.
