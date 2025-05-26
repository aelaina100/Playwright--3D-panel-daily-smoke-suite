const { test, expect, request } = require('@playwright/test');
//Json ->String->js object
const Urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json")));
// above: converting this json into a Javascript object so it is easier to access.

class LoginPage {

  constructor(page) {
    this.page = page; // so that 'page' can now be used anywhere outside this constructor in this class.
    this.accessButtonText= "ENTER";
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
  

async acceptCookiePopup() { 
    await this.page.getByRole('button', { name: 'ACCEPT' }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'ACCEPT' }).click();
}


async launchAppAndAccessPanelPage()
  {
    await test.step('Navigating to the URL', async () => { // good desciption. nothing dynamic inside it= done.
    await this.page.goto(Urldataset.URL); }); // url should set as a global variable.
    await this.acceptCookiePopup();
    await test.step(`Clicking on ${this.accessButtonText}`, async () => {  
    await expect(this.enterButton).toBeVisible();
    await expect(this.enterButton).toBeEnabled();
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