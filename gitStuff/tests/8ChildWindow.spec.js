
/*Pre-requisite:
  To understand this test, you need to familiarize yourself with the following concepts:
    'await' keyword is to make the execution of code sequential (line by line).
    The execution of each line is a "promise".
    There are 3 states of a promise:
        1- Pending  = still in the process of being executed.
        2- Fulfilled = step executed successfully.
        3- Rejected  =  step failed for some reason such as element not identified or a million other reasons.

    SO whenever a single line of code is executed in JS, the executtion will immediately return a promise,
    that is the status of the execution of that line of code
    
    Now, examine this: 
    If we need 2 (or more) lines of code to be parallelly executed (Asynchronous execution),
    where once their execution is completed, so that the controller can move to the next line of code,
    then we need to use promise.all() method.

     promise.all() takes an array of promises.
        becasue the first line will return one type of promise
        and the second line will return another type of promise.
    
    The use in this test is as follows:

    promise.all(
    [
        context.waitForEvent('page'), // No await here, so promise = pending (=controller immediately moves to the next line while stille xecuting this line).)
        box_blinkingText.click();  // performs operation so that promise = fulfilled immediately.
    ]);
        //and controller will interate for the second time where 1st line this time has a promise = fulfilled
        // so now controller will come out of the promise.all() and onto the next line of code
        // becasue all of the steps in the promise.all() have been executed successfully 
        // = having promiseS = fulfilled.

        AND at ANY point of time, if any of the promises in the array is rejected,
        then the script will throw an error and stop executing the rest of the code.
*/
const { test, expect } = require('@playwright/test'); // what instructor has been using //add the 'expect' here only
//import { test } from '@playwright/test'; // for typescript (ts) files. (not js files).
test('Child Window', async ({ browser }) => {

    const context= await browser.newContext(); // opens a fresh instance of the browser (Just like incognito mode).
    // The below two steps create an actual page in the browser where a url will be entered 
    const page= await context.newPage(); 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    //Now, remember the above 3 lines are specific to the url entered above.

    const box_blinkingText= page.locator("[href*='documents-request']");

// Now click on the link to open the child window.
    //.However, driver (page in PlayWright terminology) will still be on the parent window.
    // so I will have the need to switch onto the child window in order to perform some actions on it.
    // to do that, switch to the context of the child window by performing the below steps:

   const [childPage]=  await Promise.all([  
    //[childPage] childPage is in an array as more than one page can open up in the browser.
        
            context.waitForEvent('page'), // No await here, so promise = pending (=controller immediately moves to the next line while stille xecuting this line).)
            box_blinkingText.click(),  // performs operation so that promise = fulfilled immediately.
        ])
            //and controller will interate for the second time where 1st line this time has a promise = fulfilled
            // so now controller will come out of the promise.all() and onto the next line of code
            // becasue all of the steps in the promise.all() have been executed successfully 
            // = having promiseS = fulfilled.
    
            //AND at ANY point of time, if any of the promises in the array is rejected,
            //then the script will throw an error and stop executing the rest of the code.

    // This .waitForEvent() method keeps on waiting(listening) till a new page is created in the original context
    // once a new page is created, then this listner will be triggered and the context will be switched to the child window.
    // and this child window is captured is variable childPage.

    //Now, bottom line is: if you feel that 2 or more steps should or need to go parallelly (asynchronously)
    // in your Playwright script, before proceeding to the next line of code,
    // then you can use the promise.all() method.
    //where controller will iterate untill all of the promises in the array are fulfilled.
    // and this is when the controller can move to the next line of code
    

    //Now the controller has been switched to the child window.
    //and is represented by the variable childPage.
  
    //Now, print out the red text in the console:
    const text= await childPage.locator(".red").textContent();
    console.log(text);
    
    //Now, out of the red text, extract the email address and print it out in the parent window:
    const email= await childPage.locator("[href*=mailto]").textContent(); //  [href*=.com] not working. Investigate !
    //email = "mentor@rahulshettyacademy.com"
    console.log(email);

    //Now, from the email address, extract the email id and print it out.
    const emailDomain= email.split("@")[1]. split('.')[0]; // this will give you the domain name of the email address.
    console.log(emailDomain); // prints out: rahulshettyacademy.

    //await page.pause()
    //On the parent page, enter the email domain in the username field:
    await page.locator('#username').fill(emailDomain); // enter the email domain in the username field.

     await page.pause(); // takes an argument of time. But, does it even work ?
     
     //Now, assume with that one .click() method, two child windows are opened up.
      // so the code will be as follows:
    //const [childPage1, childPage2]=  await Promise.all([
});