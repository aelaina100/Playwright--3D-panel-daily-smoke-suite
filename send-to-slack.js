const fs = require('fs');
const axios = require('axios');

const slackWebhookUrl = 'https://hooks.slack.com/services/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';

async function sendTestResults() {
  try {
    const data = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));

    let blocks = [];

    data.suites.forEach(suite => {
      suite.specs.forEach(spec => {
        const testTitle = spec.title;
        const testStatus = spec.tests[0]?.results[0]?.status || 'unknown';

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${testTitle}* ➔ \`${testStatus.toUpperCase()}\``
          }
        });
      });
    });

    await axios.post(slackWebhookUrl, {
      text: `*Playwright Test Report* :rocket:`,
      blocks: blocks
    });

    console.log('✅ Slack message sent successfully.');
  } catch (error) {
    console.error('❌ Error sending Slack message:', error);
  }
}

sendTestResults();
/*
🧠 Summary of How This Works:
fs.readFileSync('test-results.json', 'utf8') → Load fresh report

Loop over all test cases dynamically.

Get each test title and first result's status (passed, failed, etc.)

Format and send as Slack blocks (which look nice).
*/