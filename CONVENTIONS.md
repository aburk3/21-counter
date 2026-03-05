# Frontend Conventions

This document captures observed frontend conventions in this repo so future contributors and AI agents can make consistent changes.

Scope: `src/**` frontend code.

## Source of Truth Priority

When conventions conflict, follow this priority order:

1. Existing repo rules in `.cursor/rules/*`
2. Existing code patterns in `src/**`
3. This conventions document

## Directory and File Architecture

- Use `FolderName/index.tsx` as the entry file for components and pages.
- Keep folder names aligned with component/page names.
- Under `src/pages`, do **not** use the `Page` suffix in names.
  - Use `Dashboard`, not `DashboardPage`.
- Keep feature-local files colocated with that feature:
  - `constants.ts` for UI copy/constants
  - `styles.ts` for styled-components
  - `index.test.tsx` for component/page tests
  - `type.ts` for feature-local enums/types when needed
- Use top-level shared directories by responsibility:
  - `src/components` reusable UI
  - `src/pages` route-level features
  - `src/hooks` data/state hooks
  - `src/helpers` pure formatting/sorting helpers
  - `src/lib` API client and request helpers
  - `src/constants` shared constants
  - `src/styles` global theme and shared style primitives
  - `src/types` shared/re-exported API types

## Naming Conventions

- Component and page names: `PascalCase`.
- Hooks: `useXxx` naming.
- Props types: `ComponentNameProps`.
- Constant objects: `UPPER_SNAKE_CASE` (often `as const`).
- Enums: `PascalCase` enum name, with PascalCase members and string values.

## Component Declarations and Exports

- Prefer arrow function components:
  - `const Dashboard = () => { ... }`
- Pages should default export their page component.
- Reusable components generally use named exports.
- Keep helpers local to the file when they are not reused.
- Exports should be at the bottom of the files and not exported inline.

## Styling Conventions

- Use `styled-components` for styling (no CSS modules in current codebase).
- Define styled components in colocated `styles.ts` files.
- Import styled primitives from local `./styles` or shared `@/styles/*`.
- Use theme tokens (`theme.colors`, `theme.media`) rather than hardcoding repeated style values.
- Use styled-components transient props (`$propName`) for style-only props to avoid DOM leakage.

## TypeScript Conventions

- Use `type` aliases for props and many local structures.
- Use `import type { ... }` for type-only imports.
- Keep strict typing; avoid `any` (ESLint enforces this, except generated OpenAPI types).
- Reuse API schema types through `@/types/api`.
- Use narrow unions / enums for state machines (loading/ready/error/not-found flows).

## Imports and Module Paths

- Use path alias imports via `@/*` for `src/*`.
- Typical import grouping pattern:
  1. React / external packages
  2. Shared app modules (`@/styles`, `@/components`, `@/hooks`, etc.)
  3. Local feature imports (`./constants`, `./styles`)
- Keep imports readable and domain-grouped rather than deeply interleaved.
- Export all constants and enums at the bottom of a constants.ts or types.ts file at the bottom of the file and not inline.

## State, Data Fetching, and Side Effects

- Use custom hooks in `src/hooks` for page-level data fetching and mutations.
- Return structured hook state objects (for example `{ data, error }` or `{ detail, effectiveStatus, ... }`).
- Use explicit status handling for async state (loading, ready, not found, error).
- Guard async effects with unmount protection (`isMounted` pattern or equivalent).
- Keep optimistic UI updates inside hooks where mutation behavior is managed.

## Routing and Page Composition

- Route definitions are centralized in `src/App.tsx`.
- Standard page shell composition pattern:
  - `Page` container
  - Sidebar region
  - `Main` region with `Header`, `Title`, and content sections
- Reuse layout primitives from `@/components/Layout/styles`.

## UI Text, Empty States, and Errors

- Store page copy and labels in feature-local `constants.ts` objects (`as const`).
- Provide explicit fallback text when data is missing.

## Testing Conventions

- Framework stack: Vitest + React Testing Library.
- Test file names:
  - `index.test.tsx` for component/page entry files
  - `*.test.ts` for non-React helpers/lib modules
- Prefer `renderWithProviders` from `src/test/test-utils.tsx` when components require theme/router context.
- Mock API calls at `@/lib/api` in page/hook tests.
- Use async assertions with `findBy*` and `waitFor` where appropriate.

## AI Contributor Checklist

Before creating a new frontend feature/component:

- Create a folder with `index.tsx` entry.
- Add `styles.ts` in the same folder for styled components.
- Decide if constants belong in local `constants.ts`.
- Type props with `type ComponentNameProps`.
- Use `@/` imports and follow grouping conventions.
- Add/adjust tests near the feature (`index.test.tsx`).
- Keep loading/error/not-found behavior explicit and user-visible.
