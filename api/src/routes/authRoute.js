import { Router } from 'express';
import passport from 'passport';
/* eslint import/no-named-as-default "error" */
import AuthController from '../controllers/AuthController';

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

export default router;
