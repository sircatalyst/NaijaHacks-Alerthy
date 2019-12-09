const validate = {
  body: (req, res, schema) => {
    const validData = schema.validate(req.body);

    if (validData.error != null) {
      const err = validData.error.toString().replace(/Error:/, '');
      return res.status(422).json({
        status: 'forbidden',
        message: err
      });
    }
    return validData.value;
  },

  query: (req, res, schema) => {
    const validData = schema.validate(req.query);

    if (validData.error != null) {
      const err = validData.error.toString().replace(/Error:/, '');
      return res.status(422).json({
        status: 'forbidden',
        message: err
      });
    }
    return validData.value;
  },

  params: (req, res, schema) => {
    const validData = schema.validate(req.params);

    if (validData.error != null) {
      const err = validData.error.toString().replace(/Error:/, '');
      return res.status(422).json({
        status: 'forbidden',
        message: err
      });
    }
    return validData.value;
  }
};

module.exports = validate;
