import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { initDatabase } from '../db';
import { getCurrentUser, loginUser } from '../services/auth';

export default function LoginScreen({ navigation }) {
  const [cpfOrUsername, setCpfOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDatabase();
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        if (user.role === 'family') navigation.replace('FamilyHome');
        else navigation.replace('CaregiverHome');
      }
    })();
  }, []);

  const onLogin = async () => {
    try {
      setLoading(true);
      const user = await loginUser({ cpfOrUsername, password });
      if (user.role === 'family') navigation.replace('FamilyHome');
      else navigation.replace('CaregiverHome');
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuidar+</Text>
      <Text style={styles.subtitle}>Apoio ao cuidado de idosos</Text>
      <TextInput style={styles.input} placeholder="CPF ou Nome de usuário" value={cpfOrUsername} onChangeText={setCpfOrUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2F80ED', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#606060', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2F80ED', padding: 14, borderRadius: 10, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  link: { color: '#2F80ED', textAlign: 'center', marginTop: 12 }
});
