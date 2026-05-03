import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientButton({ title, onPress, style, disabled }) {
  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.touchable, disabled && styles.disabled]}
        disabled={disabled}
      >
        <LinearGradient
          colors={['#1D4ED8', '#0F172A']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  touchable: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
