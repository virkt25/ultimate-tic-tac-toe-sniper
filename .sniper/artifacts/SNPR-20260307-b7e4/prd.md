# Product Requirements Document: Ultimate Tic-Tac-Toe

**Protocol:** SNPR-20260307-b7e4
**Phase:** Plan
**Date:** 2026-03-07

---

## Product Summary

A client-side web application for two players to play Ultimate Tic-Tac-Toe on the same device. The game features a 3x3 meta-board of 3x3 sub-boards (81 total cells) governed by the "send rule" -- where a player's cell choice determines the opponent's next sub-board. The emphasis is on a polished, accessible user experience with clear visual feedback about game state, legal moves, and board ownership.

## Target Users

Two human players sharing the same browser tab on a desktop or tablet device.

## Scope

### In Scope

- Complete Ultimate Tic-Tac-Toe rules engine (send rule, free move exception, sub-board/meta-board win/draw detection)
- Move validation that rejects all illegal moves
- Visual game state: active board highlighting, turn indicator, last move indicator, sub-board ownership overlays, winning line display
- Game controls: new game/reset, game over display
- Local two-player mode (same device, no network)
- Keyboard navigation and screen reader accessibility (WCAG 2.1 AA)
- Responsive layout for tablet and desktop screens
- Static site deployable to any CDN host

### Out of Scope

- AI opponent, online multiplayer, user accounts, backend/database
- Undo/redo, move history replay, game export
- Game variants, chat, leaderboards, sound effects
- Internationalization, native mobile app
- Phone-sized screen optimization (stretch goal only)
- localStorage persistence (not required; ephemeral state is acceptable)

## Technical Decisions

| Decision | Value |
|----------|-------|
| Language | TypeScript (strict mode) |
| Package Manager | npm |
| Build Tool | Vite |
| Framework | React |
| Test Runner | Vitest |
| State Management | useReducer or Zustand (decided during implementation) |
| Styling | CSS Modules |

### Architectural Constraints

- The game engine must be a pure TypeScript module with zero framework dependencies
- Engine must be built and tested before any UI work
- Feature-based project structure (engine/, components/, styles/)
- Bundle size target: under 200KB gzipped

## Success Criteria

1. Two players can complete a full game of Ultimate Tic-Tac-Toe following all rules correctly
2. The send rule and free move exception work without error in all edge cases
3. The game correctly detects sub-board wins, sub-board draws, meta-board wins, and meta-board draws
4. Active sub-board highlighting clearly indicates where the current player must (or may) play
5. The game is fully playable via keyboard only
6. The application renders at 60fps and loads in under 2 seconds
7. All game engine logic has comprehensive unit test coverage

## Open Decisions

1. **Draw detection nuance:** For initial release, a draw is declared only when all 9 sub-boards are resolved and no player has three-in-a-row on the meta-board. Early draw detection for unwinnable states is deferred.
2. **Animation level:** Moderate -- smooth transitions for state changes but no particle effects or elaborate animations.
3. **Dark mode:** Deferred. Ship with a clean light theme.
4. **Deployment target:** Not yet decided; build produces a generic static site artifact.

## Risk Summary

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Nested board UX confusion | Medium | High | Strong active-board highlighting, hover states showing send destination |
| Mobile responsiveness | High | Medium | Prioritize tablet/desktop; phone is stretch goal |
| Accessibility complexity | Medium | Medium | Plan ARIA structure from the start; semantic HTML |
| Game engine edge cases | Medium | Medium | Comprehensive unit tests covering all rule interactions |
| Scope creep | High | Medium | Strict adherence to Out of Scope list |

## Story Map

| Order | Story | Summary |
|-------|-------|---------|
| 1 | S01 | Project scaffolding (Vite + React + TS + tooling) |
| 2 | S02 | Game types and constants |
| 3 | S03 | Game engine core (moves, send rule, free move) |
| 4 | S04 | Win and draw detection |
| 5 | S05 | Game engine unit tests |
| 6 | S06 | Board rendering (MetaBoard, SubBoard, Cell) |
| 7 | S07 | Game interaction (click handling, turn flow, active highlighting) |
| 8 | S08 | Visual polish (overlays, last move, winning line, hover) |
| 9 | S09 | Game controls (turn indicator, new game, game over) |
| 10 | S10 | Responsive layout and accessibility |
