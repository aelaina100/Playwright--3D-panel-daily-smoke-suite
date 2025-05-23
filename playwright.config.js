
// @ts-check
import { defineConfig, devices } from '@playwright/test';
/**
 * @see https://playwright.dev/docs/test-configuration
 */
const Config = ({
  testDir: './tests',
   retries:2, // if retries:2 means failed test will run again for 2 times. If it passes on the 1st re-run, then it won't execute one more time.Report only shows such testcase
  // as 'passed' if it passes after initially failing.

  //https://playwright.dev/docs/test-timeouts
  timeout: 33 * 1000,   // for every step. 
  //Equivalent to implicit & explicit wait in selenium [for a locator to be found in the list of HTML mark-ups
  // regardless whether its associated element in the UI is loaded or not 
  expect: {
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 10 * 1000, // 5 seconds
  },


  reporter: 'html', // 'html' is the default one. This is the plain by-default playwright reporter
  // that's accessible via: Expand 'playwright-report' > index.html (right-click
  // on it & copy path, then paste in into a webpage)


  //Cross browser testing approach:
  projects: [ // One can specify, in the command line, which browser to run the scripts on
    // Example:  npx playwright test --config=playwright.config1.js --project="Safari Execution"
    // if --project is not specified, then tests will run on ALL browsers!

    {
      name: 'Chrome execution',
      use: {
        browserName: 'chromium',    // 'chromium', 'firefox'= responding to microphone pop up-if fixed then 
        // all testcases pass)       // 'webkit'  
        headless: true,    // Playwright, by default, runs in headless mode (=true)
        screenshot: 'only-on-failure',   // ''only-on-failure','off'
        video: 'retain-on-failure', // 'retain-on-failure' 'on-first-retry' -Recording a video only when re-trying a test for the first time.
        ignoreHttpsErrors: true,  // automatically accepting SSL certifications (check info @ the bottom)
        permissions: ['geolocation'],  // see if these two lines can supercede the geo() in the PO file
        trace: 'off', //to enable video recording on failure
        //viewport: {width:720, height:720} // lanunching browser in certain dimensions (minimized if you
        // want). If viewport is not provided then browser runs in the default-sized mode.
        // This is especially useful for web responsivity testing = to see if elements are fitting
        // properly or not in the page of certain dimensions = is the website mobile friendly /respon
        // or not ?= done by emulating the dimensions of a certain device's  iphone/Android/iPad, etc browser.

        //BUT if you want to target the browser's specific dimensions of a specific device: Example iphone 12,
        // then do this: as illustrated in the other browser type below:
      }
    },
    /*
    {
     name: 'Safari Execution',   // not launching in full screen ?
     use: {
               browserName: 'firefox',
               headless: false, 
               screenshot: 'on',
          },
     },
     */

    /*
    {
    name: 'Emulator-iPhone 12: Safari Execution',  
     use: {
            browserName: 'webkit',
            headless: false, 
            screenshot: 'on',
            trace: 'off',
            ...devices['iPhone 12']    // the 3 dots denotes array of devices
        }

    },
    */

  ]

});

export default defineConfig({
  reporter: [  //This reporter is that of Slack
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
});
module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)

//SSL certification: sometime if the website is not SSL certified, then you may get an error on the screen.
// where you have to click on 'advanced' and then accept it. Now, playwright can handle that by
// simply & quickly including the line of: ignoreHttpsErrors:true,

// and there is another thing of pop-up where for example, google wants to know your location (Allow or not):
// for that, include   permissions:['geolocation']