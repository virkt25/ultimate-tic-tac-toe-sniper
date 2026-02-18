# Story S21: Implement touch handling and mobile optimizations

> **Epic:** E07-responsive-mobile
> **Complexity:** M
> **Priority:** P0
> **File Ownership:** frontend (src/components/)
> **Dependencies:** S20

## Description

Optimize touch interactions for the Ultimate Tic-Tac-Toe game on mobile devices. Prevent double-tap zoom on the game board, prevent accidental scrolling while interacting with the board, eliminate the 300ms touch delay for immediate response, and configure the viewport meta tag to disable user scaling. All game interactions are single taps; no gestures (swipe, pinch, long-press) are required.

## Embedded Context

### From PRD

- **FR-042**: Double-tap zoom must not occur during gameplay.
- **US-013**: As a mobile player, I should not experience accidental zoom or scroll, and the game should feel native.
- **NFR**: Input response time must be less than 50ms from tap to visual feedback.

### From Architecture

- The `index.html` file must include a viewport meta tag configured as: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`.
- No external touch libraries are used. Native browser APIs and CSS properties handle all touch behavior.
- React 18+ with TypeScript strict mode.

### From UX Spec

- Apply `touch-action: manipulation` on the game area (MetaBoard container). This CSS property disables double-tap-to-zoom and pinch-to-zoom on the element while still allowing single-tap and vertical scroll outside the game area.
- No gestures are required for gameplay. All interactions are single taps on cells.
- No 300ms touch delay. The `touch-action: manipulation` property also eliminates the legacy 300ms delay on most modern browsers.
- The game board should not scroll when the user is interacting with it (tapping cells).

## Acceptance Criteria

1. **Given** a mobile device (iOS Safari or Chrome Android), **When** the user double-taps on a cell or the game board, **Then** no zoom occurs; instead the tap is treated as two normal taps.
2. **Given** a mobile device, **When** the user taps cells in rapid succession during gameplay, **Then** no accidental page scroll or rubber-banding occurs on the game board area.
3. **Given** a touch event on an active empty cell, **When** the user taps the cell, **Then** the mark appears in less than 50ms with no perceptible 300ms delay.
4. **Given** the `index.html` file, **When** the viewport meta tag is inspected, **Then** it includes `maximum-scale=1` and `user-scalable=no`.

## Test Requirements

- [ ] Unit tests: N/A (touch behavior cannot be meaningfully unit-tested)
- [ ] Integration tests: Manual testing on real mobile devices and/or emulators. Test on iOS Safari (iPhone) and Chrome Android. Verify: no double-tap zoom on game board, no scroll during cell tapping, no perceptible tap delay, viewport meta tag renders correctly.

## Implementation Notes

- Add `touch-action: manipulation` to the MetaBoard container element's CSS Module styles. This single property handles both the double-tap zoom prevention and the 300ms delay elimination.
- Update `index.html` to include: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`.
- Consider adding `overscroll-behavior: contain` on the game board container to prevent scroll chaining (where scrolling the board causes the page behind it to scroll).
- Do NOT add `touch-action: none` as this would prevent all default touch behaviors including scrolling outside the game area.
- The `user-scalable=no` in the viewport meta tag is necessary for iOS Safari which does not fully respect `touch-action: manipulation` alone.
- All cell click handlers already use React's `onClick` which works for both mouse and touch. No separate touch event handlers are needed.

## Out of Scope

- Pinch-to-zoom support (explicitly disabled via viewport meta tag)
- Gesture recognition (swipe, long-press, etc.)
- Haptic feedback on touch
