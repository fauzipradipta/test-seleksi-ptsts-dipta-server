import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  registerMember,
  getMembers,
  exportMembers,
  getDashboardStats
} from '../controllers/member.controller';
import { login, getCurrentUser } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getCurrentUser);

// Member routes
router.post('/members', registerMember);
router.get('/members', authenticate, getMembers);
router.get('/members/export', authenticate, exportMembers);

// Dashboard route
router.get('/dashboard', authenticate, getDashboardStats);

// export default router;
export default router;
