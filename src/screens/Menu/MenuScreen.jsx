import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import SearchBar from '../../components/SearchBar';
import Chip from '../../components/Chip';
import { colors, radius, spacing, shadow } from '../../theme/theme';

const CATEGORIES = ['Starters', 'Mains', 'Drinks', 'Desserts'];

const TINTS = [
  { soft: colors.primarySoft, fg: colors.primary },
  { soft: colors.accentSoft, fg: '#B45309' },
  { soft: colors.infoSoft, fg: '#1D4ED8' },
  { soft: colors.successSoft, fg: '#047857' },
];

const ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: ['Paneer Tikka', 'Veg Biryani', 'Masala Dosa', 'Cold Coffee', 'Hakka Noodles', 'Gulab Jamun'][i % 6],
  category: CATEGORIES[i % CATEGORIES.length],
  price: (i + 1) * 50,
  veg: i % 3 !== 0,
}));

const MenuScreen = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter(
      (it) =>
        (category === 'ALL' || it.category === category) &&
        (!q || it.name.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Menu" subtitle={`${items.length} items · ${CATEGORIES.length} categories`} />
      <View style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search dishes..." />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cats}
          contentContainerStyle={styles.catsContent}
        >
          <Chip label="ALL" active={category === 'ALL'} onPress={() => setCategory('ALL')} />
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {items.map((it, idx) => {
          const tint = TINTS[idx % TINTS.length];
          return (
            <View key={it.id} style={styles.item}>
              <View style={[styles.thumb, { backgroundColor: tint.soft }]}>
                <Text style={[styles.thumbText, { color: tint.fg }]}>
                  {it.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{it.name}</Text>
                <Text style={styles.itemMeta}>{it.category}</Text>
              </View>
              <Text style={styles.price}>₹{it.price}</Text>
              <Pressable style={({ pressed }) => [styles.add, pressed && styles.addPressed]}>
                <Text style={styles.addText}>+</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  controls: { paddingHorizontal: spacing.lg },
  cats: { marginTop: 14, marginBottom: 4, marginHorizontal: -4 },
  catsContent: { paddingHorizontal: 4 },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: spacing.xl,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    ...shadow.card,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  thumbText: { fontSize: 18, fontWeight: '800' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: colors.text },
  itemMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '800', color: colors.text, marginRight: 12 },
  add: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.primary,
  },
  addPressed: { opacity: 0.8 },
  addText: { color: colors.white, fontSize: 20, fontWeight: '700', lineHeight: 22 },
});

export default MenuScreen;
