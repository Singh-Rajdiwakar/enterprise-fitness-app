import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors, radii, shadows, spacing } from '../theme/theme';

export function GlassBackground({ children }) {
  return (
    <LinearGradient
      colors={['#1E3A8A', '#020617', '#000000']}
      locations={[0, 0.46, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      {children}
    </LinearGradient>
  );
}

export function GlassCard({ children, style }) {
  return (
    <View style={[styles.cardWrap, style]}>
      <BlurView intensity={32} tint="dark" style={styles.blurCard}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowLarge: {
    position: 'absolute',
    top: 82,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  glowSmall: {
    position: 'absolute',
    right: -60,
    bottom: 120,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(147, 197, 253, 0.08)',
  },
  cardWrap: {
    overflow: 'hidden',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    ...shadows.glass,
  },
  blurCard: {
    padding: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
