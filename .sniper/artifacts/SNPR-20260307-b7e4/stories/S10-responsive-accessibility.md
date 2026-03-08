# S10: Responsive Layout and Accessibility

## Description
Make the game board responsive for tablet and desktop screens, add keyboard navigation, ARIA labels, and screen reader support to meet WCAG 2.1 AA standards.

## Acceptance Criteria (EARS)
- When the viewport width is 768px or greater, the system shall display the full game board at a comfortable, playable size without horizontal scrolling.
- When the viewport width is between 500px and 767px, the system shall scale the board to fit the available width while maintaining legibility and usable touch target sizes (minimum 44x44 CSS pixels per cell).
- When a player uses keyboard navigation (Tab, Arrow keys), the system shall move focus between cells in a logical order, with the currently focused cell visually indicated.
- When a player presses Enter or Space on a focused cell, the system shall process that cell as a click (make the move if valid).
- The system shall provide ARIA labels on each cell conveying its position (sub-board and cell location), its current value (empty, X, or O), and whether it is a valid move target.
- When the game state changes (turn change, sub-board won, game over), the system shall announce the change to screen readers via an ARIA live region.
- The system shall meet WCAG 2.1 AA color contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text and UI components) for all interactive elements and text.

## Dependencies
- S08: Visual Polish
- S09: Game Controls

## Notes
- Phone-sized screens (<500px) are a stretch goal -- do not block the story on phone optimization
- Keyboard navigation should respect the send rule: only valid sub-boards/cells should be reachable via keyboard when a constraint is active
- Test with at least one screen reader (VoiceOver on macOS) to verify announcements
- Use semantic HTML elements (buttons for cells) rather than divs with click handlers
- Consider a skip-to-board link for keyboard users
