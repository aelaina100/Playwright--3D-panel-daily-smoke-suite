// single_test.js //provided along with browserstack-fixture.js from browserstack web
/*
const expect = require('chai').expect

const { chromium } = require('playwright');

const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

(async () => {
  const caps = {
    'os': 'os x',
    'os_version': 'big sur',
    'browser': 'chrome',  // You can choose `chrome`, `edge` or `firefox` in this capability
    'browser_version': 'latest',  // We support v83 and above. You can choose `latest`, `latest-beta`, `latest-1`, `latest-2` and so on, in this capability
    'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'xspacedev_wtY4Dz',
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YEUyHixts9P8Dhss9j4h',
    'browserstack.geoLocation': "FR",
    'project': 'My First Project',
    'build': 'playwright-build-1',
    'name': 'My First Test',  // The name of your test and build. See browserstack.com/docs/automate/playwright/organize tests for more details
    'buildTag': 'reg',
    'resolution': '1280x1024',
    'browserstack.local': 'true',
    'browserstack.localIdentifier': 'local_connection_name',
    'browserstack.playwrightVersion': '1.latest',  
    'client.playwrightVersion': '1.latest',
    'browserstack.debug': 'true',  // enabling visual logs
    'browserstack.console': 'info',  // Enabling Console logs for the test
    'browserstack.networkLogs': 'true',  // Enabling network logs for the test
    'browserstack.interactiveDebugging': 'true',
  };
  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`,
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/ncr');
  const element = await page.$('[aria-label="Search"]');
  await element.click();
  await element.type('BrowserStack');
  await element.press('Enter');
  const title = await page.title('');
  console.log(title);
  try {
    expect(title).to.equal("BrowserStack - Google Search", 'Expected page title is incorrect!');
    // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matched'}})}`);
  } catch {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
  }
  await browser.close();
})();
*/