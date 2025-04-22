// playwright.config.js  is the one default configuration file (Test runner) that was created when the
// project was created !

//However, one can still create more configuration files, and instruct playwright to 
// pick that specific one with each run, instead of the default one.

// below is the same exact default configuration file but with the following chamges:
// 1- browserName= 'webkit'
// 2- headless= 'true' (In playwright, tests by default run in headless mode, where there
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
  timeout: 33 * 1000,   // for every step. 
  //Equivalent to implicit & explicit wait in selenium [for a locator to be found in the list of HTML mark-ups
  // regardless whether its associated element in the UI is loaded or not 
  expect: {
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 15*1000, // 5 seconds
  },


  reporter: 'html', // 'html' is the default one.

  //Cross browser testing approach:
  projects: [ // One can specify, in the command line, which browser to run the scripts on
              // Example:  npx playwright test --config=playwright.config1.js --project="Safari Execution"
              // if --project is not specified, then tests will run on ALL browsers!

     {
        name: 'Chrome execution',
        use: {
                browserName: 'chrome',               
                headless: false,    
                screenshot: 'on', 
                video:'retain-on-failue',
                ignoreHttpsErrors:true,  // aitomatically accepting SSL certifications (check info @ the bottom)
                permissions:['geolocation'],  // see if these two lines can supercede the geo() in the PO file
                trace: 'off', 
                viewport: {width:720, height:720} // lanunching browser in certain dimensions (minimized if you
                // want). If viewport is not provided then browser runs in the default-sized mode.
                // This is especially useful for web responsivity testing = to see if elements are fitting
                // properly or not in the page of certain dimensions = is the website mobile friendly /responsive
                // or not ?= done by emulating the dimensions of a certain device's  iphone/Android/iPad, etc browser.

                //BUT if you want to target the browser's specific dimensions of a specific device: Example iphone 12,
                // then do this: as illustrated in the other browser type below:
             }
     },
 
        {
        name: 'Safari Execution',
         use: {
                browserName: 'webkit',
                headless: false, 
                screenshot: 'on',
                trace: 'off',
                ...devices['iPhone 12']    // the 3 dots denotes array of devices
            }

        },
        
        {
        name: 'bbbbbb',
        use: {
                  browserName: 'webkit',
                  headless: false, 
                  screenshot: 'onoff',
             },
        },
     ]
 
});

module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)

//SSL certification: sometime if the website is not SSL certified, then you may get an error on the screen.
// where you have to click on 'advanced' and then accept it. Now, playwright can handle that by
// simply & quickly including the line of: ignoreHttpsErrors:true,

    // and there is another thing of pop-up where for example, google wants to know your location (Allow or not):
    // for that, include   permissions:['geolocation']