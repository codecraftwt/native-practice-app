import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

const Avatar = ({ name = '', size = 44, bg = colors.primary, fg = colors.white, style }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: radius.pill, backgroundColor: bg },
        style,
      ]}
    >
      <Text style={[styles.initials, { color: fg, fontSize: size * 0.38 }]}>{initials || '?'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: { justifyContent: 'center', alignItems: 'center' },
  initials: { fontWeight: '800', letterSpacing: 0.5 },
});

export default Avatar;
