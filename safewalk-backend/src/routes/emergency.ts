import express from 'express';
import {
  createSOSAlertController,
  getSOSAlertsController,
  resolveSOSAlertController,
  getActiveSOSAlertsController,
} from '../controllers/emergencyController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/emergency/sos', authMiddleware, createSOSAlertController);
router.get('/emergency/:userId', authMiddleware, getSOSAlertsController);
router.put('/emergency/:alertId/resolve', authMiddleware, resolveSOSAlertController);
router.get('/emergency/active/all', authMiddleware, getActiveSOSAlertsController);

export default router;
