# Security & Compliance Requirements: Ultimate Tic-Tac-Toe Sniper

> **Status:** Draft
> **Author:** Planning Team — Security Analyst
> **Date:** 2026-02-17
> **Source:** `docs/prd.md`, `docs/risks.md`

## 1. Security Architecture Overview

Ultimate Tic-Tac-Toe Sniper is a **static, client-side-only** browser game with **no backend, no authentication, no data collection, and no persistence**. This architecture produces an exceptionally small attack surface. The security posture is defensive by design: there is nothing to breach because there is nothing stored.

### Architecture Security Profile

| Property | Value | Security Implication |
|----------|-------|---------------------|
| Backend | None | No server-side attack surface |
| Database | None | No data breach risk |
| Authentication | None | No credential theft risk |
| User data collection | None | No privacy exposure |
| Cookies / localStorage | None | No session hijacking risk |
| Third-party scripts | None | No supply chain injection at runtime |
| Network requests after load | None | No data exfiltration vector |
| User-generated content | None | No XSS injection surface |

**Threat level: LOW.** The primary security concerns are supply chain integrity during build, content delivery integrity, and client-side code quality.

## 2. Threat Model

### 2.1 Assets

| Asset | Description | Sensitivity |
|-------|-------------|-------------|
| Static site bundle | HTML, CSS, JS files served to the browser | Low — public code, no secrets |
| Build pipeline | CI/CD configuration, GitHub Actions | Medium — compromise could inject malicious code |
| Source code | GitHub repository | Low — open source or private repo with standard access controls |
| Domain / DNS | DNS records pointing to static host | Medium — hijack could serve malicious content |
| Dependencies | npm packages used at build time | Medium — supply chain attack vector |

### 2.2 Threat Actors

| Actor | Motivation | Capability | Likelihood |
|-------|-----------|------------|------------|
| Opportunistic attacker | Deface site, inject crypto miner | Low-Medium | Low |
| Supply chain attacker | Compromise npm dependency | Medium | Low |
| Automated scanner | Exploit known vulnerabilities | Low | Medium |

### 2.3 Attack Vectors & Mitigations

#### T1: Supply Chain Attack via npm Dependency

**Vector:** A compromised npm package injects malicious code into the build output.

**Likelihood:** Low | **Impact:** High

**Mitigations:**
- Lock all dependency versions exactly in `pnpm-lock.yaml`
- Run `pnpm audit` in CI on every build; fail the build on high/critical findings
- Enable Dependabot or Renovate for automated dependency update PRs
- Minimize total dependency count; avoid unnecessary packages
- Review dependency diffs before merging update PRs

#### T2: Build Pipeline Compromise

**Vector:** Attacker gains access to GitHub Actions or CI/CD and modifies the build to inject malicious code.

**Likelihood:** Low | **Impact:** High

**Mitigations:**
- Require branch protection on `main` (no direct pushes, require PR reviews)
- Pin GitHub Actions to specific commit SHAs (not tags)
- Use least-privilege repository permissions for CI service accounts
- Enable GitHub audit logs for repository activity monitoring

#### T3: Static Host / CDN Compromise

**Vector:** Attacker compromises the static hosting provider or DNS to serve a modified version of the site.

**Likelihood:** Low | **Impact:** Medium

**Mitigations:**
- Deploy to a reputable static host (Vercel, Netlify, Cloudflare Pages) with TLS enforced
- Use HTTPS-only with HSTS headers
- Configure Content Security Policy (CSP) headers (see Section 4)
- Enable Subresource Integrity (SRI) if loading any external resources (not expected for v1)

#### T4: Client-Side Game State Manipulation

**Vector:** A player opens browser DevTools and modifies game state (changes turn, forces a win).

**Likelihood:** High | **Impact:** Low (accepted risk)

**Rationale:** This is local hotseat multiplayer where both players share the same device and browser. Client-side state manipulation is equivalent to moving the opponent's piece on a physical board — it requires physical access and mutual trust already exists. Server-side validation is not applicable without a backend.

**Mitigation:** None required for v1. If online multiplayer is added in the future, all game state validation must move server-side.

