import express from 'express';
import { userLogin } from '../controllers/userController.js';
import authorizedUserRoutes from './authoriedUserRoutes.js';

const router = express.Router();

router.post('/login', userLogin);

router.use('/user', authorizedUserRoutes);

export default router;
