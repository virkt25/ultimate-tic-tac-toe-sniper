---
id: S01
title: Project Scaffolding
status: pending
priority: 1
depends_on: []
---

# S01: Project Scaffolding

## Description
Set up the project foundation: Vite with React 19 and TypeScript, install all dependencies (Zustand, Motion, Vitest), create the folder structure (`engine/`, `store/`, `components/`), configure `global.css` with dark-theme design tokens, and create the root `index.html` and `main.tsx` entrypoint.

## Acceptance Criteria (EARS)
- When a developer runs `npm install && npm run dev`, the system shall start a local development server that renders a React application in the browser without errors.
- The system shall provide a `global.css` file defining all CSS custom properties for the dark theme (background, surface, player colors, text, borders, spacing, transitions).
- When a developer runs `npm test`, the system shall execute the Vitest test runner and report zero failures (with no tests yet, the runner exits cleanly).

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D1 (Project Structure), D4 (CSS Modules + Custom Properties)
- Key files to create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/global.css`, `src/components/App.tsx`, `src/components/App.module.css`
- No dependencies on other stories
