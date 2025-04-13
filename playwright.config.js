// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const Config = ({
  testDir: './tests',

  //https://playwright.dev/docs/test-timeouts
  timeout: 50 * 1000,   // for every step. 
  //Equivalent to implicit & explicit wait in selenium [for a locator to be found in the list of HTML mark-ups
  // regardless whether its associated element in the UI is loaded or not 
  expect: {
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 5*1000, // 5 seconds
  },
  reporter: 'html', // 'html' is the default one.


  use: {
     browserName: 'chromium', // 'chromium' or 'webkit' or 'firefox'all' (all 3 browsers).

                            // 'chromium' to launch chrome browser.
                            // 'webkit' to launch safari browser. 
                             
    headless: false,   // true or false. true means run in headless mode (no UI). false means run in headed mode (with UI).
    
    screenshot: 'only-on-failure', 
    // 'on' it captures a screenshot of every step/action that's performed (Too much ! but sometimes it's asked for)
    trace: 'on', // 'on' so you get detailed report for each automation step you're performing.
                               // 'on' eats up your memory (detailed explanation will be encountered below) 
                               // 'retain-on-failure'
  },

  
});

module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)