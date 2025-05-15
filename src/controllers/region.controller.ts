import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProvinsi = async (_req: Request, res: Response) => {
  const provinsi = await prisma.region.findMany({ where: { level: 'province' } });
  res.json(provinsi);
};

export const getKabupaten = async (req: Request, res: Response) => {
  const { provinsiId } = req.params;
  const Kabupaten = await prisma.region.findMany({ where: { parentId: Number(provinsiId), level: 'kabupaten' } });
  res.json(Kabupaten);
};

export const getKecamatan = async (req: Request, res: Response) => {
  const { kabupatenId } = req.params;
  const kecamatan = await prisma.region.findMany({ where: { parentId: Number(kabupatenId), level: 'kecamatan' } });
  res.json(kecamatan);
};

export const getKelurahan = async (req: Request, res: Response) => {
  const { kecamatanId } = req.params;
  const kelurahan = await prisma.region.findMany({ where: { parentId: Number(kecamatanId), level: 'kelurahan' } });
  res.json(kelurahan);
};
