# Story S01: Scaffold Vite + React + TypeScript project

> **Epic:** E01-foundation (`docs/epics/E01-foundation.md`)
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/)
> **Dependencies:** None

## Description

Initialize the project using `pnpm create vite` with the react-ts template. Configure tsconfig.json with strict mode and path aliases (`@/` mapping to `src/`). Set up Vitest for unit testing. Create index.html with proper viewport meta tags for mobile support. Create a global CSS file defining all design tokens as CSS custom properties on `:root`. Create placeholder directories: `src/game/`, `src/state/`, `src/components/`.

## Embedded Context

### From PRD

**US-001:** As a player, I want the page to load in under 2 seconds on a 4G connection so I can start playing immediately.

**Non-Functional Requirements:**
- FCP (First Contentful Paint) < 1.5 seconds
- TTI (Time to Interactive) < 2.0 seconds
- Total bundle size < 200KB gzipped
- Static site deployment (no server required)

**Constraints:**
- TypeScript + React frontend
- pnpm as package manager
- Static site — no backend, no database, no authentication

### From Architecture

**Technology Choices:**

| Technology | Version | Purpose |
|---|---|---|
| TypeScript | 5.x strict | Language |
| React | 18+ | UI framework |
| Vite | 5+ | Build tool / dev server |
| CSS Modules | — | Scoped styling |
| Vitest + RTL | — | Unit / component testing |
| pnpm | — | Package manager |

**Build Output:** Single `index.html` + hashed JS/CSS assets in `dist/`.

**Directory Structure:**
```
ultimate-tic-tac-toe/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts (or inside vite.config.ts)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── game/
│   │   ├── types.ts
│   │   ├── engine.ts
│   │   ├── rules.ts
│   │   └── __tests__/
│   │       ├── engine.test.ts
│   │       └── rules.test.ts
│   ├── state/
│   │   ├── gameStore.ts
│   │   └── __tests__/
│   │       └── gameStore.test.ts
│   └── components/
│       ├── Board/
│       ├── Cell/
│       ├── GameStatus/
│       └── Controls/
├── public/
└── dist/ (build output)
```

### From UX Spec

**Design Tokens (CSS Custom Properties):**

```css
:root {
  /* Player colors */
  --color-player-x: #2563EB;
  --color-player-o: #DC2626;

  /* Board colors */
  --color-board-bg: #FFFFFF;
  --color-cell-border: #D1D5DB;
  --color-sub-board-gap: #9CA3AF;
  --color-active-highlight: #DBEAFE;
  --color-active-border: #3B82F6;
  --color-drawn-bg: #F3F4F6;
  --color-hover: #F9FAFB;
  --color-last-move: #F59E0B;

  /* Text and overlay */
  --color-text: #111827;
  --color-overlay-bg: rgba(0, 0, 0, 0.5);
}
```

**Typography:** System font stack — `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

**Spacing:** Base unit of 4px. Common spacings: 4px, 8px, 12px, 16px, 24px, 32px, 48px.

## Acceptance Criteria

1. **Given** a fresh clone, **When** running `pnpm install && pnpm dev`, **Then** a dev server starts with HMR and serves the app at localhost.
2. **Given** the project, **When** running `pnpm build`, **Then** a static bundle is produced in `dist/` containing `index.html` and hashed JS/CSS assets.
3. **Given** `tsconfig.json`, **When** inspecting compiler options, **Then** `strict` mode is `true` and path alias `@/*` maps to `src/*`.
4. **Given** `index.html`, **When** inspecting meta tags, **Then** viewport is set with `width=device-width, initial-scale=1`.
5. **Given** `src/index.css`, **When** inspecting the `:root` selector, **Then** all design token custom properties listed above are defined.

## Test Requirements

- [ ] No runtime tests for this story (infrastructure/scaffolding only)
- [ ] Verify build completes without errors manually

## Implementation Notes

- Use `pnpm create vite@latest . --template react-ts` to scaffold.
- Add Vitest as a dev dependency: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom`.
- Configure Vitest in `vite.config.ts` using the `/// <reference types="vitest" />` triple-slash directive or a separate `vitest.config.ts`.
- Set `test.environment: 'jsdom'` in Vitest config.
- Add path alias in both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`).
- Add scripts to `package.json`: `"dev"`, `"build"`, `"preview"`, `"test"`, `"test:coverage"`.
- Create empty placeholder directories with `.gitkeep` files if needed: `src/game/`, `src/state/`, `src/components/`.

## Out of Scope

- ESLint / Prettier configuration (S02)
- CI/CD pipeline (S03)
- Game logic implementation
- React components
