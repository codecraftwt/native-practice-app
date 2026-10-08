import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, radius, spacing, shadow, statusTheme } from '../../theme/theme';

const TABLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  number: `T${i + 1}`,
  seats: i % 4 === 0 ? 6 : 4,
  status: i % 3 === 0 ? 'OCCUPIED' : 'AVAILABLE',
}));

const TablesScreen = () => {
  const occupied = TABLES.filter((t) => t.status === 'OCCUPIED').length;
  const available = TABLES.length - occupied;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Tables" subtitle="Live floor status" />
      <View style={styles.legend}>
        <View style={[styles.legendPill, { backgroundColor: colors.successSoft }]}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>{available} Available</Text>
        </View>
        <View style={[styles.legendPill, { backgroundColor: colors.dangerSoft }]}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>{occupied} Occupied</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {TABLES.map((t) => {
          const theme = statusTheme[t.status];
          return (
            <Pressable
              key={t.id}
              style={({ pressed }) => [
                styles.table,
                { backgroundColor: theme.bg, borderColor: theme.fg + '33' },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.tableNum}>{t.number}</Text>
              <Text style={[styles.tableStatus, { color: theme.fg }]}>{t.status}</Text>
              <Text style={styles.seats}>{t.seats} seats</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 10,
    marginBottom: spacing.md,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
  legendText: { fontSize: 12, fontWeight: '700', color: colors.text },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  table: {
    width: '47.5%',
    aspectRatio: 1.15,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    justifyContent: 'center',
    ...shadow.card,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  tableNum: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  tableStatus: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginTop: 6 },
  seats: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});

export default TablesScreen;
