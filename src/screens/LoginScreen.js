import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Keyboard,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { loginUser } from '../services/auth'; // Importe seu serviço de autenticação

export default function LoginScreen({ navigation }) {
  const [cpfOrUsername, setCpfOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const usernameRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      
      // Validação básica
      if (!cpfOrUsername.trim() || !password.trim()) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      setLoading(true);
      
      // Chamada ao serviço de autenticação
      const user = await loginUser({ 
        cpfOrUsername, 
        password 
      });

      // Navegação baseada no tipo de usuário
      if (user.role === 'family') {
        navigation.replace('FamilyHome');
      } else {
        navigation.replace('CaregiverHome');
      }
      
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Cuide-se</Text>
        <Text style={styles.subtitle}>Apoio ao cuidado de idosos</Text>

        <TextInput
          ref={usernameRef}
          style={styles.input}
          placeholder="CPF ou Nome de usuário"
          placeholderTextColor="#999"
          value={cpfOrUsername}
          onChangeText={setCpfOrUsername}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
          blurOnSubmit={false}
          editable={!loading}
        />

        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="go"
          onSubmitEditing={handleLogin}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => !loading && navigation.navigate('Register')}
          style={styles.registerLink}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.registerText}>
            Não tem uma conta? <Text style={styles.registerHighlight}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#A8DADC'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 5
  },
  logo: {
    width: 150,
    height: 150,
    backgroundColor: '#F1FAEE',
    borderRadius: 75,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F80ED',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#174685',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    includeFontPadding: true,
    textAlignVertical: 'center'
  },
  button: {
    backgroundColor: '#204C54',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    minHeight: 50
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  registerLink: {
    alignSelf: 'center'
  },
  registerText: {
    color: '#174685',
    fontSize: 14
  },
  registerHighlight: {
    color: '#2F80ED',
    fontWeight: 'bold'
  }
});