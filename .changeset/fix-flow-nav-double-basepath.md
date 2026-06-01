---
'@rapidset/rapidkit': patch
---

Fix flow doc page nav generating doubled basePath URLs (`/RapidKit/RapidKit/flows/...`) on the GitHub Pages docs site, which caused 404s when clicking between flows. Removed redundant `withBasePath()` wrapping on `next/link` hrefs in `FlowDocsPage` — Next.js already applies `basePath` to `<Link>` automatically.
