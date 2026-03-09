---
id: S05
title: Engine Unit Tests
status: pending
priority: 5
depends_on: [S03, S04]
---

# S05: Engine Unit Tests

## Description
Write a comprehensive Vitest test suite for the game engine covering all scenarios required by NFR-2.2: valid move placement, invalid move rejection, sub-board win detection, meta-board win detection, draw detection (full and early), free move triggering, and turn alternation.

## Acceptance Criteria (EARS)
- When a developer runs `npm test`, the system shall execute the engine test suite and all tests shall pass.
- The system shall include test cases for each of the following scenarios: valid move placement, invalid move rejection (occupied cell, wrong board, game over), sub-board win detection, meta-board win detection, full draw detection, early draw detection, free move when sent to a decided board, and correct turn alternation after each move.

## Technical Notes
- Reference to architecture: [plan.md](../plan.md) — D2 (Pure Functions for testability), PRD NFR-2.2
- Key files to create: `src/engine/engine.test.ts`
- Depends on S03 and S04 for the complete engine implementation
