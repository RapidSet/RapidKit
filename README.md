# @rapidset/rapidkit

AI-first React UI components for building production-grade application interfaces.

RapidKit gives teams beautifully designed, accessible, typed, enterprise-ready components that are already themed and built for AI-assisted development. It is designed to make production-grade code generation easier with predictable APIs, contract-aligned documentation, and AI-friendly tooling.

It is built on top of proven technologies including shadcn/ui, Radix UI, Zod, RTK Query, TanStack, and Tailwind CSS.

[![npm version](https://img.shields.io/npm/v/@rapidset/rapidkit)](https://www.npmjs.com/package/@rapidset/rapidkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/RapidSet/RapidKit/blob/main/LICENSE)

## Installation

```bash
pnpm add @rapidset/rapidkit react react-dom @reduxjs/toolkit @tanstack/react-table react-redux react-hook-form zod tailwindcss
```

## Usage

```tsx
import { Input } from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export function Example() {
  return (
    <Input
      name="email"
      label="Email"
      value=""
      onChange={() => {}}
      placeholder="name@company.com"
    />
  );
}
```

## Documentation

https://rapidset.github.io/RapidKit/components/

## License

MIT
