# Rapidcraft

Use Rapidcraft to scaffold an AI-ready project blueprint that MCP-aware tooling can turn into a production React application.

Package: https://www.npmjs.com/package/rapidcraft

<p align="center">
  <img src="../public/rapidcraft.svg" alt="rapidcraft logo" width="96" height="96" />
</p>

<p align="center"><strong>Intent-first scaffolding for MCP-aware AI generation workflows.</strong></p>

## What The CLI Generates

`rapidcraft init` creates a project folder with a contract-aligned JSON manifest.

It does **not** generate React source files directly.

The generated `rapidkit.template.json` is the source of intent used by AI agents together with RapidKit MCP contracts.

## Quick Start

Run from any folder, including an empty folder.

No `npm init` or `yarn init` is required before running the CLI.

```bash
npx rapidcraft@latest init my-product --preset enterprise-dashboard
```

During `init`, the CLI now prompts for a deployment target and lets you skip deployment planning entirely.

You can also set it explicitly:

```bash
npx rapidcraft@latest init my-product --preset enterprise-dashboard --deployment netlify
npx rapidcraft@latest init my-product --preset operations-console --deployment kubernetes
npx rapidcraft@latest init my-product --preset enterprise-dashboard --skip-deployment
```

Alternative package manager launchers:

```bash
pnpm dlx rapidcraft@latest init my-product --preset operations-console
yarn dlx rapidcraft@latest init my-product --preset enterprise-dashboard
```

Global install is optional:

```bash
npm install -g rapidcraft
rapidcraft init my-product --preset enterprise-dashboard
```

## Presets

Current official presets:

- `enterprise-dashboard`
- `operations-console`

List available presets:

```bash
rapidcraft list-presets
```

## Generated Output

Expected scaffold output:

```text
my-product/
  rapidkit.template.json
```

The manifest includes:

- routes and page intent
- required RapidKit component surfaces
- integration boundaries (auth, API style, validation)
- deployment intent for downstream materialization workflows
- containerization rules, including a required multi-stage Docker build for container-based targets such as Kubernetes and Azure Container Apps
- generation constraints for AI workflows

## VS Code Developer Workflow

For teams using VS Code, the typical flow is:

1. Run `rapidcraft init` to generate `rapidkit.template.json`.
2. Open the generated folder in VS Code.
3. Connect an MCP-aware AI workflow to the RapidKit MCP server.
4. Ask AI to materialize the app from the manifest and contracts.
5. Run standard quality gates (`lint`, `typecheck`, `test`, `build`) in the generated app repository.

## CLI vs Traditional Bootstrap

When teams compare Rapidcraft with classic code-first scaffolding (for example direct Vite or Next bootstrap), the key difference is where architecture decisions are enforced.

| Area              | Traditional Bootstrap                  | Rapidcraft                                                  |
| ----------------- | -------------------------------------- | ----------------------------------------------------------- |
| Initial output    | Runnable app code immediately          | Intent blueprint (`rapidkit.template.json`)                 |
| Framework/runtime | Selected and materialized immediately  | Selected during AI materialization step                     |
| AI role           | Optional assistant after code exists   | Primary implementation path from manifest + contracts       |
| Governance timing | Mostly during PR reviews and refactors | Shifted left into preset contracts and manifest constraints |
| Standardization   | Template quality + team discipline     | Contract-driven generation and MCP context                  |

Practical interpretation for VS Code teams:

- if you prioritize immediate runnable code, traditional bootstrap feels faster initially
- if you prioritize repeatable enterprise structure and policy alignment, Rapidcraft reduces long-term drift

## MCP Integration

Start the RapidKit MCP server from the repository root:

```bash
pnpm mcp:server
```

Then configure your MCP-capable client to use stdio with:

- command: `pnpm`
- args: `mcp:server`
- working directory: RapidKit repository root

See `/MCP-SERVER` for complete setup examples.

## Vite And Runtime Materialization

The current CLI model is intent-first.

That means `rapidcraft init` does not directly run Vite scaffolding.

Vite (or another runtime choice) is selected when AI materializes the application from `rapidkit.template.json` using RapidKit MCP context.

For targets that require a container image, the generated blueprint now marks Docker as required and sets the Dockerfile strategy to `multi-stage` so downstream generation can optimize runtime image size.

## Recommended Team Policy

To keep generation predictable in enterprise environments:

- treat `rapidkit.template.json` as the project intent contract
- avoid manual drift between manifest intent and generated code
- use MCP contract tools as the source of truth during generation
- enforce runtime quality gates in the generated application repository

## Troubleshooting

### Unknown preset

Run:

```bash
rapidcraft list-presets
```

Then retry with a valid `--preset` value.

### Target directory is not empty

Choose a new output name or an empty target directory.

### Need to skip deployment setup

Use `--skip-deployment`, or press Enter at the deployment prompt to keep the preset default when running interactively.

### Need runnable code immediately

Use your AI materialization step right after scaffold generation. `rapidcraft init` is designed to produce the blueprint, not final app code.
