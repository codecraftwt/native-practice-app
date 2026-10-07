import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);

  const onLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await logout();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.name}>{user?.name || 'Unknown user'}</Text>
          <Text style={styles.meta}>Role: {user?.role || '-'}</Text>
          <Text style={styles.meta}>Email: {user?.email || '-'}</Text>
          <Text style={styles.meta}>Restaurant: {user?.tenant?.name || '-'}</Text>
        </View>
        <Pressable style={[styles.logoutBtn, busy && { opacity: 0.6 }]} onPress={onLogout} disabled={busy}>
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutText}>Logout</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  name: { fontSize: 18, fontWeight: '700' },
  meta: { color: '#666', marginTop: 4 },
  logoutBtn: { backgroundColor: '#d32f2f', padding: 14, borderRadius: 8, marginTop: 24 },
  logoutText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default ProfileScreen;
