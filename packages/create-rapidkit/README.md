# rapidkit CLI

Enterprise-first JSON blueprint scaffolding CLI for RapidKit.

## Usage

- npx rapidkit@latest init my-app --preset enterprise-dashboard
- pnpm dlx rapidkit@latest init my-app --preset operations-console

## Commands

- rapidkit list-presets
- rapidkit init <project-name> [--preset <id>] [--output <path>]

## Output Model

- Presets scaffold JSON blueprint manifests only.
- Generated projects are intended for AI/MCP-driven implementation workflows.
- No React application code is scaffolded by default.

## Presets

- enterprise-dashboard
- operations-console
