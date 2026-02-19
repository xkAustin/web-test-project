# Web Test Plan for https://www.wangdanatest.top

## 1. Purpose
The goal of this test plan is to provide a repeatable, engineering‑standard approach to validate the functionality, performance, and security of the website **https://www.wangdanatest.top**. The plan covers test objectives, scope, test environment, test cases, execution strategy, reporting and deliverables.

## 2. Scope
- **Functional Testing** – Validate user flows such as home page rendering, login, search, and any public API endpoints.
- **Regression Testing** – Re‑run the full test suite after any change to the code base.
- **Performance Testing** – Basic load simulation using Playwright’s `browser.newContext()` for concurrent sessions (optional).
- **Security Testing** – Basic OWASP Top‑10 checks (e.g., XSS, CSRF) using automated assertions.

## 3. Test Environment
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 20.x | Ensure `node` and `npm` are available.
| Playwright | 1.43.x | Cross‑browser automation (Chromium, Firefox, WebKit).
| Docker (optional) | 26.x | For isolated test runs.

### Environment Setup
```bash
# Install Node dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 4. Test Cases
| ID | Scenario | Steps | Expected Result |
|----|----------|-------|-----------------|
| TC‑01 | Home Page Loads | 1. Open `https://www.wangdanatest.top`. | 1. Page title contains "Wang Dan Test". 2. Header, footer present. |
| TC‑02 | Navigation – About | 1. Click "About" link. | 1. URL ends with `/about`. 2. About text visible. |
| TC‑03 | Login – Valid Credentials | 1. Open `/login`. 2. Enter valid username/password. 3. Submit. | 1. Redirect to `/dashboard`. 2. Welcome message contains username. |
| TC‑04 | Login – Invalid Credentials | 1. Open `/login`. 2. Enter wrong password. 3. Submit. | 1. Error toast with "Invalid credentials". |
| TC‑05 | Search Functionality | 1. Enter keyword in search box. 2. Submit. | 1. Results list populated. 2. Each result links to detail page. |
| TC‑06 | CSRF Protection | 1. Perform a POST to `/api/submit` without CSRF token. | 1. Response 403 Forbidden or 400 Bad Request. |
| TC‑07 | XSS Prevention | 1. Input `<script>alert(1)</script>` into search. | 1. Input is escaped and not executed. |

*(Additional cases can be added per feature.)*

## 5. Test Execution
1. **Run all tests**: `npm test`
2. **Generate HTML report**: `npm run test:report`
3. **View report**: Open `tests/report/index.html`

## 6. Reporting
- Playwright automatically generates an HTML report when the `--reporter=html` flag is used.
- Test results are summarized in `tests/report/index.html` and can be opened in any browser.
- CI integration (GitHub Actions) can publish the report as an artifact.

## 7. Deliverables
- `test_plan.md`
- Test scripts in `tests/specs/`
- `playwright.config.ts` and `package.json`
- Generated test report under `tests/report/`
- README with instructions.

---

**Note:** This plan assumes the user has the rights to test the target website. For production sites, ensure you have explicit permission and that your tests comply with the site’s terms of service.
