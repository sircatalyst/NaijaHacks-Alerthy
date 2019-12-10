import shortid from 'shortid';
import models from '../index';

// import logger
import log from '../utils/log';
// import sms
import Sms from '../utils/sms';
// import email function
import Email from '../utils/email';
// import validator schema
import schema from '../validations/alert';
// import validation function
import validate from '../validations';

const AlertController = {
  /**
   * @description Alert user's selected recipients
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  create(req, res) {
    const handleValidate = validate.body(req, res, schema.create);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.dataValues });
    const { message, recipient_phone, recipient_email, subject, first_name, last_name } = req.body;
    log.info(
      `Alert Controller - CREATE - Request ID: ${reqId} - Started the process of creating an alert - ${logData}`
    );

    models.Alert.create({
      first_name,
      last_name,
      message: message,
      recipient_phone: recipient_phone.toString(),
      recipient_email: recipient_email.toString(),
      subject: subject,
      user_id: req.user.dataValues.id,
      test_send: 1
    })
      .then(alert => {
        log.info(
          `Alert Controller - CREATE - Request ID: ${reqId} - created a new alert SUCCESSFULLY - ${logData}`
        );
        return res.status(201).json({
          status: 'success',
          data: alert
        });
      })
      .catch(error => {
        log.error(
          `Alert Controller - CREATE - Request ID: ${reqId} - Error in creating a new alert - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Get an alert of a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  get(req, res) {
    const handleValidate = validate.params(req, res, schema.get);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params });
    const { id } = req.params;

    log.info(
      `ALERT Controller - GET - Request ID: ${reqId} - Started the process of get a single alert of a user - ${logData}`
    );
    models.Alert.findOne({ where: { id, user_id: req.user.dataValues.id } })
      .then(alert => {
        if (!alert) {
          const message = 'No such alert';
          log.error(
            `ALERT Controller - GET - Request ID: ${reqId} - Error in get a single user's alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        log.info(
          `ALERT Controller - GET - Request ID: ${reqId} - SUCCESSFULLY get a user alert  - ${logData}`
        );
        return res.status(200).json({
          status: 'success',
          data: alert
        });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - GET - Request ID: ${reqId} - Error in getting an alert for a user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description list all alert messages of a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  list(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });

    log.info(
      `ALERT Controller - LIST - Request ID: ${reqId} - Started the process of listing all alert of a user - ${logData}`
    );

    models.Alert.findAll({ where: { user_id: req.user.dataValues.id } })
      .then(alert => {
        if (alert.length === 0) {
          const message = 'You have no alert yet';
          log.info(`ALERT Controller - LIST - Request ID: ${reqId} - Got no alert - ${logData}`);
          return res.status(200).json({
            status: 'success',
            data: message
          });
        }
        log.info(
          `ALERT Controller - LIST - Request ID: ${reqId} - SUCCESSFULLY get list of user's alert - ${logData}`
        );
        const total = alert.length;
        return res.status(200).json({
          status: 'success',
          data: {
            total: total,
            alert
          }
        });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - LIST - Request ID: ${reqId} - Error in getting list of a user's alert - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description list all alert messages of all users
   * @access private admin
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  listAllAlerts(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.dataValues });

    log.info(
      `ALERT Controller - LIST ALL ALERTS - Request ID: ${reqId} - Started the process of listing all alert of all users - ${logData}`
    );

    models.Alert.findAll()
      .then(alert => {
        if (alert.length === 0) {
          const message = 'No user has an alert yet';
          log.info(
            `ALERT Controller - LIST ALL ALERTS  - Request ID: ${reqId} - No user has an alert - ${logData}`
          );
          return res.status(200).json({
            status: 'success',
            data: message
          });
        }
        log.info(
          `ALERT Controller - LIST ALL ALERTS  - Request ID: ${reqId} - SUCCESSFULLY list of all users' alert messages - ${logData}`
        );
        return res.status(200).json({
          status: 'success',
          data: alert
        });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - LIST ALL ALERTS - Request ID: ${reqId} - Error in getting list of all users' alert messages - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Update a user's alert
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  update(req, res) {
    const handleValidate = validate.body(req, res, schema.update);
    const handleValidateParams = validate.params(req, res, schema.get);
    if (handleValidate.statusCode === 422 || handleValidateParams.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });
    const { first_name, last_name, message, recipient_phone, recipient_email, subject } = req.body;
    const { id } = req.params;
    log.info(
      `ALERT Controller - UPDATE - Request ID: ${reqId} - Started the process of updating a user's single alert - ${logData}`
    );
    models.Alert.update(
      {
        first_name,
        last_name,
        message,
        recipient_phone: recipient_phone.toString(),
        recipient_email: recipient_email.toString(),
        subject
      },
      { where: { id, user_id: req.user.dataValues.id } }
    )
      .then(result => {
        if (result[0] === 0) {
          const message = 'No such alert';
          log.error(
            `Alert Controller - UPDATE - Request ID: ${reqId} - Error in updating a user's single alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        log.info(
          `ALERT Controller - UPDATE - Request ID: ${reqId} - SUCCESSFULLY updated a single user's alert - ${logData}`
        );
        models.Alert.findOne({ where: { id: id, user_id: req.user.dataValues.id } })
          .then(alert => {
            return res.status(200).json({
              status: 'success',
              user: alert
            });
          })
          .catch(error => {
            log.error(
              `ALERT Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's alert - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's alert - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Delete an alert by a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  delete(req, res) {
    const handleValidate = validate.params(req, res, schema.get);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });
    const { id } = req.params;
    log.info(
      `ALERT Controller - DELETE - Request ID: ${reqId} - Started the process of deleting an alert by a user - ${logData}`
    );

    models.Alert.findOne({ where: { id, user_id: req.user.dataValues.id } })
      .then(user => {
        if (!user) {
          const message = 'No such alert';
          log.error(
            `ALERT Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        models.Alert.destroy({ where: { id, user_id: req.user.dataValues.id } })
          .then(() => {
            const message = 'Alert deleted successfully';
            log.error(
              `ALERT Controller - DELETE - Request ID: ${reqId} - alert SUCCESSFULLY deleted - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `ALERT Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Send an alert of a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  send(req, res) {
    const handleValidate = validate.body(req, res, schema.sendUpdate);
    const handleValidateParams = validate.params(req, res, schema.get);
    if (handleValidate.statusCode === 422 || handleValidateParams.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });
    const { location } = req.body;
    const { id } = req.params;

    log.info(
      `ALERT Controller - SEND - Request ID: ${reqId} - Started the process of sending a user's alert- ${logData}`
    );
    models.Alert.findOne({ where: { id, user_id: req.user.dataValues.id } })
      .then(alert => {
        if (!alert) {
          const message = 'No such alert';
          log.error(
            `ALERT Controller - SEND - Request ID: ${reqId} - Error in get a single user's alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        models.Alert.update(
          {
            location,
            trigger_time: new Date().toLocaleString()
          },
          { where: { id, user_id: req.user.dataValues.id } }
        )
          .then(() => {
            log.info(
              `ALERT Controller - SEND - Request ID: ${reqId} - SUCCESSFULLY get a user alert  - ${logData}`
            );
            const subject = `ALERTHY EMERGENCY: ${alert.subject}`;
            const recipientPhoneArray = alert.recipient_phone.split(',');
            const message = `${
              alert.message
            } sent from ${location} at ${new Date().toLocaleString()}`;
            //send sms
            for (let i = 0; i < recipientPhoneArray.length; i++) {
              Sms.send(recipientPhoneArray[i], message, reqId, logData);
            }
            //send emails
            Email.send(alert.recipient_email.split(','), message, subject, reqId, logData);
          })
          .then(() => {
            const message = 'Alert sent successfully';
            log.error(
              `ALERT Controller - SEND - Request ID: ${reqId} - alert SUCCESSFULLY SENT - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `ALERT Controller - SEND - Request ID: ${reqId} - Error in getting an alert for a user - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - SEND - Request ID: ${reqId} - Error in getting an alert for a user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description TEST Send an alert of a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  sendTest(req, res) {
    const handleValidate = validate.body(req, res, schema.sendUpdate);
    const handleValidateParams = validate.params(req, res, schema.get);
    if (handleValidate.statusCode === 422 || handleValidateParams.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });
    const { location } = req.body;
    const { id } = req.params;

    log.info(
      `ALERT Controller - SEND TEST - Request ID: ${reqId} - Started the process of sending a user's alert- ${logData}`
    );
    models.Alert.findOne({ where: { id, user_id: req.user.dataValues.id, test_send: 1 } })
      .then(alert => {
        if (!alert) {
          const message = 'No such alert';
          log.error(
            `ALERT Controller - SEND TEST - Request ID: ${reqId} - Error in get a single user's alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        models.Alert.update(
          {
            location,
            trigger_time: new Date().toLocaleString()
          },
          { where: { id, user_id: req.user.dataValues.id } }
        )
          .then(() => {
            log.info(
              `ALERT Controller - SEND TEST - Request ID: ${reqId} - SUCCESSFULLY get a user alert  - ${logData}`
            );
            const subject = `TEST ALERTHY EMERGENCY : ${alert.subject}`;
            const recipientPhoneArray = alert.recipient_phone.split(',');
            const message = `This is TEST: ${
              alert.message
            } sent from ${location} at ${new Date().toLocaleString()}`;
            //send sms
            for (let i = 0; i < recipientPhoneArray.length; i++) {
              Sms.send(recipientPhoneArray[i], message, reqId, logData);
            }
            //send emails
            Email.send(alert.recipient_email.split(','), message, subject, reqId, logData);
          })
          .then(() => {
            const message = 'Alert sent successfully';
            log.error(
              `ALERT Controller - SEND TEST - Request ID: ${reqId} - alert SUCCESSFULLY SENT - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `ALERT Controller - SEND TEST - Request ID: ${reqId} - Error in getting an alert for a user - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `ALERT Controller - SEND TEST - Request ID: ${reqId} - Error in getting an alert for a user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  }
};

module.exports = AlertController;
