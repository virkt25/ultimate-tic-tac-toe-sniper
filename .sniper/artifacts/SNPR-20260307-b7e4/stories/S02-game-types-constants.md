# S02: Game Types and Constants

## Description
Define the TypeScript types, interfaces, and constants that model the Ultimate Tic-Tac-Toe game state, board structure, players, and moves.

## Acceptance Criteria (EARS)
- The system shall export a `GameState` type that represents the complete state of a game, including all 81 cell values, 9 sub-board statuses, current player, active sub-board constraint, last move, and game outcome.
- The system shall export a `Player` type distinguishing between Player X and Player O.
- The system shall export types for `CellValue` (X, O, or empty), `SubBoardStatus` (active, won-by-X, won-by-O, drawn), and `Move` (identifying sub-board index and cell index).
- The system shall export constants for winning line patterns (the 8 possible three-in-a-row combinations on a 3x3 grid).
- When the types module is imported, the system shall impose compile-time type safety with no `any` types used in the public API.

## Dependencies
- S01: Project Scaffolding

## Notes
- Place types in `src/engine/types.ts` and constants in `src/engine/constants.ts`
- These files contain no runtime logic -- types only (plus constant arrays)
- Sub-boards and cells should be addressable by index (0-8) mapping to row/col positions
- The winning patterns constant is shared between sub-board win detection and meta-board win detection
