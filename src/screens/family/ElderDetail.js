import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  getElderById, 
  updateElder, 
  addReminder, 
  listReminders, 
  updateReminder, 
  deleteReminder, 
  generateLinkCode, 
  listCaregivers 
} from '../../services/family/elders';
import { getCurrentUser } from '../../services/auth';

export default function ElderDetail({ route }) {
  const { elderId } = route.params;
  const [elder, setElder] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [newMed, setNewMed] = useState('');
  const [newTime, setNewTime] = useState('');
  const [caregivers, setCaregivers] = useState([]);
  const [code, setCode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editMed, setEditMed] = useState('');
  const [editTime, setEditTime] = useState('');

  const loadData = async () => {
    try {
      const elderData = await getElderById(elderId);
      setElder(elderData);
      const remindersData = await listReminders(elderId);
      setReminders(remindersData);
      const caregiversData = await listCaregivers(elderId);
      setCaregivers(caregiversData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  useEffect(() => { 
    loadData(); 
  }, [elderId]);

  const onSave = async () => {
    try {
      await updateElder(elderId, elder);
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso');
    } catch (error) { 
      Alert.alert('Erro', error.message); 
    }
  };

  const onAddReminder = async () => {
    if (!newMed || !newTime) {
      Alert.alert('Atenção', 'Preencha todos os campos do lembrete');
      return;
    }
    try {
      await addReminder(elderId, newMed, newTime);
      setNewMed(''); 
      setNewTime('');
      await loadData();
    } catch (error) { 
      Alert.alert('Erro', error.message); 
    }
  };

  const onStartEdit = (item) => {
    setEditingId(item.id);
    setEditMed(item.name);
    setEditTime(item.time);
  };

  const onSaveEdit = async () => {
    try {
      await updateReminder(editingId, editMed, editTime);
      setEditingId(null);
      await loadData();
    } catch (error) { 
      Alert.alert('Erro', error.message); 
    }
  };

  const onGenerateCode = async () => {
    try {
      const user = await getCurrentUser();
      const generatedCode = await generateLinkCode(elderId, user.id);
      setCode(generatedCode);
    } catch (error) { 
      Alert.alert('Erro', error.message); 
    }
  };

  if (!elder) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{elder.full_name}</Text>
          {elder.age && <Text style={styles.age}>{elder.age} anos</Text>}
        </View>

        {/* Informações básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={elder.full_name}
              onChangeText={(text) => setElder({...elder, full_name: text})}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Idade</Text>
            <TextInput
              style={styles.input}
              value={elder.age ? String(elder.age) : ''}
              onChangeText={(text) => setElder({...elder, age: text ? Number(text) : null})}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={elder.address || ''}
              onChangeText={(text) => setElder({...elder, address: text})}
            />
          </View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>Condições médicas</Text>
  <TextInput
    style={[styles.input, styles.multilineInput]}
    value={elder.medical_conditions || ''}
    onChangeText={(text) => setElder({...elder, medical_conditions: text})}
    multiline
    numberOfLines={4}
    placeholder="Informe as condições médicas"
    placeholderTextColor="#999"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>Alergias</Text>
  <TextInput
    style={[styles.input, styles.multilineInput]}
    value={elder.allergies || ''}
    onChangeText={(text) => setElder({...elder, allergies: text})}
    multiline
    numberOfLines={4}
    placeholder="Informe as alergias conhecidas"
    placeholderTextColor="#999"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>Observações</Text>
  <TextInput
    style={[styles.input, styles.multilineInput]}
    value={elder.notes || ''}
    onChangeText={(text) => setElder({...elder, notes: text})}
    multiline
    numberOfLines={4}
    placeholder="Adicione outras observações importantes"
    placeholderTextColor="#999"
  />
</View>
         
          
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        {/* Saúde */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Saúde</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condições Médicas</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={elder.medical_conditions || ''}
              onChangeText={(text) => setElder({...elder, medical_conditions: text})}
              multiline
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alergias</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={elder.allergies || ''}
              onChangeText={(text) => setElder({...elder, allergies: text})}
              multiline
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={elder.notes || ''}
              onChangeText={(text) => setElder({...elder, notes: text})}
              multiline
            />
          </View>
        </View>

        {/* Lembretes de Medicação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lembretes de Medicação</Text>
          
          <View style={styles.reminderForm}>
            <View style={styles.reminderInputGroup}>
              <Text style={styles.label}>Medicamento</Text>
              <TextInput
                style={styles.input}
                value={newMed}
                onChangeText={setNewMed}
                placeholder="Nome do medicamento"
              />
            </View>
            
            <View style={styles.reminderInputGroup}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                style={styles.input}
                value={newTime}
                onChangeText={setNewTime}
                placeholder="HH:MM"
              />
            </View>
            
            <TouchableOpacity style={styles.addButton} onPress={onAddReminder}>
              <Icon name="add" size={24} color="#FFF" />
              <Text style={styles.addButtonText}>Adicionar Lembrete</Text>
            </TouchableOpacity>
          </View>
          
          {reminders.length > 0 ? (
            reminders.map(item => (
              <View key={item.id} style={styles.reminderItem}>
                {editingId === item.id ? (
                  <View style={styles.editReminderContainer}>
                    <View style={styles.editInputGroup}>
                      <TextInput
                        style={styles.input}
                        value={editMed}
                        onChangeText={setEditMed}
                      />
                      <TextInput
                        style={styles.input}
                        value={editTime}
                        onChangeText={setEditTime}
                        placeholder="HH:MM"
                      />
                    </View>
                    
                    <View style={styles.editButtons}>
                      <TouchableOpacity 
                        style={[styles.editButton, styles.saveEditButton]} 
                        onPress={onSaveEdit}
                      >
                        <Text style={styles.editButtonText}>Salvar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.editButton, styles.cancelEditButton]} 
                        onPress={() => setEditingId(null)}
                      >
                        <Text style={styles.editButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.reminderInfo}>
                    <View style={styles.reminderText}>
                      <Text style={styles.reminderName}>{item.name}</Text>
                      <Text style={styles.reminderTime}>{item.time}</Text>
                    </View>
                    
                    <View style={styles.reminderActions}>
                      <TouchableOpacity 
                        style={styles.reminderActionButton} 
                        onPress={() => onStartEdit(item)}
                      >
                        <Icon name="edit" size={20} color="#2F80ED" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.reminderActionButton} 
                        onPress={async () => { await deleteReminder(item.id); loadData(); }}
                      >
                        <Icon name="delete" size={20} color="#EB5757" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyReminders}>
              <Icon name="notifications-none" size={40} color="#A8DADC" />
              <Text style={styles.emptyRemindersText}>Nenhum lembrete cadastrado</Text>
            </View>
          )}
        </View>

        {/* Cuidadores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuidadores</Text>
          
          <TouchableOpacity style={styles.generateCodeButton} onPress={onGenerateCode}>
            <Icon name="vpn-key" size={20} color="#1A1A1A" />
            <Text style={styles.generateCodeButtonText}>Gerar Código de Acesso</Text>
          </TouchableOpacity>
          
          {code && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>Código: {code}</Text>
              <Text style={styles.codeInstructions}>Compartilhe este código com o cuidador</Text>
            </View>
          )}
          
          {caregivers.length > 0 ? (
            caregivers.map(caregiver => (
              <View key={caregiver.id} style={styles.caregiverItem}>
                <View style={styles.caregiverInfo}>
                  <Text style={styles.caregiverName}>{caregiver.name}</Text>
                  <Text style={styles.caregiverType}>
                    {caregiver.subrole === 'formal' ? 'Cuidador Formal' : 'Cuidador Informal'}
                  </Text>
                </View>
                <Icon name="person" size={24} color="#2F80ED" />
              </View>
            ))
          ) : (
            <View style={styles.emptyCaregivers}>
              <Icon name="person-outline" size={40} color="#A8DADC" />
              <Text style={styles.emptyCaregiversText}>Nenhum cuidador vinculado</Text>
            </View>
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8DADC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#204C54',
  },
  age: {
    fontSize: 18,
    color: '#174685',
    backgroundColor: '#F1FAEE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  section: {
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
    fontSize: 20,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#204C54',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reminderForm: {
    marginBottom: 20,
  },
  reminderInputGroup: {
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#204C54',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reminderItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reminderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderText: {
    flex: 1,
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
  reminderActions: {
    flexDirection: 'row',
  },
  reminderActionButton: {
    marginLeft: 16,
  },
  editReminderContainer: {
    marginTop: 8,
  },
  editInputGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  saveEditButton: {
    backgroundColor: '#6FCF97',
  },
  cancelEditButton: {
    backgroundColor: '#BDBDBD',
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyReminders: {
    alignItems: 'center',
    padding: 20,
  },
  emptyRemindersText: {
    marginTop: 12,
    color: '#174685',
    textAlign: 'center',
  },
  generateCodeButton: {
    backgroundColor: '#F2C94C',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  generateCodeButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  codeContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F2C94C',
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  codeInstructions: {
    fontSize: 14,
    color: '#606060',
    textAlign: 'center',
    marginTop: 4,
  },
  caregiverItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 16,
    color: '#204C54',
    fontWeight: '500',
  },
  caregiverType: {
    fontSize: 14,
    color: '#606060',
    marginTop: 4,
  },
  emptyCaregivers: {
    alignItems: 'center',
    padding: 20,
  },
  emptyCaregiversText: {
    marginTop: 12,
    color: '#174685',
    textAlign: 'center',
  },
});