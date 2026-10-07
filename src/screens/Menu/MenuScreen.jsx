import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const MenuScreen = () => {
  const categories = ['Starters', 'Mains', 'Drinks', 'Desserts'];
  const [active, setActive] = useState(categories[0]);
  const items = Array.from({ length: 8 }).map((_, i) => ({ id: i + 1, name: `Item ${i + 1}`, price: (i + 1) * 50 }));
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {categories.map((c) => (
          <Pressable key={c} onPress={() => setActive(c)} style={[styles.tab, active === c && styles.tabActive]}>
            <Text style={[styles.tabText, active === c && styles.tabTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scroll}>
        {items.map((it) => (
          <View key={it.id} style={styles.item}>
            <View>
              <Text style={styles.itemName}>{it.name}</Text>
              <Text style={styles.itemPrice}>₹{it.price}</Text>
            </View>
            <Pressable style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabs: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tabsContent: { paddingHorizontal: 12 },
  tab: { paddingVertical: 12, paddingHorizontal: 16 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#111' },
  tabText: { color: '#666' },
  tabTextActive: { color: '#111', fontWeight: '600' },
  scroll: { padding: 16, gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 10, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { color: '#666', marginTop: 4 },
  addBtn: { backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff' },
});

export default MenuScreen;