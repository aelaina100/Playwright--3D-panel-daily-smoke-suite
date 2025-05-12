const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or 'Outlook', 'Yahoo', or use SMTP
  auth: {
    user: 'ahmadelaina@gmail.com',
    pass: 'ekzg jfmm gcxv ifes' // App password (not your Gmail password!)
  }
});

const mailOptions = {
  from: 'ahmad.el-aina@wearecinco.com',
  to: 'aelaina100@gmail.com',
  subject: 'Playwright Allure Test Report',
  text: 'Please find the attached Allure report.',
  attachments: [
    {
      filename: 'allure-report.zip',
      content: fs.createReadStream('./allure-report.zip')
    }
      
  ]
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error sending email: ', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
