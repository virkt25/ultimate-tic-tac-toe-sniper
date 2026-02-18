# Story S25: Validate WCAG AA compliance

> **Epic:** E08-accessibility
> **Complexity:** S
> **Priority:** P1
> **File Ownership:** tests
> **Dependencies:** S24

## Description

Validate that the Ultimate Tic-Tac-Toe game meets WCAG 2.1 AA compliance criteria. Verify color contrast ratios for all text and UI components, confirm keyboard accessibility works end-to-end, test with a screen reader (VoiceOver on macOS), and add `prefers-reduced-motion` support to disable all CSS transitions and animations for users who have requested reduced motion in their OS settings.

## Embedded Context

### From PRD

- **NFR**: WCAG 2.1 AA compliance required. Specifically:
  - 4.5:1 contrast ratio for normal text against backgrounds.
  - 3:1 contrast ratio for UI component boundaries (borders, focus indicators).
  - 44px minimum tap targets (addressed in S20, verified here).
- **Success Metric**: Full WCAG 2.1 AA compliance across all game components.

### From Architecture

- CSS Modules for styling. All colors are defined as CSS custom properties or direct hex values.
- No animation library is used. Any transitions are pure CSS.
- React 18+ with TypeScript strict mode.

### From UX Spec

**Color contrast requirements:**

| Element | Color | Background | Required Ratio | Standard |
|---|---|---|---|---|
| Player X marks and text | #2563EB (blue) | #FFFFFF (white) | >= 4.5:1 | WCAG AA text |
| Player O marks and text | #DC2626 (red) | #FFFFFF (white) | >= 4.5:1 | WCAG AA text |
| Active board highlight border | Defined active color | Inactive board background | >= 3:1 | WCAG AA UI components |
| Cell text/marks | Mark color | Cell background | >= 4.5:1 | WCAG AA text |
| New Game button text | Button text color | Button background | >= 4.5:1 | WCAG AA text |

**Additional WCAG criteria to validate:**
- Color is not the sole means of conveying information. X and O are distinct shapes, not differentiated by color alone.
- `prefers-reduced-motion: reduce` media query must be respected. When active, all CSS transitions, animations, and motion effects are disabled.
- The game must remain fully functional at 200% browser zoom with no content clipping or overflow.
- No gestures are required for any interaction (all actions are single tap/click or keyboard).

## Acceptance Criteria

1. **Given** Player X's color (#2563EB) displayed on a white (#FFFFFF) background, **When** the contrast ratio is measured, **Then** the ratio is at least 4.5:1.
2. **Given** Player O's color (#DC2626) displayed on a white (#FFFFFF) background, **When** the contrast ratio is measured, **Then** the ratio is at least 4.5:1.
3. **Given** the active board highlight border color on an inactive board background, **When** the contrast ratio is measured, **Then** the ratio is at least 3:1.
4. **Given** the user has `prefers-reduced-motion: reduce` enabled in their OS settings, **When** the game renders and is interacted with, **Then** no CSS transitions or animations occur (all motion is disabled).
5. **Given** 200% browser zoom is applied, **When** the game renders, **Then** it remains fully functional, readable, and no content is clipped or requires horizontal scrolling.
6. **Given** a screen reader (VoiceOver on macOS), **When** the user plays the game using keyboard navigation, **Then** all actions (cell selection, mark placement) and state changes (turn changes, sub-board wins, game over) are announced by the screen reader.

## Test Requirements

- [ ] Unit tests: N/A (this story is manual validation and CSS changes)
- [ ] Integration tests: Manual testing with the following tools and procedures:
  - [ ] **Contrast checking**: Use Chrome DevTools Accessibility panel or WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) to verify all color pairings listed in the acceptance criteria.
  - [ ] **Screen reader testing**: Enable VoiceOver on macOS (Cmd+F5), navigate the game using keyboard only, and verify all ARIA labels are read, turn changes are announced, sub-board wins are announced, and game-over is announced.
  - [ ] **Reduced motion testing**: In macOS System Settings > Accessibility > Display, enable "Reduce motion". Reload the game and verify no transitions or animations play.
  - [ ] **Browser zoom testing**: Set Chrome zoom to 200% (Cmd+Plus), play a full game, and verify the layout adapts without horizontal scrolling or content clipping.
  - [ ] **Color independence**: Verify that X and O are distinguishable by shape alone (not just color) by viewing the game in grayscale mode.

## Implementation Notes

- Add a `prefers-reduced-motion` media query to the global stylesheet or a shared CSS Module:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- Alternatively, apply the reduced-motion override only to specific components that have transitions (more targeted approach).
- Verify contrast ratios mathematically:
  - #2563EB on #FFFFFF: approximately 4.6:1 (passes AA for normal text)
  - #DC2626 on #FFFFFF: approximately 4.6:1 (passes AA for normal text)
  - If any color fails, adjust the shade darker until the ratio meets the threshold.
- For the 200% zoom test, the responsive CSS from S20 should handle this naturally since zoom effectively reduces the viewport width. Verify no fixed-pixel widths break at zoom.
- Document all contrast ratio measurements and screen reader test results as part of the validation record.

## Out of Scope

- Automated accessibility testing tool integration (axe-core, pa11y, Lighthouse CI)
- WCAG AAA compliance (7:1 contrast ratio, enhanced criteria)
- Forced-colors / high-contrast mode media query support
- Testing with screen readers other than VoiceOver (NVDA, JAWS, TalkBack)
