import pool from '../config/database';
import { Member, RegistrationLog } from '../types/custom.types';

export const createMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<Member> => {
  const { nik, nama, no_hp, kelurahan_id } = memberData;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert member
    const memberResult = await client.query(
      `INSERT INTO members (nik, nama, no_hp, kelurahan_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nik, nama, no_hp, kelurahan_id]
    );
    
    // Log registration
    await client.query(
      `INSERT INTO registration_logs (member_id)
       VALUES ($1)`,
      [memberResult.rows[0].id]
    );
    
    await client.query('COMMIT');
    return memberResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMemberByNik = async (nik: string): Promise<Member | null> => {
  const result = await pool.query('SELECT * FROM members WHERE nik = $1', [nik]);
  return result.rows[0] || null;
};

export const getMemberByPhone = async (no_hp: string): Promise<Member | null> => {
  const result = await pool.query('SELECT * FROM members WHERE no_hp = $1', [no_hp]);
  return result.rows[0] || null;
};

export const getRegistrationStats = async (): Promise<{
  totalMembers: number;
  todayRegistrations: number;
  last30Minutes: { time: string; count: number }[];
}> => {
  const totalPromise = pool.query('SELECT COUNT(*) FROM members');
  const todayPromise = pool.query(
    `SELECT COUNT(*) FROM registration_logs 
     WHERE DATE(registered_at) = CURRENT_DATE`
  );
  const last30MinutesPromise = pool.query(
    `SELECT 
       DATE_TRUNC('minute', registered_at) AS time_window,
       COUNT(*) AS count
     FROM registration_logs
     WHERE registered_at >= NOW() - INTERVAL '30 minutes'
     GROUP BY time_window
     ORDER BY time_window`
  );

  const [totalResult, todayResult, last30MinutesResult] = await Promise.all([
    totalPromise,
    todayPromise,
    last30MinutesPromise
  ]);

  return {
    totalMembers: parseInt(totalResult.rows[0].count),
    todayRegistrations: parseInt(todayResult.rows[0].count),
    last30Minutes: last30MinutesResult.rows.map(row => ({
      time: row.time_window.toISOString(),
      count: parseInt(row.count)
    }))
  };
};