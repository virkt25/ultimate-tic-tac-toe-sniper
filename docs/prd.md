# Product Requirements Document: Ultimate Tic-Tac-Toe Sniper

> **Status:** Draft
> **Author:** Planning Team — Product Manager
> **Date:** 2026-02-17
> **Source:** `docs/brief.md`, `docs/personas.md`, `docs/risks.md`

## 1. Problem Statement

Players seeking quick, strategic two-player games on a shared device face significant friction with existing Ultimate Tic-Tac-Toe implementations. Current solutions require account creation (Bejofo, Board Game Arena), impose ad-heavy monetization (Poki), demand downloads and payment (Steam at $2.99), or focus on AI opponents rather than local play (TEN by Sennep Games). No existing solution optimizes for the specific use case of two players sharing a single screen with zero setup.

This problem affects casual gamers, students, office workers on breaks, families during game nights, and teachers seeking classroom activities — collectively a large segment within the $8.5B browser games market (2024). Evidence from competitor analysis shows every existing option introduces at least one friction point (account, ads, download, or online-only requirement) that blocks the "URL to gameplay in seconds" experience.

Today, users resort to pen-and-paper, ad-riddled web platforms, buggy mobile apps, or simpler games that lack strategic depth.

## 2. Solution Overview

Ultimate Tic-Tac-Toe Sniper is a static, browser-based implementation of Ultimate Tic-Tac-Toe optimized for local two-player hotseat multiplayer. The game runs entirely client-side with no backend, no accounts, no ads, and no downloads. Players navigate to a URL and immediately begin playing. The UI clearly communicates game state — active board, valid moves, turn indicator, and win conditions — so that even first-time players can learn through play. The game is responsive across desktop, tablet, and mobile (320px+), targeting Chrome and Safari.

## 3. User Stories

### P0 — Critical (Must Ship)

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|-------------|-----------|-------------------|
| US-001 | Casual Break-Taker | load the game instantly from a URL with no signup or setup | I can start playing within seconds during a short break | Page loads in under 2 seconds on 4G. No login, account creation, or onboarding gate before gameplay. |
| US-002 | Strategy Enthusiast | place marks on the correct sub-board according to official Ultimate Tic-Tac-Toe rules | the game is strategically valid and bug-free | Clicking a cell in the active sub-board places the current player's mark. Clicking outside the active board does nothing. The next active board is determined by the cell position of the last move. |
| US-003 | Casual Break-Taker | see which sub-board is currently active and which moves are valid | I never feel confused about where I can play | The active sub-board is visually highlighted (distinct background or border). Non-active boards appear normal but do not accept clicks. |
| US-004 | Strategy Enthusiast | have the game correctly detect wins on individual sub-boards and the overall game | I can trust the implementation for serious play | Three-in-a-row on a sub-board marks it as won for that player. Three won sub-boards in a row wins the overall game. Won sub-boards display the winning player's mark prominently. |
| US-005 | Social Player | see whose turn it is at all times | I can hand the device to the right person without confusion | A turn indicator displays "Player X" or "Player O" and updates after every move. The indicator is visible without scrolling on all screen sizes. |
| US-006 | Quick Competitor | start a new game immediately after one ends | I can play rapid rematches without page reloads | A "New Game" button is visible on the game-over screen. Clicking it resets the board to initial state without a full page reload. |
| US-007 | Social Player | play the game on a tablet or phone with usable tap targets | my family can play on whatever device is available | All interactive cells have a minimum tap target of 44x44px. The board scales responsively from 320px to 1920px+ viewports. No horizontal scrolling required. |
| US-008 | Strategy Enthusiast | have tied sub-boards handled correctly | edge cases don't break the game | When all 9 cells of a sub-board are filled with no winner, the sub-board is marked as a draw (neither player claims it). A drawn sub-board cannot be won by either player. |
| US-009 | Casual Break-Taker | be sent to any board when the target sub-board is already won or drawn | gameplay continues fluidly without getting stuck | When a move would send the opponent to a completed sub-board, the opponent may play on any open sub-board. All open sub-boards are highlighted as valid. |

### P1 — Important (Should Ship)

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|-------------|-----------|-------------------|
| US-010 | Social Player | see a clear game-over state with the winner displayed | there's no dispute about who won | On game end, a visible overlay or message displays the winner (X or O). The winning three-in-a-row on the meta-board is visually indicated. |
| US-011 | Quick Competitor | see a visual indication when I win a sub-board | my small victories feel rewarding during play | Winning a sub-board triggers a clear visual change (large X or O fills the sub-board). The transition is immediate, not blocked by long animations. |
| US-012 | Casual Break-Taker | receive clear feedback when I click an invalid cell | I learn the rules through playing rather than reading docs | Clicking an invalid cell produces no state change but the active board highlighting guides the player. No error modals or popups interrupt gameplay. |
| US-013 | Quick Competitor | play the game on mobile without accidental zoom or scroll issues | mobile gameplay feels native and smooth | Viewport is locked to prevent pinch-zoom on the game area. No accidental scroll when tapping cells. Touch events are handled without 300ms delay. |
| US-014 | Social Player | detect when the overall game is a draw | the game ends definitively and doesn't leave players confused | When no player can win the meta-board (all sub-boards are decided with no three-in-a-row possible), the game declares a draw. |

