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
test(`🚬@Smoke Validating: [Case Studies] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['Automotive & Transportation', 'Beauty, Fashion & Culture', 'Retail & Consumer Goods', 'Sports & Entertainment', 'Innovation & Technology'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [Cinco AI Experience] panel", async () => { // reference ENTER globally //instead say "trying to access"
  await loginPage.LaunchURLAndClickOn3DPanel("panel_5"); // this is the new method to be used.
  });
  

  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  actual_subTopicCount = await page.locator("span[class*= 'Title-sc']").count();
  await expect.soft(actual_subTopicCount).toBe(expected_count_subTopics);
  });

const feedCloseButton= await page.locator("button[aria-label= 'Close']");
for (let i = 0; i < actual_subTopicCount; i++) { //https://github.com/copilot/share/027451a4-02a4-80c5-b842-904380b10867

   
  await test.step(`Clicking on the sub-topic of: ${expected_feedPageTitles[i]}`, async () => {
  await expect.soft(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting the sub-topic to be visible before clicking`
  ).toBeVisible();

  await expect.soft(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting sub-topic to be enabled/clickable before actually clicking`
  ).toBeEnabled();

  await loginPage.subTopicTextBox.nth(i).click(); // Clicking on the sub-topic
  await page.waitForTimeout(2000); // Hard wait for stability (OK if needed)
});
    await expect.soft(
      loginPage.feedPageTitleBox.filter(
      { hasText: expected_feedPageTitles[i] }),
      "Expecting feedpage number: " + (i + 1) + " to have the title: " + expected_feedPageTitles[i]
    ).toBeVisible(); //unique locator & doesn't exist on the original sub-topic page.

    await test.step("Trying to click on the X close button of the feed page" , async () => { // or "Creating a new isolated environment for the test"
    await expect(feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect(feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await feedCloseButton.click();  //close the feed page // unique locator
    });
    await expect(feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); // make it a hard assertions.
} // for-loop enclosing bracket.

    await test.step("Closing the application page", async () => {
    await page.close();
  });
});

