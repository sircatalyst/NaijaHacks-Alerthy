import { Router } from 'express';
import passport from 'passport';
/* eslint import/no-named-as-default "error" */
import AlertController from '../controllers/AlertController';

const router = Router();

router.get(
  '/alerts',
  passport.authenticate('jwt', { session: false }),
  AlertController.listAllAlerts
);

export default router;
