import { Router } from "express";
import { authenticate, authorize } from '../middleware/auth.middleware';

import {
  registerMember,
  getMembers,
  exportMembers,
  getAllMembers,
} from '../controllers/member.controller';


const router = Router();
// Member routes
router.post('/members/register', registerMember);
router.get('/get-members',  getMembers);
router.get('/members/export', exportMembers);
router.get('/get-all-members',getAllMembers);
export default router;