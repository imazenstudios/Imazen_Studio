import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

console.log("=== Debugging Nodemailer Credentials ===");
console.log(`EMAIL_USER: "${process.env.EMAIL_USER}"`);
console.log(`EMAIL_PASS: "${process.env.EMAIL_PASS}"`);
console.log("=========================================");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to self
      subject: "Test Email",
      text: "This is a test email."
    });
    console.log("SUCCESS! Email sent: ", info.messageId);
  } catch (err) {
    console.error("FAILED TO SEND EMAIL:");
    console.error(err);
  }
}

test();
