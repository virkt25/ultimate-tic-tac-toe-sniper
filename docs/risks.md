# Risk Assessment: Ultimate Tic Tac Toe Sniper

> **Status:** Draft
> **Author:** Discovery Team — Risk Researcher
> **Date:** 2026-02-17

## Executive Risk Summary
This project is a simple browser-based game with local multiplayer and no persistence layer. The technical risk profile is LOW, but UX complexity and cross-device compatibility carry MODERATE risk. The biggest failure mode is not technical infeasibility but player abandonment due to confusing rules or poor mobile UX. The project has no backend persistence, no user data storage, and no third-party dependencies beyond standard React/Fastify libraries, which dramatically reduces operational, security, and compliance risk.

## Technical Feasibility

### Architecture Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Frontend state management becomes unwieldy as game logic grows (9x9 grid, sub-board rules, win detection) | Medium | Medium | Use a state management library (Zustand or Redux) from the start. Document state shape in types. |
| Game logic bugs in win detection or turn validation go unnoticed | Medium | High | Write unit tests for all game logic before building UI. Test edge cases (tied sub-boards, already-won sub-boards). |
| React re-renders cause performance issues on mobile with 81 cells | Low | Medium | Use React.memo for cells, optimize render cycles, test on mid-range Android devices. |
| No database means game state loss on page refresh | High | Low (by design) | Accept this for local multiplayer. For future features (online play), local storage or backend required. |

### Integration Risks
This project has minimal third-party dependencies and no external integrations (no auth providers, no payment gateways, no analytics SDKs). The only integration risks are:
- **React and Fastify version compatibility:** Low risk. Both are mature, well-documented frameworks with stable APIs.
- **pnpm workspace management:** Low risk if monorepo not used; no risk for single package.
- **Browser API inconsistencies:** Touch events, local storage, and viewport units can behave differently across browsers. Test on Safari (iOS), Chrome (Android), and Firefox.

### Scalability Risks
This is a LOCAL MULTIPLAYER GAME with no backend. There are NO scalability risks in the traditional sense (no servers, no database, no concurrent users on the same instance). However:
- **Mobile performance at scale (81 interactive cells):** If each cell is a React component with event handlers, re-render performance could degrade on low-end devices. Mitigation: Use virtualization or render optimization. Test on 3-year-old Android phones.
- **Future scope creep to online multiplayer:** If online play is added later, scalability becomes a real concern (WebSocket connections, matchmaking queues, game state sync). This should be flagged as out-of-scope for V1.

## Compliance & Regulatory

### Regulatory Requirements
**NONE APPLICABLE.** This project:
- Does not collect, store, or process user data (no GDPR, no CCPA)
- Does not handle payments (no PCI-DSS)
- Does not process health data (no HIPAA)
- Does not target children specifically (no COPPA, though general web accessibility applies)

If the persona document's future features (account creation, ranked mode, game history) are implemented, GDPR compliance becomes relevant. For V1, there are no regulatory requirements.

### Data Privacy Risks
**NO USER DATA IS COLLECTED OR STORED.** The game runs entirely in the browser with no backend persistence. There are no cookies, no analytics, no tracking. This eliminates all data privacy risk for V1.

**Future risk (if accounts are added):** Email collection, password storage, game history, and IP logging introduce GDPR requirements. If this happens, reassess privacy risks and implement consent flows, data deletion endpoints, and privacy policy.

## Operational Risks

### Deployment & Infrastructure
| Risk | Mitigation |
|------|------------|
| Static site hosting failure (CDN outage, DNS issues) | Use a reliable host (Vercel, Netlify, Cloudflare Pages) with 99.9%+ uptime SLA. Set up status page monitoring. |
| No CI/CD pipeline means manual deployments with human error risk | Set up GitHub Actions for automated build and deploy on merge to main. |
| No monitoring or error tracking means silent failures in production | Add lightweight error tracking (Sentry free tier) to catch JS exceptions. |
| Build failures due to pnpm lockfile conflicts | Lock pnpm version in CI. Use `pnpm install --frozen-lockfile` in CI/CD. |

**Key assumption:** Fastify backend is mentioned in the stack, but if there's no persistence or online multiplayer, WHAT IS THE BACKEND FOR? If it's just serving the static frontend, this is over-engineering. A static site host (Vercel, Netlify) is simpler and cheaper. If the backend has a purpose (API for future features, game validation), document it. Otherwise, cut it.

### Team & Resource Risks
| Risk | Mitigation |
|------|------------|
| Solo developer or small team means key-person dependency | Document architecture decisions in CLAUDE.md or ADRs. Use clear code structure and comments. |
| Underestimating mobile UX complexity (81 tap targets, zoom UX, touch gestures) | Allocate 30-40% of dev time to mobile optimization and testing. Do NOT treat mobile as an afterthought. |
| Scope creep to online multiplayer, ranked mode, or accounts | Lock V1 scope to local multiplayer only. Create a "V2 Features" backlog for future work. Do not start backend work until V1 ships. |
| No QA process means bugs ship to production | Write automated tests for game logic. Do manual testing on 3+ devices (desktop, iOS Safari, Android Chrome) before launch. |

## Security Risks

