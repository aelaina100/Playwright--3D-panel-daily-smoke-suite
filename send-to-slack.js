const fs = require('fs');
const axios = require('axios');

// Load dynamic URL from loggingTestDataUrl.json
const { URL: APP_URL } = JSON.parse(
  fs.readFileSync('./utils/loggingTestDataUrl.json', 'utf-8')
);

// Slack webhook URL
//const slackWebhookUrl ='https://hooks.slack.com/services/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'; // the new group channel to send Slack reports to.
const slackWebhookUrl = 'https://hooks.slack.com/services/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';

async function sendTestResults() {
  try {
    const data = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
    const now = new Date();
    const weekday = now.toLocaleString('en-US', { weekday: 'long' });
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const testUrl = APP_URL;
    let blocks = [];

    // 🔹 Header block with title, run-date, and bracketed credit
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          `*Automated Daily Application Health Check (Smoke Testing)* :spiral_calendar_pad:
Run on *${weekday}, ${month} ${day}, ${year} at ${time}* [Scripts coded & maintained by Ahmad El-Aina]`
      }
    });

    // 🔹 Application URL block
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Application URL:*\n<${testUrl}|${testUrl}>`
      }
    });

    blocks.push({ type: 'divider' });

    // 🔹 Loop through test results
    data.suites.forEach(suite => {
      suite.specs.forEach(spec => {
        const testTitle = spec.title;
        const result = spec.tests[0]?.results[0] || {};
        const status = (result.status || 'unknown').toUpperCase();
        const durationMs = typeof result.duration === 'number' ? result.duration : 0;
        const durationSec = (durationMs / 1000).toFixed(2);

        // Adding emoji based on test result
        let statusEmoji = '';
        if (status === 'PASS' || status === 'PASSED') {
          statusEmoji = '✅'; // Passed emoji
        } else if (status === 'FAIL' || status === 'FAILED') {
          statusEmoji = ':x:'; // Larger failed emoji
        } else {
          statusEmoji = '❔'; // Unknown status emoji
        }

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${testTitle}* ➔ ${statusEmoji} \`${status}\` (${durationSec}s)`
          }
        });
      });
    });

    // 🔹 Total duration summary with emojis
    let totalDurationMs = data.suites.reduce(
      (sum, suite) =>
        sum +
        suite.specs.reduce(
          (subSum, spec) =>
            subSum + (typeof spec.tests[0]?.results[0]?.duration === 'number'
              ? spec.tests[0].results[0].duration
              : 0),
          0
        ),
      0
    );
    const totalSec = (totalDurationMs / 1000).toFixed(2);

    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `⏱️ *Total Execution Time:* \`${totalSec}s\` ⏱️`
      }
    });

    // 🔹 Final horizontal line
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '______________________________________________________________________________________'
      }
    });

    // 🔹 Send to Slack
    await axios.post(slackWebhookUrl, {
      text: `*Playwright Test Report* :rocket:`,
      blocks
    });

    console.log('✅ Slack message sent successfully.');
  } catch (error) {
    console.error('❌ Error sending Slack message:', error);
  }
}

sendTestResults();
