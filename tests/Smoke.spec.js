require('dotenv').config();
const BASE_URL = process.env.URL; 
import { test, expect, request } from '@playwright/test';                                      
import { POManager } from '../pageobjects/POManager';
import { LoginPage } from '../pageobjects/LoginPage';

/* 
For clarity:
Level 1 with the panels = Topic
Level 2 = Sub-Topic
Level 3 = Feed
Level 4 = Feed Item (ex.: video, single image or carrousel)
*/
test('🚬@Smoke Validating the Entry screen of the cinco app', async ({ page }) => {
  let response;
  const expectedPageTitle = "Cinco AI Experience R3g";  
  await test.step("Navigating to the application URL: " + BASE_URL, async () => {
    response = await page.goto(BASE_URL);
  }); 
  await expect(response.status(), "Verifying that the server responded with HTTP status code 200 OK").toBe(200);
  await expect.soft(page, `Verifying that the page title matches: "${expectedPageTitle}"`).toHaveTitle(expectedPageTitle);
  await expect.soft(page, `Ensuring the page remains on the expected URL: "${BASE_URL}" with no unexpected redirects`).toHaveURL(BASE_URL);
  await test.step("Closing the application page", async () => {
  await page.close();
  });
});


test(`🚬@Smoke Verify that the 'ENTER' App button appears and is visible to the user.`, async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await test.step("Navigating to the application URL: " + BASE_URL, async () => {
  await page.goto(BASE_URL);
  });
  await test.step("Accepting the cookie banner", async () => {
  await loginPage.acceptCookiePopup();
  });
  await expect(loginPage.enterBtn, `Expecting the ${loginPage.accessButtonText} button to be visible to user`).toBeVisible(); 
  await test.step("Closing the application page", async () => {
  await page.close();
  });
});


test('🚬@Smoke Validating the 6-panel page', async ({ browser }) => { 

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { 
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });
  const PageTitle_6PanelPage = "Cinco AI Experience R3g";    
  const welcome_text = "Welcome! Speak up to start a conversation, swipe up to text, or swipe down to hide.";
  await test.step("Navigating to the application URL: [" + BASE_URL + "] and accessing the 6-panel application interface", async () => { 
  await loginPage.launchAppAndAccessPanelPage();
  });
  await expect.soft(page, `Expecting the URL of the 6-panel page to be: "${BASE_URL}"`).toHaveURL(BASE_URL); 
  await expect.soft(page, "Expecting page title to be: " + PageTitle_6PanelPage).toHaveTitle(PageTitle_6PanelPage);  
  await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); 
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

  await expect.soft(loginPage.cincoLogoBox, "Verify CINCO logo is visible to user").toBeVisible();
  await expect.soft(loginPage.editBox, "Expecting user can type in the edit box").toBeEditable(); 
  await test.step("Verify: [BOOK A MEETING] button is visible to user", async () => {
  await expect.soft(loginPage.bookingButton, "Expecting the button to be visible to user ").toBeVisible(); 
  await expect.soft(loginPage.bookingButton, "Expecting the correct text to be present in the visible button").toContainText("Book a meeting");
  });
  await expect.soft(loginPage.bookingButton, "Expecting [BOOK A MEETING] button is clickable").toBeEnabled(); 
  await expect.soft(loginPage.burgerMenu, "Expecting that users can click on the burger menu").toBeEnabled();
  await test.step("Closing the application page", async () => {
  await page.close();
  });
});


const panelNames = [
  "An Intro to Cinco",
  "Cinco’s XM Solutions",
  "Cinco AI Experience",
  "How We Work",
  "Case Studies"
];
for (const [index, name] of panelNames.entries()) {  
  test(`🚬@Smoke Verify that ${index + 1} [${name}] is accessible and loads correctly for users`, async ({ browser }) => {
    let context, page, loginPage;
    await test.step("Setting up the test environment", async () => { 
      ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
    });

    await test.step(`Navigating to the application URL: ${BASE_URL} and accessing the 6-panel application interface`, async () => { 
    await loginPage.launchAppAndAccessPanelPage();
    });
    await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible();
    await test.step(`Clicking on [${name}] 3D panel`, async () => {
    await loginPage.ClickOn3DPanelNumber(`panel_${index + 1}`);
    });
    await expect.soft(page.getByText(name),
      `Expecting the panel: [${name}] to have accessible sub topic page with the visible title of: [${name}]`)
      .toBeVisible();

    await test.step("Closing the application page", async () => {
      await page.close();
    });
  });
}


