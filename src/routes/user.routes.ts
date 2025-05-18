import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controllers/user.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use((req, res, next) => authorizeRole('ADMIN_PUSAT')(req, res, next)); 

router.get('/', getUsers);
router.post('/create-user', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
