import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, radii, spacing, typography } from '../theme/theme';

const PHOTO_PROGRESS = [
  { id: 'photo-1', label: 'Week 1', tone: 'rgba(37, 99, 235, 0.42)' },
  { id: 'photo-2', label: 'Week 4', tone: 'rgba(14, 165, 233, 0.34)' },
  { id: 'photo-3', label: 'Week 8', tone: 'rgba(16, 185, 129, 0.32)' },
  { id: 'photo-4', label: 'Today', tone: 'rgba(147, 197, 253, 0.28)' },
];

const SETTINGS = ['Account', 'Notifications', 'Privacy'];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const email = user?.email || 'user@example.com';
  const name = email.split('@')[0].replace(/[._-]/g, ' ') || 'Fitness User';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.eyebrow}>Profile</Text>
          <Text style={styles.title}>Settings & Services</Text>
        </View>

        <GlassCard>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || 'U'}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.name}>{toTitleCase(name)}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>

          <View style={styles.detailGrid}>
            <DetailTile label="Current Goal" value="Lean Muscle" />
            <DetailTile label="Weight" value="72.5 kg" />
          </View>
        </GlassCard>

        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Photo Progress Journal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroller}>
            {PHOTO_PROGRESS.map((photo) => (
              <View key={photo.id} style={[styles.photoCard, { backgroundColor: photo.tone }]}>
                <Text style={styles.photoLabel}>{photo.label}</Text>
              </View>
            ))}
          </ScrollView>
        </GlassCard>

        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Premium Services</Text>
          <Text style={styles.sectionCopy}>Book trainers, start consultations, and manage paid services.</Text>
          <View style={styles.serviceAction}>
            <PrimaryButton title="Find a Trainer" onPress={() => navigation.navigate('Trainer')} />
          </View>
        </GlassCard>

        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsList}>
            {SETTINGS.map((setting) => (
              <Pressable key={setting} style={({ pressed }) => [styles.settingRow, pressed ? styles.pressed : null]}>
                <Text style={styles.settingText}>{setting}</Text>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.logoutAction}>
            <PrimaryButton title="Logout" onPress={logout} variant="ghost" />
          </View>
        </GlassCard>
      </ScrollView>
    </GlassBackground>
  );
}

function DetailTile({ label, value }) {
  return (
    <View style={styles.detailTile}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function toTitleCase(value) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 64,
    paddingBottom: spacing.xxl + 72,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(147, 197, 253, 0.18)',
  },
  avatarText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  userDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  email: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  detailTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: spacing.md,
  },
  detailLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  sectionCard: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  sectionCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  photoScroller: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  photoCard: {
    width: 132,
    height: 172,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  photoLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  serviceAction: {
    marginTop: spacing.lg,
  },
  settingsList: {
    gap: spacing.sm,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  settingText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  settingChevron: {
    color: colors.textDim,
    fontSize: 24,
    fontWeight: '700',
  },
  logoutAction: {
    marginTop: spacing.lg,
  },
});
