const { test, expect, request } = require('@playwright/test'); 
const {POManager} = require('../pageobjects/POManager');
const { LoginPage }=require('../pageobjects/LoginPage'); 
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));    
//Urgent: Not only pages are accessible, but they should be the CORRECT pages

test('Verify the URL loads the expected Cinco URL successfully' , async ({ page }) => {  
  //Note: "404 Not Found" or "Server Not Available."
  const expectedPageTitle= "XSPACE R3a";
  await page.goto(urldataset.URL);  // if not accessible this step fails. Not the next one !//urldataset.URL
  // but sometimes it passes even if the url is not valid (ex: https://www.google.ca/s)

     // To include:
     // 1- Verify the URL returns a 200 OK status:  watch the lecture
     /*const response = await request.
     expect(response.status()).toBe(200); // 200 OK */

     //2- Verify the title of the page:
    await expect(page, "Expecting page title to be:  " + expectedPageTitle).toHaveTitle(expectedPageTitle);  //Auto-retrying assertion
     //3- Confirm browsers's current URL is the expected one (No unexpeted re-direct):
     await expect(page, "Checking for unexpected re-direct from the current URL ").toHaveURL(urldataset.URL + "/intro");
});

/* first old testcases
   // April 19th- passed examination. requires reviewing debugging steps.
test('Verify that the URL loads the expected webpage successfully', async ({ page }) => {  
  //Note: "404 Not Found" or "Server Not Available."
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  await page.goto(urldataset.URL);  // if not accessible this step fails. Not the next one !
  await expect(loginPage.logoBox, "Web page should be reachable").toBeAttached(); 
  //await page.close(); // this should be a part of the tear down code in the first place. 
                        // for now, it's commented out becasue I want to see a screenshot even when test passes
                        // as  screenshot: 'on' in the playwright configuration.js file.
});
*/
// April 17th works
test('Validating that [ENTER] button becomes visible', async ({ page }) => {
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  await page.goto(urldataset.URL); 

  // * The loading 'box' disappears ( Ask whether the loader should always appear & Ask about the maximum loading time). based on that include/not include a validation.
 

// when the 'ENTER' button of div[class*= 'EnterContainer'] is not yet visible in the UI, the controller can still locate its 
//associated HTML mark up which has 'opacity' of 0
// However, when it becomes visible (the enter button) it will have opacity of: 1

 // - Validating if the ENTER button is visible on the screen after the loader disappears (finishes loading). (to optimize the code, use visibiblity ASSERTION)
await expect(page.locator("div[class*= 'EnterContainer'][style*= 'opacity: 1']"), "Expecting the ENTER button is visible to user").toBeVisible(); // utilizing regular expressions for the value of the attribute.!

  await page.close(); 
});

test('Validate that the page with the 6 panels is accessible to users after clicking on ENTER', async ({browser})=> {
const { context, page, loginPage } = await LoginPage.createWithContext(browser);
await loginPage.navigateToUrlAndPressEnter();
//This is done by validating that the 'Toggle Chat' button is visible.
await expect(loginPage.ToggleChat,"Expecting the Toggle Chat button to be visible to users").toBeVisible(); // to know page is not brocken.
await page.close(); 
});

//works April 17th ! // work is here ~!

const panelNames = [
  "An Intro to Cinco",
  "Cinco’s XM Solutions",
  "Cinco AI Experience",
  " How We Work",
  "Case Studies"
];
for(const data of panelNumbersdataset){
  test(`Verify that ${data.panelnumb} [${panelNames[data.index]}] is accessible to users`, async ({ browser }) => {

     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
      
    await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1

     await loginPage.ClickOn3DPanelNumber(data.panelnumb);
     await expect(loginPage.panelSlidesContainer, "Expecting " + data.panelnumb +" page to be reachable (When user clicks on it in the carousel ").toBeAttached();
     //Include 200 ok and expected pagetitle
     //console.log(await page.title());     
     // Verifying the title of each page:
     const pageTextBox= page.locator("span[class*= 'StyledTypography']").nth(2);
     //waits for the box element to be visible. Playwright considers it so, when the text it's supposed to host becomes visible on the screen !
     await expect(pageTextBox).toHaveText(panelNames[data.index]); //Auto-retrying assertion  
     //                   span[class*= 'StyledTypography']
     
      await page.close(); 
    });}// for-loop encapsulation;

    //// Note: above- index values are included here simply becasue the Java code of: int count=0;  count++; is not applicable in JavaScript (Document it !).
  
     //////////////////////////Stop here and implement a dataprovider equivalent method that runs the same test case x number of times
        // depending on the number (x) of data sets, one provides !/////////////////////////////////////////////////////////////////////
        // //////////////////////////////////  
        /*
      test.skip('Verify that Panel 2: "Cinco’s XM Solutions" is accessible and loads without errors.', async ({browser }) => {
        
     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); // wait till the element is visible in the UI- This increases the chances of accessing panel 1

     const panelnumb= "panel_2"
     await loginPage.ClickOn3DPanelNumber(panelnumb);
    //Ensuring the panel's page is loaded: By ensuring the slides container is  visible on the screen
     await expect(loginPage.panelSlidesContainer).toBeVisible(); //not sure about the behavious (1 image not displayed = false, all = false, plus..)
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
      */