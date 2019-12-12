import Joi from '@hapi/joi';

const schema = {
  create: Joi.object({
    trigger_interval: Joi.number()
      .integer()
      .positive()
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
      trigger_interval: Joi.number()
        .integer()
        .positive()
        .required()
    })
    .or('trigger_interval'),

  sendUpdate: Joi.object({
    location: Joi.string()
  })
};

module.exports = schema;
