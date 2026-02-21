# Test Cases for https://www.wangdanatest.top

## 1. Functional Testing (E2E)

### 1.1 Home Page
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| E2E-01 | Home Page Loads | High | Verify home page loads correctly | Page title contains "Wang Dan Test", Header/Footer visible |
| E2E-02 | Navigation Link Check | Medium | Check main navigation links | Links redirect to correct URLs |

### 1.2 User Authentication
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| AUTH-01 | Valid Login | High | Login with valid credentials | Redirected to dashboard, username displayed |
| AUTH-02 | Invalid Login | High | Login with wrong password | Error message "Invalid credentials" shown |

### 1.3 Search Functionality
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| SRCH-01 | Keyword Search | Medium | Search for a common term | Search results are displayed |
| SRCH-02 | Empty Search | Low | Search with no keyword | Appropriate empty state or message |

## 2. API Testing
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| API-01 | Get Topics | Medium | GET /api/discussions | Returns 200 OK and a list of topics |

## 3. Security Testing
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| SEC-01 | XSS Prevention | High | Input script tag in search | Input is sanitized/escaped |
| SEC-02 | CSRF Protection | High | POST request without token | Returns 403 Forbidden |

## 4. Performance Testing
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| PERF-01 | Home Page Load Time | Medium | Measure TTI of home page | Load time < 3s |

## 5. Accessibility Testing
| ID | Title | Priority | Description | Expected Result |
|----|-------|----------|-------------|-----------------|
| ACC-01 | WCAG Compliance | Medium | Run Axe-core on home page | No critical accessibility violations |
