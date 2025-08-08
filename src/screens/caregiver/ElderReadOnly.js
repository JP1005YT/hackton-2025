import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getElderById, listReminders } from '../../services/family/elders';

export default function ElderReadOnly({ route }) {
  const { elderId } = route.params;
  const [elder, setElder] = useState(null);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    (async () => {
      const e = await getElderById(elderId);
      setElder(e);
      const meds = await listReminders(elderId);
      setReminders(meds);
    })();
  }, [elderId]);

  if (!elder) return <View style={{ flex:1 }}/>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{elder.full_name}</Text>
      {!!elder.age && <Text style={styles.sub}>{elder.age} anos</Text>}
      {!!elder.address && <Text style={styles.row}>Endereço: {elder.address}</Text>}
      {!!elder.medical_conditions && <Text style={styles.row}>Condições: {elder.medical_conditions}</Text>}
      {!!elder.allergies && <Text style={styles.row}>Alergias: {elder.allergies}</Text>}
      {!!elder.notes && <Text style={styles.row}>Obs.: {elder.notes}</Text>}

      <Text style={[styles.title, { marginTop: 16 }]}>Lembretes</Text>
      <FlatList
        data={reminders}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.reminderRow}>
            <Text style={{ flex: 1 }}>{item.name}</Text>
            <Text style={{ width: 60, textAlign: 'right' }}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888' }}>Sem lembretes</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2F80ED' },
  sub: { color: '#666', marginBottom: 12 },
  row: { marginTop: 6 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F2F2F2', paddingVertical: 10 }
});
