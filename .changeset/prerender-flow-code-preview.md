---
'@rapidset/rapidkit': patch
---

Docs: pre-render the flow Code-tab syntax highlighting at build time. Shiki now runs inside `scripts/generate-example-code-manifest.mjs` (dual github-light/github-dark themes) and emits the highlighted HTML inside `FLOW_EXAMPLE_FILES`. `MultiFileCodePreview` renders the precomputed HTML directly — the Code tab paints already-colored on the first frame, with no plain-text flash on initial open or when switching between files.
