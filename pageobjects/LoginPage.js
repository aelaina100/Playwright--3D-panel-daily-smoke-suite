const { test, expect, request } = require('@playwright/test');
//Json ->String->js object
const Urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json")));
// above: converting this json into a Javascript object so it is easier to access.

class LoginPage {

  constructor(page) {
    this.page = page; // so that 'page' can now be used anywhere outside this constructor in this class.
    this.accessButtonText= "ENTER";
    this.enterButton = page.locator("div[class*= 'EnterContainer'][style*= 'opacity: 1']"); //after "ENTER" button becomes visible, then opacity becomes '1'"
    // without the child tag: button[class*= 'hcTAG1'], then locator points the the ENTER button that has a loader
    //  inside it and not the ENTER button with the 'ENTER' text inside it. Ask the developer for a unique ID
    // for the ENTER button with the 'ENTER' text inside it & NOT the ENTER button with a loader inside it !
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
  // add a function to accept the slow network message (if reasonale/feasible)

async acceptCookiePopup() { 
    await this.page.getByRole('button', { name: 'ACCEPT' }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'ACCEPT' }).click();
}

  //original:
  /*
  async acceptCookiePopup() { 
  await test.step("Waiting for the cookie consent modal to appear", async () => {
  await this.page.locator("div[class*= 'DialogModal-sc']").waitFor({ state: 'visible' }); 
  });// change to getByRole('dialog') if possible
  await test.step("Clicking the Accept button in the cookie modal", async () => {
  await this.page.locator("div[class*= 'DialogModal-sc'] button[class*= 'StyledButton-sc']").nth(1).click(); // instead .getByRole('button', { name: /accept/i }).  if possible
  });
}
  */
  
  // go to URL and click on 'ENTER'
  async launchAppAndAccessPanelPage()// replace it with "GoToURL_and_clickEnter" where you add the clicking line
  {
    await test.step('Navigating to the URL', async () => { // good desciption. nothing dynamic inside it= done.
    await this.page.goto(Urldataset.URL); }); // url should set as a global variable.
    await this.acceptCookiePopup();
    await test.step(`Clicking on ${this.accessButtonText}`, async () => {  

     // Wait for the element to be visible and enabled
    await expect(this.enterButton).toBeVisible();
    await expect(this.enterButton).toBeEnabled();
    await this.enterButton.click();});  // Click the button
    // Playwright provides an Auto-wait for .click():  https://playwright.dev/docs/next/actionability#introduction
  }

 //3- 
  // This method creates a new browser context and page, and returns both
  static async createWithContext(browser) {
    const context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 45.5019, longitude: -73.5674 },
      locale: 'en-CA',
    });
    const page = await context.newPage();
    return { context, page, loginPage: new LoginPage(page) }; // return the custom page object as well
  }


  //4- Create a function for clicking on the 3D panel where it's # is passed as an argument (For the data provider test case):
  async ClickOn3DPanelNumber(panelnumb) {
    await this.page.evaluate((panel) => { 
    window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
    await this.page.waitForTimeout(2000); // to view in slow mode. remove it !
  }

 
  //Create a function for launching the URL, logging in, and clicking on a specific the 3D panel:
  async LaunchURLAndClickOn3DPanel(panelnumb) {
  await this.page.goto(Urldataset.URL);  // url should set as a global variable.
  await this.acceptCookiePopup();

  await test.step(`Clicking on ${this.accessButtonText}`, async () => {  

     // Wait for the element to be visible and enabled
    await expect(this.enterButton).toBeVisible();
    await expect(this.enterButton).toBeEnabled();
    await this.enterButton.click();});  // Click the button 
    // //Playwright provides an Auto-wait for .click():  https://playwright.dev/docs/next/actionability#introduction
    await expect.soft(this.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); // before clicking on the panel
    // also notice 'LoginPage'.
    await this.page.waitForTimeout(1000); // buffer before evaluating JS // what made it work -verify
    await this.page.evaluate((panel) => { // why do I have to add 'this' ?
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
    await this.page.waitForTimeout(2000); // to view in slow mode. remove it !
    
  }
}

module.exports = { LoginPage }; // the ONLY correct format despite Playwright suggestion !
// export this class to make this class public = to make it available for any class in the entire project/ framework.