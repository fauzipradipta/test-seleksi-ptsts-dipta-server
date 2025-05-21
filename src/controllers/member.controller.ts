import { Request, Response } from 'express';
import prisma from '../config/database';
import { RegionLevel } from '@prisma/client';
import excel from 'exceljs';



export const registerMember = async (req: Request, res: Response) => {
  try {
    const { nik, name, phone, province, regency, district, village } = req.body;

    // Validate NIK (16 digits)
    if (!/^\d{16}$/.test(nik)) {
      return res.status(400).json({ message: 'NIK must be 16 digits' });
    }

    // Validate phone number
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be numeric' });
    }

    const member = await prisma.member.create({
      data: {
        nik,
        name,
        phone,
        province,
        regency,
        district,
        village
      },
      // include: {
      //   province: true,
      //   regency: true,
      //   district: true,
      //   village: true
      // }
    });

    res.status(201).json(member);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'NIK or phone number already exists' });
    }
    res.status(500).json({ message: 'Error registering member', error });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    let whereCondition = {};

    // Apply filters based on user role
    switch (user.role) {
      case 'PUSAT':
        // No filter, can see all members
        break;
      case 'PROVINSI':
        whereCondition = { provinceId: user.regionId };
        break;
      case 'KABUPATEN':
        whereCondition = { regencyId: user.regionId };
        break;
      case 'KECAMATAN':
        whereCondition = { districtId: user.regionId };
        break;
      case 'KELURAHAN':
        whereCondition = { villageId: user.regionId };
        break;
    }

    const { page = 1, limit = 5 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const members = await prisma.member.findMany({
      where: whereCondition,
      skip,
      take: Number(limit),
      include: {
        province: true,
        regency: true,
        district: true,
        village: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.member.count({ where: whereCondition });

    res.json({
      data: members,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error });
  }
};

export const exportMembers = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    let whereCondition = {};

    // Apply filters based on user role (same as getMembers)
    switch (user.role) {
      case 'PUSAT': break;
      case 'PROVINSI': whereCondition = { provinceId: user.regionId }; break;
      case 'KABUPATEN': whereCondition = { regencyId: user.regionId }; break;
      case 'KECAMATAN': whereCondition = { districtId: user.regionId }; break;
      case 'KELURAHAN': whereCondition = { villageId: user.regionId }; break;
    }

    const members = await prisma.member.findMany({
      where: whereCondition,
      include: {
        province: true,
        regency: true,
        district: true,
        village: true
      }
    });

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Members');

    // Add headers
    worksheet.columns = [
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Province', key: 'province', width: 20 },
      { header: 'Regency', key: 'regency', width: 20 },
      { header: 'District', key: 'district', width: 20 },
      { header: 'Village', key: 'village', width: 20 },
      { header: 'Registration Date', key: 'createdAt', width: 20 }
    ];

    // Add rows
    members.forEach(member => {
      worksheet.addRow({
        nik: member.nik,
        name: member.name,
        phone: member.phone,
        province: member.province.name,
        regency: member.regency.name,
        district: member.district.name,
        village: member.village.name,
        createdAt: member.createdAt.toISOString()
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=members.xlsx'
    );

  
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Error exporting members', error });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    let whereCondition = {};

    // Apply filters based on user role
    switch (user.role) {
      case 'PUSAT': break;
      case 'PROVINSI': whereCondition = { provinceId: user.regionId }; break;
      case 'KABUPATEN': whereCondition = { regencyId: user.regionId }; break;
      case 'KECAMATAN': whereCondition = { districtId: user.regionId }; break;
      case 'KELURAHAN': whereCondition = { villageId: user.regionId }; break;
    }

    // Total members
    const totalMembers = await prisma.member.count({ where: whereCondition });

    // Today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysRegistrations = await prisma.member.count({
      where: {
        ...whereCondition,
        createdAt: { gte: today }
      }
    });

    // Last 30 minutes registrations (grouped by 5 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const registrations = await prisma.member.groupBy({
      by: ['createdAt'],
      where: {
        ...whereCondition,
        createdAt: { gte: thirtyMinutesAgo }
      },
      _count: true
    });

    // Process into 5-minute intervals
    const chartData = Array(6).fill(0).map((_, i) => {
      const time = new Date(Date.now() - (30 - i * 5) * 60 * 1000);
      const count = registrations.reduce((sum, reg) => {
        const regTime = new Date(reg.createdAt);
        return regTime >= time && regTime < new Date(time.getTime() + 5 * 60 * 1000) 
          ? sum + reg._count 
          : sum;
      }, 0);
      return { time, count };
    });

    res.json({
      totalMembers,
      todaysRegistrations,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error });
  }
};