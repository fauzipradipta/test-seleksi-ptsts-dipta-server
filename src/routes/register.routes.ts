import { Router } from 'express';
import { registerMember, getRegistrationStats } from '../controllers/registration.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/custom.types';

const router = Router();

// Public route
router.post('/', registerMember);

// Protected routes
router.use(authenticate);
router.get('/stats', getRegistrationStats);

export default router;