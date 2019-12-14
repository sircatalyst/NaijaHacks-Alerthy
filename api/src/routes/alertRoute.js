const { Router } = require('express');
const passport = require('passport');
/* eslint import/no-named-as-default "error" */
const AlertController = require('../Controllers/AlertController');

const router = Router();

router.patch('/send/main', passport.authenticate('jwt', { session: false }), AlertController.sendMain);

router.get('/stop/main', passport.authenticate('jwt', { session: false }), AlertController.stopMainAlert);

router.get('test/stop/main', passport.authenticate('jwt', { session: false }), AlertController.stopMainAlert);

router.patch(
  '/test/send/main',
  passport.authenticate('jwt', { session: false }),
  AlertController.sendMainTest
);

router.post('/', passport.authenticate('jwt', { session: false }), AlertController.create);

router.get('/:id', passport.authenticate('jwt', { session: false }), AlertController.get);

router.get('/', passport.authenticate('jwt', { session: false }), AlertController.list);

router.patch('/:id', passport.authenticate('jwt', { session: false }), AlertController.update);

router.delete('/:id', passport.authenticate('jwt', { session: false }), AlertController.delete);

router.patch('/send/:id', passport.authenticate('jwt', { session: false }), AlertController.send);

router.get('/stop/:id', passport.authenticate('jwt', { session: false }), AlertController.stopAlert);

router.get('/test/stop/:id', passport.authenticate('jwt', { session: false }), AlertController.stopAlert);

router.patch(
  '/test/send/:id',
  passport.authenticate('jwt', { session: false }),
  AlertController.sendTest
);

module.exports = router;