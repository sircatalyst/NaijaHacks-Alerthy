import { Router } from 'express';
import passport from 'passport';
/* eslint import/no-named-as-default "error" */
import UserController from '../controllers/UserController';

const router = Router();

router.get('/:id', passport.authenticate('jwt', { session: false }), UserController.get);

router.get('/', passport.authenticate('jwt', { session: false }), UserController.list);

router.patch('/:id', passport.authenticate('jwt', { session: false }), UserController.update);

router.delete('/:id', passport.authenticate('jwt', { session: false }), UserController.delete);

export default router;
