const { default: axios } = require('axios');
const fs = require('fs');

const SLACK_WEBHOOK = 'https://hooks.slack.com/services/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'; // my own slack
//https://hooks.slack.com/services/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  //Cinco-ai Slack.
const REPORT_PATH = './test-results.json';

// Read and parse test results
const testResults = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));

// Format test cases
const testCases = testResults.suites.flatMap(suite => 
  suite.specs.flatMap(spec => (spec.tests || []).map(test => ({
    title: spec.title,
    status: test.results[0]?.status || 'unknown',
    duration: test.results[0]?.duration || 0
  })))
);

// Fallback duration handling
const totalDuration = testResults.duration
  ? (testResults.duration / 1000).toFixed(2) + 's'
  : (testCases.reduce((sum, tc) => sum + (tc.duration || 0), 0) / 1000).toFixed(2) + 's';

// Create Slack message blocks
const blocks = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Automated Daily Application Health Check (Smoke Testing)* (${new Date().toLocaleString()})`
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
