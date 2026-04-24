# Flows

This section documents repeatable page-level flows built by composing RapidKit components, hooks, validation, and async boundaries.

## Available Flows

- [Login](./login.md)

## What Flows Are For

- Demonstrate how multiple RapidKit primitives fit together in real application layouts.
- Provide copyable starter implementations for common page types without turning them into product-specific package APIs.
- Show where validation, RTK Query, and local composition helpers should live when building on top of the kit.

## Recommended Scaling Pattern

1. Add one flow entry in the docs renderer registry.
2. Add one preview/code example implementation.
3. Add one docs page in `pages/flows` and one markdown reference page in `docs/flows`.
4. Keep flow-specific state and API adapters local to the flow example until a composition proves stable enough to publish.
