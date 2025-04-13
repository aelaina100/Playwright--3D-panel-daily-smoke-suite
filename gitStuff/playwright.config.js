// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const Config = ({
  testDir: './tests',

  //https://playwright.dev/docs/test-timeouts
  timeout: 30 * 1000,   // for every step. Equivalent to implicit & explicit wait in selenium [for an element to be identified] (//40s)
  expect: { // applies to the 'expect' list available here: https://playwright.dev/docs/actionability#assertions
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 5*1000, // 5 seconds
  },
  reporter: 'html', // 'html' is the default one.


  use: {
     browserName: 'chromium', // 'chromium' or 'webkit' or 'firefox'all' (all 3 browsers).

                            // instructor used 'chromium' to launch chrome browser.
                            // instructor used 'webkit' to launch safari browser. 
                            //headless: false, // true or false. true means run in headless mode (no UI). false means run in headed mode (with UI).
    headless: false,
    // true means run in headless mode (no UI). false means run in headed mode (with UI).
    screenshot: 'on', // 'on' it captures a screenshot of every step/action that's performed (Too much ! but sometimes it's asked for)
    trace: 'retain-on-failure', // 'on' so you get detailed report for each automation step you're performing.
               // 'on' eats up your memory (detailed explanation will be encountered below)
 // 'trace' is what happens on each step execution with complete log. 
    // 'trace' gives some log information which might help you to debug if something goes wrong.
    // so you can read the trace logs and understand what's really breaking the test.
    // 'traces' is how you address the falkiness and fix it !

     // Now, the above 2 lines of 'screenshot' and 'trace' have been added. So, in order to see
     // their reporting effect- simply run ALL the tests in this project by doing 2 things:
     // 1- get rid of ".only" attached to any test.   2- run the command: npx playwright test
            //The result is that: two folders are created in the Plawright project:

            //***** 1- The folder of: 'playwright-report' - has 'index.html' file inside it.
               // right-click on 'index.html' file > 'Copy Path' > paste it in the browser.
               // & notice that it's exactly the same file that was generated and automatically opened
               // after the end of the execution. all automatically as usual.
               // and now click on the displayed failed testcases where it gives a detailed report 
               // for why a single error occurred. PLUS gives info on ALL steps passed or failed
               // including the duration of each step (This is how you know which step is taking too long).
               // now ALL steps are provided with screeshots.

          
            // Now, Every single test will have a 'tracer' ! (This is where you adress flakiness and premanently fix it)
            // (In real-time one should only care about traces for FAILED tests) = common sense !
            // click on 'trace'.zip attached to every single test result:
                // 1- it will give you some instructions on how to view the traces:
                    // so go to trace.playwright.dev & drop the downloaded trace .zip file.
                    // THIS IS where not only you address errors but ALSO FIX FLAKINESS
                    // WHERE EVERY STEP YOU DID DOES COME WITH A SCREENSHOT.
                    // WITH THE IMPPRTANT TABS OF 'Action', 'before' & 'After'.
                    // and logs, to the right, that you need to read.
                    // and the displayed time of execution is of supreme importance.


          //***** 2- The folder of: 'Test-results':
            // Navigate to: trace.playwright.dev 
            // Under 'Test-results', you will see,listed, FOLDERS
            // Each testcase that has been executed with have its own folder with its name.
            // Each folder contains trace.zip (Another location to access traces).
            // Now, configure your Playwright so that ONLY when a testcase  if FAILED
            // then, it will have a trace generated for it. Otherside, Playwright will eat your
            // memory. SO  only set trace: 'retain-on-failure' 
            // instead of trace: 'on' = eats up your memory.

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
   //trace: 'on-first-retry', // 'on' or 'off' or 'retain-on-failure' or 'on-first-retry'.
   // 'on-first-retry' means: if the test fails, then it will collect trace for the 1st retry.
    // 'on' means: it will collect trace for all retries.
    // 'off' means: no trace collected.
    // 'retain-on-failure' means: it will collect trace only if the test fails.
    // 'on-first-retry' means: it will collect trace only if the test fails on the first retry.

    
  },

  
});

module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)