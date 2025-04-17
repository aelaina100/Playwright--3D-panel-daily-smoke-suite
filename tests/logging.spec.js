const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//test.describe.configure({mode: 'parallel'}); // makes tests in this .spec.js file run parallelly
// Test cases in this .spec.js class file:
//Ensure the app URL is not brocken.
//Ensuring that the 'Enter' button is displayed & clickable
//Ensure that user can navigate to the pannels page (present) when clicking on 'Enter'.
//Ensure that each panel can be navigated to and all the way down
// Ensuring the typing your name in the edit box reflects back in text on UI (As the AI utters the name).
const { LoginPage }=require('../pageobjects/LoginPage'); // to make page object work !
    
   // working:
test('Smoke Test: Ensuring app URL is not brocken', async ({ page }) => {   // 'async' & 'await' keywords go hand in hand
 // const LoginPage= new LoginPage(page);
  // Navigate to cinco's url:
 const loginPage= new LoginPage(page);
 await loginPage.goTo();
 /*
  // Ensures that the url is not brocken: [By ensuring the 'CINCO' logo is present.]:
     // Lines below ensure that the box element holding the logo text is fully loaded and present in the UI:
  await loginPage.logoBox.waitFor();
    //additionally: Checking if logo text is present (will be omitted and included in a regression testcase)
  expect(await  loginPage.logoBox.textContent()).not.toBeNull();
  await page.close();
  */
  await page.close();
});

// works
test('Smoke Test: Validating that [ENTER] button is visible & clickable', async ({ page }) => {
  const loginPage = new LoginPage(page);
  // Navigate to cinco's url:
  await loginPage.goTo();
  // Ensure that the "ENTER" button is fully loaded/displayed on the UI:
  await loginPage.enterButton.click();
  await page.close();
});




test('Validate that the user can navigate to the Panels page and that the page loads without errors', async ({browser})=> 
{
  const { context, page, loginPage } = await LoginPage.createWithContext(browser);

 
//do this:
await loginPage.goTo();
//await page.pause();
await loginPage.enterButton.click(); // clicking on the 'ENTER' button.
//If the speaker's element is displayed = panel page is loaded.
await loginPage.audioOnOffButton.waitFor();  // Also helps ensure page is fully loaded.audio element Identified as long as its not muted.
await page.close(); });




