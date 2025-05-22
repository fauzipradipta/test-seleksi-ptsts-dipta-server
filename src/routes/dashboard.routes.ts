import { Router } from "express";
import { authenticate, authorize } from '../middleware/auth.middleware';
import {

  getDashboardStats
} from '../controllers/member.controller';

const router = Router();

// Dashboard route
router.get('/dashboard', authenticate, getDashboardStats);

export default router;