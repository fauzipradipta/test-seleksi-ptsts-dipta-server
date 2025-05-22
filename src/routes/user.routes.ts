import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  registerMember,
  getMembers,
  exportMembers,
  getDashboardStats
} from '../controllers/member.controller';
import { login, getCurrentUser,registerUser } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getCurrentUser);
router.post('/register-admin', registerUser);


// Dashboard route
router.get('/dashboard', authenticate, getDashboardStats);

// export default router;
export default router;
