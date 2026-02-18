# Story S12: Style game board with CSS Modules and design tokens

> **Epic:** E04-board-rendering
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S10, S11

## Description

Create CSS Module files for Game, MetaBoard, SubBoard, and Cell components. Apply design tokens defined as CSS custom properties in index.css. Style the board with proper gaps, borders, colors, and typography to create a clear visual hierarchy between the meta-grid and sub-grids.

## Embedded Context

### From PRD

- **FR-001:** Render a 3x3 meta-grid where each cell contains a 3x3 sub-grid, totaling 81 playable cells. Visual hierarchy must make the nested structure obvious.
- **FR-002:** Single viewport without scrolling on 320px+ screens.
- **US-001:** Instant load — CSS Modules have zero runtime cost, supporting this goal.

### From Architecture

- **CSS Modules** are used for scoped component styles with zero runtime cost (no CSS-in-JS overhead).
- Files to create:
  - `Game.module.css` — Layout for the root game container (centering, max-width).
  - `MetaBoard.module.css` — 3x3 CSS Grid for sub-boards with gap for visual separation.
  - `SubBoard.module.css` — 3x3 CSS Grid for cells with smaller gap for cell borders.
  - `Cell.module.css` — Cell sizing, mark colors, cursor states, mark scaling.

### From UX Spec

- **Color palette (CSS custom properties defined in index.css):**
  - `--color-player-x: #2563EB` (blue-600) — X marks and X-related accents.
  - `--color-player-o: #DC2626` (red-600) — O marks and O-related accents.
  - `--color-board-bg: #FFFFFF` — Board background color.
  - `--color-cell-border: #D1D5DB` (gray-300) — Thin borders between cells within a sub-board.
  - `--color-sub-board-gap: #9CA3AF` (gray-400) — Thicker visual separator between sub-boards.
  - `--color-text: #111827` (gray-900) — Primary text color.
- **Typography:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`). Cell marks sized to 60-70% of cell area. Sub-board overlay marks sized to 80% of sub-board area.
- **Spacing:** Sub-board gap is 8px on desktop. Cell gap is 1-2px (simulating thin borders).
- **Layout:** Game board dominates viewport (70-80% area). Board is centered horizontally with appropriate whitespace.

## Acceptance Criteria

1. **Given** the game board, **When** rendered, **Then** sub-board gaps (8px, gray-400) are visually distinct from cell borders (1-2px, gray-300).
2. **Given** an X mark in a cell, **When** rendered, **Then** it uses `--color-player-x` (#2563EB blue).
3. **Given** an O mark in a cell, **When** rendered, **Then** it uses `--color-player-o` (#DC2626 red).
4. **Given** cells with marks, **When** rendered, **Then** marks fill approximately 60-70% of the cell area.
5. **Given** the game board, **When** rendered on a desktop viewport, **Then** it is centered horizontally with appropriate whitespace around it.

## Test Requirements

- [ ] Unit tests: Components render with correct CSS Module class names applied.
- [ ] Unit tests: Design token CSS custom properties are defined in index.css.
- [ ] Integration tests: Visual inspection confirms sub-board gaps are distinct from cell borders (manual verification for v1).

## Implementation Notes

- Define all CSS custom properties (design tokens) in `src/index.css` on the `:root` selector.
- MetaBoard grid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background-color: var(--color-sub-board-gap);` — the gap color creates the visual separator between sub-boards.
- SubBoard grid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background-color: var(--color-cell-border);` — the gap color creates thin cell borders.
- Cell: `background-color: var(--color-board-bg);` so cell backgrounds sit on top of the gap color.
- Game container: `max-width` constraint, centered with `margin: 0 auto`, padding for breathing room.
- Mark sizing: Use `font-size` relative to cell size (e.g., `font-size: 2em` or `clamp()`) to achieve the 60-70% fill.
- System font stack applied at the body or `:root` level in index.css.

## Out of Scope

- Responsive breakpoints and mobile sizing (S20)
- Active board highlighting colors and styles (S14)
- Sub-board overlay styling (S15)
- Animation or transitions
