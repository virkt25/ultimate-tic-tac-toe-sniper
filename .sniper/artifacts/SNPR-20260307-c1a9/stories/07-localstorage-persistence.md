---
id: 7
title: localStorage Persistence
status: pending
priority: 3
depends_on: [4]
---

# localStorage Persistence

## Description
Persist game state to `localStorage` so players do not lose their game on page refresh or accidental tab close. Hydrate state from `localStorage` on app mount.

## Acceptance Criteria
- When the game state changes, the system shall serialize and write the full `GameState` to `localStorage` under the key `uttt-game`.
- When the app mounts and a saved game exists in `localStorage`, the system shall hydrate the reducer's initial state from the saved data.
- When the app mounts and no saved game exists, the system shall initialize with `createInitialState()`.
- If the saved data in `localStorage` is corrupt or unparseable, the system shall fall back to `createInitialState()` and not throw an error.
- When "New Game" is triggered, the system shall overwrite the `localStorage` entry with the fresh initial state.

## Technical Context
- **Plan.md references:** Persistence section, Decision #5 (localStorage sync via useEffect)
- **Key files:** `src/hooks/useLocalStorage.ts`, `src/App.tsx`
