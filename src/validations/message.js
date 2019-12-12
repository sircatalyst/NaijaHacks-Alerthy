import Joi from '@hapi/joi';

const schema = {
  create: Joi.object({
    message: Joi.string()
      .min(2)
      .required(),
    subject: Joi.string()
      .min(2)
      .required()
  }),

  get: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .error(new Error('req params must be a positive number'))
  }),

  update: Joi.object()
    .keys({
      message: Joi.string().min(2),
      subject: Joi.string().min(2)
    })
    .or('message', 'subject')
};

module.exports = schema;
