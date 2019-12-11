import { Router } from 'express';
import passport from 'passport';
/* eslint import/no-named-as-default "error" */
import AlertController from '../Controllers/AlertController';
import MessageController from '../Controllers/MessageController';
import RecipientController from '../Controllers/RecipientController';

const router = Router();

router.get(
  '/alerts',
  passport.authenticate('jwt', { session: false }),
  AlertController.listAllAlerts
);

router.get(
  '/messages',
  passport.authenticate('jwt', { session: false }),
  MessageController.listAllAlertMessages
);

router.get(
  '/messages/main',
  passport.authenticate('jwt', { session: false }),
  MessageController.listAllMainMessages
);

router.get(
  '/recipients',
  passport.authenticate('jwt', { session: false }),
  RecipientController.listAllRecipient
);

export default router;
