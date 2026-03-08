# Codebase Overview: Ultimate Tic-Tac-Toe

**Protocol:** SNPR-20260307-b7e4
**Phase:** Discover
**Date:** 2026-03-07

---

## Current Repository State

This is a **greenfield project**. The repository contains no application source code. The only content is SNIPER framework configuration and Claude Code agent definitions.

### Existing Files (non-git)

```
.sniper/
  config.yaml                          -- Project configuration (stack, agents, ownership)
  live-status.yaml                     -- Protocol progress tracking
  artifacts/
    registry.md                        -- Artifact registry
    SNPR-20260307-b7e4/meta.yaml       -- Current protocol metadata
  checklists/                          -- Various workflow checklists (yaml)
  knowledge/
    manifest.yaml                      -- Knowledge base manifest

.claude/
  agents/                              -- 10 agent definition files (.md)
  commands/                            -- 4 slash command definitions (.md)
  settings.json                        -- Claude Code settings with hooks

CLAUDE.md                              -- Project-level Claude instructions
README.md                              -- Project readme (untracked)
```

### Locked-In Technical Decisions

These are established in `.sniper/config.yaml` (lines 67-78):

| Decision | Value | Source |
|----------|-------|--------|
| Language | TypeScript | `stack.language: typescript` |
| Package Manager | npm | `stack.package_manager: npm` |
| Frontend Framework | **Not yet chosen** | `stack.frontend: null` |
| Backend | None needed | `stack.backend: null` |
| Database | None needed | `stack.database: null` |
| Test Runner | **Not yet chosen** | `stack.test_runner: null` |
| Build/Lint/Test Commands | **Not yet configured** | All empty strings |

### Ownership Boundaries

Defined in `.sniper/config.yaml` (lines 43-64). These map agent responsibilities to file paths:

- **frontend:** `src/frontend/`, `src/components/`, `src/hooks/`, `src/styles/`, `src/pages/`
- **backend:** `src/backend/`, `src/api/`, `src/services/`, `src/db/` -- **Note:** likely unused for this project since there is no backend
- **tests:** `tests/`, `__tests__/`, `*.test.*`, `*.spec.*`
- **docs:** `docs/`
- **infrastructure:** `docker/`, `.github/`, `infra/`, `scripts/`

**Assumption:** The ownership paths are defaults from SNIPER scaffolding and may need adjustment once the framework and project structure are chosen. For a purely client-side game, the backend paths are irrelevant.

---

## Recommended Project Structure Patterns

The following are common patterns for a client-side TypeScript game app. These are presented as options -- the architect should select the appropriate pattern based on the chosen framework.

### Pattern A: Feature-Based Structure

Groups files by feature/domain rather than by type. Well-suited for a game with clear domain boundaries (game engine, board UI, game state).

```
src/
  engine/                  -- Pure game logic (no UI dependencies)
    types.ts               -- Game types (Board, Cell, Player, GameState, etc.)
    engine.ts              -- Core game engine (make move, check win, validate)
    engine.test.ts         -- Comprehensive engine unit tests
    constants.ts           -- Game constants (board size, winning patterns)

  state/                   -- State management layer
    store.ts               -- Game state store (framework-specific)
    actions.ts             -- State actions/reducers
    selectors.ts           -- Derived state (active board, valid moves, etc.)

  components/              -- UI components
    App.tsx                -- Root app component
    MetaBoard.tsx          -- The 3x3 grid of sub-boards
    SubBoard.tsx           -- A single 3x3 sub-board
    Cell.tsx               -- A single playable cell
    GameStatus.tsx         -- Turn indicator, game result display
    Controls.tsx           -- New game button, settings

  styles/                  -- Styling (CSS modules, Tailwind config, etc.)
    global.css
    board.module.css
    ...

  index.ts                 -- Entry point
  index.html               -- HTML shell
```

**Key principle:** The `engine/` directory contains zero framework imports. It is pure TypeScript with pure functions, making it independently testable and framework-agnostic.

### Pattern B: Layer-Based Structure

Groups by architectural layer. More traditional, works well for smaller projects.

```
src/
  types/                   -- All TypeScript types/interfaces
  logic/                   -- Pure game logic
  store/                   -- State management
  ui/                      -- All components
  assets/                  -- Static assets (icons, fonts)
  index.ts
```

### Pattern C: Flat Structure

For a project of this size (~10-15 source files), a flat or minimally nested structure may be sufficient and reduce cognitive overhead.

```
src/
  types.ts
  engine.ts
  engine.test.ts
  store.ts
  App.tsx
  Board.tsx
  Cell.tsx
  GameStatus.tsx
  main.ts
  styles.css
```

### Recommendation Context

**Fact:** The final application will likely be 10-20 source files total. Overly deep nesting adds navigation overhead without proportional benefit.

**Fact:** Separating game engine logic from UI is a best practice regardless of structure pattern chosen. The engine should be a pure TypeScript module with no framework dependencies, enabling thorough unit testing of all game rules independently.

**Fact:** The SNIPER ownership boundaries (`.sniper/config.yaml`) use paths like `src/components/` and `src/hooks/`, which align most closely with Pattern A. However, these can be adjusted.

---

## Key Architectural Observations

1. **State complexity is moderate.** The game state includes: 81 cell values, 9 sub-board statuses, current player, active sub-board constraint, move history (optional), and game outcome. This is a single object tree that fits comfortably in any state management approach (useReducer, Zustand, Svelte stores, Pinia, etc.).

2. **The game engine is the riskiest component.** The send rule with its free-move exception and the interaction between sub-board resolution and meta-board win detection contain the most edge cases. This should be built and tested first, before any UI work.

3. **Rendering is straightforward.** The board is a static 3x3-of-3x3 grid. No scrolling, no dynamic layouts, no virtualization needed. The primary rendering challenge is visual clarity of the nested structure, not performance.

4. **No build-time or runtime data fetching.** No APIs, no async data loading, no caching. The entire app state lives in memory on the client.
