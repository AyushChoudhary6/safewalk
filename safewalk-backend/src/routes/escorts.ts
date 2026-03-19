import express from 'express';
import {
  requestEscortController,
  getEscortRequestsController,
  respondToEscortController,
  startEscortController,
  completeEscortController,
} from '../controllers/escortController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/escorts/request', authMiddleware, requestEscortController);
router.get('/escorts/requests/:userId', authMiddleware, getEscortRequestsController);
router.put('/escorts/requests/:requestId/respond', authMiddleware, respondToEscortController);
router.put('/escorts/requests/:requestId/start', authMiddleware, startEscortController);
router.put('/escorts/requests/:requestId/complete', authMiddleware, completeEscortController);

export default router;
