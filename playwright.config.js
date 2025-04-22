// @ts-check
const { defineConfig, devices } = require('@playwright/test'); // Changed to require

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 33 * 1000,
  expect: {
    timeout: 15 * 1000
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ]
});