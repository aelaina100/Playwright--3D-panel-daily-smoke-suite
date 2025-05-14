const { test, expect, request } = require('@playwright/test');
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
//test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const { POManager } = require('../pageobjects/POManager');
const { LoginPage } = require('../pageobjects/LoginPage');
const { Console } = require('console');
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

test('🚬@Smoke Verify that the expected Cinco URL loads successfully', async ({ page }) => {
  let response;
  const expectedPageTitle = "Cinco AI Experience R3g";   //XSPACE R3a  //Cinco AI Experience R3g
  const expectedFinalUrl = "https://cinco.dev.xspace.domains/intro"; // hardcoded cuz in variable page url may set to = https://cinco.dev.xspace.domains (minus"/intro")
  //Check that the page loads without any HTTP errors (status code 200 OK):
  await test.step("Navigating to the application URL: " + urldataset.URL, async () => {
  response = await page.goto(urldataset.URL);  });  // Still lauches the app in browser.
  expect.soft(response.status(), "Verifying that the server responded with HTTP status code 200 OK").toBe(200);
  //Checking the title of the page:
  await expect.soft(page, `Verifying that the page title matches: "${expectedPageTitle}"`).toHaveTitle(expectedPageTitle);//Auto-retrying assertion
  // Checking the page isn't re-directed to some unexpected webpage:
  expect.soft(page.url(), `Ensuring the page remains on the expected URL: "${expectedFinalUrl}" without any unexpected redirects`).toBe(expectedFinalUrl);
  await test.step("Closing the application page", async () => {
  await page.close(); });
});


test('🚬@Smoke Verify that the enter app button becomes visible AFTER clearing cache', async ({ page }) => {
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
await expect.soft(loginPage.enterButton, `Expecting the ${loginPage.accessButtonText} button is visible to user`).toBeVisible(); 
//try byText locator to bulletproof the test // Then,insignify the case sensitivity of the text & any space(s) in the text 
// and make the expect msg, have a global variable IN PAGE OBJECT referencing 'ENTER' text.
await test.step("Closing the application page", async () => {
await page.close(); });
})


test('🚬@Smoke Verify that the 6-panel page loads correctly', async ({ browser }) => {
  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });
  const Url_6PanelPage = "https://cinco.dev.xspace.domains";
  const PageTitle_6PanelPage = "Cinco AI Experience R3g";
  const welcome_text = "Welcome! Speak up to start a conversation, swipe up to text, or swipe down to hide.";
  
  await test.step("Navigating to the application URL: " + urldataset.URL + " and accessing the 6-panel application interface", async () => { // reference ENTER globally
  await loginPage.launchAppAndAccessPanelPage(); }); // change the name of the method to avoid saying ENTER.
  // 1- Checking the page is actually directed to the url of the 6-panel page.
  await expect.soft(page, "Expecting the URL of the 6-panel page to be correct").toHaveURL(Url_6PanelPage); //Auto-retrying assertion.
  //2- checking the title of the page:
  await expect.soft(page, "Expecting page title to be: " + PageTitle_6PanelPage).toHaveTitle(PageTitle_6PanelPage);  //Auto-retrying assertion
  // 3-- that the 'Toggle Chat' button is visible.
  await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); // to know page is not brocken.
  // verify that the welcome text is displayed on the 6-panel page
  await expect.soft(page.locator("span[class*='ResponseText']"), "Verify welcome text is displayed when user lands on the 6-panel page").toContainText(welcome_text); // look at the examples for expect..tobeVisible
  // Verify that the CINCO logo is visible !
  await expect.soft(page.locator("img[alt='Cinco']"), "Verify CINCO logo is visible to user").toBeVisible();
  //Verify that the 'Start typing' edit box is editable (allows user input)
  await expect.soft(page.locator("input[name='message']"), "Expecting user can type in the edit box").toBeEditable(); // Verify that the 'Start typing' edit box is editable (allows user input)
  //Verify that 'BOOK A MEETING' button: 1- Has the text displayed(button could be there but not its text !) 2- Has the button enabled (clickable).
  await expect.soft(page.getByRole("button", { name: 'BOOK A MEETING' }).nth(0), "Expecting [BOOK A MEETING] button text to be visible to user").toContainText("Book a meeting"); // verified !
  await expect.soft(page.getByRole("button", { name: 'BOOK A MEETING' }).nth(0), "Expecting [BOOK A MEETING] button to be enabled(clickable)").toBeEnabled(); // verified !
  //await page.getByRole("button", {name: 'BOOK A MEETING'}).nth(0).click(); // and this is the evidence ! (Has to be commented out)
  //Verify the burger menu is enabled(clickable):
  await expect.soft(page.locator("button[data-testid='open-menu-button']"), "Expecting that users can click on the burger menu").toBeEnabled();
  await test.step("Closing the application page", async () => {
  await page.close(); });
});


