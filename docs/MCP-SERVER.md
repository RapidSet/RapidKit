# MCP Server

RapidKit uses a standalone MCP server package (`rapidmcp`) for AI-assisted development workflows.

Package: https://www.npmjs.com/package/@rapidset/rapidmcp

<p align="center">
  <img src="../public/rapidmcp.svg" alt="rapidmcp logo" width="96" height="96" />
</p>

<p align="center"><strong>Contract-driven MCP context for RapidKit generation and validation workflows.</strong></p>

## Purpose

The MCP server turns the repository's existing contracts, docs, and validation scripts into a structured interface that MCP-capable tools can query directly.

This is useful when developers are working with AI tools that need authoritative context instead of file-system guessing.

The server helps AI tooling:

- retrieve exact component contracts and capabilities
- retrieve current theme metadata and active theme state
- read component documentation as structured context
- run repository validation checks before or after changes

## What It Exposes

Current resources and tools are provided by the npm package `@rapidset/rapidmcp`.

Read-only resources:

- contracts index
- active theme
- component contract by name
- component docs by name

Validation and discovery tools:

- `list_components`
- `get_component_contract`
- `list_themes`
- `get_theme_contract`
- `list_presets`
- `get_preset_contract`
- `plan_project`
- `scaffold_project`
- `validate_scaffold`
- `recommend_execution_path`
- `validate_contracts`
- `validate_component_docs`
- `validate_workspace_contract_surface`

`validate_scaffold` performs a Node runtime preflight before executing checks.
By default, it fails fast when Node is outside `^20.19.0 || >=22.12.0`.
Use `allowIncompatibleNode=true` only when you intentionally want to continue on unsupported runtimes.

`scaffold_project` also includes Node preflight metadata in its output as an advisory.
It does not block project generation, but returns a warning when runtime is outside the recommended range.

`plan_project` includes the same preflight metadata so agents can select safer execution paths before calling scaffold or validation tools.
It now also returns `executionRecommendation` and accepts `allowIncompatibleNode` for explicit policy control.

`recommend_execution_path` returns a deterministic runtime decision:

- `proceed`
- `proceed-with-warning`
- `block-until-runtime-upgrade`

Use it to normalize agent behavior before calling scaffold and validation tools.

## Why It Helps Developers

For developers using MCP-aware tools, this reduces incorrect code generation and repository spelunking.

Instead of manually checking multiple files, a tool can ask the MCP server for the source of truth and generate code aligned with:

- public props
- accessibility expectations
- access-control behavior
- theme contracts
- current validation status

This is especially useful when adding new components, updating themes, or refactoring contract-driven APIs.

## New Component MCP Checklist

When a new public component is added, verify MCP visibility from the contract index rather than hardcoding component names:

1. Add the component entry to `ai/contracts/index.json`.
2. Add the component contract file under `ai/contracts/components`.
3. Add the component docs file under `docs/components`.
4. Run `pnpm validate:contracts` and `pnpm validate:component-docs`.
5. Run `npm run mcp:start` from the generated project root and confirm `list_components` includes the new component.

The MCP server reads component resources from `ai/contracts/index.json`, so index accuracy is the source of truth for MCP discoverability.

## Run Locally

Start the stdio MCP server from the generated project root:

```bash
npm run mcp:start
```

Show help:

```bash
npm run mcp:help
```

## Connect In MCP Clients

This server uses stdio, so most MCP-capable clients can connect to it with the same three pieces of information:

- command: `npm`
- args: `run mcp:start`
- working directory: absolute path to the generated project root

Reusable example:

```json
{
  "command": "npm",
  "args": ["run", "mcp:start"],
  "cwd": "/absolute/path/to/generated-project"
}
```

### VS Code

In VS Code, add a new MCP server that runs as a local stdio process.

The verified config file format is `mcp.json`.

Common places to configure it:

- workspace-scoped: `.vscode/mcp.json`
- user-scoped: open it via the `MCP: Open User Configuration` command because the exact macOS path depends on the active VS Code profile

Use the generated project root as the working directory and point the command to:

```json
{
  "servers": {
    "rapidkit": {
      "type": "stdio",
      "command": "npm",
      "args": ["run", "mcp:start"],
      "cwd": "/Users/you/Code/my-product"
    }
  }
}
```

Once connected, MCP-aware chat or agent workflows can query RapidKit contracts, docs, themes, and validation tools directly.

### Claude Code

Claude Code supports both project-scoped and user-scoped MCP configuration.

Verified config locations:

- project-scoped shared config: `.mcp.json` in the repository root
- user-scoped private config on macOS: `/Users/you/.claude.json`

Project-scoped example for a generated project:

```json
{
  "mcpServers": {
    "rapidkit": {
      "command": "npm",
      "args": ["run", "mcp:start"],
      "cwd": "/Users/you/Code/my-product",
      "env": {}
    }
  }
}
```

From the generated project root, you can also register it without editing JSON manually:

```bash
claude mcp add --transport stdio --scope project rapidkit -- npm run mcp:start
```

If you want the server available across projects instead, use user scope:

```bash
claude mcp add --transport stdio --scope user rapidkit -- npm run mcp:start
```

After setup, use `/mcp` inside Claude Code to inspect connection state.

### Claude Desktop

Claude Desktop also supports local MCP servers, but the easiest accurate path is to either:

- configure it through Claude Desktop directly, or
- import from Claude Code after adding the server there

If you already added RapidKit in Claude Code, you can use:

```bash
claude mcp add-from-claude-desktop
```

If your environment does not expose `pnpm` on the PATH for GUI apps, replace `pnpm` with the absolute path to your pnpm executable.

### Cursor

In Cursor, add RapidKit as a local MCP server and configure it as a stdio command with the generated project root as `cwd`.

Use the same stdio values:

```json
{
  "command": "npm",
  "args": ["run", "mcp:start"],
  "cwd": "/Users/you/Code/my-product"
}
```

Cursor's public docs did not expose a stable macOS config-file path in the reference used for this guide, so prefer the in-app MCP setup flow and paste the values above.

After connection, Cursor can use the RapidKit MCP surface for more accurate component generation and validation-aware edits.

### macOS Example Paths

For a generated project in `/Users/you/Code/my-product`, common macOS examples look like:

```json
{
  "workspaceVscodeConfig": "/Users/you/Code/my-product/.vscode/mcp.json",
  "claudeProjectConfig": "/Users/you/Code/my-product/.mcp.json",
  "claudeUserConfig": "/Users/you/.claude.json"
}
```

### Notes

- Rapidcraft scaffolds `@rapidset/rapidkit` and `@rapidset/rapidmcp` from npm and installs dependencies by default.
- Run your package manager install manually only if you used `--skip-install`.
- If the client fails to launch the server, verify that `npm run mcp:start` works in a terminal first.
- If `npm` is not available in the client environment, use the package manager command you used for scaffolded scripts.

## Related Files

- generated project `package.json` (`mcp:start`, `mcp:help`)
- npm package `@rapidset/rapidmcp`
- `ai/contracts/index.json`
- `ai/contracts/components/*.contract.json`
- `ai/contracts/themes/*.contract.json`
- `ai/theme.active.json`
- `scripts/validate-contracts.mjs`
- `scripts/validate-component-docs.mjs`

## Scope

The current implementation is intentionally thin and read-only by default.

It reuses the repository's existing contract and validation logic instead of introducing a second source of truth.
