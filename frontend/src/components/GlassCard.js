import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function GlassCard({ children, style, intensity = 40, contentStyle }) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint="dark" />
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  content: {
    padding: 20,
  },
});
