# Theming Guide

## Goals

- Ship pre-built themes out of the box.
- Keep components token-driven and host-app agnostic.
- Enable deterministic AI workflows for switching and creating themes.

## Token Surface

Mezmer components resolve color and radius from namespaced CSS variables.

Required tokens:

- `--mz-background`
- `--mz-foreground`
- `--mz-card`
- `--mz-card-foreground`
- `--mz-popover`
- `--mz-popover-foreground`
- `--mz-primary`
- `--mz-primary-foreground`
- `--mz-secondary`
- `--mz-secondary-foreground`
- `--mz-muted`
- `--mz-muted-foreground`
- `--mz-accent`
- `--mz-accent-foreground`
- `--mz-destructive`
- `--mz-destructive-foreground`
- `--mz-border`
- `--mz-input`
- `--mz-ring`
- `--mz-radius`

## Using Built-In Themes

```tsx
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/default.css';
```

Swap to slate:

```tsx
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/slate.css';
```

## AI-Friendly Commands

List themes:

```bash
pnpm theme:list
```

Apply a built-in theme to the workspace default:

```bash
pnpm theme:apply --theme default
pnpm theme:apply --theme slate --mode dark
```

Create a custom theme scaffold:

```bash
pnpm theme:create --id brand-x --from default
```

This command creates:

- `src/themes/brand-x.css`
- `ai/contracts/themes/brand-x-theme.contract.json`
- a new `themes` entry in `ai/contracts/index.json`

## Extending With shadcn Host Tokens

`src/styles.css` bridges shadcn tokens (`--background`, `--primary`, and others) to Mezmer tokens (`--mz-*`). If your host app already defines shadcn tokens, components can render correctly without rewriting component code.

For full control, set `--mz-*` tokens directly in your app theme CSS.
