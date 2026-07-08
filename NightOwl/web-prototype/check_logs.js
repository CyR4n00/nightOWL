import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 5000 });
    console.log('Page loaded');
  } catch (err) {
    console.log('Error loading page:', err.message);
  }

  await browser.close();
})();
