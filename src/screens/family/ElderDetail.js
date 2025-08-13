import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { getElderById, updateElder, addReminder, listReminders, updateReminder, deleteReminder, generateLinkCode, listCaregivers } from '../../services/family/elders';
import { getCurrentUser } from '../../services/auth';

export default function ElderDetail({ route }) {
  const { elderId } = route.params;
  const [elder, setElder] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [newMed, setNewMed] = useState('');
  const [newTime, setNewTime] = useState('');
  const [caregivers, setCaregivers] = useState([]);
  const [code, setCode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editMed, setEditMed] = useState('');
  const [editTime, setEditTime] = useState('');

  const load = async () => {
    const e = await getElderById(elderId);
    setElder(e);
    const meds = await listReminders(elderId);
    setReminders(meds);
    const cgs = await listCaregivers(elderId);
    setCaregivers(cgs);
  };

  useEffect(() => { load(); }, [elderId]);

  const onSave = async () => {
    try {
      await updateElder(elderId, elder);
      Alert.alert('Salvo', 'Informações atualizadas');
    } catch (e) { Alert.alert('Erro', e.message); }
  };

  const onAddReminder = async () => {
    try {
      await addReminder(elderId, newMed, newTime);
      setNewMed(''); setNewTime('');
      load();
    } catch (e) { Alert.alert('Erro', e.message); }
  };

  const onStartEdit = (item) => {
    setEditingId(item.id);
    setEditMed(item.name);
    setEditTime(item.time);
  };

  const onSaveEdit = async () => {
    try {
      await updateReminder(editingId, editMed, editTime);
      setEditingId(null);
      setEditMed('');
      setEditTime('');
      load();
    } catch (e) { Alert.alert('Erro', e.message); }
  };

  const onGenerateCode = async () => {
    try {
      const user = await getCurrentUser();
      const c = await generateLinkCode(elderId, user.id);
      setCode(c);
    } catch (e) { Alert.alert('Erro', e.message); }
  };

  if (!elder) return <View style={{ flex:1 }}/>

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
    >
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={[styles.container, { paddingBottom: 48 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{elder.full_name}</Text>
      <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#777" value={elder.full_name} onChangeText={(t)=>setElder({ ...elder, full_name: t })} />
      <TextInput style={styles.input} placeholder="Idade" placeholderTextColor="#777" value={elder.age ? String(elder.age) : ''} onChangeText={(t)=>setElder({ ...elder, age: t?Number(t):null })} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Endereço" placeholderTextColor="#777" value={elder.address || ''} onChangeText={(t)=>setElder({ ...elder, address: t })} />
      <TextInput style={styles.input} placeholder="Condições médicas" placeholderTextColor="#777" value={elder.medical_conditions || ''} onChangeText={(t)=>setElder({ ...elder, medical_conditions: t })} multiline />
      <TextInput style={styles.input} placeholder="Alergias" placeholderTextColor="#777" value={elder.allergies || ''} onChangeText={(t)=>setElder({ ...elder, allergies: t })} multiline />
      <TextInput style={styles.input} placeholder="Observações" placeholderTextColor="#777" value={elder.notes || ''} onChangeText={(t)=>setElder({ ...elder, notes: t })} multiline />

      <TouchableOpacity style={styles.button} onPress={onSave}><Text style={styles.buttonText}>Salvar alterações</Text></TouchableOpacity>

      <Text style={styles.section}>Lembretes de medicação</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Medicamento" placeholderTextColor="#777" value={newMed} onChangeText={setNewMed} />
        <TextInput style={[styles.input, { width: 120 }]} placeholder="HH:MM" placeholderTextColor="#777" value={newTime} onChangeText={setNewTime} />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#56CCF2' }]} onPress={onAddReminder}><Text style={styles.buttonText}>Adicionar</Text></TouchableOpacity>

      {reminders.map(item => (
        <View key={item.id} style={styles.reminderRow}>
          {editingId === item.id ? (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput style={[styles.input, { flex: 1 }]} value={editMed} onChangeText={setEditMed} placeholderTextColor="#777" />
                <TextInput style={[styles.input, { width: 100 }]} value={editTime} onChangeText={setEditTime} placeholder="HH:MM" placeholderTextColor="#777" />
              </View>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
                <TouchableOpacity style={[styles.button, { paddingVertical: 8, backgroundColor: '#6FCF97' }]} onPress={onSaveEdit}><Text style={styles.buttonText}>Salvar</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, { paddingVertical: 8, backgroundColor: '#BDBDBD' }]} onPress={()=>{ setEditingId(null); }}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <Text style={{ width: 60, textAlign: 'right' }}>{item.time}</Text>
              <TouchableOpacity onPress={() => onStartEdit(item)}>
                <Text style={{ color: '#2F80ED', marginLeft: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async ()=>{ await deleteReminder(item.id); load(); }}>
                <Text style={{ color: '#EB5757', marginLeft: 12 }}>Remover</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}

      <Text style={styles.section}>Vincular cuidadores</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#F2C94C' }]} onPress={onGenerateCode}>
        <Text style={[styles.buttonText, { color: '#1A1A1A' }]}>Gerar código</Text>
      </TouchableOpacity>
      {code && <Text style={styles.code}>{code}</Text>}

      <Text style={styles.section}>Cuidadores vinculados</Text>
      {caregivers.map(c => (
        <View key={c.id} style={styles.caregiverItem}>
          <Text>{c.name}</Text>
            <Text style={{ color: '#888' }}>{c.subrole === 'formal' ? 'Formal' : 'Informal'}</Text>
        </View>
      ))}
  </ScrollView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2F80ED', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 12, color: '#000' },
  section: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  button: { backgroundColor: '#2F80ED', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F2F2F2', paddingVertical: 10 },
  code: { backgroundColor: '#FFF9C4', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F2C94C', textAlign: 'center', marginTop: 8 },
  caregiverItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' }
});
