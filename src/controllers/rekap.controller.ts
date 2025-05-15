import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRekapByLevel = async (req: Request, res: Response) => {
  const { level, domisiliId } = req.query; // level = 'provinsi', 'kabupaten', etc

  let filter = {};
  if (domisiliId) {
    switch (level) {
      case 'kabupaten':
        filter = { provinsiId: Number(domisiliId) };
        break;
      case 'kecamatan':
        filter = { kabupatenId: Number(domisiliId) };
        break;
      case 'kelurahan':
        filter = { kecamatanId: Number(domisiliId) };
        break;
    }
  }

  const groups = await prisma.member.groupBy({
    by: [`${level}Id`],
    _count: { _all: true },
  });

  const result = await Promise.all(groups.map(async (g) => {
    const domisili = await prisma.domisili.findUnique({ where: { id: g[`${level}Id`] as number } });
    return {
      id: domisili?.id,
      name: domisili?.name,
      total: g._count._all,
    };
  }));

  res.json(result);
};
