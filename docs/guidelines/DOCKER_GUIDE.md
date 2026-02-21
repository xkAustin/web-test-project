# Docker Configuration Guide

## Overview

This project includes an optimized Dockerfile for running Playwright test automation in containerized environments. The multi-stage build ensures minimal image size while providing a complete testing environment.

## Image Information

- **Base Image**: `mcr.microsoft.com/playwright:v1.43.0-jammy`
- **Build Stages**: 2 (builder and production)
- **Image Size**: Optimized with multi-stage build (~1.5GB with browsers)
- **Browsers Included**: Chromium, Firefox, WebKit

## Building the Docker Image

### Basic Build

```bash
# Build image with default tag
docker build -t wangdanatest-automation .

# Build with specific tag and version
docker build -t wangdanatest-automation:1.0.0 .

# Build with progress output
docker build --progress=plain -t wangdanatest-automation .
```

### Build with BuildKit (Faster)

```bash
# Enable Docker BuildKit for faster builds
DOCKER_BUILDKIT=1 docker build -t wangdanatest-automation .
```

## Running Tests in Docker

### 1. Run All Tests (Default)

```bash
# Run all tests in the container
docker run --rm \
  -v $(pwd)/reports:/app/reports \
  -v $(pwd)/coverage:/app/coverage \
  wangdanatest-automation

# On Windows (PowerShell)
docker run --rm `
  -v ${PWD}/reports:/app/reports `
  -v ${PWD}/coverage:/app/coverage `
  wangdanatest-automation
```

### 2. Run Specific Test Suites

```bash
# Run only E2E tests
docker run --rm -it wangdanatest-automation npm run test:e2e

# Run only API tests
docker run --rm -it wangdanatest-automation npm run test:api

# Run only security tests
docker run --rm -it wangdanatest-automation npm run test:security

# Run only performance tests
docker run --rm -it wangdanatest-automation npm run test:performance

# Run with UI debugging
docker run --rm -it \
  -v $(pwd)/tests:/app/tests \
  wangdanatest-automation npm run test:ui

# Run with debugging enabled
docker run --rm -it wangdanatest-automation npm run test:debug
```

### 3. Interactive Shell Access

```bash
# Access bash shell in the container
docker run --rm -it \
  -v $(pwd)/tests:/app/tests \
  -v $(pwd)/reports:/app/reports \
  wangdanatest-automation /bin/bash

# Inside container, you can run:
# npm test
# npm run test:e2e
# npx playwright test --debug
# bash scripts/check-env.sh
```

### 4. Volume Mounting for Development

```bash
# Mount project directory for live test development
docker run --rm -it \
  -v $(pwd)/tests:/app/tests \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/reports:/app/reports \
  wangdanatest-automation npm run test:ui

# Mount with environment file
docker run --rm -it \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/tests:/app/tests \
  wangdanatest-automation npm test
```

## Environment Variables

### Available Environment Variables

```dockerfile
CI=true                           # CI mode for tests
HEADLESS=true                     # Run browsers in headless mode
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
PLAYWRIGHT_JUNIT_OUTPUT_NAME=junit-results.xml
NODE_ENV=test
LOG_LEVEL=info
```

### Override Environment Variables

```bash
# Set custom environment variables
docker run --rm \
  -e CI=true \
  -e LOG_LEVEL=debug \
  -e TEST_TIMEOUT=60000 \
  wangdanatest-automation npm test

# Pass environment file
docker run --rm \
  --env-file .env \
  wangdanatest-automation npm test
```

## Docker Compose Setup

Create a `docker-compose.yml` for multi-service testing:

```yaml
version: '3.8'

services:
  playwright-tests:
    build:
      context: .
      dockerfile: Dockerfile
    image: wangdanatest-automation:latest
    container_name: playwright-tests

    # Mount volumes
    volumes:
      - ./reports:/app/reports
      - ./coverage:/app/coverage
      - ./tests:/app/tests:ro

    # Environment configuration
    environment:
      CI: 'true'
      HEADLESS: 'true'
      LOG_LEVEL: 'info'

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

    # Command to run
    command: npm test

  # Optional: Test reporting service
  test-reporter:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./reports/html:/usr/share/nginx/html:ro
    depends_on:
      - playwright-tests

volumes:
  reports:
  coverage:
```

Run with Docker Compose:

```bash
# Run all services
docker-compose up

# Run and remove after completion
docker-compose up --abort-on-container-exit

# Build and run
docker-compose up --build

# Run specific service
docker-compose run playwright-tests npm run test:e2e

# Stop and clean up
docker-compose down -v
```

## Output and Artifacts

### Volume Mapping for Results

```bash
# Map reports directory
-v $(pwd)/reports:/app/reports

