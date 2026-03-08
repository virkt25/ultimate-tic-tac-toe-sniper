# S01: Project Scaffolding

## Description
Set up the Vite + React + TypeScript project with ESLint, Prettier, and Vitest configured. Establish the foundational directory structure and build pipeline.

## Acceptance Criteria (EARS)
- When a developer runs `npm install` followed by `npm run dev`, the system shall start a local development server that serves a React application with hot module replacement.
- When a developer runs `npm run build`, the system shall produce a production-ready static site bundle in the `dist/` directory with no TypeScript or lint errors.
- When a developer runs `npm run test`, the system shall execute the Vitest test runner and report results (passing with zero tests is acceptable at this stage).
- When a developer runs `npm run lint`, the system shall check all TypeScript and TSX files against the configured ESLint rules and report violations.
- The system shall enforce TypeScript strict mode (`"strict": true` in tsconfig.json).

## Dependencies
- None (first story)

## Notes
- Use Vite's React-TS template as the starting point
- Configure Prettier for consistent formatting
- Establish the directory structure: `src/engine/`, `src/components/`, `src/styles/`
- Add a `.prettierrc` and ESLint config appropriate for React + TypeScript
- Ensure Vitest is configured with jsdom or happy-dom environment for future component tests
