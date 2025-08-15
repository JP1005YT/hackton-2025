import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Animated,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCurrentUser, logoutUser } from '../../services/auth';
import { listEldersByFamily } from '../../services/family/elders';

export default function FamilyHome({ navigation }) {
  const [user, setUser] = useState(null);
  const [elders, setElders] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    const loadData = async () => {
      const u = await getCurrentUser();
      setUser(u);
      if (u) {
        const list = await listEldersByFamily(u.id);
        setElders(list);
      }
      fadeIn.start();
    };

    const unsubscribe = navigation.addListener('focus', loadData);

    return () => {
      unsubscribe();
      fadeIn.stop();
    };
  }, [navigation]);

  const goDetail = (elder) => {
    navigation.navigate('ElderDetail', { elderId: elder.id });
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meus Idosos</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="exit-to-app" size={28} color="#EB5757" />
          </TouchableOpacity>
        </View>

        {/* Lista de Idosos */}
        <ScrollView contentContainerStyle={styles.listContainer}>
          {elders.length > 0 ? (
            elders.map(elder => (
              <TouchableOpacity 
                key={elder.id}
                style={styles.card}
                onPress={() => goDetail(elder)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{elder.full_name}</Text>
                  {elder.age && (
                    <View style={styles.ageBadge}>
                      <Text style={styles.ageText}>{elder.age} anos</Text>
                    </View>
                  )}
                </View>
                <Icon name="chevron-right" size={24} color="#2F80ED" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="elderly" size={60} color="#F1FAEE" />
              <Text style={styles.emptyText}>Nenhum idoso cadastrado</Text>
              <Text style={styles.emptySubtext}>Toque no botão + para adicionar</Text>
            </View>
          )}
        </ScrollView>

        {/* Botão Flutuante */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('ElderForm')}
          activeOpacity={0.8}
        >
          <Icon name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#A8DADC'
  },
  container: {
    flex: 1,
    backgroundColor: '#A8DADC',
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#204C54'
  },
  listContainer: {
    paddingBottom: 80
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1FAEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#204C54',
    marginRight: 12
  },
  ageBadge: {
    backgroundColor: '#A8DADC',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  ageText: {
    fontSize: 14,
    color: '#204C54',
    fontWeight: '500'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40
  },
  emptyText: {
    fontSize: 18,
    color: '#F1FAEE',
    marginTop: 16,
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#F1FAEE',
    marginTop: 8,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#F2C94C',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5
  }
});