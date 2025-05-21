import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import dotenv from 'dotenv';
import { log } from 'console';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
      include: { region: true },
    });

    // || !(await bcrypt.compare(password, user.password))
    if (!user) {
      console.log('user not found');
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Stored password hash:', user.password);
    console.log('Comparing with input password:', password);

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password Valid?:', isValid);
    
    if(!isValid) {
       return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        region: user.region,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        role: true,
        region: {
          select: {
            id: true, // Include specific fields from the `region` model
            name: true,
          },
        },
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};