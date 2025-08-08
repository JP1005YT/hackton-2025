import { execute, query } from '../../db';

export async function createElder(familyId, data) {
  const { full_name, age, address, medical_conditions, allergies, notes } = data;
  if (!full_name) throw new Error('Nome é obrigatório');
  const res = await execute(
    `INSERT INTO elders (full_name, age, address, medical_conditions, allergies, notes, responsible_family_id)
     VALUES (?,?,?,?,?,?,?)`,
    [full_name, age || null, address || null, medical_conditions || null, allergies || null, notes || null, familyId]
  );
  return res.insertId;
}

export async function updateElder(elderId, data) {
  const { full_name, age, address, medical_conditions, allergies, notes } = data;
  await execute(
    `UPDATE elders SET full_name=?, age=?, address=?, medical_conditions=?, allergies=?, notes=? WHERE id=?`,
    [full_name, age || null, address || null, medical_conditions || null, allergies || null, notes || null, elderId]
  );
}

export async function listEldersByFamily(familyId) {
  const res = await query(`SELECT * FROM elders WHERE responsible_family_id = ? ORDER BY id DESC`, [familyId]);
  return res.rows._array;
}

export async function getElderById(elderId) {
  const res = await query(`SELECT * FROM elders WHERE id = ?`, [elderId]);
  return res.rows._array[0];
}

export async function addReminder(elderId, name, time) {
  if (!name || !time) throw new Error('Informe nome e horário');
  await execute(`INSERT INTO medication_reminders (elder_id, name, time) VALUES (?,?,?)`, [elderId, name, time]);
}

export async function listReminders(elderId) {
  const res = await query(`SELECT * FROM medication_reminders WHERE elder_id = ? ORDER BY time ASC`, [elderId]);
  return res.rows._array;
}

export async function updateReminder(id, name, time) {
  await execute(`UPDATE medication_reminders SET name=?, time=? WHERE id=?`, [name, time, id]);
}

export async function deleteReminder(id) {
  await execute(`DELETE FROM medication_reminders WHERE id=?`, [id]);
}

export async function generateLinkCode(elderId, createdBy) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase() + '-' + elderId;
  await execute(`INSERT OR REPLACE INTO link_codes (code, elder_id, created_by) VALUES (?,?,?)`, [code, elderId, createdBy]);
  return code;
}

export async function listCaregivers(elderId) {
  const res = await query(
    `SELECT u.id, u.name, u.subrole FROM caregiver_links cl JOIN users u ON cl.caregiver_id = u.id WHERE cl.elder_id = ?`,
    [elderId]
  );
  return res.rows._array;
}
