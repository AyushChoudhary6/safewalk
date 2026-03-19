import express from 'express';
import {
  calculateRouteSafetyController,
  saveRouteController,
  getRouteController,
} from '../controllers/routeController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/routes/calculate-safety', optionalAuthMiddleware, calculateRouteSafetyController);
router.post('/routes', authMiddleware, saveRouteController);
router.get('/routes/:id', optionalAuthMiddleware, getRouteController);

export default router;
