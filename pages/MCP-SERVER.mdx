# MCP Server

Mezmer includes a repository-local MCP server for AI-assisted development workflows.

## Purpose

The MCP server turns the repository's existing contracts, docs, and validation scripts into a structured interface that MCP-capable tools can query directly.

This is useful when developers are working with AI tools that need authoritative context instead of file-system guessing.

The server helps AI tooling:

- retrieve exact component contracts and capabilities
- retrieve current theme metadata and active theme state
- read component documentation as structured context
- run repository validation checks before or after changes

## What It Exposes

Current resources and tools are implemented in `scripts/mcp-server.mjs`.

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
- `validate_contracts`
- `validate_component_docs`
- `validate_workspace_contract_surface`

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
5. Run `pnpm mcp:server` and confirm `list_components` includes the new component.

The MCP server reads component resources from `ai/contracts/index.json`, so index accuracy is the source of truth for MCP discoverability.

## Run Locally

Start the stdio MCP server from the repository root:

```bash
pnpm mcp:server
```

Show help:

```bash
pnpm mcp:help
```

## Connect In MCP Clients

This server uses stdio, so most MCP-capable clients can connect to it with the same three pieces of information:

- command: `pnpm`
- args: `mcp:server`
- working directory: the absolute path to this repository

Reusable example:

```json
{
  "command": "pnpm",
  "args": ["mcp:server"],
  "cwd": "/absolute/path/to/mezmer"
}
```

### VS Code

In VS Code, add a new MCP server that runs as a local stdio process.

The verified config file format is `mcp.json`.

Common places to configure it:

- workspace-scoped: `.vscode/mcp.json`
- user-scoped: open it via the `MCP: Open User Configuration` command because the exact macOS path depends on the active VS Code profile

Use the repository root as the working directory and point the command to:

```json
{
  "servers": {
    "mezmer": {
      "type": "stdio",
      "command": "pnpm",
      "args": ["mcp:server"],
      "cwd": "/Users/you/Code/mezmer"
    }
  }
}
```

Once connected, MCP-aware chat or agent workflows can query Mezmer contracts, docs, themes, and validation tools directly.

### Claude Code

Claude Code supports both project-scoped and user-scoped MCP configuration.

Verified config locations:

- project-scoped shared config: `.mcp.json` in the repository root
- user-scoped private config on macOS: `/Users/you/.claude.json`

Project-scoped example for this repository:

```json
{
  "mcpServers": {
    "mezmer": {
      "command": "pnpm",
      "args": ["mcp:server"],
      "env": {}
    }
  }
}
```

From the repository root, you can also register it without editing JSON manually:

```bash
claude mcp add --transport stdio --scope project mezmer -- pnpm mcp:server
```

If you want the server available across projects instead, use user scope:

```bash
claude mcp add --transport stdio --scope user mezmer -- pnpm mcp:server
```

After setup, use `/mcp` inside Claude Code to inspect connection state.

### Claude Desktop

Claude Desktop also supports local MCP servers, but the easiest accurate path is to either:

- configure it through Claude Desktop directly, or
- import from Claude Code after adding the server there

If you already added Mezmer in Claude Code, you can use:

```bash
claude mcp add-from-claude-desktop
```

If your environment does not expose `pnpm` on the PATH for GUI apps, replace `pnpm` with the absolute path to your pnpm executable.

### Cursor

In Cursor, add Mezmer as a local MCP server and configure it as a stdio command with the repository root as `cwd`.

Use the same stdio values:

```json
{
  "command": "pnpm",
  "args": ["mcp:server"],
  "cwd": "/Users/you/Code/mezmer"
}
```

Cursor's public docs did not expose a stable macOS config-file path in the reference used for this guide, so prefer the in-app MCP setup flow and paste the values above.

After connection, Cursor can use the Mezmer MCP surface for more accurate component generation and validation-aware edits.

### macOS Example Paths

For a repository cloned to `/Users/you/Code/mezmer`, common macOS examples look like:

```json
{
  "workspaceVscodeConfig": "/Users/you/Code/mezmer/.vscode/mcp.json",
  "claudeProjectConfig": "/Users/you/Code/mezmer/.mcp.json",
  "claudeUserConfig": "/Users/you/.claude.json"
}
```

### Notes

- Start from the repository root so the server can read `ai/contracts`, `docs`, and validation scripts correctly.
- Run `pnpm install` before connecting the server in a client for the first time.
- If the client fails to launch the server, verify that `pnpm mcp:server` works in a terminal first.
- If `pnpm` is not available in the client environment, use the absolute executable path instead.

## Related Files

- `scripts/mcp-server.mjs`
- `ai/contracts/index.json`
- `ai/contracts/components/*.contract.json`
- `ai/contracts/themes/*.contract.json`
- `ai/theme.active.json`
- `scripts/validate-contracts.mjs`
- `scripts/validate-component-docs.mjs`

## Scope

The current implementation is intentionally thin and read-only by default.

It reuses the repository's existing contract and validation logic instead of introducing a second source of truth.
