const { test, expect, request } = require('@playwright/test');
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
//test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const { POManager } = require('../pageobjects/POManager');
const { LoginPage } = require('../pageobjects/LoginPage');
const { Console } = require('console');
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));


//Below- test cases to feed pages are accessible to user
test(`🚬@Smoke Feed Page Accessibility – [AN INTRO TO CINCO], loads successfully`, async ({ browser }) => {

  let context, page, loginPage;
  const expected_firstPanel_feedPageTitles= ['20+ Years of Brand Experiences', 'Why Choose Cinco', 'What Makes Us Different'];

  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the sub-topics of the first panel", async () => { // reference ENTER globally //instead say "trying to access"
  await loginPage.LaunchURLAndClickOn3DPanel("panel_1"); // this is the new method to be used.
  });
  
  
  const subTopicCount = await page.locator("span[class*= 'Title-sc']").count(); 
  // for debugging purposs- checing the number of sub-topics and their titles should be a validation step beloging to the data providee testcase
  console.log(`The number of sub-topics displayed inside the panel is: ${subTopicCount}`);
  

for (let i = 0; i < subTopicCount; i++) { //https://github.com/copilot/share/027451a4-02a4-80c5-b842-904380b10867
   
    await page.locator("span[class*= 'Title-sc']").nth(i).click(); //clicking on the sub-topic. Assuming that all the sub-topics are clickable.
    //-await page.waitForTimeout(2000); // seems to fix it !
  
    await expect(page.locator("div[class*='BrandingContainer'] span[class*='StyledTypography']", { hasText: expected_firstPanel_feedPageTitles[i] })).toBeVisible(); //unique locator & doesn't exist on the original sub-topic page.

    await test.step("Trying to click on the X close button of the feed page" , async () => { // or "Creating a new isolated environment for the test"
    await expect(page.locator("button[aria-label= 'Close']"), "Expecting the X button to be visible").toBeVisible();
    await expect(page.locator("button[aria-label= 'Close']"), "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await page.locator("button[aria-label= 'Close']").click();  //close the feed page // unique locator
    });
    await expect(page.locator("button[aria-label= 'Close']"), "Checking if the feed page can be closed after clicking on its close (X) button").not.toBeAttached(); // make it a hard assertions 


    // Note the below suggestion will throw an error since the element won't be attached to the DOM anymore when clicking on X.(similar case to .isDisplayed() in Selenium)
   // await expect.soft(page.locator("button[aria-label= 'Close']"), "Expecting X of the feed page #" + (i+1)+ " to be hidden = feed page closed").toBeHidden(); //unique locator
}  //or better:
/*await expect(
      page.locator("div[class*='BrandingContainer'] span[class*='StyledTypography']", { hasText: expected_firstPanel_feedPageTitles[i] })
    ).toBeHidden();
    */

});

// context.close() vs page.close() - context.close() will close all the pages in the context, while page.close() will only close the specific page.

