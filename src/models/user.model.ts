import e from 'express';
import pool from '../config/database';
import { User,UserRole } from '../types/user.type';

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const{username,password_hash,role,wilayah_id} = user;
     const result = await pool.query(
    'INSERT INTO users (username, password_hash, role, wilayah_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, password_hash, role, wilayah_id]
    
  );
    return result.rows[0] || null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const result = await pool.query('SeLECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
}

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};


export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
    const result = await pool.query('UPDATE users SET username = $1, password_hash = $2, role = $3, wilayah_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [user.username, user.password_hash, user.role, user.wilayah_id, id]
     )

    return result.rows[0] || null;
}

export const deleteUser = async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
}



