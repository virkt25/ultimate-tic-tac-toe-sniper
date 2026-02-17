# UX Specification: Ultimate Tic-Tac-Toe Sniper

> **Status:** Draft
> **Author:** Planning Team — UX Designer
> **Date:** 2026-02-17
> **Source:** `docs/prd.md`, `docs/personas.md`

## 1. Information Architecture

The application is a single-page game with no navigation. The entire experience lives on one screen with modal overlays for game-over state.

```
Root (/)
├── Game Screen (default and only view)
│   ├── Header
│   │   └── Turn Indicator
│   ├── Game Board (meta-grid)
│   │   ├── Sub-Board [0,0] through [2,2] (9 sub-boards)
│   │   │   └── Cell [0,0] through [2,2] (9 cells per sub-board)
│   ├── Game Status Bar
│   │   └── New Game Button (visible after game ends)
│   └── Game Over Overlay (conditional)
│       ├── Result Message
│       └── New Game Button
```

### Navigation Structure
- **None.** This is a single-screen application. There are no routes, pages, or navigation elements.
- The URL is the entry point. Visiting it loads the game in its initial state (empty board, Player X's turn).
- Browser back/forward buttons have no effect on game state.

### Content Hierarchy (by visual weight)
1. **Game Board** — dominates the viewport (70-80% of screen area)
2. **Turn Indicator** — always visible above the board
3. **Active Board Highlighting** — draws the eye to where the current player can move
4. **Game Over Overlay** — takes focus when the game ends
5. **New Game Button** — secondary action, visible only when relevant

---

## 2. Screen Inventory

| Screen | Purpose | User Stories | Key Components |
|--------|---------|-------------|----------------|
| Game Screen (initial) | Default state. Empty 9x9 board, Player X to move, all boards active (first move is free). | US-001, US-002, US-003, US-005, US-007 | TurnIndicator, MetaBoard (9 SubBoards, 81 Cells) |
| Game Screen (mid-game) | Active gameplay. Some cells filled, one sub-board highlighted as active, some sub-boards may be won/drawn. | US-002, US-003, US-004, US-005, US-008, US-009, US-011, US-012, US-021 | TurnIndicator, MetaBoard with mixed states, ActiveBoardHighlight |
| Game Screen (free move) | Special state where target sub-board is completed. All open sub-boards highlighted. | US-009, US-003 | TurnIndicator, MetaBoard with multiple active highlights |
| Game Screen (game over) | Game has ended (win or draw). Overlay shows result. Board remains visible underneath. | US-006, US-010, US-014 | GameOverOverlay (result + NewGameButton), MetaBoard (frozen), winning line indicator |

---

## 3. User Flows

### 3.1 Core Gameplay Flow

```
Step 1: User opens URL in browser
  → Page loads game in initial state (< 2s on 4G)
  → Board is empty, all 9 sub-boards highlighted as active (first move is free)
  → Turn indicator shows "Player X"

Step 2: Player X taps/clicks a cell in any sub-board
  → Cell fills with X mark
  → Turn indicator switches to "Player O"
  → The sub-board corresponding to the clicked cell's position becomes the active board
  → Active board is highlighted, all others are de-emphasized
  → IF the target sub-board is won or drawn:
      → All open sub-boards become active (free move state)
      → All open sub-boards are highlighted

Step 3: Player O taps/clicks a cell in the active sub-board
  → Same logic as Step 2 but with O mark
  → Turn alternates back to X

Step 4: Repeat Steps 2-3 until a sub-board is won
  → WHEN three-in-a-row on a sub-board:
      → Sub-board displays large X or O overlay
      → Sub-board is no longer playable
      → Game continues

Step 5: Repeat until meta-board win or draw
  → WHEN three won sub-boards in a row (same player):
      → Go to Game Over (Win) — Step 6
  → WHEN all sub-boards decided and no three-in-a-row possible:
      → Go to Game Over (Draw) — Step 7

Step 6: Game Over (Win)
  → Game board freezes (no more moves accepted)
  → Winning line on meta-board is visually indicated
  → Overlay appears: "{Player X/O} Wins!"
  → "New Game" button is prominent
  → Go to Step 8

Step 7: Game Over (Draw)
  → Game board freezes
  → Overlay appears: "Draw!"
  → "New Game" button is prominent
  → Go to Step 8

Step 8: User clicks "New Game"
  → Board resets to initial state (no page reload)
  → Return to Step 1 (without page load delay)
```

### 3.2 Invalid Move Attempt

```
Step 1: Player taps/clicks a cell outside the active sub-board
  → Nothing happens (no state change)
  → Active board highlighting remains, guiding the player to valid targets
  → No error modal, no toast, no popup

Step 2: Player taps/clicks a cell in a won or drawn sub-board
  → Nothing happens (no state change)
  → Active board highlighting remains visible

Step 3: Player taps/clicks an already-filled cell
  → Nothing happens (no state change)
```

### 3.3 First-Time Player Learning Flow

```
Step 1: New player arrives, sees 9x9 grid
  → All sub-boards highlighted (free move)
  → Turn indicator shows "Player X"
  → Player may feel overwhelmed but has clear visual cue: highlighted boards = valid targets

Step 2: Player taps any cell — it works (first move is always free)
  → Immediate positive feedback: mark appears, turn switches
  → One sub-board is now highlighted as active
  → Player infers: "I can only play in the highlighted area"

Step 3: Player (now O) taps in the highlighted sub-board — success
  → Pattern reinforced: highlighted = where to play

Step 4: Player taps outside highlighted board (mistake)
  → Nothing happens. Highlighting persists as a guide.
  → Player self-corrects by tapping inside highlighted board

Step 5: After several turns, a sub-board is won
  → Large X/O overlay on sub-board confirms the small win
  → Player understands sub-board winning

Step 6: Eventually, a move targets a completed sub-board
  → Multiple sub-boards light up (free move)
  → Player learns the "send anywhere" rule through experience
```

---

## 4. Component Hierarchy

### 4.1 App (Root)

The top-level component that holds all game state and renders the game screen.

```
App
├── TurnIndicator
├── MetaBoard
│   └── SubBoard (x9)
│       ├── SubBoardOverlay (shown when won or drawn)
│       └── Cell (x9 per sub-board)
├── GameStatusBar
│   └── NewGameButton
└── GameOverOverlay (conditional)
    ├── ResultMessage
    └── NewGameButton
```

### 4.2 TurnIndicator

Displays whose turn it is. Always visible, always above the board.

- **States:**
  - `playerX` — Shows "Player X" with X's color styling
  - `playerO` — Shows "Player O" with O's color styling
  - `gameOver` — Shows the result text (e.g., "X Wins!" or "Draw")
- **Props/Variants:**
  - `currentPlayer: 'X' | 'O'`
  - `gameState: 'playing' | 'wonX' | 'wonO' | 'draw'`
- **Accessibility:**
  - `aria-live="polite"` so screen readers announce turn changes
  - Text content is the accessible label (no icon-only state)

### 4.3 MetaBoard

The 3x3 grid of sub-boards. This is the primary game surface.

- **States:**
  - `initial` — All sub-boards active (first move), no marks
  - `playing` — Mixed sub-board states, one or more active
  - `freeMove` — Multiple sub-boards active (target was completed)
  - `gameOver` — Frozen, no interaction, winning line highlighted
- **Props/Variants:**
  - `boards: SubBoardState[3][3]`
  - `activeBoards: [row, col][]`
  - `gameState: 'playing' | 'wonX' | 'wonO' | 'draw'`
  - `winningLine?: [row, col][]` (meta-board winning three)
- **Accessibility:**
  - `role="grid"` with `aria-label="Ultimate Tic-Tac-Toe game board"`
  - Each sub-board is a `role="group"` with positional label

### 4.4 SubBoard

A single 3x3 grid within the meta-board.

- **States:**
  - `active` — Highlighted border/background, accepts input. This is the sub-board where the current player must move.
  - `inactive` — Normal appearance, does not accept input. Cursor shows default (not pointer).
  - `wonX` — Shows large X overlay, distinct color (blue). Not playable.
  - `wonO` — Shows large O overlay, distinct color (red). Not playable.
  - `drawn` — Greyed out, striped or muted pattern. Not playable.
- **Props/Variants:**
  - `cells: CellState[3][3]`
  - `status: 'active' | 'inactive' | 'wonX' | 'wonO' | 'drawn'`
  - `position: [row, col]` (position in meta-board)
  - `onCellClick: (row, col) => void`
- **Accessibility:**
  - `role="group"` with `aria-label="Sub-board row {r} column {c}, {status}"`
  - When active: `aria-description="Your turn — select a cell in this board"`

### 4.5 Cell

A single playable cell within a sub-board.

- **States:**
  - `empty` — No mark, clickable if parent sub-board is active. Shows pointer cursor on hover (desktop).
  - `hover` — (Desktop only) Subtle background tint when cursor hovers over an empty cell in an active board. Previews what mark will be placed.
  - `filledX` — Shows X mark in X's color. Not clickable.
  - `filledO` — Shows O mark in O's color. Not clickable.
  - `lastMove` — Same as filledX/filledO but with a subtle indicator (dot or ring) marking it as the most recent move (US-021).
  - `disabled` — Cell is empty but parent sub-board is inactive. No hover effect, no pointer cursor.
- **Props/Variants:**
  - `value: 'X' | 'O' | null`
  - `isActive: boolean` (can be clicked)
  - `isLastMove: boolean`
  - `onClick: () => void`
- **Accessibility:**
  - `role="button"` when empty and active
  - `aria-label="Row {r} column {c}, {empty|X|O}"`
  - `aria-disabled="true"` when not active or filled
  - `tabindex="0"` when active and empty, `tabindex="-1"` otherwise

### 4.6 SubBoardOverlay

Visual overlay shown on won or drawn sub-boards.

- **States:**
  - `wonX` — Large X symbol, X's color, semi-transparent background
  - `wonO` — Large O symbol, O's color, semi-transparent background
  - `drawn` — Muted/grey background with subtle pattern (no symbol)
- **Props/Variants:**
  - `result: 'X' | 'O' | 'draw'`
- **Accessibility:**
  - `aria-hidden="true"` (the sub-board's own aria-label conveys the state)

### 4.7 GameOverOverlay

Modal-style overlay shown when the game ends.

- **States:**
  - `winX` — "Player X Wins!" message, X's color accent
  - `winO` — "Player O Wins!" message, O's color accent
  - `draw` — "It's a Draw!" message, neutral color
- **Props/Variants:**
  - `result: 'X' | 'O' | 'draw'`
  - `onNewGame: () => void`
- **Accessibility:**
  - `role="dialog"` with `aria-modal="true"`
  - `aria-label="Game over"`
  - Focus is trapped within the overlay when visible
  - Auto-focus on the "New Game" button
  - `Escape` key dismisses the overlay (game board remains frozen)

### 4.8 NewGameButton

Resets the entire game state to initial.

- **States:**
  - `default` — Standard button appearance
  - `hover` — Slightly elevated or color-shifted (desktop)
  - `active` — Pressed state
  - `focus` — Visible focus ring for keyboard users
- **Props/Variants:**
  - `onClick: () => void`
- **Accessibility:**
  - Standard `<button>` element with text "New Game"
  - Visible focus indicator (2px+ outline, not just color change)

---

## 5. Interaction Patterns

### Loading States

- **Initial page load:** The game renders immediately as a static React app. There is no loading spinner. If React hydration takes time, the board structure is visible via SSR or static HTML shell. Target: First Contentful Paint < 1.5s on 4G.
- **No other loading states exist.** All game logic is synchronous and client-side. There are no API calls, no data fetching, no async operations during gameplay.

### Empty States

- **Initial board:** All 81 cells are empty. This is the natural "empty state" and it is the gameplay starting point. No placeholder text or illustrations needed.
- **No other empty states.** The game has no lists, no search results, no content feeds.

### Error States

- **No error states in the traditional sense.** The game has no network calls, no forms, no data submission. The only "error" is an invalid move attempt, which is handled silently (see Flow 3.2).
- **JavaScript failure:** If JS fails to load, the page shows nothing interactive. This is acceptable for v1 — a static `<noscript>` tag could display "This game requires JavaScript."

### Transitions

- **Cell fill:** Instant. Mark appears immediately on click/tap (< 50ms). No animation.
- **Turn switch:** Turn indicator text and color update immediately after a valid move.
- **Active board change:** The highlight moves to the new active sub-board immediately. Previous highlight is removed in the same render cycle.
- **Sub-board win:** The overlay (large X or O) appears immediately when three-in-a-row is detected. No fade-in or animation. The sub-board cells remain visible underneath at reduced opacity.
- **Game over overlay:** Appears immediately on game end. A subtle fade-in (150ms opacity transition) is acceptable but not required. The board underneath is still visible but dimmed.
- **New game reset:** Board clears instantly. No animation.

### Confirmation Dialogs

- **None.** "New Game" resets without confirmation. The game is fast and low-stakes; adding a "Are you sure?" dialog would slow down the Quick Competitor persona (US-006). If a game is mid-play, clicking "New Game" still resets immediately.

---

## 6. Responsive Strategy

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| Small Mobile | 320px - 479px | Board fills full viewport width with 8px padding. Turn indicator is compact (single line above board). Cells are at minimum 44x44px tap targets. Game over overlay fills viewport. "New Game" button below the board. Font sizes: 14px base. |
| Mobile | 480px - 767px | Board fills viewport width with 16px padding. Slightly larger cells. Turn indicator has more breathing room. Same layout structure as small mobile. |
| Tablet | 768px - 1023px | Board is centered with max-width of ~600px. More whitespace around the board. Turn indicator can be larger text. Game over overlay is centered card (not full-screen). |
| Desktop | 1024px+ | Board is centered with max-width of ~560px. Generous whitespace. Hover states are active on cells. Turn indicator is prominent. Game over overlay is a centered card with backdrop. |

### Board Sizing Strategy

The board must display 81 cells in a 9x9 arrangement (structured as 3x3 of 3x3). On the smallest viewport (320px):

- Available width: 320px - 16px padding = 304px
- 9 cells across + 2 sub-board gaps (4px each) + cell gaps = cells at ~30px
- 30px is below the 44x44 minimum tap target

**Resolution:** On viewports under 480px, the board expands to fill available width and relies on the 44px minimum target size. At 320px, 9 columns at 33px each = 297px (fits with padding). The visual gap between sub-boards is reduced to 2px. Inner cell gaps are 1px. This yields approximately 33x33px cells, which is below 44px.

**Mitigation for small screens:** Accept that at 320px, cells will be ~33px. This is a known constraint of fitting 81 cells on a tiny screen. The PRD risk section acknowledges this (Risk: "Mobile tap targets too small on 81-cell grid"). For v1, we accept this tradeoff. Cells in the active sub-board will have the full interaction area — since only 9 cells are active at once, users can tap with reasonable accuracy. On viewports 400px+, cells reach 44px.

### What Changes Per Breakpoint

- **320-479px:** No hover states (touch only). Sub-board gaps are 2px. Turn indicator is 14px font. "New Game" button is full-width below the board.
- **480-767px:** No hover states. Sub-board gaps are 4px. Turn indicator is 16px font. "New Game" is full-width.
- **768-1023px:** Hover states active if device has pointer. Sub-board gaps are 6px. Turn indicator is 18px. Board has max-width constraint. "New Game" is inline width.
- **1024px+:** Full hover states. Sub-board gaps are 8px. Turn indicator is 20px. Board centered in viewport. Generous whitespace.

---

## 7. Accessibility Requirements

### WCAG Level: AA (WCAG 2.1)

### Keyboard Navigation

- **Tab order:** TurnIndicator (read-only) → active cells in reading order (left-to-right, top-to-bottom within active sub-board) → NewGameButton (when visible)
- **Arrow keys:** Within the active sub-board, arrow keys move focus between cells (up/down/left/right). Focus wraps within the sub-board.
- **Enter / Space:** Places a mark on the focused cell (equivalent to click/tap).
- **Escape:** Dismisses the game-over overlay (board remains frozen). Focus returns to the "New Game" button in the status bar.
- **Tab within game-over overlay:** Focus cycles between the result message and the "New Game" button (focus trap).
- **Focus management:** After placing a mark, focus moves to the first empty cell of the newly active sub-board. This enables continuous keyboard play without re-tabbing.
- **Skip links:** Not needed (single-screen app with no navigation).

### Screen Reader Support

- Turn changes announced via `aria-live="polite"` region
- Sub-board wins announced via `aria-live="polite"` (e.g., "Player X won sub-board row 1 column 2")
- Game over announced via `aria-live="assertive"` (e.g., "Game over. Player X wins!")
- Each cell has a descriptive `aria-label` (e.g., "Sub-board 1-2, row 1 column 3, empty")
- Active sub-board state conveyed through `aria-description` on the sub-board group
- Board state is navigable — screen reader users can browse all cells to understand the full board

### Color Contrast

- **Text on background:** Minimum 4.5:1 contrast ratio (WCAG AA for normal text)
- **UI components:** Minimum 3:1 contrast ratio for interactive element boundaries
- **Player X color (blue):** Must meet 4.5:1 against white/light background
- **Player O color (red):** Must meet 4.5:1 against white/light background
- **Active board highlight:** Must meet 3:1 against inactive board background
- **Do not rely on color alone:** X and O are distinguished by shape (letter), not just color. Active boards use both color and border/shadow changes. Won sub-boards show the letter symbol, not just a color fill.

### Additional Accessibility

- **Reduced motion:** Respect `prefers-reduced-motion` media query. If any transitions are added (e.g., game-over fade), disable them when reduced motion is preferred.
- **Text scaling:** UI must remain functional at 200% browser zoom. Board scales down proportionally; text remains readable.
- **Touch accessibility:** No gestures required (no swipe, no pinch, no long-press). All interactions are single taps.
- **High contrast mode:** The game should remain playable in Windows High Contrast Mode and forced-colors environments. Ensure borders and marks are visible.

---

## 8. Visual Design Tokens

These are design guidelines, not a full design system. Implementation should use Tailwind CSS utility classes.

### Color Palette

| Token | Usage | Value (suggested) |
|-------|-------|-------------------|
| `--color-player-x` | X marks, X turn indicator, X win overlays | Blue (#2563EB / Tailwind blue-600) |
| `--color-player-o` | O marks, O turn indicator, O win overlays | Red (#DC2626 / Tailwind red-600) |
| `--color-board-bg` | Board background | White (#FFFFFF) |
| `--color-cell-border` | Cell grid lines | Light gray (#D1D5DB / Tailwind gray-300) |
| `--color-sub-board-gap` | Gap between sub-boards | Medium gray (#9CA3AF / Tailwind gray-400) |
| `--color-active-highlight` | Active sub-board background | Light blue (#DBEAFE / Tailwind blue-100) |
| `--color-active-border` | Active sub-board border | Blue (#3B82F6 / Tailwind blue-500) |
| `--color-drawn-bg` | Drawn sub-board background | Light gray (#F3F4F6 / Tailwind gray-100) |
| `--color-hover` | Cell hover state (desktop) | Very light gray (#F9FAFB / Tailwind gray-50) |
| `--color-last-move` | Last move indicator | Yellow/amber accent (#F59E0B / Tailwind amber-500) |
| `--color-text` | Primary text | Dark gray (#111827 / Tailwind gray-900) |
| `--color-overlay-bg` | Game over overlay backdrop | Black at 50% opacity (rgba(0,0,0,0.5)) |

### Typography

- **Font family:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`). No custom fonts loaded (per NFR: no external requests).
- **Turn indicator:** 18-20px, font-weight 600 (semibold)
- **Game over result:** 24-32px, font-weight 700 (bold)
- **Cell marks (X/O):** Sized relative to cell dimensions. The mark should fill roughly 60-70% of the cell area.
- **Sub-board overlay marks:** Sized to fill the sub-board area (roughly 80% of sub-board dimensions).

### Spacing

- **Page padding:** 8px (mobile) / 16px (tablet+)
- **Sub-board gap:** 2-8px (scales with breakpoint, see Section 6)
- **Cell gap:** 1-2px (thin grid lines)
- **Turn indicator to board:** 12-16px
- **Board to status bar:** 12-16px

---

## 9. ASCII Wireframes

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                    Player X's Turn                        │
│                                                          │
│         ┌─────────┬─────────┬─────────┐                  │
│         │ · · · │ · · · │ · · · │                  │
│         │ · · · │ · · · │ · · · │                  │
│         │ · · · │ · · · │ · · · │                  │
│         ├─────────┼─────────┼─────────┤                  │
│         │ · · · │ · · · │ · · · │                  │
│         │ · · · │ · · · │ · · · │                  │
│         │ · · · │ · · · │ · · · │                  │
│         ├─────────┼─────────┼─────────┤                  │
│         │ · · · │ · · · │ · · · │                  │
│         │ · · · │ · · · │ · · · │                  │
│         │ · · · │ · · · │ · · · │                  │
│         └─────────┴─────────┴─────────┘                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mid-Game State (sub-board [0,1] is active, [1,1] is won by X)

```
                    Player O's Turn

         ┌─────────╔═════════╗─────────┐
         │ X · O   ║ · · ·   ║ · · ·   │
         │ · · ·   ║ · O ·   ║ X · ·   │
         │ · O ·   ║ · · ·   ║ · · ·   │
         ├─────────╚═════════╝─────────┤
         │ · · ·   │ XXXXX   │ · · ·   │
         │ · · ·   │ XXXXX   │ · · ·   │
         │ · · ·   │ XXXXX   │ · · ·   │
         ├─────────┼─────────┼─────────┤
         │ · · ·   │ · · ·   │ · · ·   │
         │ · · ·   │ · · ·   │ · · ·   │
         │ · · ·   │ · · ·   │ · · ·   │
         └─────────┴─────────┴─────────┘

  ═══ = Active sub-board (highlighted border + background)
  XXXXX = Won sub-board (large X overlay, blue tint)
```

### Game Over Overlay

```
         ┌─────────────────────────────┐
         │                             │
   ┌─────┤  (board visible, dimmed)    ├─────┐
   │     │                             │     │
   │     └─────────────────────────────┘     │
   │                                         │
   │    ┌───────────────────────────┐        │
   │    │                           │        │
   │    │      Player X Wins!       │        │
   │    │                           │        │
   │    │      [ New Game ]         │        │
   │    │                           │        │
   │    └───────────────────────────┘        │
   │          (overlay card)                 │
   └─────────────────────────────────────────┘
             (backdrop: 50% black)
```

### Mobile Layout (320px)

```
┌──────────────────┐
│  Player X's Turn │
│                  │
│ ┌────┬────┬────┐ │
│ │·· ·│·· ·│·· ·│ │
│ │·· ·│·· ·│·· ·│ │
│ │·· ·│·· ·│·· ·│ │
│ ├────┼────┼────┤ │
│ │·· ·│·· ·│·· ·│ │
│ │·· ·│·· ·│·· ·│ │
│ │·· ·│·· ·│·· ·│ │
│ ├────┼────┼────┤ │
│ │·· ·│·· ·│·· ·│ │
│ │·· ·│·· ·│·· ·│ │
│ │·· ·│·· ·│·· ·│ │
│ └────┴────┴────┘ │
│                  │
│   [ New Game ]   │
│                  │
└──────────────────┘
```
