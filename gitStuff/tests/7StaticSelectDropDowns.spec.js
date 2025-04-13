const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

test('UI Controls: Static dropdowns & Web-based pop-ups', async ({ page }) => {
/* NOTE: Regarding the 'Await' keyword:
    1- 'Await' is used to make sure that the lines of code are executed in a sequential manner.
        because, JavaScript/TypeScript is an asynchronous language. So, if you don't use 'await', 
        the lines of code will be executed in parallel (simultaneously) and not in a sequential manner.
     2- 'Await' is needed when an action is performed.
*/ 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    //identify username field and enter username:
   await  page.locator('input#username').fill('rahulshettyacademy');
   // add step to validate whether the username field has been filled:

   // identify password field and enter password:")
   await page.locator('#password').fill('learning');
   // add step to validate whether the password field has been filled:

   //From the static dropdown (Has 'Select' as the TagName and when expanding, there will be 'Options' tagNames)
   // select 'Consultant':
    const staticDropDown= page.locator("select.form-control");
    await staticDropDown.selectOption("consult"); // 'time-out' is provided for .selectOption() method.
    // The argument is the value of the attribte 'value', suggestion has ALL info you need.
    // as shown above: Playwright will select an option without having to first click on the static dropdown
    // where, off course, static dropdown won't open up in UI when running the script.
    
    // add step to validate whether 'consultant' is now selected in the static dropdown
    
   // select the radio button of 'user':
  await page.locator('.checkmark').nth(1).click(); // since 'User' will be the 2nd element of the array.
  // or use .last()  // now .click() function DOES have a 'time-out' as specified in Playwright time-out page [In configuration file,
    // I have overriden this wait to be 30 seconds.],so that I can guarentee that 'OK' button will be clicked.

  // as you can see, since Playwright REJECTS Xpath, out options are limited. Hence sometimes no way but to use
   //locators that are shared by more than one element..No other option is available, but this !
 

  //Click on 'Ok' for the pop-up message (Web-based pop-up):
  // Notice that, the associated mark-up for the 'OK' button inside this msg is ALWAYS present in the list of HTML mark-ups !
  // <button type="button" id="okayBtn" class="btn btn-success" autofocus="">Okay</button>

  //.However, Before the pop-up msg appears, there exits:
  //<div id="myModal" class="modal fade"    style="display: none;" aria-hidden="true"> 
  // not associated with any element of interest(above)

  // & after the pop-up message APPEARS, it becomes:
  //<div id="myModal" class="modal fade show"    style="display: block;"> 
    // not associated with any element of interest(above)

  // So, My plan is:

  /*  below '1' is redundant (Someone would argue) because: not able to click on the 'Ok' button means that the msg didnt even appear !
      But the defense against it, is: What if the message does appear but its OK message is simply not clickable ?
      ..so, I will include it/ validate that the pop-up message DOES appear.
   */

  // 1- Ensure that this pop-up msg INDEED appears:  
 
  const locator= page.locator("div#myModal"); //The associated element (That I'm never interested in) will always be identified, along
                                              //with it's associated <HTML  mark-up>
  await expect (locator).toHaveAttribute('style','display: block;'); 
  // above line: The <HTML mark-up> of identified element (That I'm never interested in), is checked whether some specified attribute 
  // , inside it, contains a specific value !


  //2- Click on 'OK' inside it.
  await page.locator("button#okayBtn").click(); //.click() function DOES have a 'time-out' as specified in Playwright time-out page 
                                               // [In configuration file, I have overriden this wait to be 30 seconds.]
                                               // so that I can guarentee that 'OK' button will be clicked.

  //3- Ensure that this pop-up message disappear: [synchronization issue.....]
  const locator2= page.locator("div#myModal"); // look at the earlier comment for this exact same line.
  await expect (locator2).toHaveAttribute('style','display: none;'); 
  //the 3rd argument for time out is for 5 seconds for 'style' to equal 'display: block;'

  //Now, ensure that this radio button of 'Student' has INDEED been clicked on (Instrutor's line)
  await expect(page.locator('.checkmark').last()).toBeChecked(); 
  //Above line-CRUCIAL to comprehend the following:
    // The only action here is .toBechecked(). [returns 'true' or 'false' so it's an action. Investigating =action]
    // Therefore, it requires an 'await' keyword.
    // This action is outside of the expect assertion. Therefore, 'await' must be outside so
    // so it applies to this type of action.

// Click on the checkmark for 'Terms & Conditions' checkbox:
await page.locator("[name= 'terms']").click(); // since 'Terms & Conditions' will be the 3rd element of the array.
// Validate that this checkbox has been indeed checked:
await expect(page.locator("[name= 'terms']")).toBeChecked();
 
//await page.pause();
// Now, uncheck it and then validate that it has been unchecked:
await page.locator("[name= 'terms']").uncheck();
 // Above: or.click().  uncheck() function DOES have an 'Auto wait' [https://playwright.dev/docs/actionability]
//await expect(page.locator("[name= 'terms']")).not.toBeChecked(); // my own line
// Below is instrutor's own line:
expect(await page.locator("[name= 'terms']").isChecked()).toBeFalsy();// without 'await' inside, it won't work.
 //Above line-CRUCIAL to comprehend the following:
    // The only action here is .isChecked(). [returns 'true' or 'false' so it's an action.Investigating =action]
    // Therefore, it requires an 'await' keyword.
    // that is NOT before 'expect', so that 'await'applies to this sort of action.
    // Now- toBeFalsy() is not an action, but rather a value 'false'. Therefore no 'await',for it, is needed.

// Now, I want to know if the link is blinking (The link that's situated in the top right corner):
// solution: before that, you may want to create a testcase validating if there is a link
//displayed in the first plalce or not. AND then you create another testcase validating
// whether the text of the link is blinking or not. In here I am following the instructor very
//quickly as I do not have enough time !. This project will be made cleaner later on.

// but let me also say that: maybe you dont need all of that where you only need to only
// check if the test is blinking or not. Where if this test fails then either: 
// 1- Well obviously the text is not blinking ! or 2- There is no text in the box that is supposed to hold it
// where #2  does NOT require a seperate test where this means creating unecessary redundant tests !
// so think about it. 


   // So, after investigating. There is no way to check whether the text is blinking or not.
    //additionally, Playwright does NOT provide a method or mechanism to check for blinking text.
    // the only way is to believe that the class attribute has a value of 'blinkingText' only  when 
    // the text is blinking.
    // and when the text is NOT blinking, the attribute class= something else or that the attribute
    // 'class' is NOT present at all. stuff like that.
    
    //In selenium: Assert.assertTrue(driver.findElement(By.tagName("a")).getAttribute("class").contains("blinkingText"));
    //General advice: ALWASY have the assertion page in hand. instead of looking at the available
    // methods in the editor (Bad practice).
const box_blinkingText= page.locator("a").nth(0); // or use .locator("[href*='documents-request']"") so no .nth () is used.
await expect(box_blinkingText).toHaveAttribute("class", "blinkingText");

//Since script runs really fast, pause before qs web page.
   //await page.pause();
   

});
