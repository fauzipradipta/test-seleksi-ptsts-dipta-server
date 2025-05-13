import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {jwtConfig} from '../config/auth';
import { getUserByUsername } from '../models/user.model';
import { User } from '../types/custom.types'

 const authenticateUser = async (username: string, password: string): Promise<string | null> => {
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

 const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export  {authenticateUser, hashPassword};