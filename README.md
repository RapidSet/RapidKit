# @tarikukebede/mezmer 🌀

**Mezmerizingly simple, AI-first enterprise components for React.**

Mezmer is an opinionated UI toolkit designed to bridge the gap between headless logic and beautiful interfaces. It orchestrates **RTK Query**, **TanStack Table v8**, **shadcn/ui**, and **Zod** into a cohesive, permission-aware workflow.

[![npm version](https://img.shields.io/npm/v/@tarikukebede/mezmer.svg)](https://www.npmjs.com/package/@tarikukebede/mezmer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🧠 **AI-Native**: Ships with `.cursor/rules` to guide AI agents in implementing and extending your UI correctly.
- 🏗️ **Architected for Enterprise**: Native support for **Permissions/RBAC** at the component level.
- 📊 **Power Tables**: Pre-integrated TanStack Table logic with RTK Query auto-caching.
- 🛡️ **Type-Safe Forms**: Built-in Zod validation patterns for React Hook Form.
- 🎨 **Shadcn Primitives**: Accessible, customizable, and lightweight.

---

## 🚀 Quick Start

### Installation

```bash
pnpm add @tarikukebede/mezmer @reduxjs/toolkit @tanstack/react-table zod
```

---

## Commit Message Convention

This repository enforces Conventional Commits via Husky and commitlint.

### Format

```text
type(scope): subject
```

Scope is optional:

```text
type: subject
```

### Common Types

- feat: new feature
- fix: bug fix
- docs: documentation updates
- refactor: code changes without behavior change
- test: test updates
- chore: tooling, config, or maintenance

### Examples

```text
feat(input): add access resolver support
fix(input): preserve disabled behavior for read-only mode
docs(readme): add commit message convention guide
refactor(ui): simplify class merge utility usage
test(input): cover keyboard propagation behavior
chore(ci): tighten lint and pre-commit checks
```

### Local Validation

```bash
echo "feat(input): add clear button" | pnpm commitlint
```
