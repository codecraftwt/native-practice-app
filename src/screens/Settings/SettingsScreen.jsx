import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, readBody } from '../../services/api';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius, spacing } from '../../theme/theme';

const FIELDS = [
  { key: 'name', label: 'RESTAURANT NAME' },
  { key: 'email', label: 'EMAIL', keyboardType: 'email-address' },
  { key: 'phone', label: 'PHONE' },
  { key: 'address', label: 'ADDRESS', multiline: true },
  { key: 'gstNumber', label: 'GST NUMBER' },
  { key: 'timezone', label: 'TIMEZONE' },
];
const HOURS = [
  { key: 'open', label: 'OPENS (HH:MM)' },
  { key: 'close', label: 'CLOSES (HH:MM)' },
];
const NUMBERS = [
  { key: 'currency', label: 'CURRENCY' },
  { key: 'taxRate', label: 'TAX RATE (%)' },
  { key: 'serviceChargeRate', label: 'SERVICE CHARGE (%)' },
];

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const canEdit = user?.role === 'OWNER';

  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiFetch('/tenants/me');
        const json = await readBody(res);
        if (!mounted) return;
        if (!res.ok) {
          setError(json?.error?.message || 'Failed to load restaurant');
          return;
        }
        const t = json.data.tenant;
        setForm({
          name: t.name || '',
          email: t.email || '',
          phone: t.phone || '',
          address: t.address || '',
          gstNumber: t.gstNumber || '',
          timezone: t.timezone || '',
          open: t.hours?.open || '09:00',
          close: t.hours?.close || '23:00',
          currency: t.settings?.currency || 'INR',
          taxRate: String(t.settings?.taxRate ?? 0),
          serviceChargeRate: String(t.settings?.serviceChargeRate ?? 0),
        });
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load restaurant');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setError('');
  };

  const onSave = async () => {
    if (saving || !form) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await apiFetch('/tenants/me', {
        method: 'PATCH',
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          gstNumber: form.gstNumber,
          timezone: form.timezone,
          hours: { open: form.open, close: form.close },
          settings: {
            currency: form.currency,
            taxRate: Number(form.taxRate) || 0,
            serviceChargeRate: Number(form.serviceChargeRate) || 0,
          },
        },
      });
      const json = await readBody(res);
      if (!res.ok) {
        setError(json?.error?.message || 'Save failed');
        return;
      }
      setSaved(true);
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={styles.back}>&#8249; Back</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Restaurant Settings</Text>
        <Text style={styles.subtitle}>
          {canEdit ? 'Edit your restaurant profile and billing settings' : 'View only — owner can edit'}
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <Card style={styles.card}>
            {FIELDS.map((f) => (
              <View key={f.key} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={[styles.input, f.multiline && styles.multiline, !canEdit && styles.disabled]}
                  value={form[f.key]}
                  onChangeText={setField(f.key)}
                  editable={canEdit}
                  autoCapitalize="none"
                  keyboardType={f.keyboardType || 'default'}
                  placeholderTextColor={colors.textLight}
                />
              </View>
            ))}

            <View style={styles.row}>
              {HOURS.map((f) => (
                <View key={f.key} style={[styles.field, styles.half]}>
                  <Text style={styles.label}>{f.label}</Text>
                  <TextInput
                    style={[styles.input, !canEdit && styles.disabled]}
                    value={form[f.key]}
                    onChangeText={setField(f.key)}
                    editable={canEdit}
                    placeholder="09:00"
                    placeholderTextColor={colors.textLight}
                  />
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {NUMBERS.map((f) => (
              <View key={f.key} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={[styles.input, !canEdit && styles.disabled]}
                  value={form[f.key]}
                  onChangeText={setField(f.key)}
                  editable={canEdit}
                  keyboardType={f.key === 'currency' ? 'default' : 'decimal-pad'}
                  autoCapitalize="characters"
                  placeholderTextColor={colors.textLight}
                />
              </View>
            ))}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            {saved ? (
              <View style={styles.savedBox}>
                <Text style={styles.savedText}>Saved</Text>
              </View>
            ) : null}

            {canEdit ? (
              <PrimaryButton
                title={saving ? 'Saving...' : 'Save Changes'}
                onPress={onSave}
                loading={saving}
                style={styles.saveBtn}
              />
            ) : null}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  back: { fontSize: 15, fontWeight: '700', color: colors.primary, paddingVertical: 6 },
  pressed: { opacity: 0.6 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  loader: { marginTop: 40 },
  card: { padding: spacing.lg },
  field: { marginBottom: spacing.md },
  half: { flex: 1 },
  row: { flexDirection: 'row', gap: 12 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  multiline: { height: 88, textAlignVertical: 'top' },
  disabled: { opacity: 0.6 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm, padding: 12, marginTop: 4 },
  errorText: { color: '#B91C1C', fontSize: 13, fontWeight: '600' },
  savedBox: { backgroundColor: colors.successSoft, borderRadius: radius.sm, padding: 12, marginTop: 4 },
  savedText: { color: '#047857', fontSize: 13, fontWeight: '700' },
  saveBtn: { marginTop: spacing.lg },
});

export default SettingsScreen;
