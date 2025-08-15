import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FamilyHome from '../screens/family/FamilyHome';
import ElderForm from '../screens/family/ElderForm';
import ElderDetail from '../screens/family/ElderDetail';
import CaregiverHome from '../screens/caregiver/CaregiverHome';
import ElderReadOnly from '../screens/caregiver/ElderReadOnly';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primary: '#2F80ED',
    card: '#FFFFFF',
    text: '#1A1A1A'
  }
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#fff' }, headerTintColor: '#2F80ED' }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
        <Stack.Screen name="FamilyHome" component={FamilyHome} options={{ title: 'Meus Idosos' }} />
        <Stack.Screen name="ElderForm" component={ElderForm} options={{ title: 'Cadastro do Idoso' }} />
        <Stack.Screen name="ElderDetail" component={ElderDetail} options={{ title: 'Perfil do Idoso' }} />
        <Stack.Screen name="CaregiverHome" component={CaregiverHome} options={{ title: 'Idosos Vinculados' }} />
        <Stack.Screen name="ElderReadOnly" component={ElderReadOnly} options={{ title: 'Informações do Idoso' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
