import { Router } from 'express';

const router = Router();

router.get('/me', (req, res) => res.json({message: 'Hello World'}));

export default router;
