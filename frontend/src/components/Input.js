import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Input({ icon: Icon, style, showPasswordToggle, secureTextEntry, error, touched, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const secure = showPasswordToggle ? passwordHidden : !!secureTextEntry;

  const hasError = touched && error;

  return (
    <View style={style}>
      <View style={[styles.container, isFocused && styles.focused, hasError && styles.errorBorder]}>
        {Icon && <Icon size={18} color={hasError ? '#F87171' : isFocused ? '#E2E8F0' : '#94A3B8'} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholderTextColor="#64748B"
          secureTextEntry={secure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setPasswordHidden((h) => !h)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={passwordHidden ? 'Show password' : 'Hide password'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {passwordHidden ? (
              <EyeOff size={20} color="#94A3B8" />
            ) : (
              <Eye size={20} color="#E2E8F0" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  focused: {
    borderColor: '#93C5FD',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
  },
  errorBorder: {
    borderColor: '#F87171',
    backgroundColor: 'rgba(248, 113, 113, 0.05)',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 15,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
