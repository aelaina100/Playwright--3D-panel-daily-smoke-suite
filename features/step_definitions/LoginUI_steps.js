const { Given, When, Then } = require('@cucumber/cucumber')
const {POManager} = require('../../pageobjects/POManager'); // updated path (added aditional ../)
const {expect} = require('@playwright/test'); // in cucumber, importing 'playwright' keyboard
const playwright = require('@playwright/test');
const urldataset = JSON.parse(JSON.stringify(require("../../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../../utils/loggingTestDataPanelNum.json")));                                                                    // so that 'page' object comes from there.

/*

test('@Smoke Verify the URL loads the expected Cinco URL successfully' , async ({ page }) => { 

  const expectedPageTitle= "Cinco AI Experience R3g";   //XSPACE R3a  //Cinco AI Experience R3g
  const expectedFinalUrl = "https://cinco.dev.xspace.domains/intro"; // hardcoded cuz in variable page url may set to = https://cinco.dev.xspace.domains (minus"/intro")
   //Check that the page loads without any HTTP errors (status code 200 OK):
  const response=   await page.goto(urldataset.URL);   // Still lauches the app in browser.
======
  expect.soft(response.status(), "Expecting page loads without any HTTP errors (status code is 200 OK) ").toBe(200); 
  ======
  //Checking the title of the page:
  await expect.soft(page, "Expecting page title to be: " + expectedPageTitle).toHaveTitle(expectedPageTitle);  //Auto-retrying assertion
  ================
  // Checking the page isn't re-directed to some unexpected webpage:
  expect.soft(page.url(),"Verify that the page stays on the expected URL without any unexpected redirects").toBe(expectedFinalUrl);
 await page.close(); 
});   

*/

  Given('the app URL is launched',  { timeout: 100*1000 }, async function()  { // specify a time out as the default one in cucum. is 5 sec.
    // Write code here that turns the phrase above into concrete actions
    const browser= await  playwright.chromium.launch({headless:false}); // headless is the default run mode.
    const context= await browser.newContext();
    const page=    await context.newPage(); 

    const expectedPageTitle= "Cinco AI Experience R3g";   //XSPACE R3a  //Cinco AI Experience R3g
    const expectedFinalUrl = "https://cinco.dev.xspace.domains/intro"; // hardcoded cuz in variable page url may set to = https://cinco.dev.xspace.domains (minus"/intro")
     //Check that the page loads without any HTTP errors (status code 200 OK):
     this.page = page; // Save page in world context if needed later
     this.response = await page.goto(urldataset.URL); // Save response for reuse
    //exit // A cucumber keyword . Include it so that the browser is closed
  });


  When('the app page is loading', function () {
    // Write code here that turns the phrase above into concrete actions
    this.value_response_status= this.response.status();
  });


  Then('the HTTP status code should be {int}', function (expectedStatusCode) {
  // Then('the HTTP status code should be {float}', function (float) {
    // Write code here that turns the phrase above into concrete actions
    expect.soft(this.value_response_status, "Expecting page loads without any HTTP errors (status code is 200 OK) ").toBe(expectedStatusCode);
  });


  When('checking the title of the page', function () {
    // Write code here that turns the phrase above into concrete actions
    this.expectedPageTitle= "Cinco AI Experience R3gn";   //XSPACE R3a  //Cinco AI Experience R3g
  });



  Then('the title should match the expected value', function () {
    // Write code here that turns the phrase above into concrete actions
     expect.soft(this.page, "Expecting page title to be: " + this.expectedPageTitle).toHaveTitle(this.expectedPageTitle);  //Auto-retrying assertion
  });

/*

  When('checking the URL of the app', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });



  Then('the URL should be correct with no unexpected redirects', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });
  */