# S01: Project Scaffolding

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S01
**Dependencies:** None

---

## Summary

Set up the project foundation with Vite, React 19, TypeScript (strict mode), Vitest, Zustand, CSS Modules, ESLint, and Prettier. Establish the directory structure defined in the architecture plan (section 1) so all subsequent stories have a working build and test pipeline.

## Architecture Reference

- **Plan section 1** — Project Structure (full directory tree)
- **Plan section 6** — Styling Approach (global.css with CSS custom properties)
- **Spec section 3.1** — Framework Selection (React + TypeScript + Vite)
- **Spec section 3.5** — Build & Tooling (ESLint, Prettier, TypeScript strict)

## Acceptance Criteria

1. **Ubiquitous:** The project shall have a `package.json` with dependencies for React 19, Zustand, Vite, Vitest, ESLint, and Prettier.
2. **Ubiquitous:** The project shall include TypeScript configuration files (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) with strict mode enabled.
3. **Event-driven:** When a developer runs `npm run dev`, the system shall start a Vite dev server that serves a React application at `localhost`.
4. **Event-driven:** When a developer runs `npm test`, the system shall execute Vitest and report zero failures (with at least one placeholder test passing).
5. **Event-driven:** When a developer runs `npm run build`, the system shall produce a production bundle in the `dist/` directory without errors.
6. **Ubiquitous:** The project shall contain the directory structure from plan section 1: `src/engine/`, `src/store/`, `src/components/`, with placeholder files for `main.tsx`, `global.css`, and `vite-env.d.ts`.
7. **Ubiquitous:** The `global.css` file shall define the CSS custom properties from plan section 6 (color tokens, cell-size, board-gap, meta-gap) using `clamp()` for responsive sizing.
8. **Ubiquitous:** The project shall include an `eslint.config.js` and `.prettierrc` configuration file.
