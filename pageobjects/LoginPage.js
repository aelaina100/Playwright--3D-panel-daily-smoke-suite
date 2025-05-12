const { test, expect, request } = require('@playwright/test');
//Json ->String->js object
const Urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json")));
// above: converting this json into a Javascript object so it is easier to access.

class LoginPage {

  constructor(page) {
    this.page = page; // so that 'page' can now be used anywhere outside this constructor in this class.
    this.logoBox = page.locator("img[class*='Logo']");
    this.enterButton = page.locator("div[class*= 'EnterContainer'][style*= 'opacity: 1']"); //after "ENTER" button becomes visible, then opacity becomes '1'"
    // without the child tag: button[class*= 'hcTAG1'], then locator points the the ENTER button that has a loader
    //  inside it and not the ENTER button with the 'ENTER' text inside it. Ask the developer for a unique ID
    // for the ENTER button with the 'ENTER' text inside it & NOT the ENTER button with a loader inside it !
    this.audioOnToggleChat = page.locator("div[aria-label= 'Toggle chat'] canvas");  //Identified as long as its not muted. // Not used (yet)
    this.ToggleChat = page.getByRole("button", { name: 'Toggle chat' }); // identified whether audio is on or off !
    this.panelSlidesContainer = page.locator("div[data-testid='slides-container']"); //shared by inside panels 1-5
    this.formTitleBox = page.locator("div[data-testid='slides-container']");

    this.accessButtonText= "ENTER";
  }

  //2- 
  // go to URL and click on 'ENTER'
  async launchAppAndAccessPanelPage()// replace it with "GoToURL_and_clickEnter" where you add the clicking line
  {
    await test.step('Navigating to the URL', async () => { // good desciption. nothing dynamic inside it= done.
    await this.page.goto(Urldataset.URL); }); // url should set as a global variable.

     await test.step(`Clicking on ${this.accessButtonText}`, async () => {  
     await this.enterButton.click();});
    // Playwright provides an Auto-wait for .click():  https://playwright.dev/docs/next/actionability#introduction
     }

 //3- 
  // This method creates a new browser context and page, and returns both
  static async createWithContext(browser) {
    const context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 45.5019, longitude: -73.5674 },
      locale: 'en-CA'
    });
    const page = await context.newPage();
    return { context, page, loginPage: new LoginPage(page) }; // return the custom page object as well
  }


  //4- Create a function for clicking on the 3D panel where it's # is passed as an argument (For the data provider test case):
  async ClickOn3DPanelNumber(panelnumb) {
    await this.page.evaluate((panel) => { // why do I have to add 'this' ?
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
    await this.page.waitForTimeout(2000); // to view in slow mode. remove it !
  }

  // NEW NEW NEW
  //Create a function for launching the URL, logging in, and clicking on a specific the 3D panel:
  async LaunchURLAndClickOn3DPanel(panelnumb) {
    await this.page.goto(Urldataset.URL);  // url should set as a global variable.
    await this.enterButton.click(); //Playwright provides an Auto-wait for .click():  https://playwright.dev/docs/next/actionability#introduction

    await expect.soft(this.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); // before clicking on the panel
    // also notice 'LoginPage'.
    await this.page.waitForTimeout(1000); // buffer before evaluating JS // what made it work -verify


    await this.page.evaluate((panel) => { // why do I have to add 'this' ?
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
    await this.page.waitForTimeout(2000); // to view in slow mode. remove it !
  }

 async navigatingBack() {
  const currentUrl = this.page.url(); // Track URL before going back

  // Attempt to go back and wait for navigation event
  const [navigation] = await Promise.all([
    this.page.waitForEvent('framenavigated').catch(() => null),
    this.page.goBack()
  ]);

  // Always wait for the load state of the new page
  await this.page.waitForLoadState('load');

  const newUrl = this.page.url(); // Check if URL changed
  if (newUrl === currentUrl || navigation === null) {
    console.warn("⚠️ goBack() was called but navigation didn't occur.");
  } else {
    console.log(`✅ Navigated back from ${currentUrl} to ${newUrl}`);
  }
}

  
}

module.exports = { LoginPage }; // the ONLY correct format despite Playwright suggestion !
// export this class to make this class public = to make it available for any class in the entire project/ framework.