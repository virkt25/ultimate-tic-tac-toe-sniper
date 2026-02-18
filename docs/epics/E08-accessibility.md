# Epic E08: Accessibility

> **Status:** Draft
> **Priority:** P1
> **Estimated Points:** 15
> **Dependencies:** E05-game-state-ui

## Scope

### In Scope
- Keyboard navigation (Tab, Arrow keys, Enter/Space, Escape)
- Focus management (auto-focus on active board after move)
- ARIA attributes on all interactive elements
- Screen reader announcements (aria-live regions)
- Color contrast validation (WCAG 2.1 AA)
- Reduced motion support (`prefers-reduced-motion`)
- Error boundary with restart fallback

### Out of Scope
- High contrast mode / forced-colors (nice-to-have, not in v1 stories)
- Skip links (not needed for single-screen app)
- Tutorial or rules explanation

## Architecture Context

### Keyboard Navigation (from UX Spec)
- **Tab order:** TurnIndicator (read-only) → active cells (reading order) → NewGameButton
- **Arrow keys:** Move focus between cells within active sub-board. Wraps within sub-board.
- **Enter / Space:** Places mark on focused cell.
- **Escape:** Dismisses game-over overlay. Focus returns to New Game button.
- **Focus management:** After placing a mark, focus moves to the first empty cell of the newly active sub-board.
- **Focus trap:** In game-over overlay, Tab cycles between result and New Game button.

### ARIA Attributes (from UX Spec)
- MetaBoard: `role="grid"`, `aria-label="Ultimate Tic-Tac-Toe game board"`
- SubBoard: `role="group"`, `aria-label="Sub-board row {r} column {c}, {status}"`, `aria-description` when active
- Cell: `role="button"` (when empty+active), `aria-label="Row {r} column {c}, {empty|X|O}"`, `aria-disabled`, `tabindex`
- TurnIndicator: `aria-live="polite"`
- GameOverOverlay: `role="dialog"`, `aria-modal="true"`, `aria-label="Game over"`

### Screen Reader Announcements
- Turn changes: `aria-live="polite"`
- Sub-board wins: `aria-live="polite"` (e.g., "Player X won sub-board row 1 column 2")
- Game over: `aria-live="assertive"` (e.g., "Game over. Player X wins!")

### Color Contrast Requirements
- Text on background: 4.5:1 minimum
- UI component boundaries: 3:1 minimum
- Player X blue (#2563EB) on white: must meet 4.5:1
- Player O red (#DC2626) on white: must meet 4.5:1
- Active highlight: 3:1 against inactive background
- Do not rely on color alone — X and O distinguished by shape

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S23 | Implement keyboard navigation and focus management | L | S14, S15 | frontend |
| S24 | Add ARIA attributes and screen reader support | M | S23 | frontend |
| S25 | Validate WCAG AA compliance | S | S24 | tests |

## Acceptance Criteria

1. The entire game is playable using only keyboard (no mouse/touch required)
2. Arrow keys navigate between cells within the active sub-board
3. Enter/Space places a mark on the focused cell
4. After placing a mark, focus automatically moves to the first empty cell of the new active sub-board
5. Tab key navigates between major regions (indicator → board → button)
6. Escape dismisses the game-over overlay
7. Screen readers announce turn changes and game outcomes
8. All interactive elements have descriptive aria-labels
9. Color contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 UI)
10. `prefers-reduced-motion` disables any CSS transitions
11. React Error Boundary catches render errors and shows restart fallback

## Technical Notes

- Keyboard navigation: use `onKeyDown` handler on MetaBoard/SubBoard to handle arrow keys
- Focus management: use React refs and `element.focus()` after state updates
- For arrow key navigation within a 3x3 grid: calculate next cell index based on direction, wrap at edges
- Screen reader announcements: use a visually hidden `aria-live` region that updates when significant events occur
- Error boundary: wrap `<Game>` in an ErrorBoundary component that catches and displays a "Something went wrong — click to restart" fallback
