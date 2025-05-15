import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { region: true },
    orderBy: { id: 'asc' },
  });
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, role, regionId } = req.body;

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword, role, regionId },
  });

  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, password, role, regionId } = req.body;

  const updateData: any = {
    username,
    role,
    regionId,
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: updateData,
  });

  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};