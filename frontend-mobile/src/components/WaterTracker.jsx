import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { colors, radii, spacing } from '../theme/theme';

const DEFAULT_TARGET_ML = 3000;
const STEP_ML = 250;

export default function WaterTracker({ initialAmountMl = 0, targetMl = DEFAULT_TARGET_ML, onChange }) {
  const [amountMl, setAmountMl] = useState(initialAmountMl);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setAmountMl(initialAmountMl);
  }, [initialAmountMl]);

  const progress = useMemo(() => {
    return Math.min(amountMl / targetMl, 1);
  }, [amountMl, targetMl]);

  const updateAmount = async (nextAmount) => {
    const safeAmount = Math.max(nextAmount, 0);
    const delta = safeAmount - amountMl;

    setAmountMl(safeAmount);
    onChange?.(safeAmount);
    setMessage('');

    if (delta <= 0) {
      return;
    }

    setIsSaving(true);

    try {
      await api.post('/water', { amountMl: delta });
      setMessage(`Logged ${delta} ml`);
    } catch (error) {
      setMessage('Water updated locally. Sync failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Water Intake</Text>
          <Text style={styles.value}>{amountMl} ml</Text>
        </View>
        <View style={styles.ring}>
          <View style={[styles.ringFill, { opacity: Math.max(progress, 0.16), transform: [{ scale: 0.68 + progress * 0.32 }] }]} />
          <Text style={styles.ringText}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.controls}>
        <WaterButton title="-250 ml" onPress={() => updateAmount(amountMl - STEP_ML)} />
        <WaterButton title="+250 ml" onPress={() => updateAmount(amountMl + STEP_ML)} primary disabled={isSaving} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

function WaterButton({ title, onPress, primary = false, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  ring: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 43,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  ringFill: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 8,
    borderColor: colors.accent,
  },
  ringText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.62,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  message: {
    color: colors.textDim,
    fontSize: 13,
  },
});
