const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

test('Assignment: Displaying the text of all product', async ({ page }) => {

    const boxElements_products= page.locator("h5 b");
    await page.goto('https://rahulshettyacademy.com/client/');

    //Identify User Name field and input a username:
    await page.locator('input#userEmail').fill('aelaina100@gmail.com');
    //Identify password field and input a password:
    await page.locator('input#userPassword').fill('Ugoplb77');
    //Identify the login button and click on it:
    await page.locator('input#login').click();
    // Now- wait until all API calls are successfully made. So that all data of the json reponses have their
    // are completly reflected and loaded on the current webpage.

        //In our specific case, it means that all texts are now successfully loaded inside 
        // the box elements that host them
    await page.waitForLoadState('networkidle');
    // why was the above line needed ?: somewhere below, there is a method(s) that Playwright
    // has NOT provided a synchronization ('time-out' in Playwright langauge) for as evident
    // from the single webpage of [https://playwright.dev/docs/actionability] 

   //From the dashboard, display the text of the first product:
   console.log (await boxElements_products.nth(0).textContent());
   //Synchronization for identifying a locator is provided by default by Playwright and overriden in the
   // configuration file. 
   // However; synchronization 'time-out' for the method of .textContent() can NOT be found
   // in  [https://playwright.dev/docs/actionability] == 'time-out' is NOT provided.
   // meaning, the product's name could be returned as null.
        // Just because a box element (That holds a specific text) can be identified at some point,
        // it does not mean that the text it holds has already been loaded !
          // HENCE the line of:   await page.waitForLoadState('networkidle');  above !

     // and once gain: Playwright stores all the elements associated with one locator into an array. In here,
        // 'boxElements_products' is the array, that's why we can access the 1st element inside it using
        // the method of .nth(0)


    // Display the texts of all of the displayed products:
    const textssOfAllProducts= await boxElements_products.allTextContents();
    console.log(textssOfAllProducts);
     // allTextContent() is NOT provided with 'time-out' by Playwright accoring to:
     // [https://playwright.dev/docs/actionability]
     // HENCE the line of:   await page.waitForLoadState('networkidle');  above !

 // CRUCIAL: According to Playwright documentation (As of now, March 30th,2025),
 // https://playwright.dev/docs/api/class-frame#frame-wait-for-load-state
 //" 'networkidle' - DISCOURAGED wait until there are no network connections for at least 500 ms. 
 // Don't use this method for testing, rely on web assertions to assess readiness instead."

 // Now the instructor 'resolved' this issue by using a method called:  .waitFor() as in:

 // await boxElements_products.nth(0).waitFor(); [// by the way: it can only apply to a single element]
 // BUT WHAT'S THE POINT OF IT, when Playwright already waits (as specified in the config. file) for
 // boxElements_products ( page.locator("h5 b");) element to be identified within the period we specified
 //  before throwing 'element not found exception' ?

 //I'd say, simply use the 'expect' assertion that has a synchronization provided for as evident
 // in the configuration file where I specified that.

});