const panelNames = [   
  "An Intro to Cinco",
  "Cinco’s XM Solutions",
  "Cinco AI Experience",
  " How We Work",
  "Case Studies"
];
for (const data of panelNumbersdataset) {  // below verify the subtopic page ? (may wanna modify the test title to this)
  test(`@Smoke Verify that ${data.panelnumb} [${panelNames[data.index]}] is accessible and loads correctly for users`, async ({ browser }) => { 
  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Navigating to the application URL: " + urldataset.URL + " and accessing the 6-panel application interface", async () => { // reference ENTER globally
  await loginPage.launchAppAndAccessPanelPage(); }); 
    //Landing on the 6-panel page
    await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible();
    // Clicking on panel # 
   await test.step(`Clicking on [${panelNames[data.index]}] 3D panel`, async () => {
   await loginPage.ClickOn3DPanelNumber(data.panelnumb);
 });
    //Validating the title of the sub- topic:
    await expect.soft(page.getByText(panelNames[data.index]),
      "Expecting the panel: [" + panelNames[data.index] + "] to have accessible sub topic page with the visible title of: [" + panelNames[data.index] + "]").toBeVisible();
    await test.step("Closing the application page", async () => {
  await page.close(); });

  });
}

test('🚬@Smoke Verify that the "LET US CONNECT" panel is visible and fully loaded', async ({ browser }) => {
 
 let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Navigating to the application URL: " + urldataset.URL + " and accessing the 6-panel application interface", async () => { // reference ENTER globally
  await loginPage.launchAppAndAccessPanelPage(); }); 
  //Landing on the 6-panel page
  await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat icon to be visible to users").toBeVisible();

  //Clicking on the panel 'LET'S CONNECT'
  await test.step(`Clicking on [LET'S CONNECT] 3D panel`, async () => {
    await page.evaluate(() => {
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_6");
    })
  });
 //await page.waitForTimeout(2000); // to view in slow mode. remove it !
  // Validating in [LET'S CONNECT] pannel in the following ways:
  //Validating the title of the form 'BOOK A MEETING' is visible to user
  await expect.soft(page.getByText("Book a meeting").nth(1), "Expecting the title of the form [BOOK A MEETING] to be displayed on the web page").toBeVisible();
  //Verify that the 'First, Last Name' edit box is editable (allows user input)
  await expect.soft(page.locator("input[name= 'name']"), "Expecting user can type in the 'First/Last Name' field").toBeEditable(); // Verify that the 'Start typing' edit box is editable (allows user input)
  // verify that the 'Email' field is editable
  await expect.soft(page.locator("input[name= 'email']"), "Expecting user can type in the 'Email' field").toBeEditable();
  // verify that the 'Message' field is editable
  await expect.soft(page.locator("input[name= 'message']"), "Expecting user can type in the 'Message' field").toBeEditable();
  //Verify the form 'SUBMIT' button is enabled(clickable):
  await expect.soft(page.locator("button[data-testid= 'submit-button']"), "Expecting the burger menu to be enabled (clickable)").toBeEnabled();
  await test.step("Closing the application page", async () => {
  await page.close(); });
});


