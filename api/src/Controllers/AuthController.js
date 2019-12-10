import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import shortid from 'shortid';
import Sequelize from 'sequelize';
import uuid from 'uuid';
import models from '../index';
import log from '../utils/log';

const Op = Sequelize.Op;

// import validator schema
import schema from '../validations/auth';
// import validation function
import validate from '../validations';
// import email function
import Email from '../utils/email';

const AuthController = {
  /**
   * @description Register New Auth
   * @access public
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  registerUser(req, res) {
    const handleValidate = validate.body(req, res, schema.register);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params, ...req.user });
    const { first_name, last_name, password, gender, email, phone } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    log.info(
      `Auth Controller - REGISTER - Request ID: ${reqId} - Started the process of registering a user - ${logData}`
    );
    models.User.findOne({ where: { email: email } })
      .then(existingUser => {
        if (existingUser) {
          const message = 'Email already exists';
          log.error(
            `Auth Controller - REGISTER - Request ID: ${reqId} - Error in creating new user - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        } else {
          models.User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword,
            gender: gender,
            phone: phone,
            reset_password: null,
            is_admin: 0,
            is_verified: 0
          })
            .then(user => {
              delete user.dataValues.password;

              // create a token
              const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                expiresIn: 3600
              });
              log.info(
                `Auth Controller - REGISTER - Request ID: ${reqId} - created a new user SUCCESSFULLY - ${logData} - ${token}`
              );
              return res.status(201).json({
                status: 'success',
                data: user,
                token: token
              });
            })
            .catch(error => {
              log.error(
                `Auth Controller - REGISTER - Request ID: ${reqId} - Error in creating new user - ${error.message} - ${logData}`
              );
              return res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
              });
            });
        }
      })
      .catch(error => {
        log.error(
          `Auth Controller - REGISTER - Request ID: ${reqId} - Error in creating new user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description Login Auth
   * @access public
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  login(req, res) {
    const handleValidate = validate.body(req, res, schema.login);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.params });
    const { password, email } = req.body;

    log.info(
      `Auth Controller - LOGIN - Request ID: ${reqId} - Started the process of login a user - ${logData}`
    );
    models.User.findOne({ where: { email: email } })
      .then(user => {
        // check if user exists
        if (!user) {
          const message = 'Authentication failed';
          log.error(
            `Auth Controller - LOGIN - Request ID: ${reqId} - Error in login user - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        // Verify password
        bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              delete user.dataValues.password;
              // Login Token
              const token = jwt.sign({ ...user.dataValues }, process.env.JWT_SECRET_KEY, {
                expiresIn: 3600
              });
              log.info(
                `Auth Controller - LOGIN - Request ID: ${reqId} - user login SUCCESSFULLY - ${logData} - ${user.dataValues.email}`
              );
              // respond with token
              return res.status(200).json({
                status: 'success',
                user: user,
                token: token
              });
            } else {
              const message = 'Authentication failed';
              log.error(
                `Auth Controller - LOGIN - Request ID: ${reqId} - Error in login user - ${message} - ${logData}`
              );
              return res.status(400).json({
                error: 'Bad Request',
                message: message
              });
            }
          })
          .catch(error => {
            log.error(
              `Auth Controller - LOGIN - Request ID: ${reqId} - Error in login user - ${error.message} - ${logData}`
            );
            return res.status(500).json({
              status: 'Internal Server Error',
              message: error.message
            });
          });
      })
      .catch(error => {
        log.error(
          `Auth Controller - LOGIN - Request ID: ${reqId} - Error in login user - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          status: 'Internal Server Error',
          message: error.message
        });
      });
  },

  /**
   * @description forget Password
   * @access public
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   */
  forgetPassword(req, res) {
    const handleValidate = validate.body(req, res, schema.forgetPassword);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const resetCode = uuid.v4();
    const reqId = shortid.generate();
    const { email } = req.body;
    const logData = JSON.stringify({ ...req.body, ...req.params });

    log.info(
      `Auth Controller - FORGET PASSWORD - Request ID: ${reqId} - Started the process of of resetting user password - ${logData}`
    );

    models.User.findOne({ where: { email: email } })
      .then(existingUser => {
        if (!existingUser) {
          const message = 'You have no account with us';
          log.error(
            `Auth Controller - FORGET PASSWORD - Request ID: ${reqId} Error: - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        } else {
          const expireTime = Date.now() + 84600;
          models.User.update(
            { reset_password: resetCode, password_expire: expireTime },
            { where: { email: email } }
          )
            .then(() => {
              log.info(
                `Auth Controller - FORGET PASSWORD - Request ID: ${reqId} - Successfully generated reset code for user - ${logData}`
              );
              const receiver = email;
              const message = `api/v1/verify/reset=${resetCode}`;
              const subject = `ALERTHY: You forgot your password`;
              Email.send(receiver, message, subject, reqId, logData);
            })
            .then(() => {
              const message = 'Password changed successfully';
              log.info(
                `Auth Controller - FORGET PASSWORD - Request ID: ${reqId} - Successfully email reset code to user  - ${logData}`
              );
              return res.status(200).json({
                status: 'success',
                message: message
              });
            })
            .catch(error => {
              log.error(
                `Auth Controller - FORGET PASSWORD - Request ID: ${reqId} - Error: ${error.message} - ${logData}`
              );
              return res.status(500).json({
                status: 'Internal Server Error',
                message: error.message
              });
            });
        }
      })
      .catch(error => {
        log.error(
          `Auth Controller - FORGET PASSWORD - Request ID: ${reqId} - Error: ${error.message} - ${logData}`
        );
        return res.status(500).json({
          status: 'Internal Error',
          message: error.message
        });
      });
  },

  /**
   * @description Change user password
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   * @access private
   */
  changePassword(req, res) {
    const handleValidate = validate.body(req, res, schema.changePassword);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }

    const reqId = shortid.generate();
    const logData = JSON.stringify({ ...req.body, ...req.user.email });
    const { old_password, new_password } = req.body;

    log.info(
      `Auth Controller - CHANGE PASSWORD - Request ID: ${reqId} - Started the process of changing user password - ${logData}`
    );
    // compare user's password input with user db password
    bcrypt
      .compare(old_password, req.user.password)
      .then(match => {
        if (match) {
          log.info(
            `Auth Controller - CHANGE PASSWORD - Request ID: ${reqId} - user input password match with old password - ${logData}`
          );
          const newHashedPassword = bcrypt.hashSync(new_password, 8);
          models.User.update({ password: newHashedPassword }, { where: { id: req.user.id } }).then(
            () => {
              const message = 'Password changed successfully';
              log.info(
                `Auth Controller - CHANGE PASSWORD - Request ID: ${reqId} - user new password updated successfully - ${logData}`
              );
              return res.status(200).json({
                status: 'success',
                message: message
              });
            }
          );
        } else {
          const message = 'Password incorrect';
          log.error(
            `Auth Controller - CHANGE PASSWORD - Request ID: ${reqId} - Error in changing user password - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            error: message
          });
        }
      })
      .catch(error => {
        log.error(
          `Auth Controller - CHANGE PASSWORD - Request ID: ${reqId} - Error in changing user password - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          status: 'Internal Server Error',
          error: error
        });
      });
  },

  /**
   * @description verify reset code for user who forgot password
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   * @access public
   */
  verifyForgetPassword(req, res) {
    const handleValidate = validate.query(req, res, schema.verifyResetPassword);
    if (handleValidate.statusCode === 422) {
      return handleValidate;
    }
    const reqId = shortid.generate();
    let logData = JSON.stringify({ ...req.body });
    const { reset } = req.query;

    log.info(
      `Auth Controller - VERIFY FORGET PASSWORD - Request ID: ${reqId} - Started the process of verifying reset code for forget password - ${logData}`
    );
    models.User.findOne({
      where: { reset_password: reset },
      password_expire: { [Op.lt]: Date.now() }
    })
      .then(user => {
        if (reset !== user.dataValues.reset_password) {
          const message = 'Unknown user';
          logData = { ...user.dataValues.email };
          log.error(
            `Auth Controller - VERIFY FORGET PASSWORD - Request ID: ${reqId} Error: - ${message} - ${logData}`
          );
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        } else {
          delete user.dataValues.password;
          // Login Token
          const token = jwt.sign({ ...user.dataValues }, process.env.JWT_SECRET_KEY, {
            expiresIn: 3600
          });
          log.info(
            `Auth Controller - VERIFY FORGET PASSWORD - Request ID: ${reqId} - generate token successfully - ${logData} - ${user.email}`
          );
          // respond with token
          return res.status(200).json({
            status: 'success',
            data: {
              changePasswordUrl: 'http://localhost:5000/api/v1/forget',
              user: user,
              token: token
            }
          });
        }
      })
      .catch(error => {
        log.error(
          `Auth Controller - VERIFY FORGET PASSWORD - Request ID: ${reqId} - Error in verifying  user password - ${error.message} - ${logData}`
        );
        return res.status(500).json({
          status: 'Internal Server Error',
          error: error
        });
      });
  },

  /**
   * @description log out user
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   * @access private
   */
  logout(req, res) {
    const reqId = shortid.generate();
    let logData = JSON.stringify({ ...req.user.dataValues });

    log.info(
      `Auth Controller - LOGOUT - Request ID: ${reqId} - Started the process of logging user out - ${logData}`
    );
    delete req.headers.authorization; //delete token from header
    req.rawHeaders.splice(5, 1); //remove token
    delete req.user; //delete user object

    if (req.user == undefined) {
      const message = 'You have successfully logout';
      log.info(
        `Auth Controller - LOGOUT - Request ID: ${reqId} - SUCCESSFULLY log user out - ${logData}`
      );
      return res.status(200).json({
        status: 'success',
        data: message
      });
    }
    const message = 'Something went wrong';
    log.error(
      `Auth Controller - LOGOUT - Request ID: ${reqId} - Error in logging user out - ${error.message} - ${logData}`
    );
    return res.status(500).json({
      status: 'Internal Server Error',
      data: message
    });
  }
};

module.exports = AuthController;
