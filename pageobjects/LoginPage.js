const { test, expect, request } = require('@playwright/test');
//Json ->String->js object
const Urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json")));
// above: converting this json into a Javascript object so it is easier to access.

class LoginPage {

  constructor(page) {
    this.page = page; // so that 'page' can now be used anywhere outside this constructor in this class.
    this.accessButtonText= "ENTER";
    this.acceptCookieBtn= page.getByRole('button', { name: 'ACCEPT' }); // The cookie pop-up is only generated in the DOM before it's about to become visible to user.
    this.enterButton = page.locator("div[class*= 'EnterContainer'][style*= 'opacity: 1']"); //after "ENTER" button becomes visible, then opacity becomes '1'"
    this.cincoLogoBox = page.locator("img[alt='Cinco']").nth(0);
    this.editBox= page.locator("input[name='message']")
    this.audioOnToggleChat = page.locator("div[aria-label= 'Toggle chat'] canvas");  //Identified as long as its not muted. // Not used (yet)
    this.ToggleChat = page.getByRole("button", { name: 'Toggle chat' }); // identified whether audio is on or off !
    this.panelSlidesContainer = page.locator("div[data-testid='slides-container']"); //shared by inside panels 1-5
    this.formTitleBox = page.locator("div[data-testid='slides-container']");
    this.welcomeTextBox= page.locator("span[class*='ResponseText']");
    this.bookingButton= page.getByRole("button", { name: 'BOOK A MEETING' }).nth(0);
    this.burgerMenu= page.locator("button[data-testid='open-menu-button']");
    this.formNameField= page.locator("input[name= 'name']");
    this.formEmailField= page.locator("input[name= 'email']");
    this.formMessageField= page.locator("input[name= 'message']");
    this.formSubmitButton= page.locator("button[data-testid='submit-button']");
    this.subTopicTextBox= page.locator("span[class*= 'Title-sc']");
    this.feedPageTitleBox= page.locator("div[class*='BrandingContainer'] span[class*='StyledTypography']");
  }
  
  async acceptCookiePopup() { // A requirement that the cookie consent pop-up appears.
    await expect((this.acceptCookieBtn), "Expecting the [ACCEPT] cookie button to be visible to user").toBeVisible();
    await expect((this.acceptCookieBtn), "Expecting the [ACCEPT] cookie button to be clickable (enabled) to user").toBeEnabled();
    await this.acceptCookieBtn.click(); // Clicking on the accept button.
    await expect((this.acceptCookieBtn), "Expecting the cookie pop-up to have disappeared after clicking on [ACCEPT]").toBeHidden();
}

// Handling the occasionally appearing HTML 'Slow Network' popup:
async slowNetworkPopUp() {
  let visibility = false;
  const slowNetwork_continueBtn = this.page.getByRole("button", { name: "CONTINUE", exact: false });

  await test.step('Checking if the occasional "Slow Network" pop-up appears', async () => {
    try {
      // Wait up to 20s for the button to become visible
      await slowNetwork_continueBtn.waitFor({ state: "visible", timeout: 20000 });
      //await this.page.screenshot();

      visibility = true;
    } catch (e) {
      // Timeout or not found: popup did not appear
      visibility = false;
    }
  });

  if (visibility) {
    await test.step('The occasional "Slow Network" pop-up became visible', async () => {
      await expect(slowNetwork_continueBtn, "Expecting the Slow Network's 'Continue' button to be clickable").toBeEnabled();
      await slowNetwork_continueBtn.click();
      await expect.soft(slowNetwork_continueBtn, "Expecting the Slow Network's pop-up to disappear").toBeHidden({ timeout: 7000 });
    });
  } else {
    await test.step('No "Slow Network" pop-up appeared', async () => {});
  }
}





async launchAppAndAccessPanelPage()
  {
    await test.step('Navigating to the URL', async () => { // good desciption. nothing dynamic inside it= done.
    await this.page.goto(Urldataset.URL); }); // url should set as a global variable.
    await this.acceptCookiePopup();

    await this.slowNetworkPopUp();          // works but marks the entire untility as failed         
    
    await test.step(`Trying to click on ${this.accessButtonText} in order to access the 6-panel page`, async () => {  
    await expect((this.enterButton), `Expecting the ${this.accessButtonText} button to be visible to user` ) .toBeVisible();
    await expect(this.enterButton, `Expecting the ${this.accessButtonText} button to be clickable (enabled)`).toBeEnabled();
    await this.enterButton.click();});  // Click the button // https://playwright.dev/docs/next/actionability#introduction
  }

  // This method creates a new browser context and page, and returns both:
static async createWithContext(browser) {
    const context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 45.5019, longitude: -73.5674 },
      locale: 'en-CA',
    });
    const page = await context.newPage();
    return { context, page, loginPage: new LoginPage(page) }; // return the custom page object as well
  }

  //Create a function for clicking on the 3D panel where it's # is passed as an argument (For the 'data provider' test case):
  async ClickOn3DPanelNumber(panelnumb) {
    await this.page.evaluate((panel) => { 
    window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
    await this.page.waitForTimeout(2000); 
  }

 
  //Create a function for launching the URL, logging in, and clicking on a specific the 3D panel:
  async LaunchURLAndClickOn3DPanel(panelnumb) {
  await this.page.goto(Urldataset.URL);  // url should set as a global variable.
  await this.acceptCookiePopup();
  await this.slowNetworkPopUp();
  await test.step(`Clicking on ${this.accessButtonText}`, async () => {  

  await expect(this.enterButton).toBeVisible();
  await expect(this.enterButton).toBeEnabled();
  await this.enterButton.click();});  //   https://playwright.dev/docs/next/actionability#introduction
  await expect.soft(this.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); // before clicking on the panel
  await this.page.waitForTimeout(1000); // buffer before evaluating JS 
  await this.page.evaluate((panel) => {
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
    await this.page.waitForTimeout(2000); 
  }
}

module.exports = { LoginPage }; // the ONLY correct format despite Playwright suggestion !
// export this class to make this class public = to make it available for any class in the entire project/ framework.