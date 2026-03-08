---
id: 1
title: Project Scaffolding
status: pending
priority: 1
depends_on: []
---

# Project Scaffolding

## Description
Set up the Vite + React + TypeScript project with Tailwind CSS and Vitest. Establish the file structure defined in the architecture plan, with placeholder files for each module. Configure build, dev server, and test runner so subsequent stories have a working foundation.

## Acceptance Criteria
- The system shall serve a development build at `localhost` via `npm run dev` that renders a React root component.
- The system shall compile TypeScript with strict mode enabled and produce zero type errors on an empty project.
- When `npm test` is run, the system shall execute Vitest and report a passing placeholder test.
- The system shall process Tailwind utility classes in components and apply them in the rendered output.
- The system shall contain the directory structure from plan.md (`src/game/`, `src/components/`, `src/hooks/`) with placeholder files for `types.ts`, `constants.ts`, `logic.ts`, `reducer.ts`, and all component files.

## Technical Context
- **Plan.md references:** File Structure section, entire stack decision set
- **Key files:** `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.html`, `src/main.tsx`, `src/index.css`, `src/App.tsx`
- Install deps: `react`, `react-dom`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/react`, `@types/react`, `@types/react-dom`
