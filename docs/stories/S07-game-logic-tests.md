# Story S07: Comprehensive game logic tests

> **Epic:** E02-game-logic (`docs/epics/E02-game-logic.md`)
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** tests (src/game/__tests__/)
> **Dependencies:** S05, S06

## Description

Write comprehensive unit tests for `src/game/engine.ts` and `src/game/rules.ts`. Target 100% code coverage on both modules. Cover all standard paths and edge cases including: all 8 win patterns for both sub-boards and meta-board, draw detection, free move triggering, cascading free moves, game-ending scenarios, invalid move rejection, and turn alternation.

## Embedded Context

### From PRD

**Non-Functional Requirements:**
- 100% unit test coverage on game logic modules
- **Risk:** Game logic bugs in edge cases around sub-board/meta-board win detection and free move rules

**Success Metric:** 0 incorrect win/loss/draw detections in production.

### From Architecture

**Test File Locations:**
- `src/game/__tests__/engine.test.ts` — tests for all engine functions
- `src/game/__tests__/rules.test.ts` — tests for all rule validation functions

**Testing Stack:** Vitest (with `vitest run` for CI, `vitest` for watch mode).

**Functions Under Test (engine.ts):**
- `createInitialState()` — returns a valid empty game state
- `makeMove(state, board, cell)` — processes a move and returns new state or error
- `checkSubBoardWin(cells)` — detects sub-board winner
- `checkSubBoardDraw(cells)` — detects sub-board draw
- `checkMetaWin(statuses)` — detects meta-board winner and winning line
- `checkMetaDraw(statuses)` — detects meta-board draw

**Functions Under Test (rules.ts):**
- `isValidMove(state, board, cell)` — validates a move against current state
- `getActiveBoards(state)` — returns list of playable board indices
- `getNextActiveBoard(cellIndex, statuses)` — computes next active boards

### Edge Cases to Cover

The following edge cases must each have at least one dedicated test:

1. **Sub-board won by row** — player completes cells [0,1,2], [3,4,5], or [6,7,8]
2. **Sub-board won by column** — player completes cells [0,3,6], [1,4,7], or [2,5,8]
3. **Sub-board won by diagonal** — player completes cells [0,4,8] or [2,4,6]
4. **Sub-board draw** — all 9 cells filled, no three-in-a-row
5. **Free move triggered by sending to a won board** — move on cell N where board N has status `'won-x'` or `'won-o'`
6. **Free move triggered by sending to a drawn board** — move on cell N where board N has status `'draw'`
7. **Meta-board won by row** — player wins sub-boards [0,1,2], [3,4,5], or [6,7,8]
8. **Meta-board won by column** — player wins sub-boards [0,3,6], [1,4,7], or [2,5,8]
9. **Meta-board won by diagonal** — player wins sub-boards [0,4,8] or [2,4,6]
10. **Meta-board draw** — all 9 sub-boards decided, no meta-winner
11. **Move rejected: wrong board** — move targets a board not in `activeBoards`
12. **Move rejected: filled cell** — move targets a cell that already has a mark
13. **Move rejected: game over** — move attempted after `gameResult` is set
14. **First move is free** — initial state has `activeBoards: 'all'`, any board is valid
15. **Turn alternation** — after X moves, it is O's turn, then X again, continuously
16. **winningLine populated** — when meta-board is won, `winningLine` contains the correct 3 board indices

## Acceptance Criteria

1. **Given** `src/game/__tests__/engine.test.ts`, **When** running `pnpm test`, **Then** all engine tests pass.
2. **Given** `src/game/__tests__/rules.test.ts`, **When** running `pnpm test`, **Then** all rules tests pass.
3. **Given** the coverage report from `pnpm test:coverage`, **When** inspecting `src/game/engine.ts`, **Then** line, branch, and function coverage are all 100%.
4. **Given** the coverage report from `pnpm test:coverage`, **When** inspecting `src/game/rules.ts`, **Then** line, branch, and function coverage are all 100%.

## Test Requirements

- [ ] Unit tests: `src/game/__tests__/engine.test.ts` covering all 6 engine functions
- [ ] Unit tests: `src/game/__tests__/rules.test.ts` covering all 3 rules functions
- [ ] All 16 edge cases listed above have dedicated test cases
- [ ] Coverage: 100% lines, branches, functions on both `engine.ts` and `rules.ts`

## Implementation Notes

- Use Vitest `describe`/`it` blocks organized by function name.
- Create helper functions to build test game states (e.g., `createStateWithMove(...)`, `createWonSubBoard(player)`) to reduce boilerplate.
- For meta-board win tests, use helper to set `subBoardStatus` directly rather than playing through 27+ moves.
- For full game flow tests (e.g., "play to X victory"), define a sequence of `[board, cell]` tuples and iterate through them, asserting intermediate and final states.
- Example test structure:
  ```typescript
  describe('checkSubBoardWin', () => {
    it('detects top row win for X', () => {
      const cells = ['X','X','X', null,null,null, null,null,null];
      expect(checkSubBoardWin(cells)).toBe('X');
    });
    // ... all 8 patterns for X, all 8 for O, no-win cases
  });
  ```
- Run coverage with: `pnpm test:coverage -- --reporter=text` to see inline results.

## Out of Scope

- React component tests (future stories)
- Integration tests with Zustand store (S09)
- E2E / browser tests
- Performance benchmarks
