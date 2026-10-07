import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';

const OrdersScreen = () => {
  const orders = [
    { id: 'ORD-001', table: 'T1', status: 'PLACED', total: 250 },
    { id: 'ORD-002', table: 'T3', status: 'PREPARING', total: 400 },
    { id: 'ORD-003', table: 'T5', status: 'READY', total: 150 },
  ];
  const color = (s) => (s === 'PLACED' ? '#1976d2' : s === 'PREPARING' ? '#ff8f00' : s === 'READY' ? '#2e7d32' : '#666');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Orders</Text>
        {orders.map((o) => (
          <View key={o.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.orderId}>{o.id}</Text>
              <Text style={[styles.status, { backgroundColor: color(o.status) }]}>{o.status}</Text>
            </View>
            <Text style={styles.meta}>Table: {o.table} • Total: ₹{o.total}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { padding: 16, gap: 12 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: '600' },
  status: { color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 12 },
  meta: { color: '#666', marginTop: 8 },
});

export default OrdersScreen;