// /api/stats - numbers for the dashboard stat tiles
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/me', statsController.myStats);
router.get('/admin', requireRole('admin'), statsController.adminStats);

export default router;
