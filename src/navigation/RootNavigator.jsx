import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import OrdersScreen from '../screens/Orders/OrdersScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import TablesScreen from '../screens/Tables/TablesScreen';
import KitchenScreen from '../screens/Kitchen/KitchenScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ALL_STAFF = ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CASHIER', 'KITCHEN'];

const TABS = [
  { name: 'Dashboard', component: DashboardScreen, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'CASHIER'] },
  { name: 'Orders', component: OrdersScreen, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CASHIER', 'KITCHEN'] },
  { name: 'Menu', component: MenuScreen, roles: ALL_STAFF },
  { name: 'Tables', component: TablesScreen, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CASHIER', 'KITCHEN'] },
  { name: 'Kitchen', component: KitchenScreen, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'KITCHEN'] },
  { name: 'Profile', component: ProfileScreen, roles: ALL_STAFF },
];

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const MainTabs = ({ role }) => {
  const visible = TABS.filter((tab) => tab.roles.includes(role || ''));
  const tabs = visible.length > 0 ? visible : TABS.filter((tab) => tab.name === 'Profile');
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs role={user.role} /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
});

export default RootNavigator;