### P2 — Nice to Have (Could Ship)

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|-------------|-----------|-------------------|
| US-020 | Strategy Enthusiast | see which sub-boards each player has won at a glance | I can assess the strategic position quickly | Won sub-boards use distinct colors or marks (e.g., blue for X, red for O) that are visually scannable without examining individual cells. |
| US-021 | Social Player | see the last move that was played | I can follow the game when passing the device | The most recently placed mark is visually distinguished (subtle highlight or indicator). |
| US-022 | Quick Competitor | share the game URL easily | I can challenge friends by sending a link | The URL is short, memorable, and works without query parameters or fragments. Bookmarkable. |

## 4. Functional Requirements

### 4.1 Game Board & Layout

- **FR-001:** Render a 3x3 meta-grid where each cell contains a 3x3 sub-grid, totaling 81 playable cells.
- **FR-002:** Display the board in a single viewport without requiring scrolling on devices 320px+ wide.
- **FR-003:** Scale the board proportionally to the available viewport while maintaining square aspect ratio for cells.

### 4.2 Game Logic & Rules

- **FR-010:** Implement alternating turns starting with Player X.
- **FR-011:** Restrict moves to the active sub-board as determined by the previous move's cell position.
- **FR-012:** When the target sub-board is won or drawn, allow the current player to move on any open sub-board (free move).
- **FR-013:** Detect three-in-a-row wins on individual sub-boards (rows, columns, diagonals).
- **FR-014:** Detect three-in-a-row wins on the meta-board using won sub-boards.
- **FR-015:** Detect draws on individual sub-boards (all cells filled, no winner).
- **FR-016:** Detect overall game draw when no player can achieve three sub-board wins in a row.
- **FR-017:** Prevent moves on won or drawn sub-boards.
- **FR-018:** Prevent moves after the game has ended (win or draw).

### 4.3 Turn Management

- **FR-020:** Display a turn indicator showing the current player (X or O).
- **FR-021:** Update the turn indicator after each valid move.
- **FR-022:** Visually highlight the active sub-board(s) where the current player can move.
- **FR-023:** Non-active sub-boards must not accept click/tap input.

### 4.4 Game State Display

- **FR-030:** Display won sub-boards with a prominent player mark (large X or O) overlaying the sub-grid.
- **FR-031:** Display drawn sub-boards with a distinct visual state (e.g., greyed out).
- **FR-032:** On game end, display the result (Player X wins, Player O wins, or Draw).
- **FR-033:** Provide a "New Game" button that resets all state to initial without page reload.

### 4.5 Interaction & Input

- **FR-040:** Handle both click (mouse) and tap (touch) input on all cells.
- **FR-041:** Ignore clicks/taps on invalid targets (wrong sub-board, won cells, drawn boards).
- **FR-042:** Ensure no double-tap zoom on mobile when tapping cells rapidly.

## 5. Non-Functional Requirements

| Category | Requirement | Target |
|----------|------------|--------|
| Performance | Initial page load (FCP) | < 1.5 seconds on 4G connection |
| Performance | Time to Interactive (TTI) | < 2.0 seconds on 4G connection |
| Performance | Input response latency | < 50ms from tap/click to visual update |
| Performance | JS bundle size | < 200KB gzipped |
| Compatibility | Browser support | Chrome 90+, Safari 15+ (desktop and mobile) |
| Compatibility | Minimum viewport | 320px width (iPhone SE) |
| Responsiveness | Layout adaptation | Fluid layout from 320px to 2560px without horizontal scroll |
| Accessibility | Touch targets | Minimum 44x44px on all interactive elements |
| Accessibility | Color contrast | WCAG 2.1 AA (4.5:1 minimum for text, 3:1 for UI components) |
| Accessibility | Keyboard | Game playable via keyboard navigation (tab + enter) |
| Security | No data collection | Zero cookies, zero analytics, zero tracking |
| Security | No external requests | No third-party scripts, fonts, or resources loaded at runtime |
| Reliability | Client-side only | Game fully functional offline after initial load |
| Maintainability | Test coverage | 100% unit test coverage on game logic (win detection, turn rules, board state) |

