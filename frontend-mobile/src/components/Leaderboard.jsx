import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';

const LEADERBOARD_DATA = [
  { id: '1', name: 'Aarav Mehta', metric: 'Weekly Steps', value: 84210, isCurrentUser: false },
  { id: '2', name: 'Nisha Rao', metric: 'Weekly Steps', value: 76880, isCurrentUser: false },
  { id: '3', name: 'You', metric: 'Weekly Steps', value: 69240, isCurrentUser: true },
  { id: '4', name: 'Kabir Shah', metric: 'Weekly Steps', value: 64120, isCurrentUser: false },
  { id: '5', name: 'Ira Kapoor', metric: 'Weekly Steps', value: 59400, isCurrentUser: false },
];

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Leaderboard</Text>
        <Text style={styles.subtitle}>Ranked by steps</Text>
      </View>

      <View style={styles.list}>
        {LEADERBOARD_DATA.map((entry, index) => (
          <View
            key={entry.id}
            style={[styles.row, entry.isCurrentUser ? styles.currentUserRow : null]}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.name}>{entry.name}</Text>
              <Text style={styles.metric}>{entry.metric}</Text>
            </View>

            <Text style={styles.value}>{entry.value.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    gap: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: spacing.md,
  },
  currentUserRow: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },
  rankBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  rankText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  userInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  metric: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  value: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '900',
  },
});
