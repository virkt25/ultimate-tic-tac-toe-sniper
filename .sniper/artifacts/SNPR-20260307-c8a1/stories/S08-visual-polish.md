# S08: Visual Polish

**Protocol ID:** SNPR-20260307-c8a1
**Story ID:** S08
**Dependencies:** S06, S07

---

## Summary

Add CSS animations, color treatments, and hover effects to create a polished, modern game experience. This includes mark placement animations, board-won transitions, active board highlighting transitions, and player-specific color coding. All animations use CSS only (no animation libraries) per ADR in plan section 6.

## Architecture Reference

- **Plan section 6** — Styling Approach (animations: scale, opacity, transitions; color tokens; CSS-only decision)
- **Spec section 2.4** — UX Polish (animations, color-coded players, active board glow)
- **PRD section 4.4** — Visual Polish (smooth animations, modern palette, hover states)

## Acceptance Criteria

1. **Event-driven:** When a mark is placed in a cell, the system shall animate the mark appearing with a scale transition (`scale(0)` to `scale(1)`, ease-out, ~150ms).
2. **Event-driven:** When a sub-board is won, the system shall animate the win overlay appearing with a fade-in transition (`opacity(0)` to `opacity(1)`, ~300ms).
3. **State-driven:** While a sub-board is the active board, the system shall apply a background-color transition (~200ms) to highlight it.
4. **Ubiquitous:** The system shall use distinct, high-contrast colors for Player X and Player O marks (e.g., blue and red as defined in the CSS custom properties).
5. **State-driven:** While cells on inactive/non-playable boards are rendered, the system shall apply a visually muted treatment to reduce visual clutter.
6. **Ubiquitous:** The system shall use a clean, modern aesthetic with the color palette defined in `global.css` custom properties.
