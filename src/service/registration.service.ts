import {
  createMember,
  getMemberByNik,
  getMemberByPhone,
  getRegistrationStats
} from '../models/registration.model';
import { getWilayahChain } from '../models/wilayah.model';
import { hashPassword } from './auth.service';

export const registerNewMember = async (memberData: {
  nik: string;
  nama: string;
  no_hp: string;
  kelurahan_id: number;
}) => {
  // Validate NIK
  if (!/^\d{16}$/.test(memberData.nik)) {
    throw new Error('NIK must be 16 digits');
  }

  // Validate phone number
  if (!/^\d+$/.test(memberData.no_hp)) {
    throw new Error('Phone number must be numeric');
  }

  // Check if NIK already exists
  const existingByNik = await getMemberByNik(memberData.nik);
  if (existingByNik) {
    throw new Error('NIK already registered');
  }

  // Check if phone number already exists
  const existingByPhone = await getMemberByPhone(memberData.no_hp);
  if (existingByPhone) {
    throw new Error('Phone number already registered');
  }

  // Verify kelurahan exists
  const wilayah = await getWilayahChain(memberData.kelurahan_id);
  if (!wilayah) {
    throw new Error('Invalid kelurahan');
  }

  // Create member
  const newMember = await createMember(memberData);
  return {
    ...newMember,
    wilayah
  };
};

export const getRegistrationStatistics = async () => {
  return await getRegistrationStats();
};