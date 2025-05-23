import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({

      where: { username }

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

        regionLevel: user.regionLevel,
        regionId: user.regionId
      }

    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, regionLevel } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        regionLevel,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error });
  }
}


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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const admins = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        regionLevel: true,
        regionId: true,
        createdAt: true
      }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
}


