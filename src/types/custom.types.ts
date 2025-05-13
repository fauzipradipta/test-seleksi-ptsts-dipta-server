export type UserRole = 'admin_pusat' | 'admin_provinsi' | 'admin_kabupaten' | 'admin_kecamatan' | 'admin_kelurahan';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  wilayah_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Member {
  id: number;
  nik: string;
  nama: string;
  no_hp: string;
  kelurahan_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Provinsi {
  id: number;
  nama: string;
}

export interface Kabupaten {
  id: number;
  nama: string;
  provinsi_id: number;
}

export interface Kecamatan {
  id: number;
  nama: string;
  kabupaten_id: number;
}

export interface Kelurahan {
  id: number;
  nama: string;
  kecamatan_id: number;
}

export interface RegistrationLog {
  id: number;
  member_id: number;
  registered_at: Date;
}