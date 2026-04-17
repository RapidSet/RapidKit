---
layout: home

hero:
  name: Mezmer
  text: Reusable React UI Components
  tagline: Publishable, accessible, and contract-driven component library
  image:
    src: /mezmer-icon.svg
    alt: Mezmer icon
  actions:
    - theme: brand
      text: Get Started
      link: /THEMING
    - theme: alt
      text: Component Docs
      link: /components/

features:
  - title: Consumer-First API
    details: Public props are domain-neutral and stable, designed for host-app portability.
  - title: Themed by Tokens
    details: Components rely on semantic tokens and built-in themes for predictable customization.
  - title: Contract-Driven Quality
    details: Components are implemented and tested against machine-readable contracts.
---

## Install

```bash
pnpm add @tarikukebede/mezmer
```

## Use

```tsx
import { Input } from '@tarikukebede/mezmer';
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/default.css';

export function Example() {
  return <Input name="email" value="" onChange={() => {}} />;
}
```
