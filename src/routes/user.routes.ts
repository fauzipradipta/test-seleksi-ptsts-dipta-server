import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { login, getCurrentUser,registerUser,getAllUsers} from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getCurrentUser);
router.post('/register-admin', registerUser);
router.get('/get-all-users', getAllUsers);



// export default router;
export default router;
