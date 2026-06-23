import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii } from '../theme/theme';

export default function PrimaryButton({ title, onPress, disabled = false, variant = 'solid' }) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isGhost ? styles.ghostButton : styles.solidButton,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[styles.text, isGhost ? styles.ghostText : null]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  solidButton: {
    backgroundColor: colors.primary,
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.62,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  ghostText: {
    color: 'rgba(255, 255, 255, 0.84)',
  },
});
