import bcrypt from 'bcryptjs';
import * as Random from 'expo-random';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { execute, query } from '../db';

// Ensure bcryptjs has a secure RNG in RN/Expo environments without WebCrypto
if (typeof bcrypt.setRandomFallback === 'function') {
  try {
    bcrypt.setRandomFallback((len) => {
      const bytes = Random.getRandomBytes(len);
      // bcryptjs expects a plain number[] with 0..255 values
      return Array.from(bytes);
    });
  } catch (e) {
    // As a safety net, rethrow only if bcrypt is used and no RNG is available
    console.warn('Falha ao configurar RNG para bcryptjs:', e);
  }
}

export async function registerUser({ name, cpf, email, password, role, subrole }) {
  if (!name || !cpf || !password || !role) {
    throw new Error('Preencha os campos obrigatórios.');
  }
  if (role === 'caregiver' && !subrole) {
    throw new Error('Selecione o tipo de cuidador.');
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  await execute(
    `INSERT INTO users (name, cpf, email, password_hash, role, subrole) VALUES (?,?,?,?,?,?)`,
    [name, cpf, email || null, hash, role, subrole || null]
  );
  const res = await query(`SELECT id, name, cpf, role, subrole FROM users WHERE cpf = ?`, [cpf]);
  return res.rows._array[0];
}

export async function loginUser({ cpfOrUsername, password }) {
  const res = await query(
    `SELECT * FROM users WHERE cpf = ? OR name = ? LIMIT 1`,
    [cpfOrUsername, cpfOrUsername]
  );
  if (res.rows.length === 0) throw new Error('Usuário não encontrado');
  const user = res.rows._array[0];
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) throw new Error('Senha inválida');
  await AsyncStorage.setItem('session_user', JSON.stringify({ id: user.id, name: user.name, role: user.role, subrole: user.subrole }));
  return { id: user.id, name: user.name, role: user.role, subrole: user.subrole };
}

export async function logoutUser() {
  await AsyncStorage.removeItem('session_user');
}

export async function getCurrentUser() {
  const raw = await AsyncStorage.getItem('session_user');
  return raw ? JSON.parse(raw) : null;
}
