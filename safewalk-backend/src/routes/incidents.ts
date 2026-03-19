import express from 'express';
import {
  reportIncidentController,
  getNearbyIncidentsController,
  getIncidentController,
  verifyIncidentController,
  disputeIncidentController,
  getRecentIncidentsController,
} from '../controllers/incidentController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/incidents', optionalAuthMiddleware, reportIncidentController);
router.get('/incidents/nearby', optionalAuthMiddleware, getNearbyIncidentsController);
router.get('/incidents/recent', optionalAuthMiddleware, getRecentIncidentsController);
router.get('/incidents/:id', optionalAuthMiddleware, getIncidentController);
router.put('/incidents/:id/verify', authMiddleware, verifyIncidentController);
router.put('/incidents/:id/dispute', authMiddleware, disputeIncidentController);

export default router;
