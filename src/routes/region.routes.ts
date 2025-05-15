import { Router } from 'express';
import {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan
} from '../controllers/region.controller';

const router = Router();

router.get('/provisi', getProvinsi);
router.get('/kabupaten/:provinsiId', getKabupaten);
router.get('/kecamatan/:kabupatenId', getKecamatan);
router.get('/kelurahan/:kecamatanId', getKelurahan);

export default router;
