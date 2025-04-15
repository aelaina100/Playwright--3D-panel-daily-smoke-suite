//chat gpt suggested.
// example.spec.js
const { test } = require('../browserstack-fixtures'); // Adjusted path to match the correct location

test.skip('runs on BrowserStack', async ({ page }) => {
  await page.goto('https://www.google.ca/');
  // your test logic here
});
