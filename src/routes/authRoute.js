const { Router } = require('express');
const passport = require('passport');
/* eslint import/no-named-as-default "error" */
const AuthController = require('../Controllers/AuthController');

const router = Router();

router.post('/register', AuthController.registerUser);

router.post('/login', AuthController.login);

router.patch('/forget', AuthController.forgetPassword);

router.patch(
  '/change',
  passport.authenticate('jwt', { session: false }),
  AuthController.changePassword
);

router.get('/verify?:reset', AuthController.verifyForgetPassword);

router.get('/logout', passport.authenticate('jwt', { session: false }), AuthController.logout);

module.exports = router;
