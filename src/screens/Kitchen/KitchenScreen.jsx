import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import { colors, radius, spacing } from '../../theme/theme';

const BOARDS = [
  {
    title: 'NEW',
    tint: colors.info,
    soft: colors.infoSoft,
    orders: [
      { id: 'ORD-001', table: 'T1', items: '3 items', time: '2m' },
      { id: 'ORD-004', table: 'T2', items: '7 items', time: '1m' },
    ],
  },
  {
    title: 'PREPARING',
    tint: colors.warning,
    soft: colors.warningSoft,
    orders: [{ id: 'ORD-002', table: 'T3', items: '5 items', time: '8m' }],
  },
  {
    title: 'READY',
    tint: colors.success,
    soft: colors.successSoft,
    orders: [{ id: 'ORD-003', table: 'T5', items: '2 items', time: '12m' }],
  },
];

const KitchenScreen = () => {
  const active = BOARDS.reduce((sum, b) => sum + b.orders.length, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Kitchen Display" subtitle={`${active} active orders`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boards}
      >
        {BOARDS.map((b) => (
          <View key={b.title} style={styles.board}>
            <View style={[styles.boardHeader, { backgroundColor: b.soft }]}>
              <Text style={[styles.boardTitle, { color: b.tint }]}>{b.title}</Text>
              <View style={[styles.countBadge, { backgroundColor: b.tint }]}>
                <Text style={styles.countText}>{b.orders.length}</Text>
              </View>
            </View>
            {b.orders.map((o) => (
              <Card key={o.id} style={styles.ticket}>
                <View style={styles.ticketTop}>
                  <Text style={styles.ticketId}>{o.id}</Text>
                  <View style={[styles.timeChip, { backgroundColor: b.soft }]}>
                    <Text style={[styles.timeText, { color: b.tint }]}>{o.time}</Text>
                  </View>
                </View>
                <View style={styles.ticketMeta}>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaPillText}>Table {o.table}</Text>
                  </View>
                  <Text style={styles.itemsText}>{o.items}</Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: b.soft }]}>
                  <View style={[styles.progressFill, { backgroundColor: b.tint }]} />
                </View>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  boards: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: 12 },
  board: { width: 270 },
  boardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  boardTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  countBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  countText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  ticket: { marginBottom: 10, padding: 14 },
  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { fontSize: 15, fontWeight: '800', color: colors.text },
  timeChip: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  timeText: { fontSize: 11, fontWeight: '800' },
  ticketMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  metaPill: {
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaPillText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  itemsText: { fontSize: 12, color: colors.textMuted },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { width: '55%', height: '100%', borderRadius: 3 },
});

export default KitchenScreen;
