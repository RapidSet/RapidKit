---
'@rapidset/rapidkit': minor
---

Monday theme: bump default `--rk-button-height` and `--rk-control-height` to `2.5rem` (40px) — monday.com Vibe "Large" form-input scale. Internal padding is unchanged; content area scales naturally.

`Search` (magnifying glass) and `DropDown` (clear `×`) used `top-1/2 -translate-y-1/2` for vertical centering, which rendered visibly off-center for absolutely-positioned icons under Tailwind v4 consumers — the icon sat in the upper half of the field instead of dead center. Switched both to `inset-y-0 my-auto` (auto-margin block centering), which is bulletproof against transform cascades. `Search` icon also gains `pointer-events-none` so it never blocks focus on click. CT coverage in `tests/ct/ControlBorders.ct.spec.tsx` asserts the icon's vertical center is within 1px of the field's center for both components.
