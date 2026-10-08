import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, radius, spacing, shadow } from '../../theme/theme';

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

  const rows = [
    { key: 'email', glyph: '@', label: 'Email', value: user?.email || '-' },
    { key: 'role', glyph: 'R', label: 'Role', value: user?.role || '-' },
    { key: 'tenant', glyph: 'T', label: 'Restaurant', value: user?.tenant?.name || '-' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Profile" subtitle="Your account details" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar name={user?.name || 'U'} size={72} bg={colors.white} fg={colors.primary} />
          <Text style={styles.heroName}>{user?.name || 'Unknown user'}</Text>
          <View style={styles.roleChip}>
            <Text style={styles.roleText}>{user?.role || 'STAFF'}</Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          {rows.map((r, i) => (
            <View key={r.key} style={[styles.row, i > 0 && styles.divider]}>
              <View style={styles.glyphCircle}>
                <Text style={styles.glyphText}>{r.glyph}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <Text style={styles.rowValue}>{r.value}</Text>
              </View>
            </View>
          ))}
        </Card>

        <PrimaryButton
          title={busy ? 'Signing out...' : 'Logout'}
          variant="danger"
          onPress={onLogout}
          loading={busy}
          style={styles.logout}
        />

        <Text style={styles.footer}>DineFlow POS · v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: spacing.lg,
    ...shadow.primary,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    marginTop: 14,
    letterSpacing: -0.3,
  },
  roleChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
  },
  roleText: { color: colors.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  infoCard: { marginTop: 16, padding: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  glyphCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  glyphText: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 11, fontWeight: '800', color: colors.textLight, letterSpacing: 0.8 },
  rowValue: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 3 },
  logout: { marginTop: 20 },
  footer: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 12,
    marginTop: 18,
  },
});

export default ProfileScreen;
