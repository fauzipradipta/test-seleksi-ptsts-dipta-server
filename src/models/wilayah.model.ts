import pool from '../config/database';
import { Provinsi, Kabupaten, Kecamatan, Kelurahan } from '../types/custom.types';

export const getAllProvinsi = async (): Promise<Provinsi[]> => {
  const result = await pool.query('SELECT * FROM provinsi ORDER BY nama');
  return result.rows;
};

export const getKabupatenByProvinsi = async (provinsiId: number): Promise<Kabupaten[]> => {
  const result = await pool.query(
    'SELECT * FROM kabupaten WHERE provinsi_id = $1 ORDER BY nama',
    [provinsiId]
  );
  return result.rows;
};

export const getKecamatanByKabupaten = async (kabupatenId: number): Promise<Kecamatan[]> => {
  const result = await pool.query(
    'SELECT * FROM kecamatan WHERE kabupaten_id = $1 ORDER BY nama',
    [kabupatenId]
  );
  return result.rows;
};

export const getKelurahanByKecamatan = async (kecamatanId: number): Promise<Kelurahan[]> => {
  const result = await pool.query(
    'SELECT * FROM kelurahan WHERE kecamatan_id = $1 ORDER BY nama',
    [kecamatanId]
  );
  return result.rows;
};

export const getProvinsiById = async (id: number): Promise<Provinsi | null> => {
  const result = await pool.query('SELECT * FROM provinsi WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getKabupatenById = async (id: number): Promise<Kabupaten | null> => {
  const result = await pool.query('SELECT * FROM kabupaten WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getKecamatanById = async (id: number): Promise<Kecamatan | null> => {
  const result = await pool.query('SELECT * FROM kecamatan WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getKelurahanById = async (id: number): Promise<Kelurahan | null> => {
  const result = await pool.query('SELECT * FROM kelurahan WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getWilayahChain = async (kelurahanId: number): Promise<{
  provinsi: Provinsi;
  kabupaten: Kabupaten;
  kecamatan: Kecamatan;
  kelurahan: Kelurahan;
} | null> => {
  const kelurahan = await getKelurahanById(kelurahanId);
  if (!kelurahan) return null;

  const kecamatan = await getKecamatanById(kelurahan.kecamatan_id);
  if (!kecamatan) return null;

  const kabupaten = await getKabupatenById(kecamatan.kabupaten_id);
  if (!kabupaten) return null;

  const provinsi = await getProvinsiById(kabupaten.provinsi_id);
  if (!provinsi) return null;

  return {
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan
  };
};