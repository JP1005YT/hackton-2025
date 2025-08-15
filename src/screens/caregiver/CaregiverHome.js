import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCurrentUser, logoutUser } from '../../services/auth';
import { linkWithCode, listLinkedElders } from '../../services/caregiver/links';

export default function CaregiverHome({ navigation }) {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState('');
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const u = await getCurrentUser();
      setUser(u);
      if (u) {
        const list = await listLinkedElders(u.id);
        setElders(list || []);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os vínculos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    loadData();
    return unsubscribe;
  }, [navigation]);

  const onLink = async () => {
    if (!code.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o código de vínculo');
      return;
    }

    try {
      setLinking(true);
      await linkWithCode(user.id, code.trim());
      setCode('');
      await loadData();
      Alert.alert('Sucesso', 'Vínculo estabelecido com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao vincular');
    } finally {
      setLinking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Navegação mais robusta para garantir que volte para o login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Erro', 'Falha ao sair da conta. Tente novamente.');
    }
  };

  const renderElderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.elderCard}
      onPress={() => navigation.navigate('ElderReadOnly', { elderId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.elderInfo}>
        <Text style={styles.elderName} numberOfLines={1}>{item.full_name}</Text>
        {item.age && <Text style={styles.elderAge}>{item.age} anos</Text>}
      </View>
      <Icon name="chevron-right" size={24} color="#2F80ED" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Meus Vínculos</Text>
              <TouchableOpacity 
                onPress={handleLogout} 
                style={styles.logoutButton}
                testID="logout-button"
              >
                <Icon name="exit-to-app" size={24} color="#EB5757" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Formulário de vínculo */}
          <View style={styles.linkContainer}>
            <Text style={styles.sectionTitle}>Vincular Novo Idoso</Text>
            <View style={styles.linkForm}>
              <TextInput
                style={styles.codeInput}
                placeholder="Digite o código de vínculo"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
                editable={!linking}
              />
              <TouchableOpacity 
                style={[styles.linkButton, linking && styles.linkButtonDisabled]}
                onPress={onLink}
                disabled={linking}
              >
                {linking ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Icon name="link" size={20} color="#FFF" />
                    <Text style={styles.linkButtonText}>Vincular</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de idosos vinculados */}
          <View style={styles.eldersContainer}>
            <Text style={styles.sectionTitle}>Idosos Vinculados</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2F80ED" />
              </View>
            ) : elders.length > 0 ? (
              <FlatList
                data={elders}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.listContent}
                renderItem={renderElderItem}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="elderly" size={48} color="#A8DADC" />
                <Text style={styles.emptyText}>Nenhum idoso vinculado</Text>
                <Text style={styles.emptySubtext}>Use um código para vincular um idoso</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#A8DADC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#204C54',
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: {
    padding: 8,
  },
  linkContainer: {
    backgroundColor: '#F1FAEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#204C54',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#A8DADC',
    paddingBottom: 8,
  },
  linkForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#204C54',
    borderWidth: 1,
    borderColor: '#A8DADC',
    marginRight: 12,
  },
  linkButton: {
    backgroundColor: '#204C54',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  linkButtonDisabled: {
    opacity: 0.7,
  },
  linkButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  eldersContainer: {
    backgroundColor: '#F1FAEE',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 8,
  },
  elderCard: {
    backgroundColor: '#A8DADC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  elderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#204C54',
    flexShrink: 1,
  },
  elderAge: {
    fontSize: 14,
    color: '#204C54',
    backgroundColor: '#F1FAEE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#204C54',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#606060',
    marginTop: 8,
    textAlign: 'center',
  },
});