//works
  test('Verify that Panel 1: "An Intro to Cinco" is accessible and loads without errors.', async ({browser }) => {
    const { context, page, loginPage } = await LoginPage.createWithContext(browser);
    
      await loginPage.goTo();
      //await page.pause();
     await loginPage.enterButton.click(); // clicking on the 'ENTER' button.
     

     await loginPage.audioOnOffButton.waitFor();
     //clicking on Panel #1:
      await page.evaluate(() => {
        window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_1")
      });
      await page.waitForTimeout(2000);
      //Ensuring the panel's page is loaded: By ensuring the slides container is fully loaded & visible on the screen
      await loginPage.panelSlidesContainer.waitFor();
      await page.close();  });
    
       //works
      test('Verify that Panel 2: "Cinco’s XM Solutions" is accessible and loads without errors.', async ({browser }) => {
        const { context, page, loginPage } = await LoginPage.createWithContext(browser);
    
        await loginPage.goTo();
        //await page.pause();
       await loginPage.enterButton.click(); // clicking on the 'ENTER' button.
       
  
       await loginPage.audioOnOffButton.waitFor();
       //clicking on Panel #1:
        await page.evaluate(() => {
          window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_2")
        });
        await page.waitForTimeout(2000);
        //Ensuring the panel's page is loaded: By ensuring the slides container is fully loaded & visible on the screen
        await loginPage.panelSlidesContainer.waitFor();
        await page.close();  });
    
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      test('Verify that Panel 3: "Cinco’s AI Experience.', async ({browser }) => {
  
        const context= await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 45.5019, longitude: -73.5674 }, 
        locale: 'en-CA'  });
        const page= await context.newPage();  
        await page.goto('https://qa-cinco.xspace.domains');
        //await page.pause();
       await page.locator("button").click(); // clicking on the 'ENTER' button.
       await page.locator("div[aria-label= 'Toggle chat'] canvas").waitFor();
       //clicking on Panel #3:
        await page.evaluate(() => {
          window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_3")
        });
        await page.waitForTimeout(2000);
        //Ensuring the panel's page is loaded: By ensuring the slides container is fully loaded & visible on the screen
        await page.locator("div[data-testid='slides-container']").waitFor();
        await page.close();
      });

      test('Verify that Panel 4:"How we work.', async ({browser }) => {
       
        const context= await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 45.5019, longitude: -73.5674 }, 
        locale: 'en-CA'  });
        const page= await context.newPage();  
        await page.goto('https://qa-cinco.xspace.domains');
        //await page.pause();
       await page.locator("button").click(); // clicking on the 'ENTER' button.
       await page.locator("div[aria-label= 'Toggle chat'] canvas").waitFor();
       //clicking on Panel #4:
        await page.evaluate(() => {
          window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_4")
        });
        await page.waitForTimeout(2000);
        //Ensuring the panel's page is loaded: By ensuring the slides container is fully loaded & visible on the screen
        await page.locator("div[data-testid='slides-container']").waitFor();
        await page.close();
      });

      test('Verify that Panel 5: Lets Connect.', async ({browser }) => {
        

        const context= await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 45.5019, longitude: -73.5674 }, 
        locale: 'en-CA'  });
        const page= await context.newPage();  
        await page.goto('https://qa-cinco.xspace.domains');
        //await page.pause();
       await page.locator("button").click(); // clicking on the 'ENTER' button.
       await page.locator("div[aria-label= 'Toggle chat'] canvas").waitFor();  
       //clicking on Panel #5:
        await page.evaluate(() => {
          window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_5")
        });
        await page.waitForTimeout(2000);
        //Ensuring the panel's page is loaded: By ensuring the slides container is fully loaded & visible on the screen
        await page.locator("div[data-testid='slides-container']").waitFor();
        await page.close();
      });

      test('Verify that Panel 6: CASE STUDIES.', async ({browser }) => {
       
        const context= await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 45.5019, longitude: -73.5674 }, 
        locale: 'en-CA'  });
        const page= await context.newPage();  
        await page.goto('https://qa-cinco.xspace.domains');
        //await page.pause();
       await page.locator("button").click(); // clicking on the 'ENTER' button.
       await page.locator("div[aria-label= 'Toggle chat'] canvas").waitFor();  // audio element Identified as long as its not muted.
       //clicking on Panel #6:
        await page.evaluate(() => {
          window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_6")
        });
        await page.waitForTimeout(2000);
        //Ensuring the panel's page is loaded: By ensuring that the form text "Book A Meeting" is visible on the screen.
        await page.locator("div[class*= ModalHeaderContent]").waitFor();// since Playwright did not provide auto-wait for: .contentText()
        const formTitle= await page.locator("div[class*= ModalHeaderContent]").textContent();
        //console.log(formTitle);
        expect (formTitle).not.toBeNull();   // I want to fail this test case
        await page.close();
      });

      test.skip('Text entered in the field of [Start Typing] ', async ({browser }) => {
       
        const context= await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 45.5019, longitude: -73.5674 }, 
        locale: 'en-CA'  });
        const page= await context.newPage();  
        await page.goto('https://qa-cinco.xspace.domains');
        //await page.pause();
       await page.locator("button").click(); // clicking on the 'ENTER' button.
       await page.locator("div[aria-label= 'Toggle chat'] canvas").waitFor();  // audio element Identified as long as its not muted.
       //clicking on Panel #6:
        await page.evaluate(() => {
          window.blazeIT_Susanoo.ctx.susanoo.on3DObjectClicked("panel_6")
        });
        await page.waitForTimeout(2000);
        //Ensuring the panel's page is loaded: By ensuring that the form text "Book A Meeting" is visible on the screen.
        await page.locator("div[class*= ModalHeaderContent]").waitFor();// since Playwright did not provide auto-wait for: .contentText()
        const formTitle= await page.locator("div[class*= ModalHeaderContent]").textContent();
        //console.log(formTitle);
        expect (formTitle).not.toBeNull(); // I want to fail this testcase.
        await page.close();
      });