import { Router } from 'express';
import passport from 'passport';
/* eslint import/no-named-as-default "error" */
import RecipientController from '../Controllers/RecipientController';

const router = Router();

router.post('/', passport.authenticate('jwt', { session: false }), RecipientController.create);

router.get('/:id', passport.authenticate('jwt', { session: false }), RecipientController.get);

router.get('/', passport.authenticate('jwt', { session: false }), RecipientController.list);

router.patch('/:id', passport.authenticate('jwt', { session: false }), RecipientController.update);

router.delete('/:id', passport.authenticate('jwt', { session: false }), RecipientController.delete);

export default router;
