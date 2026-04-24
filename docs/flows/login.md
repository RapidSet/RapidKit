# Login Flow

Login Flow is a reference implementation for a publishable authentication entry page centered on the login form and its end-to-end integration points, including hook-driven form state, Zod schema validation, and manual validation.

## Includes

- UI composition built from `Text`, `Chip`, `Input`, `Checkbox`, and `Button`
- `useFormHandlers` integration for field bindings, validation, and submit handling
- `zod` schema usage through the hook's `schema.safeParse` pathway
- Manual `validate` usage alongside the schema for business-specific rules
- Alternate provider actions for SSO-style sign-in entry points
- Clear extension points for password reset, MFA follow-up, and invite-only onboarding states

## Why This Flow Exists

- It gives consumers a reusable starting point for authenticated product entry screens.
- It demonstrates the core integration surface of a login page without relying on surrounding marketing or support content.
- It shows how RapidKit form controls bind to the package's form hook API in a real page composition.
- It shows how schema issues and manual validation errors are mapped back to field errors through `getTextFieldProps` and `getCheckboxFieldProps`.
- It establishes a strong baseline for related flows like registration, invite acceptance, password reset, and MFA challenge screens.

## Next Adaptations

- Replace the placeholder provider buttons with your identity provider adapters.
- Add your validation, identity adapter, and submission state handling directly around the form controls.

## Validation Mapping

The flow passes both `schema` and `validate` into `useFormHandlers`.

- On submit, the hook calls `schema.safeParse(values)` for structural validation such as email format and password length.
- The `validate` callback then applies business rules that are easier to express imperatively, such as restricting sign-in to `@rapidset.io` addresses.
- Each schema issue path is reduced to its first field segment.
- `getTextFieldProps('email')` and `getTextFieldProps('password')` expose the mapped message as `error`.
- `Input` renders that `error` value directly under the corresponding field.
- When both layers return an error for the same field, the manual `validate` result takes precedence.