## 6. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Time from URL to first move | < 5 seconds | Manual testing across devices (desktop Chrome, mobile Safari, mobile Chrome) |
| Game completion rate | > 80% of started games reach win or draw | Future analytics (if added); for v1, qualitative user testing with 5+ sessions |
| Rule comprehension without docs | New player makes valid moves within 3 turns | Observational user testing with 3+ first-time players |
| Cross-device playability | Game fully functional on 100% of target browsers | Automated and manual testing on Chrome desktop, Chrome Android, Safari desktop, Safari iOS |
| Lighthouse performance score | > 95 | Lighthouse CI in deployment pipeline |
| Zero game-breaking bugs | 0 incorrect win/loss/draw detections in production | Unit tests pass at 100%; edge case test suite covers tied boards, free moves, full-board draws |
| Bundle size | < 200KB gzipped | Build output measurement in CI |

## 7. Scope Boundaries

### In Scope (v1)

- Core Ultimate Tic-Tac-Toe game logic with all standard rules
- Two-player local hotseat multiplayer on a single device
- Turn indicator (Player X / Player O)
- Active board highlighting (visual distinction for valid move targets)
- Win detection for sub-boards and meta-board
- Draw detection for sub-boards and meta-board
- Game-over display with winner announcement
- New Game / restart functionality (no page reload)
- Responsive design for desktop, tablet, and mobile (320px+)
- Static site deployment (no backend, no server)
- Keyboard accessibility for game interaction

### Explicitly Out of Scope

- **Online multiplayer or matchmaking** — No WebSocket, no server, no remote play
- **AI opponents** — No computer players, no difficulty levels
- **User accounts or authentication** — No login, no profiles, no sessions
- **Game history or persistence** — Closing the tab loses the game; no localStorage save
- **Undo/redo** — No move reversal capability
- **Timers or turn time limits** — No clock pressure
- **Themes, skins, or customization** — Single visual design only
- **Sound effects** — Silent gameplay
- **Animations beyond state transitions** — No celebratory animations, particle effects, etc.
- **Social sharing features** — No share buttons, Open Graph tags, or viral mechanics
- **Analytics or tracking** — No data collection of any kind
- **SEO optimization** — No structured data, meta tags, or search optimization
- **Tutorial or rules explanation** — Players learn through play or external resources
- **Leaderboards or competitive features** — No ranking, no scoring across games
- **Spectator mode** — No view-only mode for observers

## 8. Dependencies & Integrations

**External Dependencies: None.**

This project is intentionally dependency-light:

- **Runtime:** React (UI framework), no other runtime dependencies required
- **Build:** TypeScript compiler, bundler (Vite recommended), pnpm package manager
- **Deployment:** Any static site host (Vercel, Netlify, Cloudflare Pages, GitHub Pages)
- **Third-party services:** None. No APIs, no CDN-hosted fonts, no analytics, no error tracking in v1

The game must function with zero network requests after initial page load.

## 9. Constraints

| Type | Constraint | Impact |
|------|-----------|--------|
| Technical | No backend or server-side code | All logic runs client-side; no persistence, no server validation |
| Technical | Static site deployment only | Cannot use SSR, API routes, or server functions |
| Technical | No database | No saved games, no user data, no match history |
| Technical | pnpm as package manager | All dependency commands use pnpm (not npm or yarn) |
| Technical | TypeScript + React stack | All code in TypeScript; UI built with React |
| Platform | Chrome 90+ and Safari 15+ only | No testing or polyfills for Firefox, Edge, or other browsers |
| Platform | Minimum 320px viewport width | Layout must not break on smallest supported phones |
| Design | No accounts or authentication | Cannot gate features behind login; no personalization |
| Design | No persistence across sessions | Game state exists only in memory; refresh = reset |
| Privacy | Zero data collection | No cookies, no localStorage (for tracking), no analytics scripts |

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Players abandon game due to rule confusion (no tutorial, complex rules) | High | High | Active board highlighting, invalid-move feedback via visual cues, clear turn indicator. Validate with user testing. |
| Mobile tap targets too small on 81-cell grid (320px screen) | High | High | Ensure minimum 44x44px tap targets. Consider zooming active sub-board on small screens. Test on real devices (iPhone SE, budget Android). |
| Game logic bugs in edge cases (tied sub-boards, free moves, draw detection) | Medium | High | Write unit tests for all game logic before UI. Test edge cases: tied sub-boards, cascading free moves, full-board draw scenarios. Target 100% logic test coverage. |
| React re-render performance issues with 81 interactive cells on low-end mobile | Low | Medium | Use React.memo for cell components. Minimize state updates. Test on 3-year-old Android devices. Profile with React DevTools. |
| Safari-specific CSS or touch event issues | Medium | Medium | Test on Safari iOS and Safari macOS throughout development. Use autoprefixer. Handle touch events explicitly. |
| Scope creep to online multiplayer or AI before v1 ships | Medium | Medium | Lock scope to this PRD. Maintain a "V2 Features" backlog. Keep game logic module separate from UI for future extensibility. |
