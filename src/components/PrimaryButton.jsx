import React from 'react';
import { Text, Pressable, ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, radius, shadow } from '../theme/theme';

const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;
  const palette = {
    primary: { bg: colors.primary, fg: colors.white, shadow: shadow.primary },
    danger: { bg: colors.danger, fg: colors.white, shadow: shadow.card },
    light: { bg: colors.primarySoft, fg: colors.primary, shadow: null },
  }[variant] || { bg: colors.primary, fg: colors.white, shadow: shadow.primary };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg },
        palette.shadow,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={palette.fg} size="small" style={styles.spinner} /> : null}
        <Text style={[styles.text, { color: palette.fg }, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  spinner: { marginRight: 10 },
  text: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.6 },
});

export default PrimaryButton;
