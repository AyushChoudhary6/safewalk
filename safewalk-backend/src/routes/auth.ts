import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  getUserController,
  updateUserController,
  updateLocationController,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', authMiddleware, logoutController);

router.get('/users/:id', authMiddleware, getUserController);
router.put('/users/:id', authMiddleware, updateUserController);
router.post('/users/:id/location', authMiddleware, updateLocationController);

export default router;