test('🚬@Smoke Verify that the "LET US CONNECT" panel is visible and fully loaded', async ({ browser }) => {

  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => {
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });

  await test.step("Navigating to the application URL: " + BASE_URL + " and accessing the 6-panel application interface", async () => { 
  await loginPage.launchAppAndAccessPanelPage();
  });
  await expect.soft(loginPage.ToggleChat, "Expecting the Toggle Chat icon to be visible to users").toBeVisible();
  await test.step(`Clicking on [LET'S CONNECT] 3D panel`, async () => {
  await page.evaluate(() => {
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_6");
    })
  });
  await expect.soft(page.getByText("Book a meeting").nth(1), "Expecting the title of the form [BOOK A MEETING] to be displayed on the form").toBeVisible();
  await test.step(`Validating: 'First/Last Name' field is both visible & editable (Allows user input)`, async () => {
  await expect.soft(loginPage.formNameField, "Expecting the name field to be visible").toBeVisible();
  await expect.soft(loginPage.formNameField, "Expecting the name field to be editable (Can be typed in)").toBeEditable();
  });
  await test.step(`Validating: Email field is both visible & editable (Allows user input)`, async () => {
  await expect.soft(loginPage.formEmailField, "Expecting the Email field to be visible").toBeVisible();
  await expect.soft(loginPage.formEmailField, "Expecting the Email field to be editable (Can be typed in)").toBeEditable();
  });
  await test.step(`Validating: Message field is both visible & editable (Allows user input)`, async () => {
  await expect.soft(loginPage.formMessageField, "Expecting the Message field to be visible").toBeVisible();
  await expect.soft(loginPage.formMessageField, "Expecting the Message field to be editable (Can be typed in)").toBeEditable();
  });
  await test.step(`Validating: The Submit button is not visible & clickable`, async () => {
  await expect.soft(loginPage.formSubmitButton, "Expecting the submit button to be visible").toBeVisible();
  await expect.soft(loginPage.formSubmitButton, "Expecting the submit button to be enabled (clickable)").toBeEnabled();
  });
  await test.step("Closing the application page", async () => {
  await page.close();
  });
});

test(`🚬@Smoke Validating: [AN INTRO TO CINCO] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['20+ Years of Brand Experiences', 'Why Choose Cinco', 'What Makes Us Different'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { 
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [AN INTRO TO CINCO] panel", async () => { 
  await loginPage.LaunchURLAndClickOn3DPanel("panel_1");   
  });
  
  await test.step(`Validating- The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  await expect.soft(page.locator("span[class*= 'Title-sc']")).toHaveCount(expected_count_subTopics, `Expecting the number of sub-topics to be: ${expected_count_subTopics}`);
  });

for (let i = 0; i < expected_count_subTopics; i++) { 
  await test.step(`Clicking on the sub-topic of: ${expected_feedPageTitles[i]}`, async () => {
  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting the sub-topic to be visible before clicking`
  ).toBeVisible();

  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting sub-topic to be enabled/clickable before actually clicking`
  ).toBeEnabled();

  await loginPage.subTopicTextBox.nth(i).click(); 
});
    await expect.soft(
      loginPage.feedPageTitleBox.filter(
      { hasText: expected_feedPageTitles[i] }),
      "Expecting feedpage number: " + (i + 1) + " to have the title: " + expected_feedPageTitles[i]
    ).toBeVisible(); 

    await test.step("Trying to click on the X close button of the feed page" , async () => { 
    await expect(loginPage.feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect(loginPage.feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await loginPage.feedCloseButton.click();  
    });
    } // for-loop enclosing bracket.
    await test.step("Closing the application page", async () => {
    await page.close();
  });
});

