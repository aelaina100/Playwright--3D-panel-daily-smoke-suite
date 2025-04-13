const {test,expect} = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).

test('Locators in Playwright', async ({page})=> 
    {
        // Locators of playwright: it predominantly supports css selectors
        // xpath locators as well, but playwright clearly states that it is not recommended to use them

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
   // await expect(page).toHaveTitle("google"); 

   //identify username field and enter username:
   await page.locator('input#username').fill('aelaina100@gmail.com'); // css selector
   // identify password field and enter password:
   await page.locator('#password').fill('Ugoplb77');
  // click on the 'sign in' button
  await page.locator('#signInBtn').click();
    });

    //2nd testcase:
    test('Validate Error Message For invalid username', async ({page})=> 
        {  
        await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
        console.log(await page.title());
        // when an invalid username is entered, an error message should be displayed. 
        // this error message is: "Incorrect username/password."

        // This msg is displayed when the user enters username, password and clicks on the 'sign in' button.
        // before looking at the below code, you've to study the behavious of the HTML markup(s) of the page.

    
       //identify username field and enter username:
       await page.locator('input#username').fill('aelaina100@'); // css selector
       // identify password field and enter password:
       await page.locator('#password').fill('Ugoplb77');
      // click on the 'sign in' button
      await page.locator('#signInBtn').click();

      // Now, the error message should be displayed:
        // where the associated <HTML markup> has an attribute of:   style= 'display: block;'
        // and when no error message is displayed, the attribute is: style= 'display: none;'

          // Either case, the accompaying text of the associated HTML markup is: "Incorrect username/password."
          // Note: any error message associated with the username/password fields is displayed
          // in this specific HTML markup !

            //          Now, look at the below equivalent Selenium code (Very bottom outside of this test)
        
// Now, to do that with Playwright, you can use the following code:
// 1- Validate the box that holds the error message is displayed or not:
// 2- Validate the text of the error message:

//1:
     //  console.log(await page.locator("div[style*='block']").textContent());
 await expect(page.locator("div[style*='block']")).toContainText ("Incorrect username/password");
// this will wait till the element with the locator div[style*='block'], 
// is found according to the wait provided in the playwright.config.js file.

//use "div[style*=block] strong" if you can't extract the text !

        });

         //In selenium:
          //1- Validate the box that holds the error message is displayed or not:
         // String styleAttributeValue= driver.findElement(By.cssSelector(".alert")).getDomAttribute("style");
         // Assert.assertTrue(styleAttributeValue.contains("block"), "Box that holds the text of the message is not displayed in the first place"); 
         
         //2- Validate the text of the error message:
            // String errorMessage= driver.findElement(By.cssSelector(".alert")).getText(); // or ".alert strong"
            // Assert.assertTrue(errorMessage.contains("Incorrect username/password."), "Error message is not displayed");

        
            //Now, this is a retarded way of doing things. Why ? (for #1)
            // Because, the script is so fast that it will not automatically wait for the attribute [style] to change
            // from 'display: none;' to 'display: block;'
            // So, the script will fail.

                // So, to fix this, you can directly look for the locator of: div[style*=block]  (Validated in console)
                // where if synchronization is provided (Implicit wait or explicit wait), then before the script throws
                //  element not found exception, it will wait within the time provided for the element to be located.
                  //ok this clearly works. But, it is not the best way to do it because we're looking for a clearer message devised
                  // on our own. Therfore, use the below code instead:

              // WebElement element_errorBox = driver.findElement(By.cssSelector("div[style*=block]")); 
              // Assert.assertNotNull(element_errorBox, "The error box that hosts the text is not displayed");  
              // or use the size() method to check if the element is present or not:
                // Assert.assertTrue(driver.findElements(By.cssSelector("div[style*=block]")).size() > 0, "The error box that hosts the text is not displayed");
             
                //Ok, I have to admit.....all of the above is a trashy very non-optimized way of doing things.
                // all you need to do for 1+2 is:
                // driver.findElement(By.cssSelector("div[style*=block]")).getText();//but still, double check !!
                // and use the above line inside an assertion....

                //Now, In playwright:
                // await page.locator('div[style*=block]'); 
                // will wait till the element is found according to the wait provided in the playwright.config.js file.