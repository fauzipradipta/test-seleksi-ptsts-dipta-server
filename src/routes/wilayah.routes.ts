import { Router } from 'express';
import { 
  getProvinsiList,
  getKabupatenByProvinsi,
  getKecamatanByKabupaten,
  getKelurahanByKecamatan,
  getWilayahSummary,
  exportWilayahData
} from '../controller/wilayah.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types/custom.types';

const router = Router();

// Public routes for wilayah selection (used in registration form)
router.get('/provinsi', getProvinsiList);
router.get('/provinsi/:provinsiId/kabupaten', getKabupatenByProvinsi);
router.get('/kabupaten/:kabupatenId/kecamatan', getKecamatanByKabupaten);
router.get('/kecamatan/:kecamatanId/kelurahan', getKelurahanByKecamatan);

// Protected routes (require authentication)
router.use(authenticate);

// Get wilayah summary based on user's role and wilayah
router.get('/summary', getWilayahSummary);

// Export wilayah data to Excel
router.get('/export', exportWilayahData);

export default router;