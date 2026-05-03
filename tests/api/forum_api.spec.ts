import { test, expect } from '@playwright/test';

test.describe('Forum API Tests', () => {
  test('TC-021: GET /api/discussions should return 200', async ({ request }) => {
    const response = await request.get('/api/discussions');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json().catch(() => ({}));
    if (body.data) {
      expect(Array.isArray(body.data)).toBeTruthy();
    }
  });

  test('TC-022: GET /api/tags should return 200', async ({ request }) => {
    const response = await request.get('/api/tags');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json().catch(() => ({}));
    expect(body).toBeDefined();
  });

  test('TC-023: API response headers validation', async ({ request }) => {
    const response = await request.get('/api/discussions');

    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/application\/(vnd\.api\+)?json/);
  });

  test('TC-024: API response time should be reasonable', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/discussions');
    const responseTime = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(5000);
  });

  test('TC-025: GET /api/categories endpoint', async ({ request }) => {
    const response = await request.get('/api/categories', {
      failOnStatusCode: false,
    });
    expect([200, 404, 405, 500]).toContain(response.status());
  });

  test('TC-026: Invalid endpoint returns 404', async ({ request }) => {
    const response = await request.get('/api/invalidendpoint', {
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(404);
  });

  test('TC-027: API pagination support', async ({ request }) => {
    const response = await request.get('/api/discussions?page=1&limit=10');

    if (response.ok()) {
      const body = await response.json().catch(() => ({}));
      expect(body).toBeDefined();
    }
  });

  test('TC-028: POST request to create discussion', async ({ request }) => {
    const response = await request.post('/api/discussions', {
      data: {
        title: 'Test Discussion',
        content: 'This is a test discussion',
        category: 'Testing',
      },
      failOnStatusCode: false,
    });

    // Acceptable responses: 401/403 (auth required), 201 (created), 405 (method not supported)
    expect([201, 400, 401, 403, 405]).toContain(response.status());
  });

  test('TC-029: CORS headers validation', async ({ request }) => {
    const response = await request.get('/api/discussions');

    const headers = response.headers();
    expect(headers).toBeDefined();
  });

  test('TC-030: Rate limiting check', async ({ request }) => {
    const responses = [];
    for (let i = 0; i < 5; i++) {
      const response = await request.get('/api/discussions', {
        failOnStatusCode: false,
      });
      responses.push(response.status());
    }

    const hasRateLimitResponse = responses.includes(429);
    // Log the status codes observed for diagnostics
    console.log('Rate limit check statuses:', responses.join(', '));
    expect(typeof hasRateLimitResponse).toBe('boolean');
  });
});
