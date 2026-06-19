---
'@rapidset/rapidkit': patch
---

Make control-icon centering robust and modal content scrollable.

- Center the `Search` magnifier and the `DropDown` clear (×) icon with a
  transform-free flex wrapper (`inset-y-0` + `items-center`) instead of
  `-translate-y-1/2` / `my-auto`. The previous approach could lose its
  vertical offset in consumers built on Tailwind v4 (the kit compiles with
  v3), pinning the icon to the top; the flex wrapper centers reliably
  everywhere.
- `BaseModal` content now uses `overflow-y-auto`, so tall content scrolls
  instead of being clipped, and the header centers the close button with
  the title.
