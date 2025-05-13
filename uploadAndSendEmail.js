const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { execSync } = require('child_process');

// CONFIG
const GITHUB_REPO = 'https://github.com/aelaina100/Allure-Report.git';
const GH_PAGES_DIR = 'gh-pages';
const REPORT_DIR = 'allure-report';
const EMAIL_RECIPIENT = 'ahmad.el-aina@wearecinco.com';

const sendEmail = async (link) => {
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ahmadelaina@gmail.com',                // the sender !
      pass: 'ekzg jfmm gcxv ifes' // App password
    }
  }); 

  const mailOptions = {
    from: 'ahmad.el-aina@wearecinco.com',
    to: EMAIL_RECIPIENT,
    subject: 'Playwright Allure Test Report (Hostedggggg)',
    text: `Allure report is now live here:\n\n${link}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const injectBaseHref = () => {
  const indexPath = path.join(REPORT_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Cannot find index.html at ${indexPath}`);
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('<base href')) {
    html = html.replace('<head>', `<head>\n  <base href="/Allure-Report/">`);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✔️ Injected <base href> into index.html');
  }
};

const deployToGitHubPages = () => {
  const branchDir = path.resolve(GH_PAGES_DIR);

  // Inject base tag before deployment
  injectBaseHref();

  // Clear & recreate branch dir
  if (fs.existsSync(branchDir)) fs.rmSync(branchDir, { recursive: true });
  fs.mkdirSync(branchDir);

  // Copy report files
  execSync(`xcopy /E /I /Y ${REPORT_DIR}\\* ${GH_PAGES_DIR}`, { stdio: 'inherit' });

  // Init git and push
  process.chdir(GH_PAGES_DIR);
  execSync('git init', { stdio: 'inherit' });
  execSync('git remote add origin ' + GITHUB_REPO, { stdio: 'inherit' });
  execSync('git checkout -b gh-pages', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy Allure report"', { stdio: 'inherit' });
  execSync('git push --force origin gh-pages', { stdio: 'inherit' });

  // Reset back
  process.chdir('..');

  // Construct link
  const link = `https://${GITHUB_REPO.split('/')[3]}.github.io/${GITHUB_REPO.split('/')[4].replace('.git', '')}/`;
  return link;
};

(async () => {
  try {
    const hostedLink = deployToGitHubPages();
    console.log('📦 Hosted Report:', hostedLink);
    await sendEmail(hostedLink);
  } catch (err) {
    console.error('❌ Failed to deploy or email:', err);
  }
})();
