import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Chip from '../../components/Chip';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, readBody } from '../../services/api';
import { colors, radius, spacing, shadow, statusTheme } from '../../theme/theme';

const TRANSITIONS = {
  AVAILABLE: {
    OCCUPIED: ['WAITER', 'MANAGER', 'OWNER'],
    RESERVED: ['MANAGER', 'OWNER'],
    OUT_OF_SERVICE: ['MANAGER', 'OWNER'],
  },
  RESERVED: {
    OCCUPIED: ['WAITER', 'MANAGER', 'OWNER'],
    AVAILABLE: ['MANAGER', 'OWNER'],
    OUT_OF_SERVICE: ['MANAGER', 'OWNER'],
  },
  OCCUPIED: {
    BILLING: ['WAITER', 'CASHIER', 'MANAGER', 'OWNER'],
    OUT_OF_SERVICE: ['MANAGER', 'OWNER'],
  },
  BILLING: {
    AVAILABLE: ['CASHIER', 'MANAGER', 'OWNER'],
    OCCUPIED: ['CASHIER', 'MANAGER', 'OWNER'],
  },
  OUT_OF_SERVICE: {
    AVAILABLE: ['MANAGER', 'OWNER'],
  },
};

const STATUS_ORDER = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'BILLING', 'OUT_OF_SERVICE'];
const STATUS_UPDATERS = ['OWNER', 'MANAGER', 'WAITER', 'CASHIER'];

const TablesScreen = () => {
  const { user } = useAuth();
  const role = user?.role || '';
  const canUpdateStatus = STATUS_UPDATERS.includes(role);

  const [floors, setFloors] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async (mode = 'initial') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    try {
      const [fr, tr] = await Promise.all([apiFetch('/floors'), apiFetch('/tables')]);
      const fj = await readBody(fr);
      const tj = await readBody(tr);
      if (!fr.ok || !tr.ok) {
        setError(fj?.error?.message || tj?.error?.message || 'Failed to load tables');
        return;
      }
      setFloors(fj.data.floors || []);
      setTables(tj.data.tables || []);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load tables');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  const visibleTables = useMemo(
    () => (floorFilter === 'all' ? tables : tables.filter((t) => t.floorId === floorFilter)),
    [tables, floorFilter]
  );

  const counts = useMemo(() => {
    const c = {};
    visibleTables.forEach((t) => {
      c[t.status] = (c[t.status] || 0) + 1;
    });
    return c;
  }, [visibleTables]);

  const transitionsFor = useCallback(
    (table) => {
      const targets = TRANSITIONS[table.status] || {};
      return Object.keys(targets).filter((to) => targets[to].includes(role));
    },
    [role]
  );

  const onSelectTable = (table) => {
    if (!canUpdateStatus) return;
    setActionError('');
    setSelected(table);
  };

  const onSetStatus = async (target) => {
    if (!selected || updating) return;
    setUpdating(true);
    setActionError('');
    try {
      const res = await apiFetch(`/tables/${selected.id}/status`, {
        method: 'PATCH',
        body: { status: target },
      });
      const json = await readBody(res);
      if (!res.ok) {
        setActionError(json?.error?.message || 'Could not update table status');
        return;
      }
      const updated = json.data.table;
      setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelected(null);
    } catch (e) {
      setActionError(e.message || 'Could not update table status');
    } finally {
      setUpdating(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => load('initial')}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      );
    }
    if (visibleTables.length === 0) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.emptyText}>No tables here yet</Text>
        </View>
      );
    }
    return (
      <View style={styles.grid}>
        {visibleTables.map((t) => {
          const theme = statusTheme[t.status] || statusTheme.AVAILABLE;
          return (
            <Pressable
              key={t.id}
              style={({ pressed }) => [
                styles.table,
                { backgroundColor: theme.bg, borderColor: theme.fg + '33' },
                pressed && styles.pressed,
              ]}
              onPress={() => onSelectTable(t)}
            >
              <Text style={styles.tableNum}>{t.tableNumber}</Text>
              <Text style={[styles.tableStatus, { color: theme.fg }]}>{t.status}</Text>
              <Text style={styles.seats}>{t.capacity} seats</Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const selectedTheme = selected ? statusTheme[selected.status] || statusTheme.AVAILABLE : null;
  const selectedTargets = selected ? transitionsFor(selected) : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Tables" subtitle="Live floor status" />

      <View style={styles.legend}>
        {STATUS_ORDER.filter((s) => counts[s] > 0).map((s) => {
          const theme = statusTheme[s];
          return (
            <View key={s} style={[styles.legendPill, { backgroundColor: theme.bg }]}>
              <View style={[styles.dot, { backgroundColor: theme.fg }]} />
              <Text style={styles.legendText}>
                {counts[s]} {s === 'OUT_OF_SERVICE' ? 'OOS' : s}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        <Chip label="All floors" active={floorFilter === 'all'} onPress={() => setFloorFilter('all')} />
        {floors.map((f) => (
          <Chip
            key={f.id}
            label={f.name}
            active={floorFilter === f.id}
            onPress={() => setFloorFilter(f.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load('refresh')}
            tintColor={colors.primary}
          />
        }
      >
        {renderBody()}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropClose} onPress={() => setSelected(null)} />
          <View style={styles.sheet}>
            {selected ? (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>{selected.tableNumber}</Text>
                  <View style={[styles.sheetBadge, { backgroundColor: selectedTheme.bg }]}>
                    <Text style={[styles.sheetBadgeText, { color: selectedTheme.fg }]}>
                      {selected.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sheetMeta}>{selected.capacity} seats</Text>

                {selectedTargets.length > 0 ? (
                  selectedTargets.map((to) => {
                    const theme = statusTheme[to];
                    return (
                      <Pressable
                        key={to}
                        disabled={updating}
                        style={({ pressed }) => [styles.actionRow, pressed && styles.actionPressed]}
                        onPress={() => onSetStatus(to)}
                      >
                        <View style={[styles.actionDot, { backgroundColor: theme.fg }]} />
                        <Text style={styles.actionText}>Change to {to}</Text>
                        {updating ? <ActivityIndicator size="small" color={colors.primary} /> : null}
                      </Pressable>
                    );
                  })
                ) : (
                  <Text style={styles.noActions}>No status actions available for your role</Text>
                )}

                {actionError ? <Text style={styles.actionError}>{actionError}</Text> : null}

                <Pressable style={styles.cancelBtn} onPress={() => setSelected(null)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: 8,
    marginBottom: spacing.md,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 11, fontWeight: '800', color: colors.text },
  chipRow: {
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    maxHeight: 46,
  },
  body: { flexGrow: 1, paddingBottom: spacing.xl },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  errorText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl },
  emptyText: { fontSize: 14, color: colors.textMuted },
  retryBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  retryText: { color: colors.white, fontSize: 13, fontWeight: '800' },
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
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'center', padding: spacing.xl },
  backdropClose: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.primary,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  sheetBadge: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  sheetBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  sheetMeta: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: spacing.md },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    marginTop: 10,
    gap: 10,
  },
  actionPressed: { opacity: 0.7 },
  actionDot: { width: 10, height: 10, borderRadius: 5 },
  actionText: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.text },
  noActions: { fontSize: 13, color: colors.textMuted, marginTop: 8 },
  actionError: { fontSize: 13, color: colors.danger, marginTop: 12, fontWeight: '600' },
  cancelBtn: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '800', color: colors.textMuted },
});

export default TablesScreen;
