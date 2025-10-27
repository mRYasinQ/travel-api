import type { SendMailOptions } from 'nodemailer';

import logger from '../../configs/logger.config';
import mail from '../../configs/mail.config';

import getErrorMessage from './getErrorMessage';

const sendMail = async (options: SendMailOptions) => {
  try {
    await mail.sendMail(options);
    return true;
  } catch {
    return false;
  }
};

const sendMailSync = (options: SendMailOptions) => {
  mail.sendMail(options).catch((error) => {
    logger.error(`Failed to send email, Error: ${getErrorMessage(error)}`);
  });
};

export { sendMail, sendMailSync };
