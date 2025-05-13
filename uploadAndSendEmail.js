const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Load OAuth2 client credentials
const CREDENTIALS_PATH = 'credentials.json';
const TOKEN_PATH = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];


  const authenticate = async () => {
  const open = (await import('open')).default;
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this URL:', authUrl);
  await open(authUrl);

  const http = require('http');
  const url = require('url');

  // Wait for the authorization code via redirect to localhost
  const code = await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const query = new url.URL(req.url, `http://localhost:3000`).searchParams;
      const code = query.get('code');
      res.end('Authentication successful! You can close this tab.');
      server.close();
      resolve(code);
    }).listen(3000, () => console.log('Waiting for OAuth2 redirect...'));
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Token saved at:', path.resolve(TOKEN_PATH));
  return oAuth2Client;
};



const uploadFile = async (auth) => {
  const drive = google.drive({ version: 'v3', auth });
  
  // ✅ REPLACE with your actual shared folder ID
  const FOLDER_ID = '1f1rQZEtjG3J8zidfp3_i2t9yX35Ogdaj';

  const fileMetadata = {
    name: 'allure-report.zip',
    parents: [FOLDER_ID], // Upload into shared folder
  };

  const media = {
    mimeType: 'application/zip',
    body: fs.createReadStream('./allure-report.zip'),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = file.data.id;

  // Now the file inherits sharing from the folder — no extra permission API call needed
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
};

const sendEmail = async (link) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ahmadelaina@gmail.com',
      pass: 'ekzg jfmm gcxv ifes' // App password
    }
  });

  const mailOptions = {
    from: 'ahmad.el-aina@wearecinco.com',
    to: 'aelaina100@gmail.com',
    subject: 'Playwright Allure Test Report',
    text: `Allure report is ready. Download it from:\n\n${link}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

(async () => {
  const auth = await authenticate();
  const link = await uploadFile(auth);
  console.log('Google Drive Link:', link);
  await sendEmail(link);
})();
