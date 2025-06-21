
import { defineConfig, devices } from '@playwright/test';

const Config = ({
  testDir: './tests',
  //retries:2, 
  timeout: 60 * 1000,      

  expect: {
    timeout: 20 * 1000, 
          },

  reporter: 'html',
  
  projects: [ 
    
    {
      name: 'Chrome execution',
      use: {
        browserName: 'chromium',   //chromium
        headless: true,    
        screenshot: 'only-on-failure',   
        video: 'retain-on-failure', // or 'on-first-retry' -Recording a video only when re-trying a test for the first time.
        ignoreHttpsErrors: true,  
        permissions: ['geolocation'],  
        trace: 'retain-on-failure', 
        // To maximize a browser window:
        viewport:null,
        launchOptions: {
          args: ["--start-maximized"],
        }
        
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
