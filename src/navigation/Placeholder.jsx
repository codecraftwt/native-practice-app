import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';

const Placeholder = ({ name }) => (
  <SafeAreaView style={styles.wrap}>
    <Text style={styles.text}>{name}</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  text: { fontSize: 16, fontWeight: '700', color: colors.textMuted },
});

export default Placeholder;
