import { Router } from 'express';
import { registerMember, getMembers } from '../controllers/member.controller';

const router = Router();

router.post('/', registerMember);
router.get('/', getMembers);

export default router;
