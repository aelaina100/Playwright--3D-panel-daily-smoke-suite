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
test('🚬@Smoke Validating the Entry screen of the cinco app', async ({ page }) => {
  let response;
  const expectedPageTitle = "Cinco AI Experience R3g";  // should come from a data file.
  await test.step("Navigating to the application URL: " + urldataset.URL, async () => {
    response = await page.goto(urldataset.URL);
  });  // Still lauches the app in browser (unless headless is set to true).
  await expect.soft(response.status(), "Verifying that the server responded with HTTP status code 200 OK").toBe(200);
  await expect.soft(page, `Verifying that the page title matches: "${expectedPageTitle}"`).toHaveTitle(expectedPageTitle);//Auto-retrying assertion
  await expect.soft(page, `Ensuring the page remains on the expected URL: "${urldataset.URL}" with no unexpected redirects`).toHaveURL(urldataset.URL);
  await test.step("Closing the application page", async () => {
  await page.close();
  });
});

//working on it 
test(`🚬@Smoke Verify that the 'Enter' App button appears and is visible to the user.`, async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await test.step("Navigating to the application URL: " + urldataset.URL, async () => {
  await page.goto(urldataset.URL);
  });

  await test.step("Accepting the cookie banner", async () => {
  await loginPage.acceptCookiePopup();
  });
  await loginPage.slowNetworkPopUp();
  await expect.soft(loginPage.enterButton, `Expecting the ${loginPage.accessButtonText} button to be visible to user`).toBeVisible();
  await test.step("Closing the application page", async () => {
  await page.close();
  });
});



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


const panelNames = [
  "An Intro to Cinco",
  "Cinco’s XM Solutions",
  "Cinco AI Experience",
  " How We Work",
  "Case Studies"
];
for (const data of panelNumbersdataset) {  
  test(`🚬@Smoke Verify that ${data.panelnumb} [${panelNames[data.index]}] is accessible and loads correctly for users`, async ({ browser }) => {
    let context, page, loginPage;
    await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
      ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
    });

    await test.step("Navigating to the application URL: " + urldataset.URL + " and accessing the 6-panel application interface", async () => { // reference ENTER globally
      await loginPage.launchAppAndAccessPanelPage();
    });
    //Landing on the 6-panel page
    await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible();
    // Clicking on panel # 

    await test.step(`Clicking on [${panelNames[data.index]}] 3D panel`, async () => {
      await loginPage.ClickOn3DPanelNumber(data.panelnumb);
    });

    //Validating the title of the sub- topic:
    await expect.soft(page.getByText(panelNames[data.index]),
      "Expecting the panel: [" + panelNames[data.index] + "] to have accessible sub topic page with the visible title of: [" + panelNames[data.index] + "]")
      .toBeVisible();

    //Validating the number of the feed items in the sub-topic page:
    await test.step("Closing the application page", async () => {
      await page.close();
    });

  });
}

test('🚬@Smoke Verify that the "LET US CONNECT" panel is visible and fully loaded', async ({ browser }) => {

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });

  await test.step("Navigating to the application URL: " + urldataset.URL + " and accessing the 6-panel application interface", async () => { // reference ENTER globally
    await loginPage.launchAppAndAccessPanelPage();
  });
  //Landing on the 6-panel page
  await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat icon to be visible to users").toBeVisible();

  //Clicking on the panel 'LET'S CONNECT'
  await test.step(`Clicking on [LET'S CONNECT] 3D panel`, async () => {
    await page.evaluate(() => {
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_6");
    })
  });
  // Validating in [LET'S CONNECT] pannel in the following ways:
  //Validating the title of the form 'BOOK A MEETING' is visible to user
  await expect.soft(page.getByText("Book a meeting").nth(1), "Expecting the title of the form [BOOK A MEETING] to be displayed on the form").toBeVisible();

  //Verify that the 'First, Last Name' edit box is editable (allows user input)
  await test.step(`Validating: 'First/Last Name' field is both visible & editable (Allows user input)`, async () => {
  await expect.soft(loginPage.formNameField, "Expecting the name field to be visible").toBeVisible();
  await expect.soft(loginPage.formNameField, "Expecting the name field to be editable (Can be typed in)").toBeEditable();
  });

  // verify that the 'Email' field is editable
  await test.step(`Validating: Email field is both visible & editable (Allows user input)`, async () => {
  await expect.soft(loginPage.formEmailField, "Expecting the Email field to be visible").toBeVisible();
  await expect.soft(loginPage.formEmailField, "Expecting the Email field to be editable (Can be typed in").toBeEditable();
  });

  // verify that the 'Message' field is editable
  await test.step(`Validating: Message field is both visible & editable (Allows user input)`, async () => {
  await expect.soft(loginPage.formMessageField, "Expecting the Message field to be visible").toBeVisible();
  await expect.soft(loginPage.formMessageField, "Expecting the Message field to be editable (Can be typed in").toBeEditable();
  });
  //Verify the form 'SUBMIT' button is enabled(clickable):
  await test.step(`Validating: The Submit button is noth visible & clickable`, async () => {
  await expect.soft(loginPage.formSubmitButton, "Expecting the submit button to be visible").toBeVisible();
  await expect.soft(loginPage.formSubmitButton, "Expecting the submit button to be enabled (clickable)").toBeEnabled();
  });

  await test.step("Closing the application page", async () => {
  await page.close();
  });
});

