const { test, expect, request } = require('@playwright/test');
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
//test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const { POManager } = require('../pageobjects/POManager');
const { LoginPage } = require('../pageobjects/LoginPage');
const { Console } = require('console');
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));


test('🚬@Smoke Verify the accessibility of the feed pages for [Cinco’s XM Solutions] for users', async ({ browser }) => {

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });
  await test.step("Accessing the sub-topic page of the [Cinco’s XM Solutions] panel", async () => { // reference ENTER globally
  await loginPage.LaunchURLAndClickOn3DPanel("panel_2"); // this is the new method to be used.
  });
  await test.step("Clicking on the first displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(0).click(); // click on the first sub-topic.
    await page.waitForTimeout(2000); // to view in slow mode. remove it !
  });
  //Validating the title of the feed page is visible to user
  const title_feedPage1_panel2 = "Brand Activations";
  const container_feedPage1_panel2 = page.locator("div[class*= 'BrandingContainer'] span[class*= 'StyledTypography']");
  await expect.soft(container_feedPage1_panel2, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage1_panel2);
  await expect.soft(container_feedPage1_panel2, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  // Navigate back to the sub-topic page, in order to click on the 2nd sub-topic page:
  await test.step("Closing the feed page", async () => {
  await page.waitForTimeout(1000); 
  await page.locator("button[aria-label= 'Close']").click();//////////////////////////////////////////////////////////
  });
  await test.step("Clicking on the second displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(1).click(); // click on the second sub-topic.
  });
  const title_feedPage2_panel2 = "Strategic Sponsorships";
  const container_feedPage2_panel2 = page.locator("div[class*= 'BrandingContainer'] span[class*= 'StyledTypography']");
  await expect.soft(container_feedPage2_panel2, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage2_panel2);
  await expect.soft(container_feedPage2_panel2, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  // Navigate back to the sub-topic page, in order to click on the 2nd sub-topic page:
  await test.step("Closing the feed page", async () => {
   await page.waitForTimeout(1000); 
   await page.locator("button[aria-label= 'Close']").click();////////////////////////////////////////////////////////////
  });
  await test.step("Clicking on the third displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(2).click(); // click on the third sub-topic.
  });

  const title_feedPage3_panel2 = "XM Digital Services";
  const container_feedPage3_panel2 = page.locator("div[class*= 'BrandingContainer'] span[class*= 'StyledTypography']");
  await expect.soft(container_feedPage3_panel2, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage3_panel2);
  await expect.soft(container_feedPage3_panel2, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  //await page.waitForTimeout(2000);
  
  /*
  await test.step("Closing the feed page", async () => {
   await page.waitForTimeout(1000); 
   await page.locator("button[aria-label= 'Close']").click();////////////////////////////////////////////////////////////
  });
  */

  await test.step("Closing the application page", async () => {
  await page.waitForTimeout(2000); // to view in slow mode. remove it !
  await page.close(); });

});

