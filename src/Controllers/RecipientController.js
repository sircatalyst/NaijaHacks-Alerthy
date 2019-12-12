const shortid = require('shortid');
// const cron = require('cron');
const models = require('../models');

// import logger
const log = require('../utils/log');
// import sms
const Sms = require('../utils/sms');
// import email function
const Email = require('../utils/email');
// import validator schema
const schema = require('../validations/recipient');
// import validation function
const validate = require('../validations');

const RecipientController = {

  /**
   * @description Create Alert recipients
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
    const { recipient_phone, recipient_email, first_name, last_name } = req.body;
    log.info(
      `RECIPIENT Controller - CREATE RECIPIENT - Request ID: ${reqId} - Started the process of creating a recipient - ${logData}`
    );

    models.Recipient.create({
      first_name,
      last_name,
      recipient_phone: recipient_phone.toString(),
      recipient_email: recipient_email.toString(),
      user_id: req.user.dataValues.id
    })
      .then(alert => {
        log.info(
          `RECIPIENT Controller - CREATE RECIPIENT - Request ID: ${reqId} - created a new alert recipient SUCCESSFULLY - ${logData}`
        );
        return res.status(201).json({
          status: 'success',
          data: alert
        });
      })
      .catch(error => {
        log.error(
          `RECIPIENT Controller - CREATE - Request ID: ${reqId} - Error in creating a new alert recipient - ${error.message} - ${logData}`
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
      `RECIPIENT Controller - GET - Request ID: ${reqId} - Started the process of get a single RECIPIENT of a user - ${logData}`
    );
    models.Recipient.findOne({ where: { id, user_id: req.user.dataValues.id } })
      .then(alert => {
        if (!alert) {
          const message = 'No such recipient';
          log.error(
            `RECIPIENT Controller - GET - Request ID: ${reqId} - Error in get a single user's RECIPIENT - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        log.info(
          `RECIPIENT Controller - GET - Request ID: ${reqId} - SUCCESSFULLY get a user RECIPIENT  - ${logData}`
        );
        return res.status(200).json({
          status: 'success',
          data: alert
        });
      })
      .catch(error => {
        log.error(
          `RECIPIENT Controller - GET - Request ID: ${reqId} - Error in getting a RECIPIENT for a user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description list all alert recipient of a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  list(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });

    log.info(
      `RECIPIENT Controller - LIST - Request ID: ${reqId} - Started the process of listing all RECIPIENTS of a user - ${logData}`
    );

    models.Recipient.findAll({ where: { user_id: req.user.dataValues.id } })
      .then(alert => {
        if (alert.length === 0) {
          const message = 'You have no alert yet';
          log.info(`RECIPIENT Controller- LIST - Request ID: ${reqId} - Got no alert - ${logData}`);
          return res.status(200).json({
            status: 'success',
            message,
            data: []
          });
        }
        log.info(
          `RECIPIENT Controller - LIST - Request ID: ${reqId} - SUCCESSFULLY get list of user's recipient - ${logData}`
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
          `RECIPIENT Controller - LIST - Request ID: ${reqId} - Error in getting list of a user's RECIPIENT - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description list all alert recipient of all users
   * @access private admin
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  listAllRecipient(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.dataValues });

    log.info(
      `RECIPIENT Controller - LIST ALL RECIPIENTS - Request ID: ${reqId} - Started the process of listing all RECIPIENTS of all users - ${logData}`
    );

    models.Recipient.findAll()
      .then(alert => {
        if (alert.length === 0) {
          const message = 'No user has a RECIPIENT yet';
          log.info(
            `RECIPIENT Controller - LIST ALL RECIPIENTS  - Request ID: ${reqId} - No user has an RECIPIENT - ${logData}`
          );
          return res.status(200).json({
            status: 'success',
            message,
            data: []
          });
        }
        log.info(
          `RECIPIENT Controller - LIST ALL RECIPIENTS  - Request ID: ${reqId} - SUCCESSFULLY list of all users' RECIPIENT - ${logData}`
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
          `RECIPIENT Controller - LIST ALL RECIPIENTS - Request ID: ${reqId} - Error in getting list of all users' RECIPIENT - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Update a user's recipient
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
    const { first_name, last_name, recipient_phone, recipient_email } = req.body;
    const { id } = req.params;
    log.info(
      `RECIPIENT Controller - UPDATE - Request ID: ${reqId} - Started the process of updating a user's single RECIPIENT - ${logData}`
    );
    models.Recipient.update(
      {
        first_name,
        last_name,
        recipient_phone: recipient_phone.toString(),
        recipient_email: recipient_email.toString()
      },
      { where: { id, user_id: req.user.dataValues.id } }
    )
      .then(result => {
        if (result[0] === 0) {
          const message = 'No such recipient';
          log.error(
            `RECIPIENT Controller - UPDATE - Request ID: ${reqId} - Error in updating a user's single RECIPIENT - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message,
            data: []
          });
        }
        log.info(
          `RECIPIENT Controller - UPDATE - Request ID: ${reqId} - SUCCESSFULLY updated a single user's recipient - ${logData}`
        );
        models.Recipient.findOne({ where: { id: id, user_id: req.user.dataValues.id } })
          .then(alert => {
            return res.status(200).json({
              status: 'success',
              user: alert
            });
          })
          .catch(error => {
            log.error(
              `RECIPIENT Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's RECIPIENT - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `RECIPIENT Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's RECIPIENT - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Delete a user's recipient
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
      `RECIPIENT Controller - DELETE - Request ID: ${reqId} - Started the process of deleting a RECIPIENT by a user - ${logData}`
    );

    models.Recipient.findOne({ where: { id, user_id: req.user.dataValues.id } })
      .then(user => {
        if (!user) {
          const message = 'No such recipient';
          log.error(
            `RECIPIENT Controller - DELETE - Request ID: ${reqId} - Error in deleting a RECIPIENT - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message,
            data: []
          });
        }
        models.Recipient.destroy({ where: { id, user_id: req.user.dataValues.id } })
          .then(() => {
            const message = 'Recipient deleted successfully';
            log.error(
              `RECIPIENT Controller - DELETE - Request ID: ${reqId} - recipient SUCCESSFULLY deleted - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `RECIPIENT Controller - DELETE - Request ID: ${reqId} - Error in deleting a RECIPIENT - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `RECIPIENT Controller - DELETE - Request ID: ${reqId} - Error in deleting a RECIPIENT - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

};

module.exports = RecipientController;