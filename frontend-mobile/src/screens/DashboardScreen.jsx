import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket } from '../services/socketService';
import { colors, spacing, typography } from '../theme/theme';

const SUMMARY_FALLBACK = {
  caloriesConsumed: 0,
  waterConsumedMl: 0,
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(SUMMARY_FALLBACK);
  const [apiSteps, setApiSteps] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [liveMessages, setLiveMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setErrorMessage('');

    const [summaryResult, achievementsResult, stepsResult] = await Promise.allSettled([
      api.get('/dashboard/daily'),
      api.get('/achievements'),
      api.get('/steps'),
    ]);

    if (summaryResult.status === 'fulfilled') {
      setSummary({ ...SUMMARY_FALLBACK, ...summaryResult.value.data });
    }

    if (achievementsResult.status === 'fulfilled') {
      const achievementData = achievementsResult.value.data;
      setAchievements(Array.isArray(achievementData) ? achievementData : []);
    }

    if (stepsResult.status === 'fulfilled') {
      const today = getTodayDate();
      const stepLogs = Array.isArray(stepsResult.value.data) ? stepsResult.value.data : [];
      const todayLog = stepLogs.find((stepLog) => stepLog.date === today);
      setApiSteps(todayLog?.stepCount ?? 0);
    }

    if (
      summaryResult.status === 'rejected' ||
      achievementsResult.status === 'rejected' ||
      stepsResult.status === 'rejected'
    ) {
      setErrorMessage('Failed to load some dashboard data.');
    }
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      await fetchDashboardData();
      setIsLoading(false);
    }

    loadInitialData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const socket = connectSocket();

    const handleLiveUpdate = (payload) => {
      setLiveMessages((currentMessages) => [
        {
          id: `${Date.now()}-${currentMessages.length}`,
          type: 'live-updates',
          text: payload?.message || 'New live update received',
        },
        ...currentMessages,
      ].slice(0, 5));

      fetchDashboardData();
    };

    const handleChatMessage = (payload) => {
      setLiveMessages((currentMessages) => [
        {
          id: `${Date.now()}-${currentMessages.length}`,
          type: 'chat-messages',
          text: payload?.message || 'New chat message received',
        },
        ...currentMessages,
      ].slice(0, 5));
    };

    socket.on('live-updates', handleLiveUpdate);
    socket.on('chat-messages', handleChatMessage);

    return () => {
      socket.off('live-updates', handleLiveUpdate);
      socket.off('chat-messages', handleChatMessage);
    };
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  return (
    <GlassBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
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
            <Text style={styles.loadingText}>Loading dashboard data...</Text>
          </GlassCard>
        ) : (
          <>
            <View style={styles.grid}>
              <MetricCard label="Calories" value={summary.caloriesConsumed} unit="kcal" />
              <MetricCard label="Water" value={summary.waterConsumedMl} unit="ml" />
              <MetricCard label="Steps" value={apiSteps} unit="from API" />
            </View>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <GlassCard style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Quick Actions</Text>
              <Text style={styles.emptyText}>
                Open workouts or manage nutrition without leaving the mobile flow.
              </Text>
              <View style={styles.quickActions}>
                <PrimaryButton title="Open Workouts" onPress={() => navigation.navigate('Workout')} />
                <PrimaryButton title="Open Diet" onPress={() => navigation.navigate('Diet')} variant="ghost" />
                <PrimaryButton title="Open Community" onPress={() => navigation.navigate('Community')} variant="ghost" />
              </View>
            </GlassCard>

            <GlassCard style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Recent Achievements</Text>
              <FlatList
                data={achievements.slice(0, 6)}
                keyExtractor={(item, index) => item.id || `${item.title}-${index}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No achievements earned yet.</Text>}
                renderItem={({ item }) => (
                  <View style={styles.achievementRow}>
                    <Text style={styles.achievementTitle}>{item.title}</Text>
                    <Text style={styles.achievementDescription}>{item.description}</Text>
                  </View>
                )}
              />
            </GlassCard>

            <GlassCard style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Live Updates</Text>
              {liveMessages.length === 0 ? (
                <Text style={styles.emptyText}>Listening for live updates and chat messages.</Text>
              ) : (
                liveMessages.map((message) => (
                  <View key={message.id} style={styles.liveRow}>
                    <Text style={styles.liveType}>{message.type}</Text>
                    <Text style={styles.liveText}>{message.text}</Text>
                  </View>
                ))
              )}
            </GlassCard>
          </>
        )}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    width: '47%',
    minHeight: 136,
  },
  metricLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  metricUnit: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  sectionCard: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: spacing.md,
  },
  achievementRow: {
    gap: spacing.xs,
  },
  achievementTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  achievementDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  liveRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  liveType: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  liveText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.lg,
  },
  quickActions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
