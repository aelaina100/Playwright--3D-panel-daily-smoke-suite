
import { defineConfig, devices } from '@playwright/test';
//file totally messed up. you need to re-do it
/**
 * @see https://playwright.dev/docs/test-configuration
 */
const Config = {
  testDir: './tests',

  //https://playwright.dev/docs/test-timeouts
  timeout: 33 * 1000,   // for every step. 
  //Equivalent to implicit & explicit wait in selenium [for a locator to be found in the list of HTML mark-ups
  // regardless whether its associated element in the UI is loaded or not 
  expect: {
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 15*1000, // 5 seconds
  },
  //reporter: 'html', // 'html' is the default one. //comment it out if you are including slack reporting below.
  // Removed duplicate 'reporter' property to avoid conflicts. 

};

export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
});

module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)"