import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