//Below- test cases to feed pages are accessible to user
test(`🚬@Smoke Feed Page Accessibility – [AN INTRO TO CINCO], loads successfully`, async ({ browser }) => {

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Accessing the sub-topic page of the [AN INTRO TO CINCO] panel", async () => { // reference ENTER globally
  await loginPage.LaunchURLAndClickOn3DPanel("panel_1"); // this is the new method to be used.
  });
  
  await test.step("Clicking on the first displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(0).click(); // click on the first sub-topic.
  });
 
  //Validating the title of the feed page is visible to user
  const title_feedPage1_panel1 = "20+ Years of Brand Experiences";
  const container_feedPage1_panel1 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage1_panel1, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage1_panel1);
  await expect.soft(page.getByText(title_feedPage1_panel1).nth(0), "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  // auto-wait provided by playwright for the above line
  await test.step("Closing the feed page", async () => {
  await page.waitForTimeout(1000); 
  await page.locator("button[aria-label= 'Close']").click();//////////////////////////////////////////////////////////
  });
  await test.step("Clicking on the second displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(1).click(); // click on the second sub-topic.
  });
  const title_feedPage2_panel1 = "Why Choose Cinco"
  const container_feedPage2_panel1 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage2_panel1, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage2_panel1);
  await expect.soft(page.getByText(title_feedPage2_panel1).nth(0), "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
 
   await test.step("Closing the feed page", async () => {
   await page.waitForTimeout(1000); 
   await page.locator("button[aria-label= 'Close']").click();////////////////////////////////////////////////////////////
  });

  await test.step("Clicking on the third displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(2).click(); // click on the third sub-topic.
  });
  const title_feedPage3_panel1 = "What Makes Us Different"
  const container_feedPage3_panel1 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage3_panel1, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage3_panel1);
  await expect.soft(page.getByText(title_feedPage3_panel1).nth(0), "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
 
  await test.step("Closing the application page", async () => {
  await page.waitForTimeout(2000); // to view in slow mode. remove it !
  await page.close(); });
});


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

test('🚬@Smoke Verify the accessibility of the feed pages for [Cinco AI Experience] to users', async ({ browser }) => {

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { // or "Creating a new isolated environment for the test"
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Accessing the sub-topic page of the [AN INTRO TO CINCO] panel", async () => { // reference ENTER globally
  await loginPage.LaunchURLAndClickOn3DPanel("panel_3"); // this is the new method to be used.
  });

  await test.step("Clicking on the first displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(0).click(); // click on the first sub-topic.
  });

  //Validating the title of the feed page is visible to user
  const title_feedPage1_panel3 = "Platform Features";
  const container_feedPage1_panel3 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage1_panel3, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage1_panel3);
  await expect.soft(container_feedPage1_panel3, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  // Navigate back to the sub-topic page, in order to click on the 2nd sub-topic page:
  await test.step("Closing the feed page", async () => {
  await page.waitForTimeout(1000); 
  await page.locator("button[aria-label= 'Close']").click();//////////////////////////////////////////////////////////
  });

  await test.step("Clicking on the second displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(1).click(); // click on the second sub-topic.
  });

  const title_feedPage2_panel3 = "Seamless Access";
  const container_feedPage2_panel3 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage2_panel3, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage2_panel3);
  await expect.soft(container_feedPage2_panel3, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  // Navigate back to the sub-topic page, in order to click on the 2nd sub-topic page:
   await test.step("Closing the feed page", async () => {
   await page.waitForTimeout(1000); 
   await page.locator("button[aria-label= 'Close']").click();////////////////////////////////////////////////////////////
  });

  await test.step("Clicking on the third displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(2).click(); // click on the third sub-topic.
  });
  const title_feedPage3_panel3 = "Advanced Analytics";
  const container_feedPage3_panel3 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage3_panel3, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage3_panel3);
  await expect.soft(container_feedPage3_panel3, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  // Navigate back to the sub-topic page, in order to click on the 2nd sub-topic page:
   await test.step("Closing the feed page", async () => {
   await page.waitForTimeout(1000); 
   await page.locator("button[aria-label= 'Close']").click();////////////////////////////////////////////////////////////
  });

  await test.step("Clicking on the fourth displayed sub-topic", async () => {
  await page.locator("span[class*= 'Title']").nth(3).click(); // click on the third sub-topic.
  });

  const title_feedPage4_panel4 = "Use Cases";
  const container_feedPage4_panel4 = page.locator("div[class*= 'BrandingContainer']");
  await expect.soft(container_feedPage4_panel4, "Expecting the title of the feed page to be present in the HTML mark-up").toContainText(title_feedPage4_panel4);
  await expect.soft(container_feedPage4_panel4, "Expecting the title of the feed page to be visible to users on the web page").toBeVisible();
  //await page.waitForTimeout(2000);      

  await test.step("Closing the application page", async () => {
  await page.waitForTimeout(2000); // to view in slow mode. remove it !
  await page.close(); });
});

// work starts here May 11th @ 10:36 PM 
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
  await page.close();
});




















