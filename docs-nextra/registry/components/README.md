# Component examples registry

One folder per RapidKit component. One file per example. Each file default-exports a zero-arg React component and imports library code from `@rapidset/rapidkit` so the displayed Code tab is consumer-shaped.

Register every example in `./index.ts` (id = `<component>-<variant>`, kebab-case). The `predocs:*` hook reads each file and writes `../generated/exampleCode.ts` for the Code tab. Never hand-maintain a code string — the file on disk is the source of truth.
