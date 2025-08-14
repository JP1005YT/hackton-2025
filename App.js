import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { initDatabase } from './src/db';

export default function App() {
  useEffect(() => {
    // Inicializar banco para todas as plataformas
    initDatabase().catch(error => {
      console.error('Erro ao inicializar banco de dados:', error);
    });
  }, []);
  
  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}
