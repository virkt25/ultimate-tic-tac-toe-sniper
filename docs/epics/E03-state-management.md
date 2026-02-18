# Epic E03: State Management

> **Status:** Draft
> **Priority:** P0
> **Estimated Points:** 7
> **Dependencies:** E02-game-logic

## Scope

### In Scope
- Zustand store wrapping the game engine
- Store actions: placeMove, newGame
- Optimized selectors for component subscriptions
- Integration tests verifying store + engine work together

### Out of Scope
- Game logic implementation (E02)
- React component rendering (E04-E06)
- UI state not related to game (no UI modals, no preferences)

## Architecture Context

### State Management Layer (`src/state/`)

#### `gameStore.ts` — Zustand Store

- **Responsibility:** Wrap the pure game engine in a reactive store. Expose actions that UI components call, and state that UI components read.
- **Interfaces:**
  - `useGameStore()` — Zustand hook returning current `GameState` plus actions.
  - Actions: `placeMove(board, cell)`, `newGame()`.
  - Selectors: `useCurrentPlayer()`, `useActiveBoards()`, `useGameResult()`, `useLastMove()`, `useBoardState(boardIndex)`, `useSubBoardStatus(boardIndex)`, `useWinningLine()`.
- **Dependencies:** `zustand`, `src/game/engine.ts`, `src/game/types.ts`

### Data Flow

```
User Click → Cell.tsx → gameStore.placeMove(boardIdx, cellIdx)
                              ↓
                        engine.makeMove(state, boardIdx, cellIdx)
                              ↓
                        New GameState → Zustand store → React re-renders
```

### Error Handling

Store validates action results. Invalid moves are silently ignored — the UI prevents invalid clicks via active board highlighting. The store calls `makeMove` and only updates state if `result.success === true`.

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S08 | Create Zustand store with actions and selectors | M | S05, S06 | frontend |
| S09 | Write store integration tests | S | S08 | tests |

## Acceptance Criteria

1. `useGameStore()` returns the full game state and actions
2. `placeMove(board, cell)` calls `engine.makeMove` and updates state on success
3. `placeMove(board, cell)` does nothing on invalid moves (no error thrown)
4. `newGame()` resets state to `createInitialState()`
5. Selectors return derived state without unnecessary re-renders
6. `useBoardState(boardIndex)` returns only the 9 cells for that board
7. `useSubBoardStatus(boardIndex)` returns only the status for that board
8. Integration tests verify full game flows (place moves → win → new game)

## Technical Notes

- Use Zustand's `create` with TypeScript generics for type safety
- Selectors should use Zustand's `useShallow` or equality functions to prevent re-renders when unrelated state changes
- `useBoardState(boardIndex)` should use a selector that extracts `state.boards[boardIndex]` with shallow equality
- The store is the ONLY place where `engine.makeMove` is called — components never call engine functions directly
