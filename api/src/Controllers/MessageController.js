import shortid from 'shortid';
import models from '../index';

// import logger
import log from '../utils/log';

// import validator schema
import schema from '../validations/message';
// import validation function
import validate from '../validations';

const MessageController = {


    /**
   * @description Create alert messages
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  createMain(req, res) {
    const handleValidate = validate.body(req, res, schema.create);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.dataValues });
    const { message, subject } = req.body;
    log.info(
      `MESSAGE Controller - CREATE MESSAGE MAIN - Request ID: ${reqId} - Started the process of creating an alert main message - ${logData}`
    );
    models.Message.findOne({ where: { user_id: req.user.dataValues.id, is_main: 1 } })
    .then(msg => {
      if (msg) {
        const message = 'You can already have a main message';
        log.info(
          `ALERT Controller - CREATE MESSAGE MAIN - Request ID: ${reqId} - Error in get a single user's alert - ${message} - ${logData}`
        );
        return res.status(200).json({
          error: 'success',
          message: message
        });
      }
      models.Message.create({
        message,
        subject,
        is_main: 1,
        user_id: req.user.dataValues.id
      })
      .then(message => {
        log.info(
          `MESSAGE Controller - CREATE MESSAGE - Request ID: ${reqId} - created a new alert message SUCCESSFULLY - ${logData}`
        );
        return res.status(201).json({
          status: 'success',
          data: message
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - CREATE MESSAGE - Request ID: ${reqId} - Error in creating a new alert message - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
    })
    .catch(error => {
      log.error(
        `MESSAGE Controller - CREATE MESSAGE - Request ID: ${reqId} - Error in creating a new alert message - ${error.message} - ${logData}`
      );
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    });
  },


  /**
   * @description Create alert messages
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
    const { message, subject } = req.body;
    log.info(
      `MESSAGE Controller - CREATE MESSAGE - Request ID: ${reqId} - Started the process of creating an alert message - ${logData}`
    );
    models.Message.create({
      message,
      subject,
      user_id: req.user.dataValues.id,
      is_main: 0
    })
      .then(message => {
        log.info(
          `MESSAGE Controller - CREATE MESSAGE - Request ID: ${reqId} - created a new alert message SUCCESSFULLY - ${logData}`
        );
        return res.status(201).json({
          status: 'success',
          data: message
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - CREATE MESSAGE - Request ID: ${reqId} - Error in creating a new alert message - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Get a message of a user
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
      `MESSAGE Controller - GET - Request ID: ${reqId} - Started the process of getting a single alert of a user - ${logData}`
    );
    models.Message.findOne({ where: { id, user_id: req.user.dataValues.id, is_main: 0 } })
      .then(msg => {
        if (!msg) {
          const message = 'No such message';
          log.error(
            `ALERT Controller - GET - Request ID: ${reqId} - Error in get a single user's alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - GET - Request ID: ${reqId} - SUCCESSFULLY get a message alert  - ${logData}`
        );
        return res.status(200).json({
          status: 'success',
          data: msg
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - GET - Request ID: ${reqId} - Error in getting an alert  message for a user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },


    /**
   * @description Get a message of a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  getMainMessage(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params });

    log.info(
      `MESSAGE Controller - GET - Request ID: ${reqId} - Started the process of getting a single alert of a user - ${logData}`
    );
    models.Message.findOne({ where: { user_id: req.user.dataValues.id, is_main: 1 } })
      .then(msg => {
        if (!msg) {
          const message = 'You have no main message yet';
          log.error(
            `MESSAGE Controller - GET - Request ID: ${reqId} - Error in get a single user's alert - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - GET - Request ID: ${reqId} - SUCCESSFULLY get a message alert  - ${logData}`
        );
        return res.status(200).json({
          status: 'success',
          data: msg
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - GET - Request ID: ${reqId} - Error in getting an alert  message for a user - ${error.message} - ${logData}`
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
      `MESSAGE Controller - LIST - Request ID: ${reqId} - Started the process of listing all alert messages of a user - ${logData}`
    );

    models.Message.findAll({ where: { user_id: req.user.dataValues.id, is_main: 0 } })
      .then(msg => {
        if (msg.length === 0) {
          const message = 'You have no alert message yet';
          log.info(`MESSAGE Controller - LIST - Request ID: ${reqId} - Got no alert message - ${logData}`);
          return res.status(200).json({
            status: 'success',
            message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - LIST - Request ID: ${reqId} - SUCCESSFULLY get list of user's alert messages - ${logData}`
        );
        const total = msg.length;
        return res.status(200).json({
          status: 'success',
          data: {
            total: total,
            msg
          }
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - LIST - Request ID: ${reqId} - Error in getting list of a user's alert  messages- ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },


    /**
   * @description list all MAIN alert messages of all users
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  listAllMainMessages(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });

    log.info(
      `MESSAGE Controller - LIST - Request ID: ${reqId} - Started the process of listing all alert messages of a user - ${logData}`
    );

    models.Message.findAll({ where: { is_main: 1 } })
      .then(msg => {
        if (msg.length === 0) {
          const message = 'You have no alert message yet';
          log.info(`MESSAGE Controller - LIST - Request ID: ${reqId} - Got no alert message - ${logData}`);
          return res.status(200).json({
            status: 'success',
            message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - LIST - Request ID: ${reqId} - SUCCESSFULLY get list of user's alert messages - ${logData}`
        );
        const total = msg.length;
        return res.status(200).json({
          status: 'success',
          data: {
            total: total,
            msg
          }
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - LIST - Request ID: ${reqId} - Error in getting list of a user's alert  messages- ${error.message} - ${logData}`
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
  listAllAlertMessages(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.dataValues });

    log.info(
      `MESSAGE Controller - LIST ALL ALERTS - Request ID: ${reqId} - Started the process of listing all alert of all users - ${logData}`
    );

    models.Message.findAll()
      .then(msg => {
        if (msg.length === 0) {
          const message = 'No user has an alert message yet';
          log.info(
            `MESSAGE Controller - LIST ALL ALERTS  - Request ID: ${reqId} - No user has an alert message - ${logData}`
          );
          return res.status(200).json({
            status: 'success',
            message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - LIST ALL ALERTS  - Request ID: ${reqId} - SUCCESSFULLY list of all users' alert messages - ${logData}`
        );
        const total = msg.length;
        return res.status(200).json({
          status: 'success',
          data: {
            total: total,
            msg
          }
        });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - LIST ALL ALERT MESSAGES - Request ID: ${reqId} - Error in getting list of all users' alert messages - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

    /**
   * @description Update a user's MAIN MESSAGE
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  updateMain(req, res) {
    const handleValidate = validate.body(req, res, schema.update);;
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user.dataValues });
    const { message, subject } = req.body;
    log.info(
      `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Started the process of updating a user's single alert message - ${logData}`
    );
    models.Message.update(
      {
        message,
        subject
      },
      { where: { user_id: req.user.dataValues.id, is_main: 1 } }
    )
      .then(result => {
        if (result[0] === 0) {
          const message = 'You have no main message yet';
          log.error(
            `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Error in updating a user's single alert message- ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - UPDATE - Request ID: ${reqId} - SUCCESSFULLY updated a single user's alert message - ${logData}`
        );
        models.Message.findOne({ where: { user_id: req.user.dataValues.id, is_main: 1 } })
          .then(msg => {
            return res.status(200).json({
              status: 'success',
              user: msg
            });
          })
          .catch(error => {
            log.error(
              `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's alert message - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `MESSSAGE Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's alert message - ${error.message} - ${logData}`
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
    const { message, subject } = req.body;
    const { id } = req.params;
    log.info(
      `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Started the process of updating a user's single alert message - ${logData}`
    );
    models.Message.update(
      {
        message,
        subject
      },
      { where: { id, user_id: req.user.dataValues.id, is_main: 0 } }
    )
      .then(result => {
        if (result[0] === 0) {
          const message = 'No such alert';
          log.error(
            `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Error in updating a user's single alert message- ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        log.info(
          `MESSAGE Controller - UPDATE - Request ID: ${reqId} - SUCCESSFULLY updated a single user's alert message - ${logData}`
        );
        models.Message.findOne({ where: { id: id, user_id: req.user.dataValues.id, is_main: 0 } })
          .then(msg => {
            return res.status(200).json({
              status: 'success',
              user: msg
            });
          })
          .catch(error => {
            log.error(
              `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's alert message - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - UPDATE - Request ID: ${reqId} - Error in updating a single user's alert message - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Delete a MAIN alert message by a user
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  deleteMain(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body,  ...req.user.dataValues });
    log.info(
      `MESSAGE Controller - DELETE - Request ID: ${reqId} - Started the process of deleting an alert message by a user - ${logData}`
    );

    models.Message.findOne({ where: { user_id: req.user.dataValues.id, is_main: 1 } })
      .then(user => {
        if (!user) {
          const message = 'You have no main alert message';
          log.error(
            `MESSAGE Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert  message- ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        models.Message.destroy({ where: { user_id: req.user.dataValues.id, is_main: 1 } })
          .then(() => {
            const message = 'Alert message deleted successfully';
            log.error(
              `MESSAGE Controller - DELETE - Request ID: ${reqId} - alert  message SUCCESSFULLY deleted - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `MESSAGE Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert message - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert message - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  
  /**
   * @description Delete an alert message by a user
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
      `MESSAGE Controller - DELETE - Request ID: ${reqId} - Started the process of deleting an alert message by a user - ${logData}`
    );

    models.Message.findOne({ where: { id, user_id: req.user.dataValues.id, is_main: 0 } })
      .then(user => {
        if (!user) {
          const message = 'No such alert message';
          log.error(
            `MESSAGE Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert  message- ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message,
            data: []
          });
        }
        models.Message.destroy({ where: { id, user_id: req.user.dataValues.id, is_main: 0 } })
          .then(() => {
            const message = 'Alert message deleted successfully';
            log.error(
              `MESSAGE Controller - DELETE - Request ID: ${reqId} - alert  message SUCCESSFULLY deleted - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `MESSAGE Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert message - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `MESSAGE Controller - DELETE - Request ID: ${reqId} - Error in deleting an alert message - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

}

module.exports = MessageController;