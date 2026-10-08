import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

const Chip = ({ label, active = false, onPress, style, textStyle }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.chip,
      active ? styles.active : styles.inactive,
      pressed && styles.pressed,
      style,
    ]}
  >
    <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive, textStyle]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    marginRight: 8,
    borderWidth: 1,
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  inactive: { backgroundColor: colors.surface, borderColor: colors.border },
  pressed: { opacity: 0.8 },
  label: { fontSize: 13, fontWeight: '700' },
  labelActive: { color: colors.white },
  labelInactive: { color: colors.textMuted },
});

export default Chip;
