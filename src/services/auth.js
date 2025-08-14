import bcrypt from 'bcryptjs';
import * as Random from 'expo-random';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { execute, query } from '../db';
import { Platform } from 'react-native';

// Configuração do bcrypt para diferentes plataformas
if (Platform.OS === 'web') {
  // Para web, usar uma implementação mais simples
  console.log('Modo web detectado - usando implementação simplificada de hash');
} else {
  // Para mobile, usar expo-random
  if (typeof bcrypt.setRandomFallback === 'function') {
    try {
      bcrypt.setRandomFallback((len) => {
        const bytes = Random.getRandomBytes(len);
        return Array.from(bytes);
      });
    } catch (e) {
      console.warn('Falha ao configurar RNG para bcryptjs:', e);
    }
  }
}

// Função de hash que funciona em todas as plataformas
function hashPassword(password) {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (error) {
    console.warn('Erro no bcrypt, usando hash simples:', error);
    // Fallback simples para desenvolvimento web
    return btoa(password + 'eldercare_salt');
  }
}

// Função de verificação que funciona em todas as plataformas
function verifyPassword(password, hash) {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.warn('Erro no bcrypt, usando verificação simples:', error);
    // Fallback simples para desenvolvimento web
    return btoa(password + 'eldercare_salt') === hash;
  }
}

export async function registerUser({ name, cpf, email, password, role, subrole }) {
  if (!name || !cpf || !password || !role) {
    throw new Error('Preencha os campos obrigatórios.');
  }
  if (role === 'caregiver' && !subrole) {
    throw new Error('Selecione o tipo de cuidador.');
  }
  
  const hash = hashPassword(password);
  
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
  const ok = verifyPassword(password, user.password_hash);
  if (!ok) throw new Error('Senha inválida');
  
  const sessionUser = { id: user.id, name: user.name, role: user.role, subrole: user.subrole };
  await AsyncStorage.setItem('session_user', JSON.stringify(sessionUser));
  return sessionUser;
}

export async function logoutUser() {
  await AsyncStorage.removeItem('session_user');
}

export async function getCurrentUser() {
  const raw = await AsyncStorage.getItem('session_user');
  return raw ? JSON.parse(raw) : null;
}
