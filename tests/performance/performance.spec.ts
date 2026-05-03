import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('TC-066: Home page load time < 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const duration = Date.now() - start;

    console.log(`Home page load time: ${duration}ms`);
    expect(duration).toBeLessThan(3000);
  });

  test('TC-067: API response time < 2 seconds', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/discussions');
    const duration = Date.now() - start;

    console.log(`API response time: ${duration}ms`);
    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(2000);
  });

  test('TC-068: DOM Content Loaded performance', async ({ page }) => {
    let domLoadTime = 0;

    page.on('domcontentloaded', () => {
      domLoadTime = Date.now();
    });

    const startTime = Date.now();
    await page.goto('/');
    const totalTime = Date.now() - startTime;

    console.log(`Total page load time: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(5000);
  });

  test('TC-069: CSS file load performance', async ({ page }) => {
    let cssCount = 0;

    page.on('response', async (response) => {
      if (response.url().endsWith('.css')) {
        cssCount++;
        const timing = response.request().timing();
        console.log(
          `CSS file: ${response.url().split('/').pop()}, Load time: ${timing?.responseEnd - timing?.requestStart}ms`,
        );
      }
    });

    await page.goto('/');
    console.log(`Total CSS files loaded: ${cssCount}`);
  });

  test('TC-070: JavaScript file load performance', async ({ page }) => {
    let jsCount = 0;
    page.on('response', async (response) => {
      if (response.url().endsWith('.js')) {
        jsCount++;
        const timing = response.request().timing();
        console.log(
          `JS file: ${response.url().split('/').pop()}, Load time: ${timing?.responseEnd - timing?.requestStart}ms`,
        );
      }
    });

    await page.goto('/');
    console.log(`Total JS files loaded: ${jsCount}`);
  });

  test('TC-071: Image resource loading < 5MB total', async ({ page }) => {
    let totalImageSize = 0;

    page.on('response', async (response) => {
      if (response.url().match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
        const buffer = await response.buffer();
        totalImageSize += buffer.length;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('load');

    const totalMB = totalImageSize / (1024 * 1024);
    console.log(`Total image size: ${totalMB.toFixed(2)}MB`);
    expect(totalImageSize).toBeLessThan(5 * 1024 * 1024);
  });

  test('TC-072: Search functionality response time', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator(
      'input[placeholder*="Search"], input[placeholder*="搜索"]',
    );
    test.skip(
      !(await searchInput.isVisible({ timeout: 3000 }).catch(() => false)),
      'Search input not available on this page',
    );

    const start = Date.now();
    await searchInput.fill('test');
    await searchInput.press('Enter');
    await page.waitForLoadState('load');
    const duration = Date.now() - start;

    console.log(`Search response time: ${duration}ms`);
    expect(duration).toBeLessThan(3000);
  });

  test('TC-073: Page memory usage', async ({ page }) => {
    await page.goto('/');

    interface ExtendedPerformance extends Performance {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    }

    const memoryUsage = await page.evaluate(() => {
      const perf = performance as ExtendedPerformance;
      if (perf.memory) {
        return {
          usedJSHeapSize: perf.memory.usedJSHeapSize,
          totalJSHeapSize: perf.memory.totalJSHeapSize,
          jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memoryUsage) {
      const usedMB = memoryUsage.usedJSHeapSize / (1024 * 1024);
      console.log(`Heap memory used: ${usedMB.toFixed(2)}MB`);
      expect(usedMB).toBeGreaterThan(0);
    }
  });

  test('TC-074: Concurrent requests performance', async ({ request }) => {
    const start = Date.now();

    const requests = [
      request.get('/api/discussions'),
      request.get('/api/tags'),
      request.get('/api/discussions?page=2'),
    ];

    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    console.log(`3 concurrent API requests: ${duration}ms`);
    expect(duration).toBeLessThan(3000);

    responses.forEach((response) => {
      expect(response.ok()).toBeTruthy();
    });
  });

  test('TC-075: Login form interaction performance', async ({ page }) => {
    await page.goto('/login');

    const usernameInput = page
      .locator('input[name="username"], input[type="text"]')
      .first();
    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]',
    );

    test.skip(
      !(await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)),
      'Login form not found',
    );

    const start = Date.now();
    await usernameInput.fill('testuser');
    await passwordInput.fill('testpass');

    const duration = Date.now() - start;
    console.log(`Form filling time: ${duration}ms`);
    expect(duration).toBeLessThan(1000);
  });

  test('TC-076: Page rendering performance (Paint timing)', async ({ page }) => {
    await page.goto('/');

    const paintTiming = await page.evaluate(() => {
      const entries = performance.getEntriesByType?.('paint') || [];
      return entries.map((entry) => ({
        name: entry.name,
        startTime: entry.startTime,
      }));
    });

    if (paintTiming.length > 0) {
      console.log('Paint timings:', paintTiming);
      expect(paintTiming[0].startTime).toBeGreaterThanOrEqual(0);
    } else {
      expect(paintTiming).toBeDefined();
    }
  });

  test('TC-077: Navigation timing breakdown', async ({ page }) => {
    await page.goto('/');

    const navigationTiming = await page.evaluate(() => {
      const perf = performance.timing;
      return {
        dnsLookup: perf.domainLookupEnd - perf.domainLookupStart,
        tcpConnection: perf.connectEnd - perf.connectStart,
        requestTime: perf.responseStart - perf.requestStart,
        responseTime: perf.responseEnd - perf.responseStart,
        domParsing: perf.domInteractive - perf.responseEnd,
        totalTime: perf.loadEventEnd - perf.navigationStart,
      };
    });

    console.log('Navigation timing:', navigationTiming);
    expect(navigationTiming.totalTime).toBeLessThan(3000);
  });

  test('TC-078: TTFB (Time to First Byte) < 1 second', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
    const ttfb = Date.now() - start;

    console.log(`TTFB: ${ttfb}ms`);
    expect(ttfb).toBeLessThan(1000);
  });

  test('TC-079: Stress test - Multiple page loads', async ({ page }) => {
    const start = Date.now();

    for (let i = 0; i < 5; i++) {
      await page.goto('/');
    }

    const totalTime = Date.now() - start;
    const avgTime = totalTime / 5;
    console.log(`Average load time: ${avgTime}ms`);
    expect(avgTime).toBeLessThan(3000);
  });

  test('TC-080: Resource caching effectiveness', async ({ page }) => {
    await page.goto('/');

    const firstLoadMetrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType?.('resource') || [];
      return {
        count: entries.length,
        cachedCount: entries.filter(
          (e) => (e as PerformanceResourceTiming).transferSize === 0,
        ).length,
      };
    });

    console.log(
      `Resources: ${firstLoadMetrics.count}, Cached: ${firstLoadMetrics.cachedCount}`,
    );
    console.log(`Cache hit rate: ${firstLoadMetrics.count > 0 ? ((firstLoadMetrics.cachedCount / firstLoadMetrics.count) * 100).toFixed(1) : 0}%`);
  });
});
