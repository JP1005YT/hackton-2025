import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getElderById, listReminders } from '../../services/family/elders';

export default function ElderReadOnly({ route, navigation }) {
  const { elderId } = route.params;
  const [elder, setElder] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [elderData, remindersData] = await Promise.all([
          getElderById(elderId),
          listReminders(elderId)
        ]);
        setElder(elderData);
        setReminders(remindersData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [elderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#204C54" />
      </SafeAreaView>
    );
  }

  if (!elder) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Não foi possível carregar os dados</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#2F80ED" />
          </TouchableOpacity>
          <Text style={styles.title}>Informações do Idoso</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Seção de informações pessoais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="person-outline" size={22} color="#204C54" />
            <Text style={styles.cardTitle}>Dados Pessoais</Text>
          </View>
          
          <InfoRow 
            icon="badge" 
            label="Nome Completo" 
            value={elder.full_name} 
          />
          
          {elder.age && (
            <InfoRow 
              icon="cake" 
              label="Idade" 
              value={`${elder.age} anos`} 
            />
          )}

          {elder.address && (
            <InfoRow 
              icon="home" 
              label="Endereço" 
              value={elder.address} 
            />
          )}
        </View>

        {/* Seção de saúde */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="favorite-outline" size={22} color="#204C54" />
            <Text style={styles.cardTitle}>Informações de Saúde</Text>
          </View>
          
          {elder.medical_conditions && (
            <InfoRow 
              icon="healing" 
              label="Condições Médicas" 
              value={elder.medical_conditions} 
            />
          )}

          {elder.allergies && (
            <InfoRow 
              icon="warning" 
              label="Alergias" 
              value={elder.allergies} 
            />
          )}

          {elder.notes && (
            <InfoRow 
              icon="notes" 
              label="Observações" 
              value={elder.notes} 
            />
          )}
        </View>

        {/* Seção de lembretes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="notifications-none" size={22} color="#204C54" />
            <Text style={styles.cardTitle}>Lembretes</Text>
          </View>
          
          {reminders.length > 0 ? (
            <FlatList
              data={reminders}
              scrollEnabled={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.reminderItem}>
                  <Icon name="alarm" size={24} color="#174685" />
                  <View style={styles.reminderTextContainer}>
                    <Text style={styles.reminderName}>{item.name}</Text>
                    <Text style={styles.reminderTime}>{item.time}</Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="notifications-off" size={32} color="#A8DADC" />
              <Text style={styles.emptyText}>Nenhum lembrete cadastrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para linhas de informação
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={20} color="#204C54" style={styles.rowIcon} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#A8DADC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8DADC',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8DADC',
  },
  errorText: {
    color: '#EB5757',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#204C54',
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#F1FAEE',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#A8DADC',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#204C54',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  rowIcon: {
    marginTop: 3,
    marginRight: 12,
    width: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#174685',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#204C54',
    lineHeight: 22,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  reminderTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  reminderName: {
    fontSize: 16,
    color: '#204C54',
    fontWeight: '500',
  },
  reminderTime: {
    fontSize: 14,
    color: '#174685',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#606060',
    fontSize: 16,
    marginTop: 10,
  },
});