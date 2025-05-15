import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { subMinutes } from 'date-fns';

const prisma = new PrismaClient();

export const getDashboardData = async (req: Request, res: Response) => {
  const now = new Date();
  const from = subMinutes(now, 30);

  // Total members today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalToday = await prisma.member.count({
    where: { createdAt: { gte: today } },
  });

  // Total all time
  const totalAll = await prisma.member.count();

  // Growth chart
  const data: { time: string, count: number }[] = [];
  for (let i = 5; i <= 30; i += 5) {
    const from = subMinutes(now, i);
    const to = subMinutes(now, i - 5);
    const count = await prisma.member.count({
      where: {
        createdAt: { gte: from, lt: to }
      }
    });
    data.push({ time: `${i - 5}-${i}m ago`, count });
  }

  res.json({
    totalToday,
    totalAll,
    chart: data.reverse(),
  });
};
