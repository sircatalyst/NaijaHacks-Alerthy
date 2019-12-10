import { Router } from 'express';
import passport from 'passport';
/* eslint import/no-named-as-default "error" */
import AlertController from '../controllers/AlertController';

const router = Router();

router.post('/', passport.authenticate('jwt', { session: false }), AlertController.create);

router.get('/:id', passport.authenticate('jwt', { session: false }), AlertController.get);

router.get('/', passport.authenticate('jwt', { session: false }), AlertController.list);

router.patch('/:id', passport.authenticate('jwt', { session: false }), AlertController.update);

router.delete('/:id', passport.authenticate('jwt', { session: false }), AlertController.delete);

router.patch('/send/:id', passport.authenticate('jwt', { session: false }), AlertController.send);

router.patch('/stop', passport.authenticate('jwt', { session: false }), AlertController.stopAlert);

router.patch(
  '/test/send/:id',
  passport.authenticate('jwt', { session: false }),
  AlertController.sendTest
);

export default router;
