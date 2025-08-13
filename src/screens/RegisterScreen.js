import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { registerUser } from '../services/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');
  const [subrole, setSubrole] = useState(null);
  const isCaregiver = role === 'caregiver';

  const onRegister = async () => {
    try {
      const user = await registerUser({ name, cpf, email, password, role, subrole });
      Alert.alert('Sucesso', 'Conta criada! Faça login.');
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
  <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#777" value={name} onChangeText={setName} />
  <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#777" value={cpf} onChangeText={setCpf} autoCapitalize="none" />
  <TextInput style={styles.input} placeholder="Email (opcional)" placeholderTextColor="#777" value={email} onChangeText={setEmail} autoCapitalize="none" />
  <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#777" value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Tipo de conta</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setRole('family')} style={[styles.chip, role==='family' && styles.chipActive]}><Text style={[styles.chipText, role==='family' && styles.chipTextActive]}>Familiar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('caregiver')} style={[styles.chip, role==='caregiver' && styles.chipActive]}><Text style={[styles.chipText, role==='caregiver' && styles.chipTextActive]}>Cuidador</Text></TouchableOpacity>
      </View>

      {isCaregiver && (
        <View>
          <Text style={styles.label}>Tipo de cuidador</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setSubrole('formal')} style={[styles.chip, subrole==='formal' && styles.chipActive]}><Text style={[styles.chipText, subrole==='formal' && styles.chipTextActive]}>Formal</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setSubrole('informal')} style={[styles.chip, subrole==='informal' && styles.chipActive]}><Text style={[styles.chipText, subrole==='informal' && styles.chipTextActive]}>Informal</Text></TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={onRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2F80ED', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 12, color: '#000' },
  label: { fontWeight: '600', marginTop: 8, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#E0E0E0', marginRight: 8 },
  chipActive: { backgroundColor: '#2F80ED22', borderColor: '#2F80ED' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#2F80ED', fontWeight: '600' },
  button: { backgroundColor: '#2F80ED', padding: 14, borderRadius: 10, marginTop: 16 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});
