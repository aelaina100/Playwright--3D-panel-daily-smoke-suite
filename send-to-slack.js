const { default: axios } = require('axios');
const fs = require('fs');

const SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';
const REPORT_PATH = './test-results.json';

// Read and parse test results
const testResults = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));

// Format test cases
const testCases = testResults.suites.flatMap(suite => 
  suite.specs.flatMap(spec => ({
    title: spec.title,
    status: spec.tests[0].results[0].status,
    duration: spec.tests[0].results[0].duration
  }))
);

// Create Slack message blocks
const blocks = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Test Results Report* (${new Date().toLocaleString()})`
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
        `*Duration:* ${(testResults.duration / 1000).toFixed(2)}s`
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
      text: '*Test Cases:*\n' + testCases.map(tc => 
        `${tc.status === 'passed' ? '✅' : '❌'} ${tc.title} - ${tc.duration}ms`
      ).join('\n')
    }
  }
];

// Send to Slack
axios.post(SLACK_WEBHOOK, {
  blocks,
  text: `Playwright Test Report - ${testResults.config.projects[0].name}`
})
.then(() => console.log('Report sent to Slack'))
.catch(error => console.error('Error sending report:', error.message));