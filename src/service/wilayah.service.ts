import { pool } from '../config/database';
import {
  getAllProvinsi,
  getKabupatenByProvinsi,
  getKecamatanByKabupaten,
  getKelurahanByKecamatan,
  getWilayahChain
} from '../models/wilayah.model';
import { UserRole } from '../types/custom.types';

export const getWilayahHierarchy = async () => {
  const provinsiList = await getAllProvinsi();
  return provinsiList;
};

export const getChildWilayah = async (type: string, parentId: number) => {
  switch (type) {
    case 'kabupaten':
      return await getKabupatenByProvinsi(parentId);
    case 'kecamatan':
      return await getKecamatanByKabupaten(parentId);
    case 'kelurahan':
      return await getKelurahanByKecamatan(parentId);
    default:
      throw new Error('Invalid wilayah type');
  }
};

export const getWilayahSummary = async (role: UserRole, wilayahId: number) => {
  if (!role || !wilayahId) {
    throw new Error('Invalid user data');
  }

  let query = '';
  let params = [wilayahId];

  switch (role) {
    case 'admin_provinsi':
      query = `
        SELECT p.nama as provinsi_name,
        (SELECT COUNT(*) FROM kabupaten WHERE provinsi_id = $1) as child_count,
        (SELECT COUNT(*) FROM members m
         JOIN kelurahan k ON m.kelurahan_id = k.id
         JOIN kecamatan kc ON k.kecamatan_id = kc.id
         JOIN kabupaten kb ON kc.kabupaten_id = kb.id
         WHERE kb.provinsi_id = $1) as total_members
        FROM provinsi p WHERE p.id = $1`;
      break;

    case 'admin_kabupaten':
      query = `
        SELECT kb.nama as kabupaten_name,
        (SELECT COUNT(*) FROM kecamatan WHERE kabupaten_id = $1) as child_count,
        (SELECT COUNT(*) FROM members m
         JOIN kelurahan k ON m.kelurahan_id = k.id
         JOIN kecamatan kc ON k.kecamatan_id = kc.id
         WHERE kc.kabupaten_id = $1) as total_members
        FROM kabupaten kb WHERE kb.id = $1`;
      break;

    case 'admin_kecamatan':
      query = `
        SELECT kc.nama as kecamatan_name,
        (SELECT COUNT(*) FROM kelurahan WHERE kecamatan_id = $1) as child_count,
        (SELECT COUNT(*) FROM members m
         JOIN kelurahan k ON m.kelurahan_id = k.id
         WHERE k.kecamatan_id = $1) as total_members
        FROM kecamatan kc WHERE kc.id = $1`;
      break;

    case 'admin_kelurahan':
      query = `
        SELECT k.nama as kelurahan_name,
        (SELECT COUNT(*) FROM members WHERE kelurahan_id = $1) as total_members
        FROM kelurahan k WHERE k.id = $1`;
      break;

    default:
      throw new Error('Unauthorized');
  }

  const result = await pool.query(query, params);
  return result.rows[0];
};

export const getWilayahForExport = async (role: UserRole, wilayahId: number) => {
  let query = '';
  let params = [wilayahId];

  switch (role) {
    case 'admin_provinsi':
      query = `
        SELECT 
          kb.nama as wilayah_name,
          (SELECT COUNT(*) FROM members m
           JOIN kelurahan k ON m.kelurahan_id = k.id
           JOIN kecamatan kc ON k.kecamatan_id = kc.id
           WHERE kc.kabupaten_id = kb.id) as total_members
        FROM kabupaten kb
        WHERE kb.provinsi_id = $1
        ORDER BY kb.nama`;
      break;

    case 'admin_kabupaten':
      query = `
        SELECT 
          kc.nama as wilayah_name,
          (SELECT COUNT(*) FROM members m
           JOIN kelurahan k ON m.kelurahan_id = k.id
           WHERE k.kecamatan_id = kc.id) as total_members
        FROM kecamatan kc
        WHERE kc.kabupaten_id = $1
        ORDER BY kc.nama`;
      break;

    case 'admin_kecamatan':
      query = `
        SELECT 
          k.nama as wilayah_name,
          (SELECT COUNT(*) FROM members WHERE kelurahan_id = k.id) as total_members
        FROM kelurahan k
        WHERE k.kecamatan_id = $1
        ORDER BY k.nama`;
      break;

    case 'admin_kelurahan':
      query = `
        SELECT 
          m.nama,
          m.nik,
          m.no_hp,
          p.nama as provinsi,
          kb.nama as kabupaten,
          kc.nama as kecamatan,
          k.nama as kelurahan,
          m.created_at as tanggal_daftar
        FROM members m
        JOIN kelurahan k ON m.kelurahan_id = k.id
        JOIN kecamatan kc ON k.kecamatan_id = kc.id
        JOIN kabupaten kb ON kc.kabupaten_id = kb.id
        JOIN provinsi p ON kb.provinsi_id = p.id
        WHERE k.id = $1
        ORDER BY m.created_at DESC`;
      break;

    default:
      throw new Error('Unauthorized');
  }

  const result = await pool.query(query, params);
  return result.rows;
};