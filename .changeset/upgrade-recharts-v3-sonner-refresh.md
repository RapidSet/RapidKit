---
'@rapidset/rapidkit': minor
---

BREAKING: the `recharts` optional peer dependency now requires `^3.0.0` (was `^2.15.0`). Apps that render `Chart` must upgrade recharts to v3 — recharts 2.x is deprecated upstream.

The `Chart` public API and documented behavior are unchanged: chart roots explicitly opt out of recharts v3's new default `accessibilityLayer` so the container keeps its `role="img"` + `aria-label` contract, and the internal shadcn chart primitive is retyped against recharts v3 tooltip/legend content types.

Also refreshes the `sonner` dev dependency to the latest 2.x; the `sonner` peer range (`^2.0.0`) is unchanged and `Toast` requires no consumer action.
