const { test, expect, request } = require('@playwright/test');
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const { POManager } = require('../pageobjects/POManager');
const { LoginPage } = require('../pageobjects/LoginPage');
const { Console } = require('console');
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));

test('@Maintenace Smoke Verify that the enter app button becomes visible', async ({ page }) => {
const poManager = new POManager(page);
const loginPage = poManager.getLoginPage();
await test.step("Navigating to the application URL: " + urldataset.URL, async () => {
await page.goto(urldataset.URL); });

// Below- As per the new design, the ENTER button will not be visible until user gives a concent for cookie tracking by Cinco.
  //  Cookie tracking is a new feature that was added to the application.
  // it is a pop-up that shortly appears after the application is launched (Will always appear for the automation script, since each test is launched on a fresh browser context)
  // Get this HTML popup when it opens up:

  await test.step("Waiting for the cookie consent modal to appear", async () => {
  await page.locator("div[class*= 'DialogModal-sc']").waitFor({ state: 'visible' }); 
  });// change to getByRole('dialog') if possible
 
  await test.step("Clicking the Accept button in the cookie modal", async () => {
  await page.locator("div[class*= 'DialogModal-sc'] button[class*= 'StyledButton-sc']").nth(1).click(); // instead .getByRole('button', { name: /accept/i }).  if possible
  });

await expect(loginPage.enterButton, `Expecting the ${loginPage.accessButtonText} button is visible to user`).toBeVisible(); 
//try byText locator to bulletproof the test // Then,insignify the case sensitivity of the text & any space(s) in the text 
// and make the expect msg, have a global variable IN PAGE OBJECT referencing 'ENTER' text.
await test.step("Closing the application page", async () => {
await page.close(); });
});