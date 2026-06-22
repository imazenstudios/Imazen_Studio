import nodemailer from 'nodemailer';
import dns from 'dns';

export const getMailer = (user, pass) => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: user || process.env.EMAIL_USER,
      pass: pass || process.env.EMAIL_PASS
    },
    tls: {
      servername: 'smtp.gmail.com'
    },
    lookup: (hostname, options, callback) => {
      dns.resolve4(hostname, (err, addresses) => {
        if (err) return callback(err);
        callback(null, addresses[0], 4);
      });
    }
  });
};
