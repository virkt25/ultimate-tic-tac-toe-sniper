# Story S22: Cross-browser testing and Safari fixes

> **Epic:** E07-responsive-mobile
> **Complexity:** S
> **Priority:** P0
> **File Ownership:** tests, frontend
> **Dependencies:** S21

## Description

Test the Ultimate Tic-Tac-Toe game on all four target browsers and fix any browser-specific issues discovered during testing. The target browsers are Chrome desktop, Chrome Android, Safari desktop, and Safari iOS. Safari is a known risk area for CSS and touch behavior differences. Apply vendor prefixes or browser-specific CSS fixes as needed.

## Embedded Context

### From PRD

- **NFR**: The game must support Chrome 90+ and Safari 15+ on both desktop and mobile platforms.
- **Success Metric**: 100% feature functionality across all target browsers.
- **Risk**: Safari CSS and touch interaction differences are a known risk that must be validated.

### From Architecture

- Use `autoprefixer` (PostCSS plugin) for automatic CSS vendor prefixing. This is configured in the Vite build pipeline.
- No JavaScript polyfills are needed for the target browser matrix (Chrome 90+ and Safari 15+ support all required APIs: CSS Grid, CSS Modules, `aspect-ratio`, `touch-action`, Zustand/React 18).
- TypeScript strict mode with no browser-specific API usage beyond standard DOM APIs.

### From UX Spec

- The game must render identically (within acceptable tolerances) across all target browsers.
- Touch interactions on mobile browsers must work as specified in S21.
- CSS Grid layout, `aspect-ratio`, CSS custom properties, and CSS Modules must all function correctly.
- Known Safari issues to watch for: `aspect-ratio` support (Safari 15+), `touch-action` behavior, `-webkit-tap-highlight-color`, safe area insets on notched devices, and CSS Grid rendering differences.

## Acceptance Criteria

1. **Given** Chrome desktop (90+), **When** playing a full game from start to game-over, **Then** all features (board rendering, cell interaction, turn indicator, sub-board wins, game-over overlay, new game reset) work correctly.
2. **Given** Chrome Android (90+), **When** playing a full game using touch input, **Then** all features work correctly with touch, no zoom or scroll issues occur, and the layout is responsive.
3. **Given** Safari desktop (15+), **When** playing a full game from start to game-over, **Then** all features work correctly with no visual or functional differences from Chrome.
4. **Given** Safari iOS (15+), **When** playing a full game using touch input, **Then** touch interactions and layout work correctly, with no double-tap zoom, no scroll issues, and correct responsive layout.
5. **Given** any of the four target browsers, **When** inspecting the browser console during a full game, **Then** no JavaScript errors or warnings are logged.

## Test Requirements

- [ ] Unit tests: N/A (this story is manual testing and browser-specific CSS fixes)
- [ ] Integration tests: Manual cross-browser testing using the following checklist for each target browser:
  - [ ] Board renders as a 3x3 grid of sub-boards, each containing a 3x3 grid of cells
  - [ ] Cells are square (aspect-ratio: 1 works)
  - [ ] Active sub-board is visually highlighted
  - [ ] Clicking/tapping an active empty cell places the correct mark (X or O)
  - [ ] Turn indicator updates after each move
  - [ ] Sub-board win is displayed correctly with overlay
  - [ ] Game-over overlay appears with correct result
  - [ ] New Game button resets the entire game
  - [ ] Responsive layout works at 320px, 480px, 768px, 1024px viewports
  - [ ] No console errors during gameplay
  - [ ] (Mobile only) No double-tap zoom, no 300ms delay, no scroll during interaction
  - Document any browser-specific CSS fixes applied with comments explaining the fix and which browser it targets.

## Implementation Notes

- Run `npx autoprefixer` as part of the Vite PostCSS pipeline (should already be configured; verify in `postcss.config.js` or `vite.config.ts`).
- Common Safari-specific fixes to apply if needed:
  - `-webkit-tap-highlight-color: transparent` to remove the default tap highlight on iOS Safari.
  - `env(safe-area-inset-*)` padding for devices with notches (iPhone X+).
  - `-webkit-appearance: none` on buttons if Safari applies default button styling.
- If `aspect-ratio` has issues on Safari 15.0-15.3, use a padding-bottom percentage fallback (`padding-bottom: 100%; height: 0;`).
- Add a comment in the CSS for any browser-specific fix explaining what it fixes and which browser version it targets.
- Verify that `autoprefixer` is in the project's PostCSS config with the correct browserslist target (`Chrome >= 90, Safari >= 15`).

## Out of Scope

- Firefox support
- Edge support
- Samsung Internet support
- Internet Explorer support
