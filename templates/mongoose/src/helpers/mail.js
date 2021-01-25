import winston from 'winston';
import sgMail from '@sendgrid/mail';

// eslint-disable-next-line import/prefer-default-export
export async function sendEmail(email) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_MAIL);
    const msg = {
      to: email,
      from: 'Express App<email@example.com>',
      subject: 'Welcome Email',
      text: 'Welcome to Express App',
    };
    await sgMail.send(msg);
    winston.info('Mail sent!');
  } catch (error) {
    winston.error(error.message);
    throw error;
  }
}
