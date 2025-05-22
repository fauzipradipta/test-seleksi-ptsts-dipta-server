import { Router } from "express";
import { authenticate, authorize } from '../middleware/auth.middleware';

import {
  registerMember,
  getMembers,
  exportMembers,
} from '../controllers/member.controller';


const router = Router();
// Member routes
router.post('/members/register', registerMember);
router.get('/get-members',  getMembers);
router.get('/members/export', exportMembers);

export default router;