#### T5: Cross-Site Scripting (XSS)

**Vector:** Injection of malicious scripts via user input or URL parameters.

**Likelihood:** Very Low | **Impact:** Medium

**Rationale:** The game accepts no user-generated text content (no player names, no chat, no custom input fields). No URL parameters or fragments are processed. React's JSX rendering escapes content by default.

**Mitigations:**
- Never use `dangerouslySetInnerHTML`
- Do not process URL query parameters or hash fragments for game state
- Content Security Policy headers block inline scripts (see Section 4)

#### T6: Clickjacking

**Vector:** The game is embedded in a malicious iframe that overlays invisible UI to capture clicks.

**Likelihood:** Low | **Impact:** Low

**Mitigations:**
- Set `X-Frame-Options: DENY` header
- Set `Content-Security-Policy: frame-ancestors 'none'` header

## 3. Authentication & Authorization Model

**Not applicable.** There is no authentication or authorization in this application. There are no user accounts, no sessions, no tokens, no roles, and no permissions.

If authentication is introduced in a future version (e.g., for online multiplayer with accounts), the following must be implemented:
- OAuth 2.0 / OIDC with a reputable provider (no custom password storage)
- JWT with short-lived access tokens and refresh token rotation
- RBAC at minimum for any admin functionality
- All auth state validated server-side

## 4. Data Protection

### 4.1 Data at Rest

**No data is stored.** The application does not use:
- Databases
- localStorage
- sessionStorage
- IndexedDB
- Cookies
- File system storage

Game state exists only in React component memory and is destroyed when the tab is closed or refreshed.

### 4.2 Data in Transit

The only data in transit is the initial static asset delivery (HTML, CSS, JS).

**Requirements:**
- All assets served over HTTPS (TLS 1.2+ minimum, TLS 1.3 preferred)
- HSTS header with `max-age=31536000; includeSubDomains`
- No mixed content (all resources loaded over HTTPS)
- No runtime network requests (game functions fully offline after initial load)

### 4.3 Data Collection Policy

**Zero data collection.** The application must not:
- Set any cookies
- Use any analytics scripts (Google Analytics, Mixpanel, etc.)
- Load any third-party tracking pixels
- Send any telemetry or error reporting data (for v1)
- Fingerprint the browser or device
- Access device sensors, camera, microphone, or location

## 5. Compliance Requirements

### 5.1 Applicable Regulations

