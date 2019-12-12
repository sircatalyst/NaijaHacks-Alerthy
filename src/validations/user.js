const Joi = require('@hapi/joi');

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/m;
const phone = Joi.string().regex(phoneRegex);

const schema = {
  get: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .error(new Error('req params must be a positive number'))
  }),

  update: Joi.object()
    .keys({
      first_name: Joi.string()
        .min(2)
        .max(24),
      last_name: Joi.string()
        .min(2)
        .max(24),
      gender: Joi.any().valid('male', 'female', 'others'),
      phone
    })
    .or('first_name', 'last_name', 'gender', 'phone')
};

module.exports = schema;
