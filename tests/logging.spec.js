const { test, expect, request } = require('@playwright/test'); 
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
//test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const {POManager} = require('../pageobjects/POManager');
const { LoginPage }=require('../pageobjects/LoginPage'); 
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));    
//Urgent: Not only pages are accessible, but they should be the CORRECT pages


test.only('@Smoke Verify the URL loads the expected Cinco URL successfully' , async ({ page }) => {  
  //Note: "404 Not Found" or "Server Not Available."
  const expectedPageTitle= "Cinco AI Experience R3gm";   //XSPACE R3a  //Cinco AI Experience R3g
  await page.goto(urldataset.URL);  
  await expect(page, "Expecting page title to be:  " + expectedPageTitle).toHaveTitle(expectedPageTitle);  //Auto-retrying assertion
  await expect(page, "Checking for unexpected re-direct from the current URL ").toHaveURL(urldataset.URL + "/intro");
  await page.close(); 
});
                           


test.only('@SSmoke Validating that [ENTER] button becomes visible', async ({ page }) => {
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  await page.goto(urldataset.URL); 
await expect(page.locator("div[class*= 'EnterContainer'][style*= 'opacity: 1']"), "Expecting the ENTER button is visible to user").toBeVisible(); // utilizing regular expressions for the value of the attribute.!
 await page.close(); 
 });


test('@SSmoke Validate the 6-panel page is accessible to users after clicking on ENTER', async ({browser})=> {
const { context, page, loginPage } = await LoginPage.createWithContext(browser);
await loginPage.navigateToUrlAndPressEnter();
//This is done by validating that the 'Toggle Chat' button is visible.
await expect(loginPage.ToggleChat,"Expecting the Toggle Chat button to be visible to users").toBeVisible(); // to know page is not brocken.
await page.close(); 
});                                                                                             


const panelNames = [
  "An Intro to Cinco",
  "Cinco’s XM Solutions",
  "Cinco AI Experience",
  " How We Work",
  "Case Studies"
];
for(const data of panelNumbersdataset){
  test(`@Smoke Verify that ${data.panelnumb} [${panelNames[data.index]}] is accessible to users`, async ({ browser }) => {

     const { context, page, loginPage } = await LoginPage.createWithContext(browser);
      
     await loginPage.navigateToUrlAndPressEnter();
     await loginPage.ToggleChat.waitFor(); 
     await loginPage.ClickOn3DPanelNumber(data.panelnumb);
     await expect(loginPage.panelSlidesContainer, "Expecting " + data.panelnumb +" page to be reachable (When user clicks on it in the carousel ").toBeAttached(); 
     const pageTextBox= page.locator("span[class*= 'StyledTypography']").nth(2);
     await expect(pageTextBox).toHaveText(panelNames[data.index]);               
     await page.close();  
     });}// for-loop encapsulation;
      
    

   