import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';

const DashboardScreen = () => {
  const cards = [
    { title: 'Today\'s Sales', value: '₹0.00' },
    { title: 'Today\'s Orders', value: '0' },
    { title: 'Active Tables', value: '0' },
    { title: 'Pending Kitchen', value: '0' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Dashboard</Text>
        <View style={styles.grid}>
          {cards.map((c) => (
            <View key={c.title} style={styles.card}>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardValue}>{c.value}</Text>
            </View>
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
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, width: '47%', elevation: 1 },
  cardTitle: { color: '#666', fontSize: 12 },
  cardValue: { fontSize: 18, fontWeight: '700', marginTop: 4 },
});

export default DashboardScreen;