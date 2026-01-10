import express from 'express';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post('/jwt', AuthControllers.login);
router.post('/logout', AuthControllers.logout);

export const AuthRoutes = router;
