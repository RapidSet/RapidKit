# rapidkit CLI

Enterprise-first JSON blueprint scaffolding CLI for RapidKit.

## Usage

- npx @rapidset/rapidkit-cli@latest init my-app --preset enterprise-dashboard
- pnpm dlx @rapidset/rapidkit-cli@latest init my-app --preset operations-console
- npx @rapidset/rapidkit-cli@latest init my-app --preset enterprise-dashboard --deployment netlify
- npx @rapidset/rapidkit-cli@latest init my-app --preset operations-console --deployment kubernetes
- npx @rapidset/rapidkit-cli@latest init my-app --preset enterprise-dashboard --skip-deployment

## Commands

- rapidkit list-presets
- rapidkit init <project-name> [--preset <id>] [--output <path>] [--deployment <target>] [--skip-deployment]

## Output Model

- Presets scaffold JSON blueprint manifests only.
- Generated projects are intended for AI/MCP-driven implementation workflows.
- No React application code is scaffolded by default.
- Blueprint manifests now record a deployment target selection for downstream AI materialization.
- Container-based targets record a required multi-stage Docker build strategy for downstream image optimization.

## Presets

- enterprise-dashboard
- operations-console
