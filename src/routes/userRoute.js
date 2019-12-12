const { Router } = require('express');
const passport = require('passport');
/* eslint import/no-named-as-default "error" */
const UserController = require('../Controllers/UserController');

const router = Router();

router.get('/:id', passport.authenticate('jwt', { session: false }), UserController.get);

router.get('/', passport.authenticate('jwt', { session: false }), UserController.list);

router.patch('/:id', passport.authenticate('jwt', { session: false }), UserController.update);

router.delete('/:id', passport.authenticate('jwt', { session: false }), UserController.delete);

module.exports = router;
