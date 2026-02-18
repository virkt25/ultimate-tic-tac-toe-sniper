# Story S20: Implement responsive grid layout with breakpoints

> **Epic:** E07-responsive-mobile
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S12

## Description

Add CSS media queries for 4 breakpoints to make the Ultimate Tic-Tac-Toe board responsive across all target viewports. Adjust padding, gaps, font sizes, and board max-width so the board fits entirely within the viewport from 320px to 2560px wide. The board must scale proportionally with no horizontal scrolling at any width.

## Embedded Context

### From PRD

- **FR-002**: The game must fit within a single viewport with no scrolling required on devices 320px and wider.
- **FR-003**: The board must scale proportionally to fit the available viewport.
- **NFR**: Minimum viewport width is 320px. The layout must be fluid from 320px to 2560px. No horizontal scroll at any width.
- **US-007**: As a player, I can play comfortably on a tablet or phone so the game is accessible anywhere.

### From Architecture

- CSS Modules are used for component styling.
- Vite handles CSS processing. No CSS-in-JS.
- The board is a CSS Grid layout (3x3 of sub-boards, each a 3x3 grid of cells).

### From UX Spec

Four breakpoints with specific design adjustments:

| Breakpoint | Range | Padding | Gaps | Font | Board Width | Hover |
|---|---|---|---|---|---|---|
| Small Mobile | 320-479px | 8px | 2px sub-board | 14px | Full viewport width | None |
| Mobile | 480-767px | 16px | 4px | 16px | Full viewport width | None |
| Tablet | 768-1023px | - | 6px | 18px | Centered, max ~600px | If pointer device |
| Desktop | 1024px+ | - | 8px | 20px | Centered, max ~560px | Full hover states |

Additional sizing details:
- At 320px viewport, cells will be approximately 33px wide. This is below the ideal 44px tap target, but is an accepted tradeoff for the smallest supported viewport.
- Cells reach the 44px minimum tap target at approximately 400px viewport width and above.
- All cells use `aspect-ratio: 1` to maintain square shape at any size.
- Small Mobile breakpoint: New Game button is full-width.
- Mobile and Small Mobile: No hover states (touch-only interaction).
- Tablet: Hover states enabled only if the device has a pointer input (`@media (hover: hover) and (pointer: fine)`). Card-style overlay for sub-board results.
- Desktop: Full hover states on all interactive cells.

## Acceptance Criteria

1. **Given** a 320px wide viewport, **When** the board renders, **Then** it fills the viewport width with 8px padding on each side and 2px gaps between sub-boards, with no horizontal scrollbar.
2. **Given** a 1024px wide viewport, **When** the board renders, **Then** it is horizontally centered with a max-width of approximately 560px and 8px gaps between sub-boards.
3. **Given** any viewport width between 320px and 2560px, **When** the board renders, **Then** no horizontal scrolling occurs and the board fits entirely within the viewport.
4. **Given** a desktop viewport (1024px+) with a mouse, **When** hovering over an active empty cell, **Then** hover states are visually applied.
5. **Given** a mobile viewport (below 768px), **When** the board renders, **Then** no hover states are applied (touch-only devices).
6. **Given** a viewport 480px or wider, **When** cells render, **Then** each cell is at least 44px in width and height.

## Test Requirements

- [ ] Unit tests: N/A (CSS-only changes, no logic)
- [ ] Integration tests: Manual testing at each breakpoint using Chrome DevTools responsive mode. Verify layout, padding, gaps, font sizes, hover behavior, and absence of horizontal scrollbar at 320px, 480px, 768px, 1024px, and 2560px.

## Implementation Notes

- Use CSS Module media queries in the relevant component `.module.css` files (MetaBoard, SubBoard, Cell, NewGameButton).
- Define breakpoints as:
  - `@media (max-width: 479px)` for Small Mobile
  - `@media (min-width: 480px) and (max-width: 767px)` for Mobile
  - `@media (min-width: 768px) and (max-width: 1023px)` for Tablet
  - `@media (min-width: 1024px)` for Desktop
- Use `@media (hover: hover) and (pointer: fine)` to conditionally enable hover styles.
- Apply `aspect-ratio: 1` to all Cell elements.
- Use `box-sizing: border-box` throughout to ensure padding is included in width calculations.
- Use `vw` units or `calc()` for fluid sizing at small viewports, transitioning to `max-width` constraints at larger sizes.
- Set `overflow-x: hidden` on the body as a safety net, but the layout itself must not overflow.

## Out of Scope

- Touch event handling and mobile-specific interaction optimizations (S21)
- Safari-specific CSS fixes (S22)
