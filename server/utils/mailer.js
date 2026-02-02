const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PSSW
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendReminderEmail = (to, subject, text) => {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text
  });
};

module.exports = sendReminderEmail;