### Attack Surface
This game has a MINIMAL attack surface because there is no backend, no user input validation (beyond game moves), and no user data. The only potential security issues are:
- **XSS via user-generated content:** If player names or chat messages are added in the future, sanitize all inputs. For V1, there is no user-generated content, so no XSS risk.
- **Client-side cheating:** Players can open dev tools and modify game state (e.g., change whose turn it is, force a win). This is acceptable for local multiplayer where both players share the same device. For online play, server-side validation is required.
- **Dependency vulnerabilities:** React, Fastify, and npm packages can have CVEs. Mitigation: Run `pnpm audit` regularly. Use Dependabot or Renovate for automated dependency updates.

### Third-Party Risk
This project uses standard open-source frameworks (React, Fastify). The supply chain risk is LOW because:
- React and Fastify are maintained by Meta and the Fastify team (reputable, high activity).
- pnpm is a well-vetted package manager.
- No exotic or low-maintenance dependencies.

**Mitigation:** Lock dependency versions in `package.json`. Audit dependencies with `pnpm audit` before deployment. Avoid adding unnecessary packages.

## Risk Matrix

| # | Risk | Likelihood (1-5) | Impact (1-5) | Score | Priority | Mitigation Strategy |
|---|------|-------------------|---------------|-------|----------|---------------------|
| 1 | Players don't understand the rules and abandon the game | 5 | 5 | 25 | P0 | Interactive tutorial on first play. Highlight valid moves. Inline tooltips. |
| 2 | Mobile tap targets too small, causing mis-taps and frustration | 4 | 4 | 16 | P0 | Zoom active sub-board on mobile. Minimum 44x44px tap targets. Test on real devices. |
| 3 | Game state lost on page refresh (no persistence) | 5 | 2 | 10 | P1 | Accept for V1 local play. Add localStorage save for future. |
| 4 | Win detection logic has edge case bugs (tied boards, invalid states) | 3 | 4 | 12 | P1 | Write comprehensive unit tests for all win conditions before UI work. |
| 5 | Fastify backend serves no purpose and over-complicates deployment | 3 | 2 | 6 | P2 | Clarify backend role. If not needed, deploy as static site (Vercel). |
| 6 | Dependency vulnerabilities in React/Fastify | 2 | 3 | 6 | P2 | Run `pnpm audit` in CI. Enable Dependabot for automated updates. |
| 7 | No error tracking means production bugs go unnoticed | 3 | 2 | 6 | P2 | Add Sentry or similar (free tier). Log errors to console in dev mode. |
| 8 | Browser compatibility issues (Safari, Firefox, mobile browsers) | 2 | 3 | 6 | P2 | Test on Safari, Firefox, Chrome, iOS Safari, Android Chrome. Use autoprefixer. |

## Assumptions Requiring Validation
1. **"No backend persistence" means games are lost on refresh.** Validate: Is this acceptable for the target user (local multiplayer)? Should localStorage be used to save in-progress games? The persona doc mentions "Game state reliability" as a shared need across all personas. This conflicts with the "no database" constraint. Clarify intent.
2. **Fastify backend is included in the stack but with no persistence layer.** Validate: What is the backend for? If it's just serving static files, a static host is simpler. If it's for future API endpoints (matchmaking, game history), document that as future scope and do NOT build it for V1.
3. **Users will play on the same device (local multiplayer).** Validate: Does this mean pass-and-play (turn-based on one screen) or split-screen? If pass-and-play, ensure the UI hides whose turn it is until the device is handed over (or accept that both players see everything). If online multiplayer is planned, this is a MAJOR scope change.
4. **The target audience understands or will quickly learn Ultimate Tic Tac Toe rules.** Validate: The persona doc identifies "rule comprehension" as the #1 friction point. Without interactive guidance, casual players (Casey) will bounce. DO NOT assume users know the rules. Test with non-gamers.
5. **Mobile optimization is critical.** The persona doc prioritizes Morgan (mobile player) as P0, but the stack is React (not React Native). Validate: Is responsive web design sufficient, or is a native app required for the mobile experience?

## Open Questions
1. **What is the Fastify backend for?** If there's no database, no user accounts, and no online play, why is there a backend? Is it just serving the React app? If so, replace with static hosting (Vercel, Netlify).
2. **How is turn-taking handled in local multiplayer?** Pass-and-play (hand the device back and forth)? Or a "hotseat" mode where both players sit together and take turns clicking? This affects UI design (e.g., do we show a "Your turn, Player X" modal?).
3. **Is game state persisted across sessions?** The constraint says "no database," but the persona doc says "game state reliability" is a shared need. Should we use localStorage to save in-progress games? Or accept that closing the tab loses the game?
4. **Are there plans for online multiplayer or ranked mode?** The persona doc describes competitive features (Elo, matchmaking, game history) that require a backend and persistence. If these are future scope, document them as out-of-scope for V1 to avoid scope creep.
5. **How will the game be discovered?** SEO, social sharing, word-of-mouth? If social sharing is key (per Alex persona), we need Open Graph tags, shareable game links, and potentially a "Challenge a Friend" flow. Is this in scope for V1?
6. **What devices and browsers are in scope for testing?** At minimum: Chrome desktop, Safari desktop, iOS Safari, Android Chrome. What about Firefox, Edge, older Android browsers (Samsung Internet)?
