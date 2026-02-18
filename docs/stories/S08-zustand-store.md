# Story S08: Create Zustand store with actions and selectors

> **Epic:** E03-state-management (`docs/epics/E03-state-management.md`)
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/state/)
> **Dependencies:** S05, S06

## Description

Create `src/state/gameStore.ts` with a Zustand store that wraps the game engine. The store holds the full `GameState` and exposes two actions (`placeMove`, `newGame`) and optimized selectors for each slice of state. Selectors are designed to minimize React re-renders by returning stable references for unchanged data.

## Embedded Context

### From Architecture

**gameStore.ts — Store Shape and API:**

```typescript
import { create } from 'zustand';

interface GameStore extends GameState {
  /** Place a mark on the given board and cell. Invalid moves are silently ignored. */
  placeMove: (board: BoardIndex, cell: CellIndex) => void;
  /** Reset the game to initial state. */
  newGame: () => void;
}

const useGameStore = create<GameStore>((set) => ({
  ...createInitialState(),

  placeMove: (board, cell) => {
    set((state) => {
      const result = makeMove(state, board, cell);
      if (result.success) {
        return result.state;
      }
      return state; // no change on invalid move
    });
  },

  newGame: () => {
    set(createInitialState());
  },
}));
```

**Selectors (optimized with shallow equality or manual selectors):**

```typescript
/** Current player ('X' or 'O') */
const useCurrentPlayer = () => useGameStore((s) => s.currentPlayer);

/** Active boards list or 'all' */
const useActiveBoards = () => useGameStore((s) => s.activeBoards);

/** Game result (null if in progress) */
const useGameResult = () => useGameStore((s) => s.gameResult);

/** Last move made (null if no moves) */
const useLastMove = () => useGameStore((s) => s.lastMove);

/** Cells array for a specific sub-board — returns stable reference if unchanged */
const useBoardState = (boardIndex: BoardIndex) =>
  useGameStore((s) => s.boards[boardIndex]);

/** Status of a specific sub-board */
const useSubBoardStatus = (boardIndex: BoardIndex) =>
  useGameStore((s) => s.subBoardStatus[boardIndex]);

/** Winning line on meta-board (null if no winner) */
const useWinningLine = () => useGameStore((s) => s.winningLine);
```

**Data Flow:**

```
User Click → Cell Component → gameStore.placeMove(board, cell)
  → engine.makeMove(currentState, board, cell)
  → MoveResult { success: true, state: newGameState }
  → Zustand set(newGameState)
  → React re-renders only components whose selectors return different values
```

**Error Handling:**
- Invalid moves (wrong board, filled cell, game over) are silently ignored — `placeMove` calls `makeMove`, and if the result is `{ success: false }`, the store state remains unchanged. No errors are thrown, no toasts are shown.

**Selector Optimization:**
- `useBoardState(i)` selects `state.boards[i]` — Zustand's default `Object.is` equality check works here because the engine creates new sub-board arrays only for the board that changed. Boards that did not change keep the same array reference.
- `useSubBoardStatus(i)` selects a primitive string value — no special equality needed.
- For `useActiveBoards`, consider using `shallow` from `zustand/shallow` if returning an array, since array references change on every state update even if contents are the same.

## Acceptance Criteria

1. **Given** the store in its initial state, **When** `placeMove(0, 0)` is called, **Then** `boards[0][0]` becomes `'X'` and `currentPlayer` becomes `'O'`.
2. **Given** an invalid move (e.g., targeting a non-active board), **When** `placeMove` is called, **Then** the store state does not change (no error thrown).
3. **Given** a game in progress, **When** `newGame()` is called, **Then** the store state resets to the value of `createInitialState()` — all cells null, X to move, all boards active, no result.
4. **Given** `useBoardState(3)` is subscribed, **When** a move is made on board 3, **Then** the selector returns the updated cells array for board 3.
5. **Given** `useBoardState(3)` is subscribed, **When** a move is made on board 5 (not board 3), **Then** the selector does NOT trigger a re-render (same reference returned).
6. **Given** `useGameResult()` is subscribed, **When** a game-winning move is made, **Then** the selector returns the `GameResult` object.

## Test Requirements

- [ ] Integration tests covering store + engine interaction — see S09
- [ ] Selector stability tests (verify unchanged boards return same reference) — see S09

## Implementation Notes

- Install Zustand: `pnpm add zustand`.
- The store flattens `GameState` into the store shape (spread `...createInitialState()`) rather than nesting it under a `gameState` key. This simplifies selectors.
- `placeMove` uses Zustand's `set` with a function updater to access current state. It calls `makeMove` from the engine and conditionally updates.
- For `useActiveBoards`, import `shallow` from `zustand/shallow` and use it as the equality function: `useGameStore((s) => s.activeBoards, shallow)`. This prevents re-renders when the active boards array has the same contents but a new reference.
- Export both the store hook (`useGameStore`) and all individual selectors as named exports.
- The store file imports from `@/game/engine` and `@/game/types` using the path aliases configured in S01.

## Out of Scope

- React components that consume the store
- Move history / undo actions
- Persistence (localStorage, URL state)
- AI opponent logic
