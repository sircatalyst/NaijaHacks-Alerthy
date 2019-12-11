import Joi from '@hapi/joi';

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/m;
const phone = Joi.string().regex(phoneRegex);
const schema = {
  create: Joi.object({
    first_name: Joi.string()
      .min(2)
      .required(),
    last_name: Joi.string()
      .min(2)
      .required(),
    recipient_phone: Joi.array()
      .items(phone.required())
      .required(),
    recipient_email: Joi.array()
      .items(
        Joi.string()
          .email()
          .required()
      )
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
      first_name: Joi.string().min(2),
      last_name: Joi.string().min(2),
      recipient_phone: Joi.array().items(phone.required()),
      recipient_email: Joi.array().items(
        Joi.string()
          .email()
          .required()
      )
    })
    .or('first_name', 'last_name', 'recipient_phone', 'recipient_email'),

  sendUpdate: Joi.object({
    location: Joi.string()
  })
};

module.exports = schema;
