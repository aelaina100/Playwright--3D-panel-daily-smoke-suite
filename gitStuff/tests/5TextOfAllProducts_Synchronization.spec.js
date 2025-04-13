const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

test('Displaying the text of all products', async ({ page }) => {

  const boxElements_products= page.locator("h4 a"); // locator shared between more than one element on the web page.

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  //identify username field and enter username:
   await  page.locator('input#username').fill('rahulshettyacademy');
  // identify password field and enter password:")
  await page.locator('#password').fill('learning');
  // click on the 'sign in' button
  await page.locator('#signInBtn').click();
 
  //Grab the title of the first product present in the dashboard:
   console.log(await  boxElements_products.nth(0).textContent()); // for the second element, use .nth(1)
   //or: Equally valid:
   //console.log(await page.locator("h4 a").first().textContent); // .last() method also exists
   // Playwright stores the elementS associated with one locator into an array.

   // for the above line: According to [https://playwright.dev/docs/actionability]
    // Playwright does NOT provide 'Auto-waiting' (Synchronization) for the methods of:
    // .textContent() & .allTextContents() & so many many more methods. This means that,
    // even though Playwright will wait (wait time specified in configuration file) for box elements 
    // "h4 a" to be identified before throwing an exception, there is no guarentee that these box elements
    // will by then have texts populated inside them (and once again playwright for these 2 specific methods
    // plus many many more does NOT provide a 'time-out'). this means that .textContent() & .allTextContents() , etc
    //can still return null.

      //and this is an IMPORTANT note: Earlier, a time-out was provided for .textContent() 
        //meaning, if this method returns 'null', PlayWright will wait (wait specified in configuratio
        // file) until a value instead of null in populated. However, .textContent() (as of now) does NOT
        // have a 'time-out' provided for it by Playwright [it has been removed from the list as shown
        //in: https://playwright.dev/docs/actionability]

   // to do: solve this synchronization issue for the above line, below displaying line, and the assertio line

  // display the texts of all products:
  console.log(" Displaying the textS of all the displayed products: ");
  console.log( await boxElements_products.allTextContents());

  // But in real-time, we need to user assertions:
   //await expect(elementsInsideArray.allTextContents()).toContain('iphone X', 'Samsung Note 8', 'Nokia Edge', 'Blackberry');
   // but the above line is bs: because actual text(s) could still be null(s)
     // make the assertion to not contain null..
   


});