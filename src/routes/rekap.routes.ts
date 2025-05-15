import { Router } from 'express';
import { getRekapByLevel } from '../controllers/rekap.controller';

const router = Router();
router.get('/', getRekapByLevel);

export default router;
