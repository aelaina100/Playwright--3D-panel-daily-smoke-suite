const { default: axios } = require('axios');
const fs = require('fs');
// Load dynamic URL from loggingTestDataUrl.json
const { URL: APP_URL } = JSON.parse(fs.readFileSync('./utils/loggingTestDataUrl.json', 'utf-8'));

const SLACK_WEBHOOK = 'https://hooks.slack.com/services/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'; // my own slack
//https://hooks.slack.com/services/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  //Cinco-ai Slack.
const REPORT_PATH = './test-results.json';

// Read and parse test results
const testResults = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));

// Format test cases
const testCases = testResults.suites.flatMap(suite => 
  suite.specs.flatMap(spec => 
    (spec.tests || []).flatMap(test => 
      test.results?.length ? [{
        title: spec.title,
        status: test.results[0].status,
        duration: test.results[0].duration
      }] : []
    )
  )
);

// Fallback duration handling
const totalDuration = testResults.duration
  ? (testResults.duration / 1000).toFixed(2) + 's'
  : (testCases.reduce((sum, tc) => sum + (tc.duration || 0), 0) / 1000).toFixed(2) + 's';
//
const formattedDate = new Date().toLocaleString('en-US', {
  weekday: 'long',    // e.g., "Monday"
  year: 'numeric',    // e.g., "2025"
  month: 'long',      // e.g., "April"
  day: 'numeric',     // e.g., "23"
  hour: 'numeric',    // 12-hour format
  minute: '2-digit',
  hour12: true        // Forces AM/PM
});
// Create Slack message blocks
const blocks = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Automated Daily Application Health Check (Smoke Testing) on ${APP_URL}* (${formattedDate })`
    }
  },
  {
    type: 'divider'
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: [
        `*Total Tests:* ${testCases.length}`,
        `*Passed:* ${testCases.filter(tc => tc.status === 'passed').length}`,
        `*Failed:* ${testCases.filter(tc => tc.status === 'failed').length}`,
        `*Duration:* ${totalDuration}`
      ].join('\n')
    }
  },
  {
    type: 'divider'
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Playwright Scripts (JavaScript):*\n' + testCases.map(tc => 
        `${tc.status === 'passed' ? '✅' : '❌'} ${tc.title} - ${tc.duration}ms`
      ).join('\n')
    }
  }
];

// Send to Slack
axios.post(SLACK_WEBHOOK, {
  blocks,
  text: `Playwright Test Report - ${testResults.config?.projects?.[0]?.name || 'Unknown Project'}`
})
.then(() => console.log('*****************************Report sent to Slack*****************************'))
.catch(error => console.error('Error sending report:', error.message));