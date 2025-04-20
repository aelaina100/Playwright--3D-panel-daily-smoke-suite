const { test, expect } = require('@playwright/test'); 
const {POManager} = require('../pageobjects/POManager');
const { LoginPage }=require('../pageobjects/LoginPage'); 
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));    
//Urgent: Not only pages are accessible, but they should be the CORRECT pages

   // April 19th- passed examination. requires reviewing debugging steps.
test('Smoke Test: Ensuring app URL is not brocken', async ({ page }) => {   
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  await page.goto(urldataset.URL);  // if not accessible this step fails. Not the next one !
  await expect(loginPage.logoBox, "Web page should be reachable").toBeAttached(); 
  //await page.close(); // this should be a part of the tear down code in the first place. 
                        // for now, it's commented out becasue I want to see a screenshot even when test passes
                        // as  screenshot: 'on' in the playwright configuration.js file.
});
// April 17th works
test.only('Smoke Test: Validating that [ENTER] button is visible & Enabled', async ({ page }) => {
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  await page.goto(urldataset.URL); 
  //line(s) below should validate that: 1- The loading 'box' disappears 2- [ENTER] button is enabled (attached > visible >enabled)

  await expect (loginPage.enterButton, "'ENTER' button should be enabled (Can be clicked on !)").toBeEnabled();
  //await page.close(); 
});
// April 17th works
test('Validate that the 6 panels page is accessible to users', async ({browser})=> {
const { context, page, loginPage } = await LoginPage.createWithContext(browser);
await loginPage.navigateToUrlAndPressEnter();
await expect(loginPage.ToggleChat,"Expecting panel page to be reachable").toBeAttached(); // to know page is not brocken.
//await page.close(); 
});

//works April 17th ! // work is here ~!
for(const data of panelNumbersdataset){
  test(`Verify that Panel ${data.panelnumb}: [An Intro to Cinco] is accessible to users`, async ({browser }) => {
     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1
     await loginPage.ClickOn3DPanelNumber(data.panelnumb);
     await expect(loginPage.panelSlidesContainer, "Expecting Panel 1 page to be reachable (When user clicks Panel 1 in the carousel ").toBeAttached();
      await page.waitForTimeout(2000);
      //await page.close(); 
    });}// for-loop encapsulation
    
     //////////////////////////Stop here and implement a dataprovider equivalent method that runs the same test case x number of times
        // depending on the number (x) of data sets, one provides !///////////////////////////////////////////////////////////////////////////////////////////////////////  
      test.skip('Verify that Panel 2: "Cinco’s XM Solutions" is accessible and loads without errors.', async ({browser }) => {
        
     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1

     const panelnumb= "panel_2"
     await loginPage.ClickOn3DPanelNumber(panelnumb);
    //Ensuring the panel's page is loaded: By ensuring the slides container is  visible on the screen
     await expect(loginPage.panelSlidesContainer).toBeVisible(); 
     //await loginPage.panelSlidesContainer.waitFor(); // old line replaced by the one above.
     await page.close(); 
     });
    
        
      test.skip('Verify that Panel 3: "Cinco’s AI Experience.', async ({browser }) => {
  
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

      test.skip('Verify that Panel 4:"How we work.', async ({browser }) => {
       
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

      test.skip('Verify that Panel 5: Lets Connect.', async ({browser }) => {
        

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

      test.skip('Verify that Panel 6: CASE STUDIES.', async ({browser }) => {
       
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