# Map coverage directory
-v $(pwd)/coverage:/app/coverage

# Map screenshots
-v $(pwd)/screenshots:/app/screenshots

# Map all outputs
-v $(pwd)/reports:/app/reports \
-v $(pwd)/coverage:/app/coverage \
-v $(pwd)/screenshots:/app/screenshots
```

### Access Test Results

```bash
# View HTML reports after tests complete
open reports/html/index.html

# View coverage report
open coverage/index.html

# View test results JSON
cat reports/test-results.json | jq '.'

# View JUnit XML for CI/CD integration
cat reports/junit-results.xml
```

## Health Monitoring

### Check Container Health

```bash
# Check container status
docker ps --filter "name=wangdanatest"

# Inspect health status
docker inspect --format={{.State.Health}} wangdanatest-automation

# View container logs
docker logs wangdanatest-automation

# Stream logs in real-time
docker logs -f wangdanatest-automation

# Get last 100 lines of logs
docker logs --tail 100 wangdanatest-automation
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Out of Memory

```bash
# Increase Docker memory limit
docker run --memory 4g wangdanatest-automation npm test

# Limit workers to reduce memory usage
docker run --rm \
  -e PLAYWRIGHT_TEST_WORKERS=1 \
  wangdanatest-automation npm test
```

#### 2. Timeout Issues

```bash
# Increase timeout values
docker run --rm \
  -e PLAYWRIGHT_TIMEOUT=60000 \
  wangdanatest-automation npm test
```

#### 3. Browser Not Found

```bash
# Reinstall browsers inside container
docker run --rm -it wangdanatest-automation \
  npx playwright install --with-deps

# Create new image with browsers cached
docker build --no-cache -t wangdanatest-automation:fresh .
```

#### 4. Display/Rendering Issues

```bash
# Run with X11 forwarding (Linux)
docker run --rm -it \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  wangdanatest-automation npm run test:ui
```

#### 5. Network Issues in Tests

```bash
# Use host network (Linux only)
docker run --rm --network host wangdanatest-automation npm test

# Or map specific ports
docker run --rm \
  -p 3000:3000 \
  -p 8080:8080 \
  wangdanatest-automation npm test
```

## Performance Optimization

### Reduce Build Time

```bash
# Use BuildKit for parallel layer building
DOCKER_BUILDKIT=1 docker build -t wangdanatest-automation .

# Cache base image layers
docker pull mcr.microsoft.com/playwright:v1.43.0-jammy

# Use --cache-from for CI/CD
docker build \
  --cache-from wangdanatest-automation:latest \
  -t wangdanatest-automation:latest \
  .
```

### Reduce Image Size

The multi-stage build already optimizes image size by:
- Separating build dependencies from runtime
- Removing npm cache after install
- Using minimal base image
- Result image size: ~1.5GB (includes all browsers)

### Run Tests Faster

```bash
# Increase parallelism
docker run --rm \
  -e PLAYWRIGHT_TEST_WORKERS=4 \
  wangdanatest-automation npm test

# Run specific tests only
docker run --rm wangdanatest-automation \
  npx playwright test tests/e2e/ -g "quick"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t wangdanatest-automation .

      - name: Run tests
        run: |
          docker run --rm \
            -v ${{ github.workspace }}/reports:/app/reports \
            -v ${{ github.workspace }}/coverage:/app/coverage \
            wangdanatest-automation

      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: reports/
```

### GitLab CI Example

```yaml
docker-tests:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t wangdanatest-automation .
    - |
      docker run --rm \
        -v $CI_PROJECT_DIR/reports:/app/reports \
        -v $CI_PROJECT_DIR/coverage:/app/coverage \
        wangdanatest-automation
  artifacts:
    paths:
      - reports/
      - coverage/
    when: always
```

## Security Considerations

### Best Practices

```bash
# Don't run as root (container already uses non-root playwright user)
# Use read-only volumes where possible
docker run --rm \
  -v $(pwd)/tests:/app/tests:ro \
  -v $(pwd)/reports:/app/reports \
  wangdanatest-automation

# Scan image for vulnerabilities
docker scan wangdanatest-automation

# Use specific image tags (not latest)
docker run --rm wangdanatest-automation:1.0.0 npm test

# Never commit .env file to image
# Always use --env-file or -e flags
```

## Cleanup

### Remove Unused Resources

```bash
# Remove container
docker rm wangdanatest-automation

# Remove image
docker rmi wangdanatest-automation

# Remove dangling images
docker image prune

# Remove all unused resources
docker system prune -a

# Remove volumes
docker volume prune
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- Project QUICK_COMMANDS.md for all npm test commands
