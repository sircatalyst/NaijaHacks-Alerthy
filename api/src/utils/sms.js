import twilio from 'twilio';
import log from './log';

let client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const Sms = {
  send(receiver, message, reqId, logData) {
    client.messages
      .create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: receiver,
        body: message
      })
      .then(result => {
        log.info(`SMS METHOD - SEND - Request ID: ${reqId} - SUCCESSFULLY sent SMS  - ${logData}`);
      })
      .catch(error => {
        log.info(
          `SMS METHOD - SEND - Request ID: ${reqId} - Error sending SMS - Error: ${error.message} - ${logData}`
        );
      });
  }
};

module.exports = Sms;
