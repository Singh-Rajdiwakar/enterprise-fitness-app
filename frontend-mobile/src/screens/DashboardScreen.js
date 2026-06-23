import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { colors, spacing, typography } from '../theme/theme';

const METRIC_FALLBACK = {
  caloriesConsumed: 0,
  waterConsumedMl: 0,
  currentWeight: 0,
  achievementsCount: 0,
};

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(METRIC_FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await api.get('/dashboard/daily');
        setSummary({ ...METRIC_FALLBACK, ...response.data });
      } catch (error) {
        setErrorMessage('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={typography.eyebrow}>Dashboard</Text>
            <Text style={styles.title}>Welcome, {user?.email || 'User'}</Text>
          </View>
          <PrimaryButton title="Logout" onPress={logout} variant="ghost" />
        </View>

        {isLoading ? (
          <GlassCard style={styles.loadingCard}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Loading your daily summary...</Text>
          </GlassCard>
        ) : (
          <View style={styles.grid}>
            <MetricCard label="Calories" value={summary.caloriesConsumed} unit="kcal" />
            <MetricCard label="Water" value={summary.waterConsumedMl} unit="ml" />
            <MetricCard label="Weight" value={summary.currentWeight} unit="kg" />
            <MetricCard label="Achievements" value={summary.achievementsCount} unit="earned" />
          </View>
        )}

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </ScrollView>
    </GlassBackground>
  );
}

function MetricCard({ label, value, unit }) {
  return (
    <GlassCard style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerText: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  loadingCard: {
    marginTop: spacing.lg,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  grid: {
    gap: spacing.md,
  },
  metricCard: {
    minHeight: 132,
  },
  metricLabel: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  metricUnit: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.lg,
  },
});
