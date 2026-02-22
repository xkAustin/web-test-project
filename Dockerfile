# Dockerfile for running Playwright tests
# Multi-stage build for optimized image size and faster builds
# Base image includes Playwright and all browser dependencies

# ============================================================================
# BUILDER STAGE: Install dependencies
# ============================================================================
FROM mcr.microsoft.com/playwright:v1.43.0-jammy AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for testing)
RUN npm ci

# ============================================================================
# FINAL PRODUCTION STAGE: Test execution environment
# ============================================================================
FROM mcr.microsoft.com/playwright:v1.43.0-jammy

LABEL maintainer="QA Team"
LABEL description="Playwright automated testing framework for wangdanatest.top"
LABEL version="1.0.0"

WORKDIR /app

# ============================================================================
# System dependencies and utilities
# ============================================================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Required utilities
    curl \
    git \
    # Text processing and networking tools
    wget \
    jq \
    # Development tools
    build-essential \
    python3 \
    # Cleanup to reduce image size
    && rm -rf /var/lib/apt/lists/*

# ============================================================================
# Copy project files from builder
# ============================================================================
COPY --from=builder /app/node_modules /app/node_modules
COPY package*.json ./
COPY . .

# ============================================================================
# Create necessary directories for test output and reports
# ============================================================================
RUN mkdir -p \
    reports/html \
    reports/junit \
    coverage \
    screenshots \
    test-results \
    .test-cache

# ============================================================================
# Environment Configuration for CI/CD Testing
# ============================================================================
# CI environment indicator for test execution
ENV CI=true

# Headless mode for browser automation
ENV HEADLESS=true

# Browser installation settings
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0

# Playwright cache and configuration
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_JUNIT_OUTPUT_NAME=junit-results.xml

# Test execution settings
ENV NODE_ENV=test
ENV LOG_LEVEL=info

# ============================================================================
# Verify installations and environment
# ============================================================================
RUN echo "✓ Node.js version:" && node --version && \
    echo "✓ npm version:" && npm --version && \
    echo "✓ Playwright version:" && npm list @playwright/test && \
    echo "✓ Playwright browsers check:" && ls -la /ms-playwright/chromium* /ms-playwright/firefox* /ms-playwright/webkit* 2>/dev/null | head -5

# ============================================================================
# Health check to ensure container is ready for testing
# ============================================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD npm list @playwright/test > /dev/null 2>&1 && \
        [ -d "/ms-playwright/chromium" ] && \
        echo "OK" || exit 1

# ============================================================================
# Test execution
# ============================================================================
# Default command runs all tests
CMD ["npm", "test"]

# ============================================================================
# Available test commands (use with docker run -it <image> <command>):
# - npm test                      Run all tests
# - npm run test:e2e              Run E2E tests only
# - npm run test:api              Run API tests only
# - npm run test:security         Run security tests
# - npm run test:performance      Run performance tests
# - npm run test:ui               Run UI test interface
# - npm run test:debug            Run with debugging enabled
# - npx playwright test --help    View all Playwright options
# ============================================================================
