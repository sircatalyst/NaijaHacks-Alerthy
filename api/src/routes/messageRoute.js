const { Router } = require('express');
const passport = require('passport');
/* eslint import/no-named-as-default "error" */
const MessageController = require('../Controllers/MessageController');

const router = Router();

router.post('/', passport.authenticate('jwt', { session: false }), MessageController.create); 

router.post('/main', passport.authenticate('jwt', { session: false }), MessageController.createMain);

router.get('/main', passport.authenticate('jwt', { session: false }), MessageController.getMainMessage);

router.get('/:id', passport.authenticate('jwt', { session: false }), MessageController.get);

router.get('/', passport.authenticate('jwt', { session: false }), MessageController.list);

router.patch('/main', passport.authenticate('jwt', { session: false }), MessageController.updateMain);

router.patch('/:id', passport.authenticate('jwt', { session: false }), MessageController.update);

router.delete('/main', passport.authenticate('jwt', { session: false }), MessageController.deleteMain);

router.delete('/:id', passport.authenticate('jwt', { session: false }), MessageController.delete);


module.exports = router;
