import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getCurrentUser } from '../../services/auth';
import { createElder } from '../../services/family/elders';

export default function ElderForm({ navigation }) {
  const [user, setUser] = useState(null);
  const [full_name, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [medical_conditions, setMedical] = useState('');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => setUser(await getCurrentUser()))();
  }, []);

  const onSave = async () => {
    try {
      await createElder(user.id, { full_name, age: age ? Number(age) : null, address, medical_conditions, allergies, notes });
      Alert.alert('Sucesso', 'Idoso cadastrado');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo idoso</Text>
      <TextInput style={styles.input} placeholder="Nome completo" value={full_name} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Idade" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Endereço" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Condições médicas" value={medical_conditions} onChangeText={setMedical} multiline />
      <TextInput style={styles.input} placeholder="Alergias" value={allergies} onChangeText={setAllergies} multiline />
      <TextInput style={styles.input} placeholder="Observações" value={notes} onChangeText={setNotes} multiline />

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2F80ED', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2F80ED', padding: 14, borderRadius: 10, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});
