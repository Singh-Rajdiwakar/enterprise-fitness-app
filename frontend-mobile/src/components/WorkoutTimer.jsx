import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';

export default function WorkoutTimer({ initialSeconds = 60 }) {
  const normalizedInitialSeconds = Math.max(Number(initialSeconds) || 60, 1);
  const [remainingSeconds, setRemainingSeconds] = useState(normalizedInitialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setRemainingSeconds(normalizedInitialSeconds);
    setIsRunning(false);
  }, [normalizedInitialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const progress = remainingSeconds / normalizedInitialSeconds;

  const handleReset = () => {
    setRemainingSeconds(normalizedInitialSeconds);
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerRing}>
        <View
          style={[
            styles.progressRing,
            {
              opacity: Math.max(progress, 0.18),
              transform: [{ scale: 0.76 + progress * 0.24 }],
            },
          ]}
        />
        <Text style={styles.timeText}>{formattedTime}</Text>
        <Text style={styles.timerLabel}>Rest Timer</Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => setIsRunning((currentValue) => !currentValue)}
          style={({ pressed }) => [styles.controlButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.controlText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </Pressable>

        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [styles.controlButton, styles.secondaryButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.controlText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  timerRing: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 95,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  progressRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 10,
    borderColor: colors.accent,
  },
  timeText: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  timerLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  controlButton: {
    minWidth: 92,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
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
  controlText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
});
