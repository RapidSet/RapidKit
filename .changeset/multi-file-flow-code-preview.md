---
'@rapidset/rapidkit': minor
---

Docs: redesign the flow code preview into a shadcn-style multi-file viewer. The Code tab on `/flows/login` and `/flows/dashboard` now shows a left-rail file tree and a per-file pane with full path, per-file copy, and Shiki highlighting. Each flow's source lives in `docs-nextra/registry/flows/<flow>/` as real `.tsx`/`.ts` modules; the preview iframe imports the same modules, so displayed code and rendered preview can't drift.
