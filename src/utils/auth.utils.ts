import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/auth';
import { User } from '../types/custom.types';

/**
 * Hashes a password using bcrypt
 * @param password The plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password
 * @param plainPassword The plain text password
 * @param hashedPassword The hashed password to compare against
 * @returns Promise resolving to boolean indicating if passwords match
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generates a JWT token for a user
 * @param user The user object containing id, username and role
 * @returns JWT token string
 */
export const generateToken = (user: {
  id: number;
  username: string;
  role: string;
  wilayah_id?: number;
}): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      wilayah_id: user.wilayah_id
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
};

/**
 * Verifies a JWT token and extracts the payload
 * @param token The JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): User | null => {
  try {
    return jwt.verify(token, jwtConfig.secret) as User;
  } catch (error) {
    return null;
  }
};

/**
 * Extracts token from Authorization header
 * @param authHeader The Authorization header string
 * @returns The token or null if invalid format
 */
export const getTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return null;
};

/**
 * Generates a random temporary password
 * @param length Length of the generated password (default: 12)
 * @returns Generated password
 */
export const generateTempPassword = (length = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Object with validation results
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  messages: string[];
} => {
  const messages: string[] = [];
  
  if (password.length < 8) {
    messages.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    messages.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    messages.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    messages.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    messages.push('Password must contain at least one special character');
  }
  
  return {
    isValid: messages.length === 0,
    messages
  };
};