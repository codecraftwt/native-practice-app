import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { colors, radius, shadow } from '../theme/theme';
import LoginScreen from '../screens/Auth/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import OrdersScreen from '../screens/Orders/OrdersScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import TablesScreen from '../screens/Tables/TablesScreen';
import KitchenScreen from '../screens/Kitchen/KitchenScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ALL_STAFF = ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CASHIER', 'KITCHEN'];

const TABS = [
  { name: 'Dashboard', component: DashboardScreen, roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CASHIER'] },
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

const tabScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textLight,
  tabBarStyle: styles.tabBar,
  tabBarLabelStyle: styles.tabLabel,
  tabBarIcon: ({ focused }) => (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
        {route.name.charAt(0)}
      </Text>
    </View>
  ),
});

const MainTabs = () => {
  const { user } = useAuth();
  const role = user?.role || '';
  const visible = TABS.filter((tab) => tab.roles.includes(role));
  const tabs = visible.length > 0 ? visible : TABS.filter((tab) => tab.name === 'Profile');
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <SafeAreaView style={styles.splash}>
        <View style={styles.splashLogo}>
          <Text style={styles.splashLogoText}>D</Text>
        </View>
        <Text style={styles.splashBrand}>DineFlow</Text>
        <ActivityIndicator size="small" color={colors.primary} style={styles.splashSpinner} />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  splashLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.primary,
  },
  splashLogoText: { color: colors.white, fontSize: 32, fontWeight: '800' },
  splashBrand: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    letterSpacing: -0.4,
  },
  splashSpinner: { marginTop: 18 },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  tabIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: { backgroundColor: colors.primary },
  tabIconText: { fontSize: 12, fontWeight: '800', color: colors.textLight },
  tabIconTextActive: { color: colors.white },
});

export default RootNavigator;
