import mailgun from 'mailgun-js';
import dotenv from 'dotenv';
import log from './log';

dotenv.config();
const { MAILGUN_API_KEY, MAILGUN_DOMAIN_ID } = process.env;

const domain = MAILGUN_API_KEY;
const apiKey = MAILGUN_DOMAIN_ID;
const mail = mailgun({ apiKey, domain });

const Email = {
  forgetPassword(receiver, message, reqId, logData, res) {
    const subject = 'X-PROJECT: LINK TO RESET YOUR PASSWORD ';
    const sender = 'donotreply@DONT.com';
    const data = {
      from: sender,
      to: receiver,
      subject,
      text: message
    };
    /* eslint no-unused-vars: "error" */
    return mail.messages().send(data, (error, body) => {
      if (error) {
        log.error(
          `User Controller - FORGET PASSWORD - Request ID: ${reqId} - Error: ${error.message} 
            - ${logData}`
        );
        return res.status(error.statusCode).json({
          status: 'Internal Error',
          message: error.message
        });
      }
      log.info(
        `User Controller - FORGET PASSWORD - Request ID: ${reqId} 
                - Successfully email reset code to user - ${logData}`
      );
      return res.status(201).json({
        status: 'success',
        message: 'Check your email to reset your password'
      });
    });
  }
};

module.exports = Email;
