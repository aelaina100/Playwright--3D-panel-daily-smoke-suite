class LoginPage {

constructor(page)
{  
    this.page= page; // so that 'page' can now be used anywhere outside this constructor in this class.
    this.logoBox= page.locator("img[class*='Logo']");
    this.enterButton= page.locator("button");
    this.audioOnOffButton= page.locator("div[aria-label= 'Toggle chat'] canvas");
    this.panelSlidesContainer=  page.locator("div[data-testid='slides-container']"); //shared by inside panels 1-5
    this.formTitleBox= page.locator("div[data-testid='slides-container']");
} 


//1- 
async goTo() // replace it with "GoToURL_and_clickEnter" where you add the clicking line
{
     await this.page.goto('https://qa-cinco.xspace.domains');  // url should set as a global variable.
}
   
  //2- 
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

  //3- Create a function for clicking on the 3D panel where it's # is passed as an argument
    
   
}

module.exports = { LoginPage }; // the ONLY correct format despite Playwright suggestion !
// export this class to make this class public = to make it available for any class in the entire project/ framework.