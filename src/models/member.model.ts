import pool from '../config/db.config';
import { Member } from '../types/custom.types';


 const createMember = async (member: Omit<Member, 'id' |'created_at' | 'updated_at'>): Promise<Member> => {
    const { nik, nama, no_hp, kelurahan_id } = member;
    const result = await pool.query(
        'INSERT INTO members (nik, nama, no_hp, kelurahan_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [nik, nama, no_hp, kelurahan_id]
    );

    await pool.query(
        'INSERT INTO registration_logs (member_id, registered_at) VALUES ($1, CURRENT_TIMESTAMP)',
        [result.rows[0].id]
    );

    return result.rows[0] || null;
}

 const getMemberById = async (id: number): Promise<Member | null> => {
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    return result.rows[0] || null;
}

 const getMemberByKecamatan = async (kecamatan_id: number): Promise<Member[]> => {
    const result = await pool.query('SELECT m.* FROM members m JOIN kelurahan k ON m.kelurahan_id = k.id WHERE k.kecamatan_id = $1', [kecamatan_id]);
    return result.rows;
}

 const getMemberByKabupaten = async (kabupaten_id: number): Promise<Member[]> => {
    const result = await pool.query('SELECT m.* FROM members m JOIN kelurahan k ON m.kelurahan_id = k.id JOIN kecamatan kc ON k.kecamatan_id = kc.id WHERE kc.kabupaten_id = $1', [kabupaten_id]);
    return result.rows;
}

 const getMemberByProvinsi = async (provinsi_id: number): Promise<Member[]> => {
    const result = await pool.query('SELECT m.* FROM members m JOIN kelurahan k ON m.kelurahan_id = k.id JOIN kecamatan kc ON k.kecamatan_id = kc.id JOIN kabupaten kb ON kc.kabupaten_id = kb.id WHERE kb.provinsi_id = $1', [provinsi_id]);
    return result.rows;
}

 const getAllMembers = async (): Promise<Member[]> => {
    const result = await pool.query('SELECT * FROM members');
    return result.rows;
}
 const getTotalMembers = async (): Promise<number> => {
    const result = await pool.query('SELECT COUNT(*) FROM members');
    return parseInt(result.rows[0].count, 10);
}
 const getTodayRegistrations = async (): Promise<Member[]> => {
    const result = await pool.query('SELECT m.* FROM members m JOIN registration_logs rl ON m.id = rl.member_id WHERE DATE(rl.registered_at) = CURRENT_DATE');
    return result.rows;
}

 const getRecentRegistrations = async (minutes: number = 30): Promise<{time: string, count: number}[]> => {
  const result = await pool.query(
    `SELECT 
       DATE_TRUNC('minute', registered_at) AS time_window,
       COUNT(*) AS count
     FROM registration_logs
     WHERE registered_at >= NOW() - INTERVAL '${minutes} minutes'
     GROUP BY time_window
     ORDER BY time_window`
  );
  return result.rows.map(row => ({
    time: row.time_window.toISOString(),
    count: parseInt(row.count)
  }));
};

export  {getRecentRegistrations, getTodayRegistrations, getTotalMembers, getAllMembers, getMemberByProvinsi, getMemberByKabupaten, getMemberByKecamatan, getMemberById, createMember}