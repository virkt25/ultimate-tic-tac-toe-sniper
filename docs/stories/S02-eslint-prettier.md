> **Status:** Complete (Sprint 1)

# Story S02: Configure ESLint and Prettier

> **Epic:** E01-foundation (`docs/epics/E01-foundation.md`)
> **Complexity:** S
> **Priority:** P0
> **File Ownership:** frontend
> **Dependencies:** S01

## Description

Set up ESLint with TypeScript-aware rules and React-specific plugins. Set up Prettier for consistent code formatting. Add `eslint-plugin-security` to enforce security best practices. Add lint and format scripts to `package.json`. Ensure ESLint and Prettier do not conflict with each other.

## Embedded Context

### From PRD

**Non-Functional Requirements — Maintainability:**
- Consistent code style enforced by tooling
- TypeScript strict mode with no escape hatches

### From Architecture

**Code Standards:**
- ESLint + Prettier for linting and formatting
- Strict TypeScript — no `any` types allowed
- All functions must have explicit return types where non-trivial
- No implicit any, no unused variables, no unused imports

### From Security Requirements

- `eslint-plugin-security` must be included in the ESLint configuration and run as part of CI
- No use of `dangerouslySetInnerHTML` anywhere in the codebase
- No use of `eval()` or `Function()` constructor
- These rules must be enforced via ESLint, not just convention

## Acceptance Criteria

1. **Given** the project, **When** running `pnpm lint`, **Then** ESLint runs without errors on all `src/` files.
2. **Given** a TypeScript file containing an `any` type annotation, **When** running `pnpm lint`, **Then** it reports an error for `@typescript-eslint/no-explicit-any`.
3. **Given** the ESLint configuration, **When** inspecting loaded plugins, **Then** `eslint-plugin-security` is included and active.
4. **Given** a TypeScript file using `dangerouslySetInnerHTML`, **When** running `pnpm lint`, **Then** it reports an error.
5. **Given** the project, **When** running `pnpm format:check`, **Then** Prettier checks all source files for formatting compliance.

## Test Requirements

- [ ] No runtime tests (lint/format configuration only)
- [ ] Verify `pnpm lint` passes on the existing scaffolded code from S01

## Implementation Notes

- Install dev dependencies: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-security`, `prettier`, `eslint-config-prettier`.
- Use flat config format (`eslint.config.js`) if using ESLint 9+, or `.eslintrc.cjs` for ESLint 8.
- Key rules to enable:
  - `@typescript-eslint/no-explicit-any: "error"`
  - `@typescript-eslint/explicit-function-return-type: "warn"` (or similar)
  - `no-eval: "error"`
  - `react/no-danger: "error"` (blocks dangerouslySetInnerHTML)
  - `security/*` rules from eslint-plugin-security
- Create `.prettierrc` with project defaults (single quotes, trailing commas, 2-space indent, etc.).
- Create `.prettierignore` to skip `dist/`, `node_modules/`, `coverage/`.
- Add scripts to `package.json`:
  - `"lint": "eslint src/"`
  - `"lint:fix": "eslint src/ --fix"`
  - `"format": "prettier --write src/"`
  - `"format:check": "prettier --check src/"`

## Out of Scope

- CI/CD pipeline integration — will be added later
- Pre-commit hooks (e.g., husky + lint-staged) — can be added later
- Editor-specific settings (.vscode/)
