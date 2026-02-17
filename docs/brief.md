# Project Brief: Ultimate Tic-Tac-Toe Sniper

> **Status:** Draft
> **Author:** Discovery Team — Analyst
> **Date:** 2026-02-17

## Executive Summary
Ultimate Tic-Tac-Toe Sniper is a browser-based implementation of Ultimate Tic-Tac-Toe designed for local multiplayer on a single device. This project targets the growing browser games market ($9.07B projected by 2030, 3.1% CAGR) by offering zero-friction access to a strategic board game without requiring downloads, accounts, or online connectivity.

## Problem Statement
Players seeking quick, strategic two-player games face friction when using existing Ultimate Tic-Tac-Toe implementations. Current solutions either require account creation, impose monetization barriers (ads/subscriptions), or lack clean local multiplayer experiences. The problem affects casual gamers, students, and anyone seeking a no-commitment strategic game during breaks or social settings. Today, users must choose between ad-heavy free platforms like Poki, online-only implementations requiring accounts (Bejofo, Board Game Arena), or downloaded applications (Steam).

## Market Landscape

### Direct Competitors
| Competitor | Key Features | Pricing | Market Position | Weaknesses |
|-----------|-------------|---------|-----------------|------------|
| [Bejofo Ultimate Tic-Tac-Toe](https://bejofo.com/ttt) | Online multiplayer, account system, multi-language support | Free with potential freemium model | Established online platform | Requires account creation, unclear local multiplayer support |
| [Poki Ultimate Tic-Tac-Toe](https://poki.com/en/g/ultimate-tic-tac-toe) | Browser-based, part of gaming platform | Free (ad-supported) | Large casual gaming platform | Heavy ads, embedded in platform ecosystem |
| [Board Game Arena](https://en.boardgamearena.com/gamepanel?game=ultimatetictactoe) | Turn-based/real-time modes, global player base | Free with premium tiers | Comprehensive board game platform | Requires account, online-only, platform overhead |
| [TEN by Sennep Games](https://ten.sennepgames.com/) | AI opponent (6 moves ahead), PWA support, solo/multiplayer | Free | Modern implementation with AI focus | Focus on AI competition rather than local play |
| [Ultimate TicTacToe on Steam](https://store.steampowered.com/app/360870/Ultimate_TicTacToe/) | Desktop application, online multiplayer | $2.99 | Premium desktop game | Requires download and purchase, not browser-based |

### Indirect Competitors / Alternatives
Users currently solve the need for quick strategic games through:
- Physical pen-and-paper Ultimate Tic-Tac-Toe during face-to-face interactions
- Classic Tic-Tac-Toe (simpler but less strategic depth)
- Other browser-based strategy games on platforms like [Tabletopia](https://tabletopia.com/) (2,500+ board games) or [itch.io](https://itch.io/games/html5/tag-board-game) HTML5 collections
- General casual puzzle games that lack multiplayer or strategic depth
- Downloading mobile apps for local multiplayer board games

## Target Market
- **Primary segment:** Casual gamers aged 15-35 seeking zero-friction strategic entertainment in social settings (friends sharing a device, students in classrooms, coworkers on breaks). Secondary segment includes teachers using games for logic education.
- **Market size:** Browser games market stands at $8.5B (2024) growing to $15.9B by 2033 (7.5% CAGR). Casual gaming specifically reaches $25B by 2027. The subset of strategy board game enthusiasts represents a niche but engaged segment.
- **Growth trends:** Browser games are experiencing a renaissance in 2026 driven by HTML5 capabilities, no-download convenience, mobile compatibility, and cross-platform play. Zero-friction access ("no installation, no account, no payment") is a key trend driving adoption.

## Unique Value Proposition
Ultimate Tic-Tac-Toe Sniper differentiates through radical simplicity: zero barriers to play. Unlike competitors requiring accounts (Bejofo, Board Game Arena), downloads (Steam), or tolerating ads (Poki), this implementation offers instant local multiplayer with no friction. The focus on same-device play without persistence requirements creates a clean, distraction-free experience optimized for the specific use case of two players sharing a screen — a niche underserved by online-first competitors. This is the fastest path from URL to gameplay for local Ultimate Tic-Tac-Toe.

## Key Assumptions
1. Users value frictionless access over feature richness — the hypothesis is that eliminating accounts/ads/downloads outweighs missing online multiplayer or AI opponents for the local play use case.
2. TypeScript/React stack (no backend) is sufficient for stateless local gameplay — confirmed: no persistence needed, closing tab loses game.
3. There is sufficient demand for local-only multiplayer to justify building a standalone implementation rather than directing users to existing platforms with local modes.
4. SEO and organic discovery can drive traffic without marketing spend — assumes "ultimate tic tac toe" and related keywords have searchable volume.

## Technical Constraints
- **No database requirement:** All game state must be client-side, limiting features like match history, leaderboards, or saved games.
- **Browser compatibility:** Must support Chrome and Safari (desktop + mobile) with HTML5 and JavaScript enabled. Target devices include desktops, tablets, and mobile phones (320px+ minimum).
- **Stateless architecture:** No backend. Game logic runs entirely client-side in React. Deployed as a static site.
- **No authentication system:** Design explicitly excludes user accounts, sessions, or identity management.
- **Responsive design requirement:** Must accommodate various screen sizes for local multiplayer on different devices.
- **No external dependencies:** Cannot rely on third-party game services, analytics requiring user consent, or cloud infrastructure.

## Initial Scope Recommendation

### In Scope (v1)
- Core Ultimate Tic-Tac-Toe game logic (9x9 grid with board navigation rules)
- Two-player local multiplayer on a single device
- Clean, minimal UI with game state visualization (active board highlighting, win conditions)
- Turn indicator showing current player (X or O)
- Win detection for individual boards and overall game
- Game reset/restart functionality
- Responsive design for desktop, tablet, and mobile
- Static site deployment (no backend)
- Active board highlighting (inactive boards normal but unclickable)

### Out of Scope (v1)
- Online multiplayer or matchmaking
- AI opponents or computer players
- User accounts, authentication, or profiles
- Game history, statistics, or persistence
- Leaderboards or competitive features
- Undo/redo functionality
- Timers or turn time limits
- Themes, customization, or skins
- Sound effects or animations (keep minimal)
- Social sharing or viral features
- Analytics tracking (respect privacy-first approach)

## Resolved Questions
1. **Timer / move history?** No — keep UI maximally minimal.
2. **Active board UX?** Highlight active board only; inactive boards stay visually normal but are unclickable.
3. **Tutorial / practice mode?** No — no built-in rules explanation.
4. **Multi-player beyond 1v1?** No — strictly 1v1.
5. **Minimum screen size?** Mobile-first, 320px+ supported.
6. **Turn-taking model?** Hotseat — both players side by side, turn indicator only.
7. **Backend?** Cut Fastify — static React app deployed to static host.
8. **Persistence?** None — closing tab loses game, by design.
9. **Future online play?** Maybe — keep game logic separable but don't overbuild.
10. **Discovery / SEO?** Decide later, not in V1 scope.
11. **Browser support?** Chrome + Safari (desktop + mobile).
