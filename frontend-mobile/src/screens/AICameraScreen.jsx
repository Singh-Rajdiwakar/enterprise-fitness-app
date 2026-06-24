import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import { colors, radii, spacing, typography } from '../theme/theme';

const FEEDBACK = [
  'Keep your back straight',
  'Squat deeper',
  'Drive through your heels',
  'Brace your core',
  'Control the descent',
];

const TRACKING_POINTS = [
  { id: 'head', top: '16%', left: '48%' },
  { id: 'shoulder-left', top: '31%', left: '35%' },
  { id: 'shoulder-right', top: '31%', left: '61%' },
  { id: 'hip-left', top: '52%', left: '39%' },
  { id: 'hip-right', top: '52%', left: '57%' },
  { id: 'knee-left', top: '70%', left: '35%' },
  { id: 'knee-right', top: '70%', left: '62%' },
];

export default function AICameraScreen({ navigation }) {
  const [feedbackIndex, setFeedbackIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFeedbackIndex((currentIndex) => (currentIndex + 1) % FEEDBACK.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={typography.eyebrow}>AI Coach</Text>
            <Text style={styles.title}>Form Correction</Text>
            <Text style={styles.subtitle}>
              Camera integration placeholder with mock computer vision tracking and live coaching feedback.
            </Text>
          </View>
        </View>

        <View style={styles.cameraFrame}>
          <View style={styles.cameraGradientTop} />
          <View style={styles.bodyGuide} />
          <View style={styles.lineShoulders} />
          <View style={styles.lineTorsoLeft} />
          <View style={styles.lineTorsoRight} />
          <View style={styles.lineLegLeft} />
          <View style={styles.lineLegRight} />

          {TRACKING_POINTS.map((point) => (
            <View key={point.id} style={[styles.trackingPoint, { top: point.top, left: point.left }]} />
          ))}

          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeText}>LIVE FORM ANALYSIS</Text>
          </View>
        </View>

        <GlassCard style={styles.feedbackCard}>
          <Text style={styles.feedbackLabel}>Real-time Feedback</Text>
          <Text style={styles.feedbackText}>{FEEDBACK[feedbackIndex]}</Text>
          <Text style={styles.feedbackMeta}>Audio cue ready • Rep quality tracking active</Text>
        </GlassCard>

        <View style={styles.metricsGrid}>
          <AIMetric label="Knee Tracking" value="92%" />
          <AIMetric label="Back Angle" value="Good" />
          <AIMetric label="Rep Tempo" value="3.1s" />
        </View>
      </ScrollView>
    </GlassBackground>
  );
}

function AIMetric({ label, value }) {
  return (
    <GlassCard style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 64,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  headerText: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  cameraFrame: {
    height: 430,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    overflow: 'hidden',
  },
  cameraGradientTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 140,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },
  bodyGuide: {
    position: 'absolute',
    top: '19%',
    left: '41%',
    width: 72,
    height: 220,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.32)',
    borderRadius: 36,
  },
  trackingPoint: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: colors.accent,
  },
  lineShoulders: {
    position: 'absolute',
    top: '33%',
    left: '38%',
    width: 86,
    height: 2,
    backgroundColor: colors.accent,
    transform: [{ rotate: '2deg' }],
  },
  lineTorsoLeft: {
    position: 'absolute',
    top: '39%',
    left: '40%',
    width: 76,
    height: 2,
    backgroundColor: colors.accent,
    transform: [{ rotate: '64deg' }],
  },
  lineTorsoRight: {
    position: 'absolute',
    top: '39%',
    left: '49%',
    width: 76,
    height: 2,
    backgroundColor: colors.accent,
    transform: [{ rotate: '116deg' }],
  },
  lineLegLeft: {
    position: 'absolute',
    top: '62%',
    left: '37%',
    width: 84,
    height: 2,
    backgroundColor: colors.accent,
    transform: [{ rotate: '112deg' }],
  },
  lineLegRight: {
    position: 'absolute',
    top: '62%',
    left: '51%',
    width: 84,
    height: 2,
    backgroundColor: colors.accent,
    transform: [{ rotate: '68deg' }],
  },
  cameraBadge: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: 'rgba(2, 6, 23, 0.72)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cameraBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  feedbackCard: {
    marginTop: spacing.lg,
  },
  feedbackLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  feedbackText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  feedbackMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  metricCard: {
    flex: 1,
  },
  metricLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
});
