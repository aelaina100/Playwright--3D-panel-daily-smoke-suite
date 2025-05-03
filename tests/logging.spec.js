const { test, expect, request } = require('@playwright/test'); 
//test.describe.configure({ mode: 'parallel' }); // tests in here will run parallelly
//test.describe.configure({ mode: 'serial' }); // tests in here will run serially where a test executes only when the one before it passes !(inter-dependency)                                        
const {POManager} = require('../pageobjects/POManager');
const { LoginPage }=require('../pageobjects/LoginPage'); 
const { Console } = require('console');
//Json ->String->js object
const urldataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataUrl.json"))); // converting this json into a Javascript object so it is easier to access
const panelNumbersdataset = JSON.parse(JSON.stringify(require("../utils/loggingTestDataPanelNum.json")));    
//Urgent: Not only pages are accessible, but they should be the CORRECT pages


test('@Smoke Verify the URL loads the expected Cinco URL successfully' , async ({ page }) => { 

  const expectedPageTitle= "Cinco AI Experience R3g";   //XSPACE R3a  //Cinco AI Experience R3g
  const expectedFinalUrl = "https://cinco.dev.xspace.domains/intro"; // hardcoded cuz in variable page url may set to = https://cinco.dev.xspace.domains (minus"/intro")
   //Check that the page loads without any HTTP errors (status code 200 OK):
  const response=   await page.goto(urldataset.URL);   // Still lauches the app in browser.
  expect.soft(response.status(), "Expecting page loads without any HTTP errors (status code is 200 OK) ").toBe(200); 
  //Checking the title of the page:
  await expect.soft(page, "Expecting page title to be: " + expectedPageTitle).toHaveTitle(expectedPageTitle);  //Auto-retrying assertion
  // Checking the page isn't re-directed to some unexpected webpage:
  expect.soft(page.url(),"Verify that the page stays on the expected URL without any unexpected redirects").toBe(expectedFinalUrl);
 await page.close(); 
});                         

//I believe it is only good for regression=add another TC to validate that logo is present ? (Reasoning: 1-UI load confirmation 2-Critical branding: public-facing apps 3-https://cinco.dev.xspace.domains/intro)
test('@Smoke Validating that [ENTER] button becomes visible', async ({ page }) => {
  const poManager= new POManager(page);
  const loginPage =poManager.getLoginPage();
  await page.goto(urldataset.URL); 
  await expect(loginPage.enterButton, "Expecting the ENTER button is visible to user").toBeVisible(); // utilizing regular expressions for the value of the attribute.!
  await page.close(); 
 });


test.only('@Smoke Validating the 6-panel page', async ({browser})=> { // the title could only be 'validate the 6-panel..""
const { context, page, loginPage } = await LoginPage.createWithContext(browser);

const Url_6PanelPage= "https://cinco.dev.xspace.domains";
const PageTitle_6PanelPage= "Cinco AI Experience R3g";
const welcome_text= "Welcome! Speak up to start a conversation, swipe up to text, or swipe down to hide.";

await loginPage.navigateToUrlAndPressEnter(); 
// 1- Checking the page is actually directed to the url of the 6-panel page.
 await expect.soft(page,"Expecting the URL of the 6-panel page to be correct").toHaveURL(Url_6PanelPage); //Auto-retrying assertion.
//2- checking the title of the page:
await expect.soft(page, "Expecting page title to be: " + PageTitle_6PanelPage).toHaveTitle(PageTitle_6PanelPage);  //Auto-retrying assertion
// 3-- that the 'Toggle Chat' button is visible.
await expect.soft(loginPage.ToggleChat,"Expecting the Toggle Chat button to be visible to users").toBeVisible(); // to know page is not brocken.
// verify that the welcome text is displayed on the 6-panel page
await expect.soft(page.locator("span[class*='ResponseText']"), "Verify welcome text is displayed when user lands on the 6-panel page").toContainText(welcome_text); // look at the examples for expect..tobeVisible
// Verify that the CINCO logo is visible !
await expect.soft(page.locator("img[alt='Cinco']"), "Verify CINCO logo is visible to user").toBeVisible();
//Verify that the 'Start typing' edit box is editable (allows user input)
await expect.soft(page.locator("input[name='message']"), "Expecting user can type in the edit box ").toBeEditable(); // Verify that the 'Start typing' edit box is editable (allows user input)
// Verify the submit button is enabled:

//Verify that 'BOOK A MEETING' button: 1- Has the text displayed(button could be there but not its text !) 2- Has the button enabled (clickable).
await expect(page.getByRole("button", {name: 'BOOK A MEETING'}).nth(0), "Expecting [BOOK A MEETING] button text to be visible to user").toContainText("Book a meeting"); // verified !
await expect(page.getByRole("button", {name: 'BOOK A MEETING'}).nth(0), "Expecting [BOOK A MEETING] button to be enabled(clickable)").toBeEnabled(); // verified !
//await page.getByRole("button", {name: 'BOOK A MEETING'}).nth(0).click(); // and this is the evidence ! (Has to be commented out)
//Verify the burger menu is enabled(clickable):
await expect(page.locator("button[data-testid='open-menu-button']","Expecting the buger menu to be enabled (clickable)" )).toBeEnabled();



//await page.close(); 

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
      
    

   