# Story S09: Write store integration tests

> **Epic:** E03-state-management (`docs/epics/E03-state-management.md`)
> **Complexity:** S
> **Priority:** P0
> **File Ownership:** tests
> **Dependencies:** S08

## Description

Write integration tests verifying the Zustand store and game engine work together correctly for full game flows. These tests exercise the store's `placeMove` and `newGame` actions and verify that selectors return correct derived state at each step. Tests operate directly on the store (no React rendering needed).

## Embedded Context

### From Architecture

**Test File Location:** `src/state/__tests__/gameStore.test.ts`

**Testing Stack:** Vitest. Tests interact with the Zustand store directly using `useGameStore.getState()` and `useGameStore.setState()` outside of React components.

**Store API Under Test:**
- `placeMove(board: BoardIndex, cell: CellIndex)` — places a mark, updates state
- `newGame()` — resets to initial state
- Selectors: `useCurrentPlayer()`, `useActiveBoards()`, `useGameResult()`, `useLastMove()`, `useBoardState(i)`, `useSubBoardStatus(i)`, `useWinningLine()`

**Testing Zustand Outside React:**
```typescript
import { useGameStore } from '@/state/gameStore';

// Access state directly
const state = useGameStore.getState();

// Call actions directly
useGameStore.getState().placeMove(0, 0);

// Read updated state
const updated = useGameStore.getState();
expect(updated.boards[0][0]).toBe('X');

// Reset between tests
beforeEach(() => {
  useGameStore.getState().newGame();
});
```

### Test Scenarios

**Scenario 1: Play a complete game to X victory**
Define a sequence of moves where X wins three sub-boards in a row on the meta-board. After each move, verify `currentPlayer` alternates. After the final move, verify `gameResult` is `{ winner: 'X' }` and `winningLine` contains the correct 3 board indices.

**Scenario 2: Play a game to draw**
Define a sequence of moves where all 9 sub-boards become decided (won or drawn) with no player achieving three sub-boards in a row. Verify `gameResult` is `{ draw: true }`.

**Scenario 3: Free move scenario**
Play moves such that a player is sent to a completed sub-board. Verify `activeBoards` becomes `'all'` (or the equivalent expanded list). Then verify that a move on any in-progress board succeeds.

**Scenario 4: Reset game mid-play**
Make several moves, then call `newGame()`. Verify all state properties match `createInitialState()`: all cells null, currentPlayer 'X', activeBoards 'all', gameResult null, lastMove null, winningLine null.

**Scenario 5: Verify selectors return correct derived state**
After each move in a sequence, verify:
- `currentPlayer` matches expected value
- `activeBoards` matches expected boards
- `boards[i]` for the moved-on board contains the new mark
- `subBoardStatus[i]` updates when a sub-board is won or drawn
- `gameResult` transitions from null to a result at game end
- `lastMove` reflects the most recent move

## Acceptance Criteria

1. **Given** a predefined sequence of moves leading to X winning three sub-boards in a row, **When** each `placeMove` is called in order, **Then** after the final move `gameResult` equals `{ winner: 'X' }` and `winningLine` is populated with the correct board indices.
2. **Given** a predefined sequence of moves leading to a full draw, **When** each `placeMove` is called in order, **Then** `gameResult` equals `{ draw: true }`.
3. **Given** a game where a move sends the opponent to a completed board, **When** `placeMove` is called for that move, **Then** `activeBoards` becomes `'all'` and a subsequent move on any open board succeeds.
4. **Given** a game in progress with several moves made, **When** `newGame()` is called, **Then** all state resets: 81 null cells, currentPlayer 'X', activeBoards 'all', gameResult null, lastMove null, winningLine null.
5. **Given** a sequence of moves, **When** inspecting state after each move, **Then** `currentPlayer` alternates, `lastMove` matches the move just made, and `boards[i]` reflects the placed mark.

## Test Requirements

- [ ] Integration tests: `src/state/__tests__/gameStore.test.ts`
- [ ] Test the store directly without React rendering (use `getState()` and action calls)
- [ ] Reset store state in `beforeEach` to ensure test isolation
- [ ] At least 5 test scenarios as described above

## Implementation Notes

- Use `beforeEach(() => useGameStore.getState().newGame())` to reset state between tests, ensuring each test starts from a clean initial state.
- For the "play to X victory" scenario, craft a minimal move sequence. You do not need to play a realistic full game — you can use a sequence where X wins 3 sub-boards quickly (e.g., X wins boards 0, 1, 2 via top row of meta-board). Each sub-board win requires at least 5 moves on that board (3 for winner + 2 for opponent).
- For the draw scenario, consider setting up state programmatically rather than playing through 81 moves. Use `useGameStore.setState(...)` to set up a near-end-game state, then play the final moves through `placeMove`.
- When testing selectors, call them via `useGameStore.getState().propertyName` since we are not in a React context. The selector hooks (`useCurrentPlayer`, etc.) are React hooks and cannot be called outside components, but we can test the underlying state shape.
- Verify immutability: after `placeMove`, the old state reference should not be mutated. Store a reference to `getState()` before the move and verify it is unchanged after.

## Out of Scope

- React component rendering tests
- E2E / browser tests
- Performance or stress tests
- Testing with React Testing Library (no components exist yet)
