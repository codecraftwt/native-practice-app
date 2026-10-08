import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

const SearchBar = ({ value, onChangeText, placeholder = 'Search...', style }) => (
  <View style={[styles.wrap, style]}>
    <Text style={styles.glyph}>&#9906;</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      autoCapitalize="none"
      autoCorrect={false}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 46,
  },
  glyph: {
    fontSize: 16,
    color: colors.textLight,
    marginRight: 8,
    transform: [{ rotate: '-20deg' }],
  },
  input: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
});

export default SearchBar;
