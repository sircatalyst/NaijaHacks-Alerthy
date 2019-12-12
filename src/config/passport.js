/* eslint-disable no-console */
import { Strategy, ExtractJwt } from 'passport-jwt';
/* eslint import/no-named-as-default "error" */
import models from '../models/index';

const { User } = models;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

export default passport => {
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
