const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
 //test.describe.configure({mode: 'serial'}); // is there a way to make the first 3 test cases run serially ? yes ! DeepSeek !
// Test cases in this .spec.js class file:
//Ensure the app URL is not brocken.
//Ensuring that the 'Enter' button is displayed & clickable
//Ensure that user can navigate to the pannels page (present) when clicking on 'Enter'.
//Ensure that each panel can be navigated to and all the way down
// Ensuring the typing your name in the edit box reflects back in text on UI (As the AI utters the name).
const { LoginPage }=require('../pageobjects/LoginPage'); // to make page object work !
    
   // April17th-works
test('Smoke Test: Ensuring app URL is not brocken', async ({ page }) => {   // 'async' & 'await' keywords go hand in hand
  const loginPage= new LoginPage(page);
  // Navigate to cinco's url:
 await page.goto("https://qa-cinco.xspace.domains"); // This URL has to be set globally (will see how to do so and where to set it)
 
  // Ensures that the url is not brocken: [By ensuring the box element supposed to host the text of CINCO logo in attached to the DOM.]
  //regardless of whether the text is null, present, or spelled incorrectly.
     await expect(loginPage.logoBox, "Web page should be reachable").toBeAttached(); // assertion message displayed whether assertion passes/fails
  /*  // Add below to your personal note: When the page is brocken, the line of code below will throw a time-out exception of whatver
     // is set in the config.js file. This is why, in this specific test case- include an assertion instead, that will explicitly tell you
     // that the element is not attached to the DOM.
  await loginPage.logoBox.waitFor('attached'); 
  //.waitFor() with no argument will default to having the argument of 'visible'. 
  // "element without any content has an empty bounding box and is not considered visible."
  // reference: https://playwright.dev/docs/api/class-locator#locator-wait-for
  
*/ 
  
});

// April 17th works
test('Smoke Test: Validating that [ENTER] button is visible & Enabled', async ({ page }) => {
  const loginPage = new LoginPage(page);
  // Navigate to cinco's url:
  await page.goto("https://qa-cinco.xspace.domains"); // This URL has to be set globally (will see how to do so and where to set i
  // Ensure that the "ENTER" button is enabled (can be clicked on)
  await expect (loginPage.enterButton, "'ENTER' button should be enabled (Can be clicked on !)").toBeEnabled();
  // method .toBeEnabled() checks: 1- Element attached to the dom > Visible in the UI > Enabled in the UI (Can be clicked on)
   // defaults to waitFor('visibility') 
   // and console.log(await loginPage.enterButton.textContent()); returns the text 'ENTER' confirming that .waitFor() with no argument
   // is the correct method to be used in this test case TO VALIDATE THAT THE ENTER BUTTON IS VISIBLE
  await page.close();
});



// April 17th works
test('Validate that the 6 panels page is reachable', async ({browser})=> 
{
const { context, page, loginPage } = await LoginPage.createWithContext(browser);
await loginPage.navigateToUrlAndPressEnter();
  // page is reachable if the 'toggle chat' element is attached to the DOM. 
await expect(loginPage.ToggleChat,"Expecting panel page to be reachable").toBeAttached();
await page.close(); });




//works April 17th !
  test.only('Verify that Panel 1: "An Intro to Cinco" is accessible and loads without errors.', async ({browser }) => {
    const { context, page, loginPage } = await LoginPage.createWithContext(browser);
    
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1
     //clicking on Panel #1:
      const panelnumb= "panel_1";
      await loginPage.ClickOn3DPanelNumber(panelnumb);
      //Ensuring the panel's page is loaded: By ensuring the slides container is fully loaded & visible on the screen
      await loginPage.panelSlidesContainer.waitFor();
      await page.close();  });


    
       //works
      test('Verify that Panel 2: "Cinco’s XM Solutions" is accessible and loads without errors.', async ({browser }) => {
        const { context, page, loginPage } = await LoginPage.createWithContext(browser);
    
        await loginPage.goToURL();
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