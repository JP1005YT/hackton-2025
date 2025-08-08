import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getCurrentUser, logoutUser } from '../../services/auth';
import { listEldersByFamily } from '../../services/family/elders';

export default function FamilyHome({ navigation }) {
  const [user, setUser] = useState(null);
  const [elders, setElders] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const u = await getCurrentUser();
      setUser(u);
      if (u) {
        const list = await listEldersByFamily(u.id);
        setElders(list);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const goDetail = (elder) => navigation.navigate('ElderDetail', { elderId: elder.id });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Idosos</Text>
        <TouchableOpacity onPress={async () => { await logoutUser(); navigation.replace('Login'); }}><Text style={styles.logout}>Sair</Text></TouchableOpacity>
      </View>

      <FlatList
        data={elders}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goDetail(item)}>
            <Text style={styles.cardTitle}>{item.full_name}</Text>
            <Text style={styles.cardSub}>{item.age ? `${item.age} anos` : ''}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Nenhum idoso cadastrado</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ElderForm')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2F80ED' },
  logout: { color: '#EB5757', fontWeight: '600' },
  card: { marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSub: { color: '#666' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#F2C94C', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 },
  fabText: { fontSize: 28, color: '#1A1A1A', marginTop: -2 }
});
