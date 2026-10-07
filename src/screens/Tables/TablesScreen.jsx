import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const TablesScreen = () => {
  const tables = Array.from({ length: 12 }).map((_, i) => ({ id: i + 1, number: `T${i + 1}`, status: i % 3 === 0 ? 'OCCUPIED' : 'AVAILABLE' }));
  const color = (s) => (s === 'AVAILABLE' ? '#2e7d32' : s === 'OCCUPIED' ? '#ff8f00' : '#9e9e9e');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Tables</Text>
        <View style={styles.grid}>
          {tables.map((t) => (
            <Pressable key={t.id} style={[styles.table, { backgroundColor: color(t.status) }]}>
              <Text style={styles.tableNum}>{t.number}</Text>
              <Text style={styles.tableStatus}>{t.status}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  table: { width: '30%', aspectRatio: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 8 },
  tableNum: { color: '#fff', fontSize: 16, fontWeight: '700' },
  tableStatus: { color: '#fff', fontSize: 10, marginTop: 4 },
});

export default TablesScreen;