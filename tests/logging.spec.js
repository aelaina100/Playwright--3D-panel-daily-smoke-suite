const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
 //test.describe.configure({mode: 'serial'}); // is there a way to make the first 3 test cases run serially ? yes ! DeepSeek !
// Test cases in this .spec.js class file:
//Ensure the app URL is not brocken.
//Ensuring that the 'Enter' button is displayed & clickable
//Ensure that user can navigate to the pannels page (present) when clicking on 'Enter'.
//Ensure that each panel can be navigated to and all the way down
// Ensuring the typing your name in the edit box reflects back in text on UI (As the AI utters the name).
const {POManager} = require('../pageobjects/POManager');
const { LoginPage }=require('../pageobjects/LoginPage'); // to make page object work ! // remove it for the 1st test cases . But
// this will make the rest of the 'browser' fixtured test cases dysfunctional
    


//Urgent: Not only pages are accessible, but they should be the CORRECT pages
   // April17th-works
test('Smoke Test: Ensuring app URL is not brocken', async ({ page }) => {   // 'async' & 'await' keywords go hand in hand
   //const loginPage = new LoginPage(page); //this is the old way of creating an object. Instead we created POManager.js class where
  // all objects are created and dumped in there (plus include the related imports above.)
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  // This way of handling objects of pageobject classes is especially useful when you want to access a locator/method
  // belonging to a second (different) pageobject (Not LoginPage.js)in the same test case (Not specifically done in this test)
  //
  // Navigate to cinco's url:
 await page.goto("https://qa-cinco.xspace.domains"); // This URL has to be set globally (will see how to do so and where to set it)
 
  // Ensures that the url is not brocken: [By ensuring the box element supposed to host the text of CINCO logo in attached to the DOM.]
  //regardless of whether the text is null, present, or spelled incorrectly.
     await expect(loginPage.logoBox, "Web page should be reachable").toBeAttached(); // assertion message displayed whether assertion passes/fails
    // Add below to your personal note: When the page is brocken, the line of code below will throw a time-out exception of whatver
     // is set in the config.js file. This is why, in this specific test case- include an assertion instead, that will explicitly tell you
     // that the element is not attached to the DOM (Where this explicit telling is provided by you as an assertion message that
     // will be shown in the report whether assertion passes or fails !- As demonstrated in the test below)
  await loginPage.logoBox.waitFor('attached'); 
  //.waitFor() with no argument will default to having the argument of 'visible'. 
  // "element without any content has an empty bounding box and is not considered visible."
  // reference: https://playwright.dev/docs/api/class-locator#locator-wait-for
 
  
});

// April 17th works
test('Smoke Test: Validating that [ENTER] button is visible & Enabled', async ({ page }) => {
  //const loginPage = new LoginPage(page); //this is the old way of creating an object. Instead we created POManager.js class where
  // all objects are created and dumped in there (plus include the related imports above.)
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  // This way of handling objects of pageobject classes is especially useful when you want to access a locator/method
  // belonging to a second (different) pageobject (Not LoginPage.js)in the same test case (Not specifically done in this test)
  //
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
test.only('Validate that the 6 panels page is accessible to users', async ({browser})=> 
{
const { context, page, loginPage } = await LoginPage.createWithContext(browser);
await loginPage.navigateToUrlAndPressEnter();
  // page is reachable if the 'toggle chat' element is attached to the DOM. 
await expect(loginPage.ToggleChat,"Expecting panel page to be reachable").toBeAttached(); // to know page is not brocken.
await page.close(); });




//works April 17th ! // work is here ~!
  test('Verify that Panel 1: "An Intro to Cinco" is accessible to users.', async ({browser }) => {

     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1
     //clicking on Panel #1
     const panelnumb= "panel_1"
     await loginPage.ClickOn3DPanelNumber(panelnumb);
      //Below: Ensuring that user can go inside Panel 1 page where this page is accessible/reachable (Don't care if images are present/ 
      // or if they load properly, as this is a seperate testcase included in regression testing (Remember that this is a smoke
      // test designated to assess the health of the application (before the real exhaustive testing) and the criteria for that is whether 
      // a page is broken or not !. Simple !)
      //how about incuding soft assertions for whether images are loaded or not :D :D smiley face !
      // and can you combine soft assertions with visual testing !
      await expect(loginPage.panelSlidesContainer, "Expecting Panel 1 page to be reachable (When user clicks Panel 1 in the carousel ").toBeAttached();
    /*
      // Add below to your personal note: In this specific test wwe have an assertion:
     await expect(loginPage.panelSlidesContainer, "Expecting ").toBeVisible(); //https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible
       
      //instead of the below line:
     //await loginPage.panelSlidesContainer.waitFor(); // to ensure slide container in visible
     // (and not .waitFor('asttached') which only checks if the element is attached to the DOM = Not necessarily visible in the UI.
     //In this smoke test, I WANT this slide container to be visible in the UI. AND it is ONLY visible in the UI if
     // it has a content that's visible in the UI. Examine the reference of: https://playwright.dev/docs/next/api/class-locator#locator-wait-for
     // where it states: "'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element 
     // without any content or with display:none has an empty bounding box and is not considered visible."
     */
  });
    
     //////////////////////////Stop here and implement a dataprovider equivalent method that runs the same test case x number of times
        // depending on the number (x) of data sets, one provides !///////////////////////////////////////////////////////////////////////////////////////////////////////  
      test('Verify that Panel 2: "Cinco’s XM Solutions" is accessible and loads without errors.', async ({browser }) => {
        
     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1
     //clicking on Panel #1
     const panelnumb= "panel_2"
     await loginPage.ClickOn3DPanelNumber(panelnumb);
    //Ensuring the panel's page is loaded: By ensuring the slides container is  visible on the screen
     await expect(loginPage.panelSlidesContainer).toBeVisible(); 
     //await loginPage.panelSlidesContainer.waitFor(); // old line replaced by the one above.
     await page.close();  });
    
        
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