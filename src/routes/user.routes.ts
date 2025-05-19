// import { Router } from 'express';
// import {
//   createUser,
//   deleteUser,
//   getUsers,
//   updateUser,
// } from '../controllers/user.controller';
// import { authenticate, authorizeRole } from '../middleware/auth.middleware';

// const router = Router();

// router.use(authenticate);
// router.use((req, res, next) => authorizeRole('ADMIN_PUSAT')(req, res, next)); 

// router.get('/', getUsers);
// router.post('/create-user', createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

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
