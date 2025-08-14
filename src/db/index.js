import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
let dbPromise = isWeb ? null : SQLite.openDatabaseAsync('eldercare.db');

// Web storage functions
function getWebStorage() {
  const storage = {
    users: JSON.parse(localStorage.getItem('eldercare_users') || '[]'),
    elders: JSON.parse(localStorage.getItem('eldercare_elders') || '[]'),
    medication_reminders: JSON.parse(localStorage.getItem('eldercare_medication_reminders') || '[]'),
    caregiver_links: JSON.parse(localStorage.getItem('eldercare_caregiver_links') || '[]'),
    link_codes: JSON.parse(localStorage.getItem('eldercare_link_codes') || '[]'),
    counters: JSON.parse(localStorage.getItem('eldercare_counters') || '{"users": 1, "elders": 1, "medication_reminders": 1, "caregiver_links": 1}')
  };
  return storage;
}

function saveWebStorage(tableName, data) {
  localStorage.setItem(`eldercare_${tableName}`, JSON.stringify(data));
}

function saveWebCounters(counters) {
  localStorage.setItem('eldercare_counters', JSON.stringify(counters));
}

export function initDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      if (isWeb) {
        // Para web, apenas inicializa o localStorage se necessário
        if (!localStorage.getItem('eldercare_users')) {
          localStorage.setItem('eldercare_users', '[]');
          localStorage.setItem('eldercare_elders', '[]');
          localStorage.setItem('eldercare_medication_reminders', '[]');
          localStorage.setItem('eldercare_caregiver_links', '[]');
          localStorage.setItem('eldercare_link_codes', '[]');
          localStorage.setItem('eldercare_counters', '{"users": 1, "elders": 1, "medication_reminders": 1, "caregiver_links": 1}');
        }
        resolve();
        return;
      }
      
      if (!dbPromise) { resolve(); return; }
      const db = await dbPromise;
      await db.withExclusiveTransactionAsync(async () => {
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
      if (isWeb) {
        // Implementação para web usando localStorage
        const storage = getWebStorage();
        let result = [];
        
        // Parse simples de SQL para operações básicas
        const sqlLower = sql.toLowerCase().trim();
        
        if (sqlLower.includes('select * from users where cpf = ?') || sqlLower.includes('select * from users where cpf = ? or name = ?')) {
          const searchTerm = params[0];
          result = storage.users.filter(user => 
            user.cpf === searchTerm || user.name === searchTerm
          );
        } else if (sqlLower.includes('select id, name, cpf, role, subrole from users where cpf = ?')) {
          const cpf = params[0];
          result = storage.users.filter(user => user.cpf === cpf)
            .map(user => ({ id: user.id, name: user.name, cpf: user.cpf, role: user.role, subrole: user.subrole }));
        } else if (sqlLower.includes('select * from elders where responsible_family_id = ?')) {
          const familyId = params[0];
          result = storage.elders.filter(elder => elder.responsible_family_id === familyId);
        } else if (sqlLower.includes('select * from elders where id = ?')) {
          const elderId = params[0];
          result = storage.elders.filter(elder => elder.id === elderId);
        } else if (sqlLower.includes('select * from medication_reminders where elder_id = ?')) {
          const elderId = params[0];
          result = storage.medication_reminders.filter(reminder => reminder.elder_id === elderId);
        } else if (sqlLower.includes('select u.id, u.name, u.subrole from caregiver_links cl join users u')) {
          const elderId = params[0];
          const links = storage.caregiver_links.filter(link => link.elder_id === elderId);
          result = links.map(link => {
            const user = storage.users.find(u => u.id === link.caregiver_id);
            return user ? { id: user.id, name: user.name, subrole: user.subrole } : null;
          }).filter(Boolean);
        } else if (sqlLower.includes('select * from link_codes where code = ?')) {
          const code = params[0];
          result = storage.link_codes.filter(link => link.code === code);
        } else if (sqlLower.includes('select id from caregiver_links where elder_id=? and caregiver_id=?')) {
          const [elderId, caregiverId] = params;
          result = storage.caregiver_links.filter(link => 
            link.elder_id === elderId && link.caregiver_id === caregiverId
          );
        } else if (sqlLower.includes('select e.* from caregiver_links cl join elders e')) {
          const caregiverId = params[0];
          const links = storage.caregiver_links.filter(link => link.caregiver_id === caregiverId);
          result = links.map(link => {
            const elder = storage.elders.find(e => e.id === link.elder_id);
            return elder || null;
          }).filter(Boolean);
        }
        
        resolve({ rows: { _array: result, length: result.length } });
        return;
      }
      
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
      if (isWeb) {
        // Implementação para web usando localStorage
        const storage = getWebStorage();
        const counters = storage.counters;
        let insertId = null;
        let rowsAffected = 0;
        
        const sqlLower = sql.toLowerCase().trim();
        
        if (sqlLower.includes('insert into users')) {
          const [name, cpf, email, password_hash, role, subrole] = params;
          
          // Verificar se CPF já existe
          const existingUser = storage.users.find(user => user.cpf === cpf);
          if (existingUser) {
            reject(new Error('CPF já cadastrado'));
            return;
          }
          
          const newUser = {
            id: counters.users++,
            name,
            cpf,
            email,
            password_hash,
            role,
            subrole,
            created_at: new Date().toISOString()
          };
          
          storage.users.push(newUser);
          saveWebStorage('users', storage.users);
          saveWebCounters(counters);
          insertId = newUser.id;
          rowsAffected = 1;
        } else if (sqlLower.includes('insert into elders')) {
          const [full_name, age, address, medical_conditions, allergies, notes, responsible_family_id] = params;
          
          const newElder = {
            id: counters.elders++,
            full_name,
            age,
            address,
            medical_conditions,
            allergies,
            notes,
            responsible_family_id
          };
          
          storage.elders.push(newElder);
          saveWebStorage('elders', storage.elders);
          saveWebCounters(counters);
          insertId = newElder.id;
          rowsAffected = 1;
        } else if (sqlLower.includes('insert into medication_reminders')) {
          const [elder_id, name, time] = params;
          
          const newReminder = {
            id: counters.medication_reminders++,
            elder_id,
            name,
            time
          };
          
          storage.medication_reminders.push(newReminder);
          saveWebStorage('medication_reminders', storage.medication_reminders);
          saveWebCounters(counters);
          insertId = newReminder.id;
          rowsAffected = 1;
        } else if (sqlLower.includes('insert or replace into link_codes')) {
          const [code, elder_id, created_by] = params;
          
          // Remove código existente para o mesmo elder_id
          storage.link_codes = storage.link_codes.filter(link => link.elder_id !== elder_id);
          
          const newLink = {
            code,
            elder_id,
            created_by,
            created_at: new Date().toISOString()
          };
          
          storage.link_codes.push(newLink);
          saveWebStorage('link_codes', storage.link_codes);
          rowsAffected = 1;
        } else if (sqlLower.includes('insert into caregiver_links')) {
          const [elder_id, caregiver_id] = params;
          
          const newLink = {
            id: counters.caregiver_links++,
            elder_id,
            caregiver_id
          };
          
          storage.caregiver_links.push(newLink);
          saveWebStorage('caregiver_links', storage.caregiver_links);
          saveWebCounters(counters);
          insertId = newLink.id;
          rowsAffected = 1;
        } else if (sqlLower.includes('update elders set')) {
          const [full_name, age, address, medical_conditions, allergies, notes, elderId] = params;
          
          const elderIndex = storage.elders.findIndex(elder => elder.id === elderId);
          if (elderIndex !== -1) {
            storage.elders[elderIndex] = {
              ...storage.elders[elderIndex],
              full_name,
              age,
              address,
              medical_conditions,
              allergies,
              notes
            };
            saveWebStorage('elders', storage.elders);
            rowsAffected = 1;
          }
        } else if (sqlLower.includes('update medication_reminders set')) {
          const [name, time, id] = params;
          
          const reminderIndex = storage.medication_reminders.findIndex(reminder => reminder.id === id);
          if (reminderIndex !== -1) {
            storage.medication_reminders[reminderIndex] = {
              ...storage.medication_reminders[reminderIndex],
              name,
              time
            };
            saveWebStorage('medication_reminders', storage.medication_reminders);
            rowsAffected = 1;
          }
        } else if (sqlLower.includes('delete from medication_reminders where id=?')) {
          const [id] = params;
          
          const originalLength = storage.medication_reminders.length;
          storage.medication_reminders = storage.medication_reminders.filter(reminder => reminder.id !== id);
          saveWebStorage('medication_reminders', storage.medication_reminders);
          rowsAffected = originalLength - storage.medication_reminders.length;
        }
        
        resolve({ insertId, rowsAffected });
        return;
      }
      
      if (!dbPromise) { reject(new Error('DB indisponível no Web')); return; }
      const db = await dbPromise;
      const result = await db.runAsync(sql, params);
      resolve({ insertId: result.lastInsertRowId, rowsAffected: result.changes });
    } catch (e) {
      reject(e);
    }
  });
}
