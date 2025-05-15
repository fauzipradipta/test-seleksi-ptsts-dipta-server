import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/auth';
import { getUserByUsername } from '../models/user.model';
import { UserRole } from '../types/custom.types';
import { createUser } from '../models/user.model';
import{ generateToken,comparePasswords } from '../utils/auth.utils';

export const authenticateUser = async (username: string, password: string): Promise<string | null> => {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return token;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const loginUser = async (username: string, password: string) => {
  const user = await getUserByUsername(username);
  if (!user) throw new Error('Invalid credentials');
  
  const isMatch = await comparePasswords(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');
  
  return generateToken(user);
};

export const registerAdminUser = async (userData: {
  username: string;
  password: string;
  role: UserRole;
  wilayah_id: number;
}) => {
  const existingUser = await getUserByUsername(userData.username);
  if (existingUser) throw new Error('Username already exists');
  
  const hashedPassword = await hashPassword(userData.password);
  return createUser({
    ...userData,
    password_hash: hashedPassword
  });
};