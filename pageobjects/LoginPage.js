require('dotenv').config(); 
import { test, expect, request } from '@playwright/test';
const BASE_URL = process.env.URL; 

class LoginPage {
  constructor(page) {
    this.page = page; 
    this.accessButtonText = "ENTER";
    this.acceptCookieBtn = page.getByRole('button', { name: 'ACCEPT' }); // Only generated in the DOM before it's about to become visible to user.
    this.enterBtn = page.locator("div[class*= 'EnterContainer'][style*= 'opacity: 1']"); // after "ENTER" button becomes visible, then opacity becomes '1'"
    this.cincoLogoBox = page.locator("img[alt='Cinco']").nth(0);
    this.editBox = page.locator("input[name='message']");
    this.audioOnToggleChat = page.locator("div[aria-label= 'Toggle chat'] canvas");   
    this.ToggleChat = page.getByRole("button", { name: 'Toggle chat' }); // Identified whether audio is on or off 
    this.panelSlidesContainer = page.locator("div[data-testid='slides-container']"); // shared by inside panels 1-5
    this.formTitleBox = page.locator("div[data-testid='slides-container']");
    this.welcomeTextBox = page.locator("span[class*='ResponseText']");
    this.bookingButton = page.getByRole("button", { name: 'BOOK A MEETING' }).nth(0);
    this.burgerMenu = page.locator("button[data-testid='open-menu-button']");
    this.formNameField = page.locator("input[name= 'name']");
    this.formEmailField = page.locator("input[name= 'email']");
    this.formMessageField = page.locator("input[name= 'message']");
    this.formSubmitButton = page.locator("button[data-testid='submit-button']");
    this.subTopicImages = page.locator("div[class*= 'Image-sc']");
    this.feedPageTitleBox = page.locator("div[class*='BrandingContainer'] span[class*='StyledTypography']");
    this.feedCloseButton = page.locator("button[aria-label= 'Close'] svg");
    this.feedImages = page.locator("img[alt*='Click or tap']");   
  }
  
  async acceptCookiePopup() { 
    await expect((this.acceptCookieBtn), "Expecting the [ACCEPT] cookie button to be visible to user").toBeVisible();
    await expect((this.acceptCookieBtn), "Expecting the [ACCEPT] cookie button to be clickable (enabled) to user").toBeEnabled();
    await this.acceptCookieBtn.click(); 
    await expect((this.acceptCookieBtn), "Expecting the cookie pop-up to have disappeared after clicking on [ACCEPT]").toBeHidden();
  }

  async launchAppAndAccessPanelPage() {
    await test.step('Navigating to the URL', async () => { 
    await this.page.goto(BASE_URL); 
    }); 
    await this.acceptCookiePopup();            
    await test.step(`Trying to click on ${this.accessButtonText} in order to access the 6-panel page`, async () => {  
    await expect((this.enterBtn), `Expecting the ${this.accessButtonText} button to be visible to user`).toBeVisible();
    await expect(this.enterBtn, `Expecting the ${this.accessButtonText} button to be clickable (enabled)`).toBeEnabled();
    await this.enterBtn.click();
    });  
  }

  // This method creates a new browser context and page, and returns both:
  static async createWithContext(browser) {
    const context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 45.5019, longitude: -73.5674 },
      locale: 'en-CA',
    });
    const page = await context.newPage();
    return { context, page, loginPage: new LoginPage(page) }; 
  }

  async ClickOn3DPanelNumber(panelnumb) {
    await this.page.evaluate((panel) => { 
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
  }

  async LaunchURLAndClickOn3DPanel(panelnumb) {
    await this.page.goto(BASE_URL); 
    await this.acceptCookiePopup();
    await test.step(`Trying to click on ${this.accessButtonText} in order to access the 6-panel page`, async () => {  
    await expect((this.enterBtn), `Expecting the ${this.accessButtonText} button to be visible to user`).toBeVisible();
    await expect(this.enterBtn, `Expecting the ${this.accessButtonText} button to be clickable (enabled)`).toBeEnabled();
    await this.enterBtn.click();
    });  
    await expect.soft(this.ToggleChat, "Expecting the Toggle Chat button to be visible to users").toBeVisible(); 
    await expect.soft(this.ToggleChat, "Expecting the Toggle Chat button to be enabled [clickable]").toBeEnabled(); 
    await this.page.evaluate((panel) => {
      window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked(panel);
    }, panelnumb);
  }


async rightClickOnlastImageFeedpage() { 
  try {
    await expect(this.feedImages.first()).toBeVisible({ timeout: 30000 });
    const count = await this.feedImages.count();
    if (count > 0) {
      const lastImage = await this.feedImages.nth(count - 1);
      await lastImage.scrollIntoViewIfNeeded();
      await lastImage.click({ button: 'right' });
    }
  } catch (error) {
  } }


async nativeClickFeedClose() {
  const handle = await this.feedCloseButton.elementHandle();
  if (handle) {
    await handle.evaluate(el => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      el.dispatchEvent(event);
    });
  }
}

}
module.exports = { LoginPage }; 
