import nodemailer from 'nodemailer';

const { MAIL_SECURE, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;

const mail = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: Number(MAIL_SECURE) === 1,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export default mail;
