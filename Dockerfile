# Dockerfile for running Playwright tests
# Base image with Node 20 and necessary dependencies
FROM node:20-alpine

# Install system dependencies for Playwright (Chromium, Firefox, WebKit)
RUN apk add --no-cache \
    chromium \
    firefox \
    webkit2gtk-4.0 \
    ca-certificates \
    libxss1 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm \
    libasound2 \
    libxcb \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json .
COPY package-lock.json ./ 2>/dev/null || true

# Install npm dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Install Playwright browsers (with dependencies)
RUN npx playwright install --with-deps

# Expose the port used by Playwright (optional, not needed for headless)
# EXPOSE 3000

# Default command to run tests
CMD ["npm", "test"]
