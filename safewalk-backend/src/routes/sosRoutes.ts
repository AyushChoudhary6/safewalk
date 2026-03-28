import { Router } from 'express';
import { triggerSOS, updateLocation, stopSOS } from '../controllers/sosController';

const router = Router();

// SOS System Endpoints
router.post('/trigger', triggerSOS);
router.post('/update-location', updateLocation);
router.post('/stop', stopSOS);

export default router;
