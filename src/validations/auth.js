import Joi from '@hapi/joi';

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/m;
const phone = Joi.string().regex(phoneRegex);
const schema = {
  register: Joi.object({
    first_name: Joi.string()
      .min(2)
      .max(24)
      .required(),
    last_name: Joi.string()
      .min(2)
      .max(24)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    gender: Joi.any()
      .valid('male', 'female', 'others')
      .required(),
    phone: phone.required(),
    password: Joi.string()
      .min(7)
      .required(),
    confirm_password: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .error(new Error('confirm password not same with password'))
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(7)
      .required()
  }),

  forgetPassword: Joi.object({
    email: Joi.string()
      .email()
      .required()
  }),

  changePassword: Joi.object({
    old_password: Joi.string()
      .min(7)
      .required(),
    new_password: Joi.string()
      .min(7)
      .required(),
    confirm_new_password: Joi.string()
      .required()
      .valid(Joi.ref('new_password'))
  }),

  verifyResetPassword: Joi.object({
    reset: Joi.string()
      .min(7)
      .required()
      .error(new Error('req query must be a valid string (min of 7)'))
  })
};

module.exports = schema;
