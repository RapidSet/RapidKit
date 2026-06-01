---
'@rapidset/rapidkit': patch
---

Fix the RapidKit logo in the dashboard flow demo's sidenav 404ing on the deployed docs site. The demo's `Sidebar` used a root-relative `/rapidkit.svg` path, which resolves to the domain root on GitHub Pages instead of the `/RapidKit` basePath. Switched to a stable absolute URL of the same asset hosted on GitHub raw so the demo renders the logo in both the deployed preview and any consumer's app without depending on a docs-only basePath helper.
