import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCurrentUser } from '../../services/auth';
import { createElder } from '../../services/family/elders';

export default function ElderForm({ navigation }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    address: '',
    medical_conditions: '',
    allergies: '',
    notes: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    try {
      if (!form.full_name.trim()) {
        Alert.alert('Atenção', 'Por favor, informe o nome completo');
        return;
      }

      await createElder(user.id, { 
        ...form, 
        age: form.age ? Number(form.age) : null 
      });
      
      Alert.alert('Sucesso', 'Idoso cadastrado com sucesso');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao cadastrar idoso');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#2F80ED" />
          </TouchableOpacity>
          <Text style={styles.title}>Cadastrar Idoso</Text>
          <View style={{ width: 24 }} /> {/* Espaçamento balanceado */}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome completo"
              placeholderTextColor="#999"
              value={form.full_name}
              onChangeText={(text) => handleChange('full_name', text)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Idade</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a idade"
              placeholderTextColor="#999"
              value={form.age}
              onChangeText={(text) => handleChange('age', text)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o endereço"
              placeholderTextColor="#999"
              value={form.address}
              onChangeText={(text) => handleChange('address', text)}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informações de Saúde</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condições Médicas</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Informe as condições médicas"
              placeholderTextColor="#999"
              value={form.medical_conditions}
              onChangeText={(text) => handleChange('medical_conditions', text)}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alergias</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Informe as alergias conhecidas"
              placeholderTextColor="#999"
              value={form.allergies}
              onChangeText={(text) => handleChange('allergies', text)}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Adicione outras observações importantes"
              placeholderTextColor="#999"
              value={form.notes}
              onChangeText={(text) => handleChange('notes', text)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={onSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Salvar Cadastro</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8DADC',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#204C54',
    textAlign: 'center',
    flex: 1,
  },
  formSection: {
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#174685',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#204C54',
    borderWidth: 1,
    borderColor: '#A8DADC',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#204C54',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});