import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radius, statusTheme } from '../theme/theme';

const StatusPill = ({ status, style }) => {
  const theme = statusTheme[status] || { bg: colors.border, fg: colors.textMuted };
  return (
    <View style={[styles.pill, { backgroundColor: theme.bg }, style]}>
      <Text style={[styles.text, { color: theme.fg }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
});

export default StatusPill;
