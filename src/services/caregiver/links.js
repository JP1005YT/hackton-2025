import { execute, query } from '../../db';

export async function linkWithCode(caregiverId, code) {
  const res = await query(`SELECT * FROM link_codes WHERE code = ?`, [code]);
  if (res.rows.length === 0) throw new Error('Código inválido');
  const { elder_id } = res.rows._array[0];
  // avoid duplicate link
  const exists = await query(
    `SELECT id FROM caregiver_links WHERE elder_id=? AND caregiver_id=? LIMIT 1`,
    [elder_id, caregiverId]
  );
  if (exists.rows.length === 0) {
    await execute(
      `INSERT INTO caregiver_links (elder_id, caregiver_id) VALUES (?,?)`,
      [elder_id, caregiverId]
    );
  }
  return elder_id;
}

export async function listLinkedElders(caregiverId) {
  const res = await query(
    `SELECT e.* FROM caregiver_links cl JOIN elders e ON cl.elder_id = e.id WHERE cl.caregiver_id = ? ORDER BY e.id DESC`,
    [caregiverId]
  );
  return res.rows._array;
}
