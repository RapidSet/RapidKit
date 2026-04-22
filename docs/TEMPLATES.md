# Template System

RapidKit templates are contract-driven and enterprise-focused.

## Current policy

- Official enterprise templates are maintained in-repo.
- Community templates are supported through the same contract model but are not auto-trusted.
- CLI defaults to official templates only unless community templates are explicitly allowed.

## Official enterprise presets

- enterprise-dashboard
- operations-console

## Contract files

- Index: `ai/contracts/index.json`
- Preset contracts: `ai/contracts/presets/*.contract.json`
- Contract schema: `ai/contracts/presets/template-contract.schema.json`

## Production baseline requirements

Every template contract must include:

- required checks (install, typecheck, lint, test, build)
- required project structure paths
- at least one test file path
- prompt definitions and defaults
- backend integration boundaries
- data-flow rules

## AI-first usage

Use MCP tools to avoid out-of-contract generation:

1. `list_presets`
2. `get_preset_contract`
3. `plan_project`
4. `scaffold_project`
