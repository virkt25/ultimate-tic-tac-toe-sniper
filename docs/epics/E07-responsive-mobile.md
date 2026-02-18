# Epic E07: Responsive & Mobile

> **Status:** Draft
> **Priority:** P0
> **Estimated Points:** 12
> **Dependencies:** E04-board-rendering

## Scope

### In Scope
- Responsive CSS Grid layout with 4 breakpoints
- Touch event handling (prevent zoom, prevent scroll, eliminate 300ms delay)
- Mobile viewport configuration (meta tags)
- Cross-browser testing fixes (Chrome + Safari, desktop + mobile)
- Board sizing strategy for small screens (320px+)

### Out of Scope
- Desktop-only hover states (handled in E05)
- Keyboard navigation (E08)
- Screen reader support (E08)
- Native app wrapper or PWA features

## Architecture Context

### Responsive Breakpoints (from UX Spec)

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| Small Mobile | 320-479px | Full viewport width, 8px padding, 2px sub-board gaps, 14px font, full-width New Game button |
| Mobile | 480-767px | Full viewport width, 16px padding, 4px gaps, 16px font |
| Tablet | 768-1023px | Centered, max-width ~600px, 6px gaps, 18px font, card-style overlay |
| Desktop | 1024px+ | Centered, max-width ~560px, 8px gaps, 20px font, hover states active |

### Board Sizing at 320px
- Available width: 320px - 16px = 304px
- 9 cells across with gaps ≈ 33px per cell (below 44px minimum)
- Accepted tradeoff per PRD risk assessment
- Only 9 cells active at once, so tap accuracy is manageable

### Touch Handling
- `touch-action: manipulation` on game area to prevent double-tap zoom
- No 300ms click delay (modern browsers handle this with `touch-action`)
- No pinch-zoom on game board
- No accidental scroll when tapping cells

### Non-Functional Targets
- FCP < 1.5s on 4G
- TTI < 2.0s on 4G
- Bundle < 200KB gzipped
- No horizontal scrolling at any viewport width

## Stories

| # | Story | Complexity | Dependencies | Owner |
|---|-------|-----------|-------------|-------|
| S20 | Implement responsive grid layout with breakpoints | M | S12 | frontend |
| S21 | Implement touch handling and mobile optimizations | M | S20 | frontend |
| S22 | Cross-browser testing and Safari fixes | S | S21 | tests |

## Acceptance Criteria

1. Board fills viewport width on mobile (320-767px) with appropriate padding
2. Board is centered with max-width on tablet (768px+) and desktop (1024px+)
3. Sub-board gaps scale per breakpoint (2px → 4px → 6px → 8px)
4. No horizontal scrolling at any viewport width from 320px to 2560px
5. No accidental zoom when double-tapping cells on mobile
6. No accidental scroll when tapping cells on mobile
7. Touch events respond without perceptible delay (< 50ms)
8. Game functions correctly on Chrome desktop, Chrome Android, Safari desktop, Safari iOS
9. Font sizes scale appropriately per breakpoint

## Technical Notes

- Use CSS `@media` queries for breakpoints
- Board container: `width: 100%; max-width: 560px; margin: 0 auto;`
- CSS Grid with `aspect-ratio: 1` on cells to maintain square shape
- `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">` in `index.html`
- Test on real devices or device emulators in Chrome DevTools / Safari Responsive Design Mode
