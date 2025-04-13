const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

//IMPORTANT: This test is only to show you how debugging works in Playwright.
// So, the logic/steps here aren't completed/ all correct yet.
test("Debugging command: npx playwright test --debug", async ({ page }) => {
    // Debugging step by step to understand what went wrong and/or how to code works.
    // npx playwright test --debug  // will start the test in debug mode.
    // This is where the Playwright Inspector launches.
      // In there it will skip the lines that have no actions such as merely identifying an element.
      // as there is nothing to debug in those lines.
     // And it will stop (not execute) at the line that has an action such as url navigation, clicking, filling, etc.
     // Now, execute that line by using the 'Step Over' button in the Inspector.
     // And it will stop (not execute) at the next line that has an action such as clicking, filling, etc.
     // where parallelly, UI will show the web element being identified in the browser.
     // Now, execute that line by using the 'Step Over' button in the Inspector.
        // And it will stop (not execute) at the next line that has an action such as clicking, filling, etc.
        // where parallelly, UI will show the web element being identified in the browser.
     // Now, execute that line by using the 'Step Over' button in the Inspector.
     // and so on and so forth!.

     //THE 'TRACER' IS SITUATED AT THE BOTTOM OF THE INSPECTOR:[DEBUGGER IS THE SECTION ABOVE IT]
     // IN THE TRACER: READ THE ASSOCIATED LOGS IN THE INSPECTOR FOR EVERY SINGLE DEBUGGED LINE OF CODE
     //  AFOREMENTIOND ABOVE.
     // AND THIS IS WHAT MATTERS THE MOST IN DEBUGGING.
     // THIS IS WHERE YOU KNOW WHAT WENT WRONG AND HOW TO FIX IT.

     //Now, at any point of time, clicking on the 'resume' button in the Inspector,
     // will execute the rest of the code without stopping at any line.
     // And the script will finish executing and the browser will close.
     
     //CRUCIAL: debugging controller will show you with a RED DOT the exact spot where 
     // the line of code will be executed when you click on the 'Step Over' button. 

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/'); // When debugging controller stops here
    // (Not executing), browser is launched  with no url entered.
    // and when I click on the 'Step Over' button in the Inspector, 
    // it will execute this line and navigate to the url.

   await  page.locator('input#username').fill('rahulshettyacademy'); // When debuggin controller stops here
   // (Not executing), UI shows the username field being identified in the browser.
   // and when I click on the 'Step Over' button, username is entered in the field.

   await page.locator('#password').fill('learning');
   
    const staticDropDown= page.locator("select.form-control");
    await staticDropDown.selectOption("consult"); 
   
  await page.locator('.checkmark').nth(1).click(); // debugging controller stops here showing you 
  //with a RED DOT the exact spot where the radio button will be checked when you click on the 'Step Over' button.

  await page.locator("button#okayBtn").click();  // debugging controller stops here showing you 
  //witha RED DOT the exact spot where the radio button will be checked when you click on the 'Step Over' button.

  await expect(page.locator('.checkmark').last()).toBeChecked(); 

await page.locator("[name= 'terms']").click(); 

await expect(page.locator("[name= 'terms']")).toBeChecked();

await page.locator("[name= 'terms']").uncheck();

expect(await page.locator("[name= 'terms']").isChecked()).toBeFalsy();


const box_blinkingText= page.locator("a").nth(0); 
await expect(box_blinkingText).toHaveAttribute("class", "blinkingText");

 
});
// April 13th