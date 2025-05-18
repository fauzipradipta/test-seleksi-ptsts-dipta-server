import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerMember = async (req: Request, res: Response) => {
  const { nik, name, phoneNumber, provinsiId, kabupatenId, kecamatanId, kelurahanId } = req.body;

  // Validation
  if (!/^\d{16}$/.test(nik)) return res.status(400).json({ message: 'Invalid NIK format' });
  if (!name) return res.status(400).json({ message: 'Name is required' });
  if (!/^\d+$/.test(phoneNumber)) return res.status(400).json({ message: 'Invalid phone format' });

  // Check uniqueness
  const exists = await prisma.member.findFirst({
    where: { OR: [{ nik }, { phoneNumber }] }
  });
  if (exists) return res.status(400).json({ message: 'NIK or phone already registered' });

  const member = await prisma.member.create({
    data: {
      nik,
      name,
      phoneNumber,
      provinsiId,
      kabupatenId,
      kecamatanId,
      kelurahanId,
    },
  });

  return res.status(201).json(member);
};

export const getMembers = async (_req: Request, res: Response) => {
  const members = await prisma.member.findMany({
    include: {
      provinsi: true,
      kabupaten: true,
      kecamatan: true,
      kelurahan: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.json(members);
};