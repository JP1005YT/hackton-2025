import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Abrir DB com API assíncrona; no Web mantemos indisponível (sem configuração WASM).
const isWeb = Platform.OS === 'web';
let dbPromise = isWeb ? null : SQLite.openDatabaseAsync('eldercare.db');

export function initDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dbPromise) { resolve(); return; }
      const db = await dbPromise;
      await db.withExclusiveTransactionAsync(async () => {
        // boas práticas
        await db.execAsync(`PRAGMA foreign_keys = ON;`);
        await db.execAsync(`PRAGMA journal_mode = WAL;`);

        await db.execAsync(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  email TEXT,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('family','caregiver')),
  subrole TEXT CHECK(subrole IN ('formal','informal')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS elders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  age INTEGER,
  address TEXT,
  medical_conditions TEXT,
  allergies TEXT,
  notes TEXT,
  responsible_family_id INTEGER,
  FOREIGN KEY (responsible_family_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS medication_reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  elder_id INTEGER,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  FOREIGN KEY (elder_id) REFERENCES elders(id)
);

CREATE TABLE IF NOT EXISTS caregiver_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  elder_id INTEGER,
  caregiver_id INTEGER,
  FOREIGN KEY (elder_id) REFERENCES elders(id),
  FOREIGN KEY (caregiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS link_codes (
  code TEXT PRIMARY KEY,
  elder_id INTEGER,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (elder_id) REFERENCES elders(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
        `);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export function query(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dbPromise) { reject(new Error('DB indisponível no Web')); return; }
      const db = await dbPromise;
      const rowsArray = await db.getAllAsync(sql, params);
      resolve({ rows: { _array: rowsArray, length: rowsArray.length } });
    } catch (e) {
      reject(e);
    }
  });
}

export function execute(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dbPromise) { reject(new Error('DB indisponível no Web')); return; }
      const db = await dbPromise;
      const result = await db.runAsync(sql, params);
      resolve({ insertId: result.lastInsertRowId, rowsAffected: result.changes });
    } catch (e) {
      reject(e);
    }
  });
}
