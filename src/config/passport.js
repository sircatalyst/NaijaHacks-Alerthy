/* eslint-disable no-console */
const { Strategy, ExtractJwt } = require('passport-jwt');
/* eslint import/no-named-as-default "error" */
const models = require('../models/index');

const { User } = models;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

module.exports = passport => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      User.findOne({ where: { id: jwt_payload.id } })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => err);
    })
  );
};
