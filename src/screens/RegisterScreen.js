import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Animated,
  Easing,
  Keyboard
} from 'react-native';
import { registerUser } from '../services/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');
  const [subrole, setSubrole] = useState(null);
  const isCaregiver = role === 'caregiver';

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const formScale = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp)
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1))
      }),
      Animated.spring(formScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const onRegister = async () => {
    try {
      Keyboard.dismiss();
      const user = await registerUser({ name, cpf, email, password, role, subrole });
      
      // Animação de sucesso
      Animated.sequence([
        Animated.timing(formScale, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(formScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start(() => {
        Alert.alert('Sucesso', 'Conta criada! Faça login.');
        navigation.replace('Login');
      });
    } catch (e) {
      // Animação de erro
      Animated.sequence([
        Animated.timing(formScale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(formScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start(() => {
        Alert.alert('Erro', e.message);
      });
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[
        styles.formContainer, 
        { 
          transform: [
            { translateY: slideUp },
            { scale: formScale }
          ] 
        }
      ]}>
        <Text style={styles.title}>Criar conta</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Nome" 
          placeholderTextColor="#999" 
          value={name} 
          onChangeText={setName} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="CPF" 
          placeholderTextColor="#999" 
          value={cpf} 
          onChangeText={setCpf} 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Email (opcional)" 
          placeholderTextColor="#999" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Senha" 
          placeholderTextColor="#999" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

        <Text style={styles.label}>Tipo de conta</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            onPress={() => setRole('family')} 
            style={[styles.chip, role==='family' && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, role==='family' && styles.chipTextActive]}>Familiar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setRole('caregiver')} 
            style={[styles.chip, role==='caregiver' && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, role==='caregiver' && styles.chipTextActive]}>Cuidador</Text>
          </TouchableOpacity>
        </View>

        {isCaregiver && (
          <View>
            <Text style={styles.label}>Tipo de cuidador</Text>
            <View style={styles.row}>
              <TouchableOpacity 
                onPress={() => setSubrole('formal')} 
                style={[styles.chip, subrole==='formal' && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, subrole==='formal' && styles.chipTextActive]}>Formal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setSubrole('informal')} 
                style={[styles.chip, subrole==='informal' && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, subrole==='informal' && styles.chipTextActive]}>Informal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.button} 
          onPress={onRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#A8DADC',
    justifyContent: 'center' 
  },
  formContainer: {
    backgroundColor: '#F1FAEE',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#204C54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#204C54', 
    marginBottom: 24,
    textAlign: 'center'
  },
  input: { 
    height: 50,
    borderWidth: 1, 
    borderColor: '#A8DADC', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 16, 
    color: '#204C54',
    backgroundColor: '#FFF',
    fontSize: 16
  },
  label: { 
    fontWeight: '600', 
    marginTop: 8, 
    marginBottom: 12,
    color: '#174685',
    fontSize: 16
  },
  row: { 
    flexDirection: 'row', 
    gap: 12,
    marginBottom: 16
  },
  chip: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#A8DADC',
    backgroundColor: '#FFF',
    flex: 1,
    alignItems: 'center'
  },
  chipActive: { 
    backgroundColor: '#204C5422', 
    borderColor: '#204C54' 
  },
  chipText: { 
    color: '#174685',
    fontSize: 14
  },
  chipTextActive: { 
    color: '#204C54', 
    fontWeight: '600' 
  },
  button: { 
    backgroundColor: '#204C54', 
    padding: 16, 
    borderRadius: 10, 
    marginTop: 24,
    shadowColor: '#204C54',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: { 
    color: '#FFF', 
    textAlign: 'center', 
    fontWeight: '600',
    fontSize: 18
  }
});