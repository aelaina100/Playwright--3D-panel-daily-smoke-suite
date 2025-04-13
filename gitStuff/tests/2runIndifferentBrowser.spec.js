const {test,expect} = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

test('Test:different browsers plus assertions', async ({page})=> 
{
await page.goto('https://www.google.ca/');
console.log(await page.title());
// Now, In Selenium there are TestNG assertions (assertions that come with the TerstNG library). However;
// In Playwright, there are built-in assertions (assertions that come with the playwright library).
//   We call them 'expect' assertions. 
await expect(page).toHaveTitle("google"); 
// once again- manually add 'expect' keyword as in: const {test,expect} = require('@playwright/test');
// in order to import its package(library).

//Now, to run in different browsers, we can use the 'browserName' property in the playwright.config.js file.
// so do it.
});