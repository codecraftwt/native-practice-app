import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import SearchBar from '../../components/SearchBar';
import Chip from '../../components/Chip';
import Card from '../../components/Card';
import StatusPill from '../../components/StatusPill';
import { colors, spacing, statusTheme } from '../../theme/theme';

const ORDERS = [
  { id: 'ORD-001', table: 'T1', status: 'PLACED', total: 250, items: 3, time: '10:32 AM' },
  { id: 'ORD-002', table: 'T3', status: 'PREPARING', total: 400, items: 5, time: '10:28 AM' },
  { id: 'ORD-003', table: 'T5', status: 'READY', total: 150, items: 2, time: '10:15 AM' },
  { id: 'ORD-004', table: 'T2', status: 'PLACED', total: 620, items: 7, time: '10:41 AM' },
  { id: 'ORD-005', table: 'T7', status: 'SERVED', total: 340, items: 4, time: '09:58 AM' },
];

const FILTERS = ['ALL', 'PLACED', 'PREPARING', 'READY'];

const OrdersScreen = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  const orders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORDERS.filter(
      (o) =>
        (filter === 'ALL' || o.status === filter) &&
        (!q || o.id.toLowerCase().includes(q) || o.table.toLowerCase().includes(q)),
    );
  }, [query, filter]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Orders" subtitle={`${orders.length} orders in view`} />
      <View style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search order or table..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {orders.length === 0 ? (
          <Card style={styles.empty}>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>Try a different filter or search term.</Text>
          </Card>
        ) : (
          orders.map((o) => {
            const stripe = (statusTheme[o.status] || {}).bg || colors.border;
            return (
              <Card key={o.id} style={styles.orderCard}>
                <View style={[styles.stripe, { backgroundColor: stripe }]} />
                <View style={styles.orderBody}>
                  <View style={styles.orderTop}>
                    <Text style={styles.orderId}>{o.id}</Text>
                    <StatusPill status={o.status} />
                  </View>
                  <Text style={styles.orderMeta}>
                    Table {o.table} · {o.items} items · {o.time}
                  </Text>
                  <View style={styles.orderBottom}>
                    <Text style={styles.payLabel}>TOTAL</Text>
                    <Text style={styles.orderTotal}>₹{o.total}</Text>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  controls: { paddingHorizontal: spacing.lg },
  filters: { marginTop: 14, marginBottom: 4 },
  list: { paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: spacing.xl, gap: 12 },
  orderCard: { flexDirection: 'row', padding: 0, overflow: 'hidden' },
  stripe: { width: 5, borderRadius: 3 },
  orderBody: { flex: 1, padding: spacing.lg },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: '800', color: colors.text, letterSpacing: -0.2 },
  orderMeta: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payLabel: { fontSize: 10, fontWeight: '800', color: colors.textLight, letterSpacing: 0.8 },
  orderTotal: { fontSize: 17, fontWeight: '800', color: colors.text },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
});

export default OrdersScreen;
