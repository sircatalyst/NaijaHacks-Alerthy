import cron from 'node-cron';
import models from '../models/index';
import shortid from 'shortid';

// import logger
import log from './log';
// import sms
import Sms from './sms';
// import email function
import Email from './email';

    // // cron.schedule('0 30 23 * * *', () => { //at 11.30pm
    // cron.schedule('*/1 * * * *', () => { //every minute
    //     console.log("HHHSSHHSHSHHSHSHHSHSHSSHS")
    //     models.Alert.findAll({ where: { trigger_job: 1 }  })
    //     .then(alerts => {
    //         alerts.map(alert => {
    //             cron.schedule(`0 ${alert.trigger_interval} * * * *`, () => 
    //                 update(location, alert.id, alert.user_id) 
    //             );
    //         })
    //     })
    //     .catch((err) => {
    //         err;
    //     });
    // }),

    // update(location, alertId, UserId){
    //     const reqId = shortid.generate();
    //     const logData = JSON.stringify({ location, alertId, UserId});
    //     models.Alert.update(
    //         {
    //           location,
    //           trigger_time: new Date().toLocaleString()
    //         },
    //         { where: { id: alertId , user_id: UserId } }
    //     )
    //     .then(() => {
    //         log.info(
    //             `ALERT JOB METHOD - SEND - Request ID: ${reqId} - SUCCESSFULLY get a user alert  - ${logData}`
    //         );
    //         const subject = `ALERTHY EMERGENCY: ${alert.subject}`;
    //         const recipientPhoneArray = alert.recipient_phone.split(',');
    //         const message = `${alert.message} sent from ${location} at ${new Date().toLocaleString()}`;
    //         //send sms
    //         for (let i = 0; i < recipientPhoneArray.length; i++) {
    //             Sms.send(recipientPhoneArray[i], message, reqId, logData);
    //         }
    //         //send emails
    //         Email.send(alert.recipient_email.split(','), message, subject, reqId, logData);
    //     })
    //     .then(() => {
    //         const message = 'Alert sent successfully';
    //         log.error(
    //             `ALERT JOB METHOD  - SEND - Request ID: ${reqId} - alert SUCCESSFULLY SENT - ${message} - ${logData}`
    //         );
    //         return res.status(200).json({
    //         status: 'success',
    //         message: message
    //         });
    //     })
    //     .catch(error => {
    //         log.error(
    //             `ALERT JOB METHOD  - SEND - Request ID: ${reqId} - Error in getting an alert for a user - ${error.message} - ${logData}`
    //         );
    //         return res.status(500).json({
    //         error: 'Internal Server Error',
    //         message: error.message
    //         });
    //     });

    // }