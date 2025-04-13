const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

test('Displaying the text of one product', async ({ page }) => {

  const userNameElement= page.locator('input#username'); //'await' only required when you're performing an action on the element.
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  //identify username field and enter username:
  await userNameElement.fill('aelaina@');
  await page.waitForTimeout(2000);  // freeze the compiler, to view the execution slowly
 //identify username field and clearing it:
  await userNameElement.fill("");
   //identify username field and enter a new username:
   await userNameElement.fill('rahulshettyacademy');
  // identify password field and enter password:")
  await page.locator('#password').fill('learning');
  // click on the 'sign in' button
  await page.locator('#signInBtn').click();
  //Grab the title of the first product present in the dashboard:
   console.log(await page.locator("h4 a").nth(0).textContent()); // for the second element, use .nth(1)
   //or: Equally valid:
   //console.log(await page.locator("h4 a").first().textContent); // .last() method also exists
   // Playwright stores the elements associated with one locator into an array.

   //Very important: a method to get all the texts in that array does exist in Playwright:
    // .allTextContents()
});