//Below- test cases to feed pages are accessible to user
test(`🚬@Smoke Validating: [AN INTRO TO CINCO] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['20+ Years of Brand Experiences', 'Why Choose Cinco', 'What Makes Us Different'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [AN INTRO TO CINCO] panel", async () => { 
  await loginPage.LaunchURLAndClickOn3DPanel("panel_1"); 
  });
  

  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  actual_subTopicCount = await page.locator("span[class*= 'Title-sc']").count();
  await expect.soft(actual_subTopicCount).toBe(expected_count_subTopics);
  });

const feedCloseButton= await page.locator("button[aria-label= 'Close']");
for (let i = 0; i < actual_subTopicCount; i++) { 

   
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
    await expect.soft(feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect.soft(feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await feedCloseButton.click();  //close the feed page // unique locator
    });
    await expect.soft(feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); // make it a hard assertions.
} // for-loop enclosing bracket.
    await test.step("Closing the application page", async () => {
    await page.close();
  });
});

test(`🚬@Smoke Validating: [Cinco’s XM Solutions] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['Brand Activations', 'Strategic Sponsorships', 'XM Digital Services'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [Cinco's XM Solutions] panel", async () => { 
  await loginPage.LaunchURLAndClickOn3DPanel("panel_2");
  });
  

  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  actual_subTopicCount = await page.locator("span[class*= 'Title-sc']").count();
  await expect.soft(actual_subTopicCount).toBe(expected_count_subTopics);
  });

const feedCloseButton= await page.locator("button[aria-label= 'Close']");
for (let i = 0; i < actual_subTopicCount; i++) { 

   
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
    await expect.soft(feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect.soft(feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await feedCloseButton.click();  //close the feed page // unique locator
    });
    await expect.soft(feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); // make it a hard assertions.
} // for-loop enclosing bracket.
    await test.step("Closing the application page", async () => {
    await page.close();
  });
});


test(`🚬@Smoke Validating: [Cinco AI Experience] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['Platform Features', 'Seamless Access', 'Advanced Analytics', 'Use Cases'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [Cinco AI Experience] panel", async () => { // reference ENTER globally //instead say "trying to access"
  await loginPage.LaunchURLAndClickOn3DPanel("panel_3"); // this is the new method to be used.
  });
  

  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  actual_subTopicCount = await page.locator("span[class*= 'Title-sc']").count();
  await expect.soft(actual_subTopicCount).toBe(expected_count_subTopics);
  });

const feedCloseButton= await page.locator("button[aria-label= 'Close']");
for (let i = 0; i < actual_subTopicCount; i++) { 

   
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
    await expect.soft( ////////*////
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


test('🚬@Smoke Verify the accessibility of the feed pages for [How We Work] to users', async ({ browser }) => {

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });

  await test.step("Accessing the sub-topic page of the [HOW WE WORK] panel", async () => { // reference ENTER globally
    await loginPage.LaunchURLAndClickOn3DPanel("panel_4"); // this is the new method to be used.
  });

  //In the sub topic page, validate the text of the images (unclickable- merly titles) is visible to users:
  // const boxElements = await page.locator("span[class*='Title']");

  const expectedTitles = [
    "Our Proven Methodology",
    "From Creative Ideas to Flawless Execution"];

  for (let i = 0; i < expectedTitles.length; i++) {
    await expect.soft(page.getByText(expectedTitles[i]), "Expecting the text [" + expectedTitles[i] + "] to be visible to users on the web page").toBeVisible();
  }
   await test.step("Closing the application page", async () => {
    await page.close();
  });
});

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
for (let i = 0; i < actual_subTopicCount; i++) { 

   
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
    await expect.soft(feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect.soft(feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await feedCloseButton.click();  //close the feed page // unique locator
    });
    await expect.soft(feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); // make it a hard assertions.
} // for-loop enclosing bracket.

    await test.step("Closing the application page", async () => {
    await page.close();
  });
});



















