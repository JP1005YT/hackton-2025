import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getCurrentUser, logoutUser } from '../../services/auth';
import { linkWithCode, listLinkedElders } from '../../services/caregiver/links';

export default function CaregiverHome({ navigation }) {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState('');
  const [elders, setElders] = useState([]);

  const load = async () => {
    const u = await getCurrentUser();
    setUser(u);
    if (u) {
      const list = await listLinkedElders(u.id);
      setElders(list);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const onLink = async () => {
    try {
      await linkWithCode(user.id, code.trim());
      setCode('');
      await load();
      Alert.alert('Vinculado', 'Você agora tem acesso às informações do idoso.');
    } catch (e) { Alert.alert('Erro', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Vínculos</Text>
        <TouchableOpacity onPress={async () => { await logoutUser(); navigation.replace('Login'); }}><Text style={styles.logout}>Sair</Text></TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Código de vínculo" value={code} onChangeText={setCode} />
        <TouchableOpacity style={styles.linkBtn} onPress={onLink}><Text style={{ color: '#fff', fontWeight: '600' }}>Vincular</Text></TouchableOpacity>
      </View>

      <FlatList
        data={elders}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ElderReadOnly', { elderId: item.id })}>
            <Text style={styles.cardTitle}>{item.full_name}</Text>
            <Text style={styles.cardSub}>{item.age ? `${item.age} anos` : ''}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Nenhum vínculo</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2F80ED' },
  logout: { color: '#EB5757', fontWeight: '600' },
  row: { paddingHorizontal: 16, flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 12 },
  linkBtn: { backgroundColor: '#2F80ED', padding: 12, borderRadius: 10, marginLeft: 8, alignSelf: 'center' },
  card: { marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSub: { color: '#666' }
});
