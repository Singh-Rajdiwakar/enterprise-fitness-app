import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme/theme';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.28)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.76)',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.18)',
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
});
