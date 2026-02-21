import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  const baseURL = 'https://www.wangdanatest.top';

  test('TC-066: Home page load time < 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    const duration = Date.now() - start;

    console.log(`Home page load time: ${duration}ms`);
    expect(duration).toBeLessThan(3000);
  });

  test('TC-067: API response time < 2 seconds', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${baseURL}/api/discussions`);
    const duration = Date.now() - start;

    console.log(`API response time: ${duration}ms`);
    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(2000);
  });

  test('TC-068: DOM Content Loaded performance', async ({ page }) => {
    let domLoadTime = 0;

    page.on('load', () => {
      domLoadTime = Date.now();
    });

    const startTime = Date.now();
    await page.goto(`${baseURL}/`);
    const totalTime = Date.now() - startTime;

    console.log(`Total page load time: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(5000);
  });

  test('TC-069: CSS file load performance', async ({ page }) => {
    let cssLoadTimes: number[] = [];

    page.on('response', async response => {
      if (response.url().endsWith('.css')) {
        const timing = response.request().timing();
        console.log(`CSS file: ${response.url()}, Load time: ${timing?.responseEnd - timing?.requestStart}ms`);
      }
    });

    await page.goto(`${baseURL}/`);
  });

  test('TC-070: JavaScript file load performance', async ({ page }) => {
    page.on('response', async response => {
      if (response.url().endsWith('.js')) {
        const timing = response.request().timing();
        console.log(`JS file: ${response.url()}, Load time: ${timing?.responseEnd - timing?.requestStart}ms`);
      }
    });

    await page.goto(`${baseURL}/`);
  });

  test('TC-071: Image resource loading < 5MB total', async ({ page }) => {
    let totalImageSize = 0;

    page.on('response', async response => {
      if (response.url().match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
        const buffer = await response.buffer();
        totalImageSize += buffer.length;
      }
    });

    await page.goto(`${baseURL}/`);
    await page.waitForLoadState('networkidle');

    const totalMB = totalImageSize / (1024 * 1024);
    console.log(`Total image size: ${totalMB.toFixed(2)}MB`);
    expect(totalImageSize).toBeLessThan(5 * 1024 * 1024);
  });

  test('TC-072: Search functionality response time', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const start = Date.now();
      await searchInput.fill('test');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      const duration = Date.now() - start;

      console.log(`Search response time: ${duration}ms`);
      expect(duration).toBeLessThan(3000);
    }
  });

  test('TC-073: Page memory usage', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const memoryUsage = await page.evaluate(() => {
      if ((performance as any).memory) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (memoryUsage) {
      const usedMB = memoryUsage.usedJSHeapSize / (1024 * 1024);
      console.log(`Heap memory used: ${usedMB.toFixed(2)}MB`);
    }
  });

  test('TC-074: Concurrent requests performance', async ({ request }) => {
    const start = Date.now();

    const requests = [
      request.get(`${baseURL}/api/discussions`),
      request.get(`${baseURL}/api/tags`),
      request.get(`${baseURL}/api/discussions?page=2`)
    ];

    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    console.log(`3 concurrent API requests: ${duration}ms`);
    expect(duration).toBeLessThan(3000);

    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });
  });

  test('TC-075: Login form interaction performance', async ({ page }) => {
    await page.goto(`${baseURL}/login`);

    const start = Date.now();
    const usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]');

    if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await usernameInput.fill('testuser');
      await passwordInput.fill('testpass');

      const duration = Date.now() - start;
      console.log(`Form filling time: ${duration}ms`);
      expect(duration).toBeLessThan(1000);
    }
  });

  test('TC-076: Page rendering performance (Paint timing)', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const paintTiming = await page.evaluate(() => {
      const entries = (performance as any).getEntriesByType?.('paint') || [];
      return entries.map((entry: any) => ({
        name: entry.name,
        startTime: entry.startTime
      }));
    });

    if (paintTiming.length > 0) {
      console.log('Paint timings:', paintTiming);
    }
  });

  test('TC-077: Navigation timing breakdown', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const navigationTiming = await page.evaluate(() => {
      const perf = performance.timing;
      return {
        dnsLookup: perf.domainLookupEnd - perf.domainLookupStart,
        tcpConnection: perf.connectEnd - perf.connectStart,
        requestTime: perf.responseStart - perf.requestStart,
        responseTime: perf.responseEnd - perf.responseStart,
        domParsing: perf.domInteractive - perf.responseEnd,
        totalTime: perf.loadEventEnd - perf.navigationStart
      };
    });

    console.log('Navigation timing:', navigationTiming);
    expect(navigationTiming.totalTime).toBeLessThan(3000);
  });

  test('TC-078: TTFB (Time to First Byte) < 1 second', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${baseURL}/`);
    const ttfb = Date.now() - start;

    console.log(`TTFB: ${ttfb}ms`);
    expect(ttfb).toBeLessThan(1000);
  });

  test('TC-079: Stress test - Multiple page loads', async ({ page }) => {
    const start = Date.now();

    for (let i = 0; i < 5; i++) {
      await page.goto(`${baseURL}/`);
      const elapsed = Date.now() - start;
      console.log(`Load ${i + 1} completed in ${elapsed}ms`);
    }

    const totalTime = Date.now() - start;
    const avgTime = totalTime / 5;
    console.log(`Average load time: ${avgTime}ms`);
    expect(avgTime).toBeLessThan(3000);
  });

  test('TC-080: Resource caching effectiveness', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const firstLoadMetrics = await page.evaluate(() => {
      const entries = (performance as any).getEntriesByType?.('resource') || [];
      return {
        count: entries.length,
        cachedCount: entries.filter((e: any) => e.transferSize === 0).length
      };
    });

    console.log(`Resources: ${firstLoadMetrics.count}, Cached: ${firstLoadMetrics.cachedCount}`);
  });
});