test(`🚬@Smoke Validating: [Cinco’s XM Solutions] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['Brand Activations', 'Strategic Sponsorships', 'XM Digital Services'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { 
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [Cinco's XM Solutions] panel", async () => { 
  await loginPage.LaunchURLAndClickOn3DPanel("panel_2");
  });
  
  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  await expect.soft(page.locator("span[class*= 'Title-sc']")).toHaveCount(expected_count_subTopics, `Expecting the number of sub-topics to be: ${expected_count_subTopics}`);
  });

for (let i = 0; i < expected_count_subTopics; i++) { 
  await test.step(`Clicking on the sub-topic of: ${expected_feedPageTitles[i]}`, async () => {
  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting the sub-topic to be visible before clicking`
  ).toBeVisible();

  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting sub-topic to be enabled/clickable before actually clicking`
  ).toBeEnabled();

  await loginPage.subTopicTextBox.nth(i).click(); 
});
    await expect.soft(
      loginPage.feedPageTitleBox.filter(
      { hasText: expected_feedPageTitles[i] }),
      "Expecting feedpage number: " + (i + 1) + " to have the title: " + expected_feedPageTitles[i]
    ).toBeVisible(); 

    await test.step("Trying to click on the X close button of the feed page" , async () => { 
    await expect(loginPage.feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect(loginPage.feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await loginPage.feedCloseButton.click();  
    });
    await expect(loginPage.feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); 
    } // for-loop enclosing bracket.
    await test.step("Closing the application page", async () => {
    await page.close();
  });
});


test(`🚬@Smoke Validating: [Cinco AI Experience] feed page`, async ({ browser }) => {

  let context, page, loginPage,actual_subTopicCount;
  const expected_feedPageTitles= ['Platform Features', 'Seamless Access', 'Advanced Analytics', 'Use Cases'];
  const expected_count_subTopics= expected_feedPageTitles.length;
  
  await test.step("Setting up the test environment", async () => { 
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [Cinco AI Experience] panel", async () => { 
  await loginPage.LaunchURLAndClickOn3DPanel("panel_3"); 
  });
  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  await expect.soft(page.locator("span[class*= 'Title-sc']")).toHaveCount(expected_count_subTopics, `Expecting the number of sub-topics to be: ${expected_count_subTopics}`);
  });

 for (let i = 0; i < expected_count_subTopics; i++) { 
  await test.step(`Clicking on the sub-topic of: ${expected_feedPageTitles[i]}`, async () => {
  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting the sub-topic to be visible before clicking`
  ).toBeVisible();

  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting sub-topic to be enabled/clickable before actually clicking`
  ).toBeEnabled();
  await loginPage.subTopicTextBox.nth(i).click();
});
    await expect.soft( 
      loginPage.feedPageTitleBox.filter(
      { hasText: expected_feedPageTitles[i] }),
      "Expecting feedpage number: " + (i + 1) + " to have the title: " + expected_feedPageTitles[i]
    ).toBeVisible(); 
    

    await test.step("Trying to click on the X close button of the feed page" , async () => { 
    await expect(loginPage.feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect(loginPage.feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await loginPage.feedCloseButton.click();  
    });
    await expect(loginPage.feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); 
} // for-loop enclosing bracket.
    await test.step("Closing the application page", async () => {
    await page.close();
  });
});


test('🚬@Smoke Verify the accessibility of the feed pages for [How We Work] to users', async ({ browser }) => {
  
  let context, page, loginPage;
  await test.step("Setting up the test environment", async () => { 
    ({ context, page, loginPage } = await LoginPage.createWithContext(browser));
  });

  await test.step("Accessing the sub-topic page of the [HOW WE WORK] panel", async () => { 
    await loginPage.LaunchURLAndClickOn3DPanel("panel_4"); 
  });

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
  
  await test.step("Setting up the test environment", async () => { 
  ({ context, page, loginPage } = await LoginPage.createWithContext(browser));  });

  await test.step("Trying to access the [Cinco AI Experience] panel", async () => { 
  await loginPage.LaunchURLAndClickOn3DPanel("panel_5"); 
  });
  
  await test.step(`Validating: The number of sub-topics displayed should be: ${expected_count_subTopics}`, async () => {
  await expect.soft(page.locator("span[class*= 'Title-sc']")).toHaveCount(expected_count_subTopics, `Expecting the number of sub-topics to be: ${expected_count_subTopics}`);
  });

for (let i = 0; i < expected_count_subTopics; i++) { 
  await test.step(`Clicking on the sub-topic of: ${expected_feedPageTitles[i]}`, async () => {
  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting the sub-topic to be visible before clicking`
  ).toBeVisible();

  await expect(
    loginPage.subTopicTextBox.nth(i), 
    `Expecting sub-topic to be enabled/clickable before actually clicking`
  ).toBeEnabled();

  await loginPage.subTopicTextBox.nth(i).click(); 
});
    await expect.soft(
      loginPage.feedPageTitleBox.filter(
      { hasText: expected_feedPageTitles[i] }),
      "Expecting feedpage number: " + (i + 1) + " to have the title: " + expected_feedPageTitles[i]
    ).toBeVisible(); 

    await test.step("Trying to click on the X close button of the feed page" , async () => { 
    await expect(loginPage.feedCloseButton, "Expecting the X button to be visible").toBeVisible();
    await expect(loginPage.feedCloseButton, "Expecting the X button to be clickable (enabled)").toBeEnabled();
    await loginPage.feedCloseButton.click();  
    });
    await expect(loginPage.feedCloseButton, "The feedpage has closed after clicking on its close (X) button").not.toBeAttached(); 
} // for-loop enclosing bracket.
    await test.step("Closing the application page", async () => {
    await page.close();
  });
});