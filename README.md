📘 Cinco Playwright Automation Framework

🛠️ Setup

1. Install Dependencies

npm install   

2. Install Playwright Browsers

npx playwright install

🚀 Available Scripts

These scripts are defined in the package.json file. Run them using:

npm run <script-name>

✅ npm run All

Runs all Playwright tests using the default configuration. Equivalent to:

npx playwright test

💬 npm run testSlack

Executes the Playwright test suite and sends a report to Slack with custom formatting. Useful for CI/CD integration or team notifications.

📊 npm run WithAllureNoSlack

Runs the test suite, generates an Allure report, and opens it locally. Equivalent to:

npx rimraf allure-results allure-report && \
(npx playwright test tests/smoke.spec.js --reporter=line,allure-playwright || echo Test run failed) && \
npx allure generate ./allure-results -o ./allure-report --clean && \
npx allure open ./allure-report

📂 Project Structure

.
├── .github/                 # GitHub workflows and configuration
├── node_modules/           # Installed dependencies
├── pageobjects/            # Page Object Model implementations
├── playwright-report/      # Playwright's default HTML report output
├── test-results/           # Test result artifacts (if any)
├── tests/                  # Playwright test specs
├── tests-examples/         # Example test specs or templates
├── utils/                  # Utility functions (e.g. Slack integration)
├── .gitignore              # Git ignored files configuration
├── package-lock.json       # Dependency lock file
├── package.json            # Scripts and dependencies
├── playwright.config.js    # Playwright configuration
├── README.md               # Project documentation
├── send-to-slack.js        # Custom Slack integration script
└── uploadAndSendEmail.js   # Script to upload reports and email links

📌 Notes

Make sure you have Node.js installed.

Customize Slack and Allure integration as needed for your team.

Ensure any secrets or tokens are managed securely (e.g. via environment variables).

✅ Coming Soon

GitHub Actions CI integration

Additional test coverage and advanced reporting

For any questions or contributions, feel free to open an issue or pull request.

