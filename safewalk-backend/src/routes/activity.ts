import express from 'express';
import {
  logWalkActivityController,
  getActivityHistoryController,
  getActivityController,
} from '../controllers/activityController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/activity/walk', authMiddleware, logWalkActivityController);
router.get('/activity/:userId', authMiddleware, getActivityHistoryController);
router.get('/activity/detail/:activityId', authMiddleware, getActivityController);

export default router;
