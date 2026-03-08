# Self-Review: Story 5 - Board Highlighting and Overlays

## Files Changed
- `src/components/Cell.tsx` - Replaced text-based X/O with SVG shape symbols for colorblind accessibility
- `src/components/Cell.module.css` - Added `.symbol` class, updated `.hoverHint` for flex layout, removed font properties
- `src/components/SubBoard.tsx` - Added `isFreeMove` prop, muted state logic, SVG overlays for won boards, improved aria-labels
- `src/components/SubBoard.module.css` - Added `.muted`, `.drawBoard`, `.overlaySymbol` classes; opacity transition; enhanced draw/won styling
- `src/components/MetaBoard.tsx` - Passes `isFreeMove` prop to SubBoard

## Acceptance Criteria Verification

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| Active board has distinct visual highlight when activeBoardIndex is set | Done | `.active` class with indigo ring, background tint, box-shadow |
| All undecided boards highlighted during free move | Done | `isFreeMove` prop; when `activeSubBoard === null` and game in progress, all playing boards get `.active` via `isSubBoardActive()` logic |
| Won boards show large X/O overlay | Done | SVG-based X (crossed lines) and O (circle) overlays replace text |
| Drawn boards appear greyed out with reduced opacity | Done | `.drawBoard` class at 0.5 opacity + `.draw` overlay with grey backdrop |
| X and O distinguishable by shape (not just color) | Done | SVG shapes: X uses two crossed lines, O uses a circle; used in both cells and overlays |

## Non-active muted boards
When `activeBoardIndex` is non-null, non-active undecided boards receive `.muted` (opacity: 0.45), creating clear visual distinction.

## Testing
- All 29 existing tests pass
- TypeScript type-check passes with no errors

## Risks / Notes
- The muted state uses opacity which is a simple but effective approach; an alternative would be desaturation via CSS filter
- SVG symbols inherit `currentColor` from parent, keeping the existing color scheme intact
- Overlay symbols use slightly thinner strokes (12 vs 14) than cell symbols to better fit the larger display area
