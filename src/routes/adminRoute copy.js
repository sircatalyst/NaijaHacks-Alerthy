const { Router } = require('express');
const passport = require('passport');
/* eslint import/no-named-as-default "error" */
const AlertController = require('../Controllers/AlertController');
const MessageController = require('../Controllers/MessageController');
const RecipientController = require('../Controllers/RecipientController');

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

module.exports = router;
