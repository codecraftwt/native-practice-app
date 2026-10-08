import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import StatusPill from '../../components/StatusPill';
import { colors, radius, spacing } from '../../theme/theme';

const METRICS_ROLES = ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'CASHIER'];

const STATS = [
  { key: 'sales', glyph: '₹', label: "Today's Sales", value: '₹10,000', tint: colors.primary, soft: colors.primarySoft },
  { key: 'orders', glyph: '#', label: "Today's Orders", value: '24', tint: colors.info, soft: colors.infoSoft },
  { key: 'tables', glyph: 'T', label: 'Active Tables', value: '8 / 12', tint: colors.success, soft: colors.successSoft },
  { key: 'kitchen', glyph: 'K', label: 'In Kitchen', value: '3', tint: colors.warning, soft: colors.warningSoft },
];

const WAITER_STATS = [
  { key: 'myorders', glyph: '#', label: 'My Active Orders', value: '5', tint: colors.info, soft: colors.infoSoft },
  { key: 'mytables', glyph: 'T', label: 'My Tables', value: '3', tint: colors.success, soft: colors.successSoft },
];

const RECENT = [
  { id: 'ORD-001', table: 'T1', status: 'PLACED', total: 250 },
  { id: 'ORD-002', table: 'T3', status: 'PREPARING', total: 400 },
  { id: 'ORD-003', table: 'T5', status: 'READY', total: 150 },
];

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const canManageSettings = user?.role === 'OWNER' || user?.role === 'MANAGER';
  const stats = METRICS_ROLES.includes(user?.role) ? STATS : WAITER_STATS;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.hello}>Welcome back</Text>
            <Text style={styles.name}>{user?.name || 'Team'}</Text>
            <View style={styles.roleChip}>
              <Text style={styles.roleText}>{user?.role || 'STAFF'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {canManageSettings ? (
              <Pressable
                style={({ pressed }) => [styles.settingsBtn, pressed && styles.settingsPressed]}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.settingsBtnText}>Settings</Text>
              </Pressable>
            ) : null}
            <Avatar name={user?.name || 'U'} size={52} />
          </View>
        </View>

        <View style={styles.grid}>
          {stats.map((s) => (
            <Card key={s.key} style={styles.statCard}>
              <View style={[styles.glyphCircle, { backgroundColor: s.soft }]}>
                <Text style={[styles.glyph, { color: s.tint }]}>{s.glyph}</Text>
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Text style={styles.sectionLink}>View all</Text>
        </View>

        <Card style={styles.recentCard}>
          {RECENT.map((o, i) => (
            <View key={o.id} style={[styles.recentRow, i > 0 && styles.recentDivider]}>
              <View style={styles.recentLeft}>
                <Text style={styles.recentId}>{o.id}</Text>
                <Text style={styles.recentMeta}>Table {o.table}</Text>
              </View>
              <StatusPill status={o.status} />
              <Text style={styles.recentTotal}>₹{o.total}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerLeft: { flex: 1 },
  headerRight: { alignItems: 'flex-end', gap: 10 },
  settingsBtn: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  settingsPressed: { opacity: 0.7 },
  settingsBtnText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  hello: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  roleChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  roleText: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    rowGap: 12,
  },
  statCard: {
    width: '48%',
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  glyphCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  glyph: { fontSize: 17, fontWeight: '800' },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, letterSpacing: -0.2 },
  sectionLink: { fontSize: 13, fontWeight: '700', color: colors.primary },
  recentCard: { marginHorizontal: spacing.lg, padding: 0, overflow: 'hidden' },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  recentDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  recentLeft: { flex: 1 },
  recentId: { fontSize: 15, fontWeight: '800', color: colors.text },
  recentMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  recentTotal: { fontSize: 15, fontWeight: '800', color: colors.text, marginLeft: 12 },
});

export default DashboardScreen;
