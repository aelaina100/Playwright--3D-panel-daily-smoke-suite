// playwright.config.js  is the one default configuration file (Test runner) that was created when the
// project was created !

//However, one can still create more configuration files, and instruct playwright to 
// pick that specific one with each run, instead of the default one.

// below is the same exact default configuration file but with the following chamges:
// 1- It is for device emulation & browserName= 'webkit'
// 2- headless= 'off' (In playwright, tests by default run in headless mode, where there
//  is no need to state headless ='true' as you can ommit /comment out this line.)

// Now, when giving the playwright command without specifying a configuration file, then 
// the default one (playwright.config.js) will be used.
// unless, you state: npx playwright test --config (Pass the name of the other configuration file)

// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const Config = ({
  testDir: './tests',

  //https://playwright.dev/docs/test-timeouts
  timeout: 30 * 1000,   // for every step. 
  //Equivalent to implicit & explicit wait in selenium [for a locator to be found in the list of HTML mark-ups
  // regardless whether its associated element in the UI is loaded or not 
  expect: {
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 15*1000, // 5 seconds
  },
  reporter: 'html', // 'html' is the default one.


  use: {
     browserName: 'webkit', // 'chromium' or 'webkit' or() 'firefox not responding to microphone pop up-if fixed then 
                              // all testcases pass)
     

                            // 'chromium' to launch chrome browser.
                            // 'webkit' to launch safari browser. 
                             
    headless: true,   // true or false. true means run in headless mode (no UI). false means run in headed mode (with UI).
    
    screenshot: 'on', 
    video: 'retain-on-failure',
    // 'on' it captures a screenshot of every step/action that's performed (Too much ! but sometimes it's asked for)
    trace: 'off', // 'on' so you get detailed report for each automation step you're performing.
                               // 'on' eats up your memory (detailed explanation will be encountered below) 
                               // 'retain-on-failure'
    ...devices['iPhone 12']    // the 3 dots denotes array of devices
  },

  
});
export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
});
module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)