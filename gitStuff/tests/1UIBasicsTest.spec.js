const {test} = require('@playwright/test'); // what instructor has been using
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

// In playwright, a testcase is equivalent to:  @Test + below it, another method (in selenium).
test('First Playwright test', async ({browser})=> // curly brackets around 'browser' mean that
{                                                 // 'browser' is a playwright fixture. So without them
                                                  // 'browser' is just some variable name.
                                                // also, fixtures are global variable across the project.

 const context= await browser.newContext(); // newContext() means a fresh instance of the browser (Just like incognito mode)
  // without pluggins (Example: favourites, ad blockers, cookies (cookie in browser means you'rlogged in already
  // without having to enter username and password again))
  
  //It also means: Start this fresh instance with some fixed properties (ex: start with an injected cookie otherwise
  // app won't run. or with an inject proxy , where without it app won't launch.)
  // so whatever you want to inject has to be sent as a parameter of newContext(), so that playwright prepares a 
  // new browser with that info plugged in

  //Now, what type of browser you want to launch? (chrome, firefox, safari, etc.)
  // we specify this in the playwright.config.js file. (see above).
  // Now, the above line is going to only launch the browser/ open an instance of the browser (No url is entered)

const page= await context.newPage(); //creates an actual page in the browser where a url will be entered and automation
//is performed on.  
await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  });

  // 2nd test below same as above (Preferred way of writing in real-time as the code is optimized)

  test('Write it this way in real-time', async ({page})=> // test.only // to run only this test case.
  // test.skip // to skip this test case. (test.skip('test name', async ({page})=> {})
{   
  // the fixture is 'page' instead of 'browser' (as above). Plus comment out the below 2 lines:

 //const context= await browser.newContext() 
 //const page= await context.newPage() 

 // so the above 2 lines could be ommitted.  Becasue they reflect a default mode where:
 // 1- Start a fresh instant with no pluggin = as if it's in-cognito.
 // 2- create an actual page in the browser where a url will be entered and automation is performed on.

await page.goto('https://www.google.ca/');

  });

  //To run these test cases, in the 'Terminal' tab, type:
// npx playwright (points to the playwright module in node_modules package in project skeleton) test (triggers the playwright.config.js file)

//In Playwright, tests in a single .js file run sequentially (one after another). However;
// .js files run in parallel (simultaneously).

//Crucial: In Playwright, tests run in headless mode by default.
// To run in head mode: There are two ways to do this:
// 1- In the terminal, run the following command:  npx playwright test --headed
// 
// 2- In the playwright.config.js file, under 'use' key, add the following line: headless: false
// [headless: false, // true or false. true means run in headless mode (no UI). false means run in headed mode (with UI).]

