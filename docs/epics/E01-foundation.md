# Epic E01: Foundation

> **Status:** Draft
> **Priority:** P0
> **Estimated Points:** 8
> **Dependencies:** None

## Scope

### In Scope
- Vite + React + TypeScript project scaffolding
- ESLint + Prettier configuration
- Directory structure per architecture spec
- Base HTML shell with viewport meta tags
- Global CSS reset and CSS custom properties (design tokens)

### Out of Scope
- Game logic implementation (E02)
- React component implementation (E04-E06)
- CI/CD pipeline (GitHub Actions) — will be added later
- Deployment hosting configuration
- Custom domain setup

## Architecture Context

### Directory Structure (from `docs/architecture.md`)

```
ultimate-tic-tac-toe-sniper/
├── public/
│   └── favicon.ico
├── src/
│   ├── game/                    # Pure game logic (no React)
│   │   ├── types.ts
│   │   ├── engine.ts
│   │   ├── rules.ts
│   │   └── __tests__/
│   │       ├── engine.test.ts
│   │       └── rules.test.ts
│   ├── state/                   # State management
│   │   └── gameStore.ts
│   ├── components/              # React UI components
│   │   ├── Game.tsx
│   │   ├── Game.module.css
│   │   ├── MetaBoard.tsx
│   │   ├── MetaBoard.module.css
│   │   ├── SubBoard.tsx
│   │   ├── SubBoard.module.css
│   │   ├── Cell.tsx
│   │   ├── Cell.module.css
│   │   ├── TurnIndicator.tsx
│   │   ├── TurnIndicator.module.css
│   │   ├── GameOverOverlay.tsx
│   │   ├── GameOverOverlay.module.css
│   │   └── NewGameButton.tsx
│   ├── App.tsx
│   ├── App.module.css
│   ├── main.tsx
│   └── index.css                # Global styles (CSS reset, variables)
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── eslint.config.js
```

### Technology Choices

| Component | Choice | Why |
|-----------|--------|-----|
| Language | TypeScript 5.x (strict mode) | Type safety for nested game state |
| Frontend | React 18+ | Component model maps to nested board structure |
| State Management | Zustand | < 2KB, minimal boilerplate, no providers |
| Build Tool | Vite 5+ | Fast HMR, native TS/React, small bundles |
| Styling | CSS Modules | Scoped styles, zero runtime cost |
| Testing | Vitest + React Testing Library | Native Vite integration, fast |
| Package Manager | pnpm | Required per constraints |

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S01 | Scaffold Vite + React + TypeScript project | M | None | frontend |
| S02 | Configure ESLint and Prettier | S | S01 | frontend |

## Acceptance Criteria

1. Running `pnpm install && pnpm dev` starts a development server with HMR
2. Running `pnpm build` produces a static bundle in `dist/`
3. TypeScript strict mode is enabled and `pnpm typecheck` passes
4. ESLint and Prettier are configured and `pnpm lint` passes
5. Directory structure matches the architecture specification
7. Global CSS reset and design token custom properties are defined in `index.css`

## Technical Notes

- Use `pnpm create vite` with the `react-ts` template as the starting point
- Configure `tsconfig.json` with `strict: true`, path aliases (`@/` → `src/`)
- Vitest config can live in `vite.config.ts` using the `test` field
- Bundle size target: < 200KB gzipped (verify with `vite build`)
