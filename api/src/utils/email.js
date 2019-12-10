import sgMail from '@sendgrid/mail';
import log from './log';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Email = {
  send(receiver, message, subject, reqId, logData) {
    const sender = 'test@example.com';
    const msg = {
      to: receiver,
      from: sender,
      subject,
      text: message
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    return new Promise((resolve, reject) => {
      sgMail.send(msg, (error, body) => {
        if (error) {
          log.error(
            `EMAIL METHOD - SEND - Email not sent successfully - Request ID: ${reqId} - Error: ${error.message} 
              - ${logData}`
          );
          reject({
            error
          });
        } else {
          log.info(
            `EMAIL METHOD - SEND - Successfully sent email - Request ID: ${reqId} - ${logData}`
          );
          resolve({
            body
          });
        }
      });
    });
  }
};

module.exports = Email;
