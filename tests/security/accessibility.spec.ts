import { test, expect } from '@playwright/test';
import { AxeBuilder } from 'axe-playwright';

// Accessibility test for the home page

test('TC-AX-01 Home page accessibility', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // Fail the test if any violations are found
  if (accessibilityScanResults.violations.length > 0) {
    const violations = accessibilityScanResults.violations.map(v => `${v.id}: ${v.help}`);
    throw new Error(`Accessibility violations:\n${violations.join('\n')}`);
  }
});
