import type { SendMailOptions } from 'nodemailer';

import logger from '../../configs/logger.config';
import mail from '../../configs/mail.config';

import getErrorMessage from './getErrorMessage';

const sendMail = async (options: SendMailOptions, logOnError: boolean = false) => {
  try {
    await mail.sendMail(options);
    return true;
  } catch (error) {
    if (logOnError) logger.error(`Failed to send email, Error: ${getErrorMessage(error)}`);
    return false;
  }
};

const sendMailSync = (options: SendMailOptions) => {
  void sendMail(options, true);
};

export { sendMail, sendMailSync };
