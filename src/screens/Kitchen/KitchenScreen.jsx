import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const KitchenScreen = () => {
  const boards = [
    { title: 'NEW', items: ['ORD-001', 'ORD-004'] },
    { title: 'PREPARING', items: ['ORD-002'] },
    { title: 'READY', items: ['ORD-003'] },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Kitchen Display</Text>
      <ScrollView horizontal contentContainerStyle={styles.row}>
        {boards.map((b) => (
          <View key={b.title} style={styles.board}>
            <Text style={styles.boardTitle}>{b.title}</Text>
            {b.items.map((id) => (
              <Pressable key={id} style={styles.card}>
                <Text style={styles.cardText}>{id}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: '700', padding: 16 },
  row: { paddingHorizontal: 12, gap: 12 },
  board: { backgroundColor: '#fff', borderRadius: 10, width: 280, padding: 12, marginHorizontal: 4 },
  boardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  card: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 8 },
  cardText: { fontWeight: '600' },
});

export default KitchenScreen;