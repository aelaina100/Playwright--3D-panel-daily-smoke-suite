// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const Config = ({
  testDir: './tests',

  //https://playwright.dev/docs/test-timeouts
  timeout: 33 * 1000,   // for every step. 
  //Equivalent to implicit & explicit wait in selenium [for a locator to be found in the list of HTML mark-ups
  // regardless whether its associated element in the UI is loaded or not 
  expect: {
    // Maximum time expect() should wait for assertions [for an element to be identified]
    timeout: 15*1000, // 5 seconds
  },
  reporter: 'html', // 'html' is the default one. //comment it out if you are including slack reporting below.
  // Removed duplicate 'reporter' property to avoid conflicts. 


  use: {
     browserName: 'chromium', // 'chromium' or 'webkit' or 'firefox'all' (all 3 browsers).

                            // 'chromium' to launch chrome browser.
                            // 'webkit' to launch safari browser. 
                             
    headless: false,   // true or false. true means run in headless mode (no UI). false means run in headed mode (with UI).
    
    screenshot: 'on', // 'off' 'only-on-failure' check documentation !
    // 'on' it captures a screenshot at the END of each test.
    // (Too much ! but sometimes it's asked for)

    trace: 'off', // 'on' so you get detailed report for each automation step you're performing.
                               // 'on' eats up your memory (detailed explanation will be encountered below) 
                               // 'retain-on-SLACK_BOT_USER_OAUTH_TOKEN=[your Slack bot user OAUTH token] npx playwright testailure'
  },
/*
  reporter: [
    ['html'], // Generates HTML report
    [
      './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
      {
        slackWebHookUrl: 'https://hooks.slack.com/services/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',
        sendResults: 'always', // Options: "always", "on-failure", "off"
      }
    ],
    ['dot'] // Minimalistic "dot" reporter
  ],
  
  */
  
});

module.exports = Config // so that 'config' is a global variable across this project.
//'config' holds the key:value pairs of the above properties in project (Applies to all tests in the project)