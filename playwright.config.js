
import { defineConfig, devices } from '@playwright/test';

const Config = ({
  testDir: './tests',
  retries:2, 
  timeout: 33 * 1000,      //https://playwright.dev/docs/test-timeouts

  expect: {
    timeout: 10 * 1000, // 10 seconds
          },

  reporter: 'html',
  
  projects: [ 
    
    {
      name: 'Chrome execution',
      use: {
        browserName: 'chromium',   
        headless: false,    
        screenshot: 'only-on-failure',   
        video: 'retain-on-failure', // 'retain-on-failure'.  'on-first-retry' -Recording a video only when re-trying a test for the first time.
        ignoreHttpsErrors: true,  
        permissions: ['geolocation'],  
        trace: 'off', 
        
      }
    },
     ]
});

export default defineConfig({
  reporter: [  //This reporter is that of Slack
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
});
module.exports = Config 
