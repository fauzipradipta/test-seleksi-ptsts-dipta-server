import { Request, Response } from 'express';
import {
  createMember,
  getMemberById,
  getMembersByKelurahan,
  getMembersByKecamatan,
  getMembersByKabupaten,
  getMembersByProvinsi,
  getAllMembers,
  getTotalMembers,
  getTodayRegistrations,
  getRecentRegistrations
} from '../models/member.model';
import { UserRole } from '../types/custom.types';
import { exportToExcel } from '../utils/excelExporter.utils';

export const registerMember = async (req: Request, res: Response) => {
  try {
    const { nik, nama, no_hp, kelurahan_id } = req.body;
    
    // Validate input
    if (!nik || !nama || !no_hp || !kelurahan_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return res.status(400).json({ message: 'NIK must be 16 digits' });
    }
    
    if (!/^\d+$/.test(no_hp)) {
      return res.status(400).json({ message: 'Phone number must be numeric' });
    }

    const member = await createMember({ nik, nama, no_hp, kelurahan_id });
    res.status(201).json(member);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      if (error.constraint.includes('nik')) {
        return res.status(400).json({ message: 'NIK already registered' });
      }
      if (error.constraint.includes('no_hp')) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
    }
    res.status(500).json({ message: 'Error registering member' });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const userRole = req.user.role as UserRole;
    const userId = req.user.id;
    
    let members;
    switch (userRole) {
      case 'admin_pusat':
        members = await getAllMembers();
        break;
      case 'admin_provinsi':
        members = await getMembersByProvinsi(req.user.wilayah_id);
        break;
      case 'admin_kabupaten':
        members = await getMembersByKabupaten(req.user.wilayah_id);
        break;
      case 'admin_kecamatan':
        members = await getMembersByKecamatan(req.user.wilayah_id);
        break;
      case 'admin_kelurahan':
        members = await getMembersByKelurahan(req.user.wilayah_id);
        break;
      default:
        return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalMembers, todayRegistrations, recentRegistrations] = await Promise.all([
      getTotalMembers(),
      getTodayRegistrations(),
      getRecentRegistrations()
    ]);
    
    res.json({
      totalMembers,
      todayRegistrations,
      recentRegistrations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export const exportMembers = async (req: Request, res: Response) => {
  try {
    const userRole = req.user.role as UserRole;
    const userId = req.user.id;
    
    let members, fileName;
    
    switch (userRole) {
      case 'admin_pusat':
        members = await getAllMembers();
        fileName = 'all-members';
        break;
      case 'admin_provinsi':
        members = await getMembersByProvinsi(req.user.wilayah_id);
        fileName = `provinsi-${req.user.wilayah_id}-members`;
        break;
      case 'admin_kabupaten':
        members = await getMembersByKabupaten(req.user.wilayah_id);
        fileName = `kabupaten-${req.user.wilayah_id}-members`;
        break;
      case 'admin_kecamatan':
        members = await getMembersByKecamatan(req.user.wilayah_id);
        fileName = `kecamatan-${req.user.wilayah_id}-members`;
        break;
      case 'admin_kelurahan':
        members = await getMembersByKelurahan(req.user.wilayah_id);
        fileName = `kelurahan-${req.user.wilayah_id}-members`;
        break;
      default:
        return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const excelBuffer = await exportToExcel(members, userRole);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting members' });
  }
};