import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { domisili: true },
    orderBy: { id: 'asc' },
  });
  res.json(users);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    // Validate role
    if (!username || !password || !role) {
      // return res.status(400).json({ message: 'Invalid role' });
       res.status(400).json({ message: 'Invalid role' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });

    // Send success response
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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