| Regulation | Applicable? | Rationale |
|-----------|-------------|-----------|
| GDPR (EU General Data Protection Regulation) | **No** | No personal data collected, processed, or stored |
| CCPA (California Consumer Privacy Act) | **No** | No personal information collected or sold |
| COPPA (Children's Online Privacy Protection Act) | **No** | No data collection from any users, including children |
| PCI-DSS (Payment Card Industry Data Security Standard) | **No** | No payment processing |
| HIPAA (Health Insurance Portability and Accountability Act) | **No** | No health data processed |
| ADA / WCAG (Accessibility) | **Yes** | Web content accessibility applies; see Section 5.2 |

### 5.2 Accessibility Compliance

While not strictly a "security" regulation, accessibility is a legal requirement in many jurisdictions and is included here for completeness.

**Target:** WCAG 2.1 Level AA

**Requirements (from PRD):**
- Color contrast ratio: 4.5:1 minimum for text, 3:1 for UI components
- Minimum touch targets: 44x44px
- Full keyboard navigation (tab + enter)
- Semantic HTML for screen reader compatibility
- Visible focus indicators on all interactive elements

### 5.3 Future Compliance Considerations

If the following features are added in future versions, reassess compliance:

| Future Feature | Triggers |
|----------------|----------|
| User accounts / email collection | GDPR, CCPA — consent flows, privacy policy, data deletion |
| Analytics / tracking | GDPR, CCPA, ePrivacy — cookie consent banner |
| Children-targeted marketing | COPPA — parental consent requirements |
| Payment / premium features | PCI-DSS — payment handling standards |

## 6. Security Headers

The static hosting configuration must include the following HTTP response headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

**Notes:**
- `style-src 'unsafe-inline'` is permitted only if the CSS-in-JS solution requires it (e.g., styled-components, emotion). If using external CSS files only, tighten to `style-src 'self'`.
- `X-XSS-Protection: 0` disables the legacy XSS auditor which can introduce vulnerabilities. CSP provides modern XSS protection.
- `connect-src 'none'` enforces the zero-network-request requirement after page load.
- `Permissions-Policy` explicitly denies access to device APIs that the game does not need.

## 7. Security Testing Requirements

### 7.1 Static Analysis (CI Pipeline)

| Check | Tool | Frequency | Fail Criteria |
|-------|------|-----------|---------------|
| Dependency audit | `pnpm audit` | Every CI build | Any high or critical vulnerability |
| Linting for security patterns | ESLint with security plugins (`eslint-plugin-security`) | Every CI build | Any security rule violation |
| TypeScript strict mode | `tsc --strict` | Every CI build | Any type error (prevents unsafe casts) |
| Bundle analysis | Bundler output check | Every CI build | Bundle > 200KB gzipped or unexpected chunks |

### 7.2 Manual Security Review (Pre-Release)

| Check | Description |
|-------|-------------|
| No `dangerouslySetInnerHTML` usage | Grep codebase; must return zero results |
| No `eval()` or `Function()` constructor | Grep codebase; must return zero results |
| No URL parameter processing | Verify no `window.location.search` or `window.location.hash` reading |
| No external resource loading | Verify no `fetch()`, `XMLHttpRequest`, or dynamic `<script>` injection |
| No data storage APIs | Verify no `localStorage`, `sessionStorage`, `IndexedDB`, or `document.cookie` usage |
| Security headers configured | Verify all headers from Section 6 are present in hosting configuration |
| HTTPS enforced | Verify HTTP redirects to HTTPS; HSTS header present |

### 7.3 Browser Security Testing

| Test | Target |
|------|--------|
| CSP violations | Open game in Chrome with DevTools Console; verify zero CSP violation warnings |
| Mixed content | Verify no mixed content warnings in browser console |
| Lighthouse security audit | Run Lighthouse; verify no security findings in Best Practices category |

## 8. Dependency Security Policy

### 8.1 Allowed Dependencies

Only well-maintained, widely-used packages should be included:

- **React** (Meta) — UI framework
- **TypeScript** (Microsoft) — type safety
- **Vite** (community, high activity) — build tool
- **Testing libraries** (Jest/Vitest, React Testing Library) — dev only

### 8.2 Dependency Rules

1. **Minimize count:** Every dependency added increases supply chain risk. Justify each addition.
2. **Lock versions:** Use exact versions in `package.json` and commit `pnpm-lock.yaml`.
3. **Audit regularly:** Run `pnpm audit` on every CI build.
4. **Review updates:** Do not auto-merge dependency update PRs. Review changelogs and diffs.
5. **No runtime CDN dependencies:** All code must be bundled at build time. No loading scripts from CDNs at runtime.
6. **Dev dependencies stay dev-only:** Ensure dev dependencies are not included in the production bundle.

## 9. Incident Response

Given the minimal attack surface and lack of user data, a lightweight incident response process is sufficient.

### If the static site is compromised or defaced:
1. Take the site offline (remove DNS or disable deployment)
2. Audit the build pipeline and hosting configuration for unauthorized changes
3. Review recent dependency updates and CI/CD logs
4. Redeploy from a known-good commit
5. Rotate any hosting provider API keys or tokens

### If a dependency vulnerability is disclosed:
1. Run `pnpm audit` to confirm exposure
2. Update the affected dependency to a patched version
3. Review the vulnerability advisory for exploitation risk
4. Rebuild and redeploy

## 10. Security Architecture Review Checklist

This checklist will be used to review the system architecture document when it is available:

- [ ] No server-side components that expand the attack surface
- [ ] No runtime external resource loading
- [ ] No user data processing or storage
- [ ] CSP and security headers defined in deployment configuration
- [ ] Build pipeline uses locked dependencies and runs audits
- [ ] Component architecture does not use dangerous React patterns
- [ ] State management does not persist to browser storage APIs
- [ ] No URL-based state that could be manipulated
