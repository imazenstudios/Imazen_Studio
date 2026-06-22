import nodemailer from 'nodemailer';
import dns from 'dns';

export const getMailer = (user, pass) => {
  return nodemailer.createTransport({
    // Hardcode an official Gmail IPv4 Anycast address to absolutely bypass Vercel's IPv6 DNS override
    host: '142.250.114.108',
    port: 465,
    secure: true,
    auth: {
      user: user || process.env.EMAIL_USER,
      pass: pass || process.env.EMAIL_PASS
    },
    tls: {
      servername: 'smtp.gmail.com'
    }
  });
};
