class LoginPage {

constructor(page)
{  
    this.page= page; // so that 'page' can now be used anywhere outside this constructor in this class.
    this.logoBox= page.locator("img[class*='Logo']");
    this.enterButton= page.locator("button");
    this.audioOnToggleChat= page.locator("div[aria-label= 'Toggle chat'] canvas");  //Identified as long as its not muted. // Not used (so far)
    this.ToggleChat= page.getByRole("button", {name: 'Toggle chat'}); // identified whether audio is on or off (double check)
    this.panelSlidesContainer=  page.locator("div[data-testid='slides-container']"); //shared by inside panels 1-5
    this.formTitleBox= page.locator("div[data-testid='slides-container']");
} 

//2- 
// go to URL and click on 'ENTER'
async navigateToUrlAndPressEnter()// replace it with "GoToURL_and_clickEnter" where you add the clicking line
{
     await this.page.goto('https://qa-cinco.xspace.domains');  // url should set as a global variable.
     await this.enterButton.click(); //Playwright provides an Auto-wait for .click():  https://playwright.dev/docs/next/actionability#introduction
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


  //4- Create a function for clicking on the 3D panel where it's # is passed as an argument
 async ClickOn3DPanelNumber(panelnumb)
  {
  await this.page.evaluate((panel) => { // why do I have to add 'this' ?
    window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
  }, panelnumb);
  await this.page.waitForTimeout(2000); // to view in slow mode. remove it !
}
    
   
}

module.exports = { LoginPage }; // the ONLY correct format despite Playwright suggestion !
// export this class to make this class public = to make it available for any class in the entire project/ framework.