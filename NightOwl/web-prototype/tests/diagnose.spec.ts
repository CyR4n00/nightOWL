import { test } from '@playwright/test';
import * as fs from 'fs';

test('diagnose gate view', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', exception => {
    errors.push(`[PageError] ${exception.message}`);
  });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'gateview.png' });

  const content = await page.content();
  fs.writeFileSync('page-content.txt', content);
  fs.writeFileSync('console-errors.txt', errors.join('\n'));
});
