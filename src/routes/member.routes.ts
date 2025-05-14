import { authenticate, authorize } from '../middleware/auth.middleware';
import { registerMember, getMembers, getDashboardStats, exportMembers } from '../controller/member.controller'
import { UserRole } from '../types/custom.types';
import { Router } from 'express';

const router = Router();

// Public route for registration
router.post('/register', registerMember);

// Protected routes
router.use(authenticate);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Get members based on user role
router.get('/', getMembers);

// Export members to Excel
router.get('/export', exportMembers);

export default router;