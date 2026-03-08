# S10: Responsive Design and Accessibility

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S10
**Dependencies:** S06, S07, S08

---

## Summary

Ensure the game is fully responsive from 320px to 1440px+ viewports using `clamp()`-based fluid sizing, and meets WCAG AA accessibility standards. This includes keyboard navigation, ARIA labels, screen reader announcements for game state changes, and sufficient color contrast.

## Architecture Reference

- **Plan section 6** — Styling Approach (clamp() sizing, responsive strategy, minimum 28px touch targets)
- **Spec section 2.4** — UX Polish (responsive layout for desktop and mobile)
- **PRD section 4.5** — Accessibility (keyboard nav, ARIA, WCAG AA, 320px-1440px)
- **PRD section 6** — Success Metrics (Lighthouse accessibility >= 90, no layout breakage at 320/768/1440px)

## Acceptance Criteria

1. **Ubiquitous:** The game layout shall render without horizontal scrolling or layout breakage at viewport widths of 320px, 768px, and 1440px.
2. **Ubiquitous:** Cell sizes shall use `clamp()` to scale fluidly between a minimum of 28px and a maximum of 48px.
3. **Event-driven:** When a user navigates with the keyboard (Tab/Shift-Tab), focus shall move through all playable cells in a logical order.
4. **Event-driven:** When a user presses Enter or Space on a focused playable cell, the system shall place a mark in that cell.
5. **Ubiquitous:** Every cell button shall have an ARIA label describing its position and state (e.g., "Board 1 Row 1 Column 2, empty" or "Board 1 Row 1 Column 2, X").
6. **Event-driven:** When the game state changes (turn change, board won, game won, draw), the `GameStatus` component shall announce the change via `aria-live="polite"`.
7. **Ubiquitous:** All text and interactive elements shall meet WCAG AA minimum contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components).
8. **Ubiquitous:** All interactive touch targets shall have a minimum size of 28px in both dimensions.
