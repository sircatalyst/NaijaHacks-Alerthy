import shortid from 'shortid';
import models from '../index';
import log from '../utils/log';

// import validator schema
import schema from '../validations/user';
// import validation function
import validate from '../validations';

const UserController = {
  /**
   * @description Get a user
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
      `User Controller - GET - Request ID: ${reqId} - Started the process of get a single user - ${logData}`
    );
    models.User.findOne({ where: { id } })
      .then(user => {
        if (!user) {
          const message = 'No such user';
          log.error(
            `User Controller - GET - Request ID: ${reqId} - Error in get a single user - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        log.info(
          `User Controller - GET - Request ID: ${reqId} - SUCCESSFULLY get a user  - ${logData} - ${user}`
        );
        return res.status(200).json({
          status: 'success',
          data: user
        });
      })
      .catch(error => {
        log.error(
          `User Controller - GET - Request ID: ${reqId} - Error in getting a user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description list users
   * @access private
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  list(req, res) {
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.dataValues });

    log.info(
      `User Controller - LIST - Request ID: ${reqId} - Started the process of listing all users - ${logData}`
    );
    models.User.findAll()
      .then(user => {
        if (!user) {
          const message = 'You have no user yet';
          log.info(`User Controller - LIST - Request ID: ${reqId} - Got no user - ${logData}`);
          return res.status(200).json({
            status: 'success',
            data: message
          });
        }
        log.info(
          `User Controller - LIST - Request ID: ${reqId} - SUCCESSFULLY get list of users  - ${logData}`
        );
        const total = user.length;
        return res.status(200).json({
          status: 'success',
          data: {
            total: total,
            user
          }
        });
      })
      .catch(error => {
        log.error(
          `User Controller - LIST - Request ID: ${reqId} - Error in getting list of users - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Update a user
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
    const { first_name, last_name, gender, phone } = req.body;
    const { id } = req.params;
    log.info(
      `User Controller - UPDATE - Request ID: ${reqId} - Started the process of updating a user - ${logData}`
    );
    models.User.update(
      {
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        phone: phone
      },
      { where: { id: id } }
    )
      .then(result => {
        if (result[0] === 0) {
          const message = 'No such user';
          log.error(
            `User Controller - UPDATE - Request ID: ${reqId} - Error in updating user details - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        log.info(
          `User Controller - UPDATE - Request ID: ${reqId} - SUCCESSFULLY updated user - ${logData}`
        );
        models.User.findOne({ where: { id: id } })
          .then(user => {
            return res.status(200).json({
              status: 'success',
              user: user
            });
          })
          .catch(error => {
            log.error(
              `User Controller - UPDATE - Request ID: ${reqId} - Error in updating user details - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `User Controller - UPDATE - Request ID: ${reqId} - Error in updating user details - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Delete a user
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
      `User Controller - DELETE - Request ID: ${reqId} - Started the process of deleting a user - ${logData}`
    );

    models.User.findOne({ where: { id: id } })
      .then(user => {
        if (!user) {
          const message = 'No such user';
          log.error(
            `User Controller - DELETE - Request ID: ${reqId} - Error in deleting user - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        models.User.destroy({ where: { id: id } })
          .then(re => {
            const message = 'User deleted successfully';
            log.error(
              `User Controller - DELETE - Request ID: ${reqId} - user SUCCESSFULLY deleted - ${message} - ${logData}`
            );
            return res.status(200).json({
              status: 'success',
              message: message
            });
          })
          .catch(error => {
            log.error(
              `User Controller - DELETE - Request ID: ${reqId} - Error in deleting user - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              error: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `User Controller - UPDATE - Request ID: ${reqId} - Error in updating user details - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  }
};

module.exports = UserController;
