const { test, expect, request } = require('@playwright/test');
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
//test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const { POManager } = require('../pageobjects/POManager');
const { LoginPage } = require('../pageobjects/LoginPage');
const { Console, time } = require('console');
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));

/* 
For clarity:
Level 1 with the panels = Topic
Level 2 = Sub-Topic
Level 3 = Feed
Level 4 = Feed Item (ex.: video, single image or carrousel)
*/

test('🚬@Smoke Validating the 6-panel page', async ({ browser }) => {
  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });
  const PageTitle_6PanelPage = "Cinco AI Experience R3g";    // should come from a data file.
  const welcome_text = "Welcome! Speak up to start a conversation, swipe up to text, or swipe down to hide.";

  await test.step("Navigating to the application URL: [" + urldataset.URL + "] and accessing the 6-panel application interface", async () => { 
  await loginPage.launchAppAndAccessPanelPage();
  });
  // 1- Checking the page is actually directed to the url of the 6-panel page.
  await expect.soft(page, `Expecting the URL of the 6-panel page to be: "${urldataset.URL}"`).toHaveURL(urldataset.URL); //Auto-retrying assertion. // define each page URL ina resource file and compare. To do.
  //2- checking the title of the page:
  await expect.soft(page, "Expecting page title to be: " + PageTitle_6PanelPage).toHaveTitle(PageTitle_6PanelPage);  //Auto-retrying assertion
  // 3-that the 'Toggle Chat' button is visible.
  await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); // to know page is not brocken.
  console.log(await page.title);

  // verify that the welcome text is visible to user:
  await test.step("Verify that the welcome text is displayed on the 6-panel page", async () => {

    await expect.soft(
      loginPage.welcomeTextBox,
      "Welcome text box should be visible"
    ).toBeVisible();

    await expect.soft(
      loginPage.welcomeTextBox,
      "Welcome text should be present in the visible box"
    ).toContainText(welcome_text);
  });

  // Verify that the CINCO logo is visible !
  await expect.soft(loginPage.cincoLogoBox, "Verify CINCO logo is visible to user").toBeVisible();

  //Verify that the 'Start typing' edit box is editable (allows user input)
  await expect.soft(loginPage.editBox, "Expecting user can type in the edit box").toBeEditable(); 

  //Verify that 'BOOK A MEETING' button is visible to user:
  await test.step("Verify: [BOOK A MEETING] button is visible to user", async () => {
    await expect.soft(loginPage.bookingButton, "Expecting the button to be visible to user ").toBeVisible(); // verified !
    await expect.soft(loginPage.bookingButton, "Expecting the correct text to be present in the visible button").toContainText("Book a meeting");
  });

  await expect.soft(loginPage.bookingButton, "Expecting [BOOK A MEETING] button is clickable").toBeEnabled(); // verified !
  //await page.getByRole("button", {name: 'BOOK A MEETING'}).nth(0).click(); // and this is the evidence ! (Has to be commented out)
  //Verify the burger menu is enabled(clickable):
  await expect.soft(loginPage.burgerMenu, "Expecting that users can click on the burger menu").toBeEnabled();
  await test.step("Closing the application page", async () => {
    await page.close();
  });
});
