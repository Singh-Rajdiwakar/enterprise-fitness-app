import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radii, spacing, typography } from '../theme/theme';

const TRAINERS = [
  {
    id: 'trainer-1',
    name: 'Rhea Malhotra',
    specialty: 'Strength & Hypertrophy',
    rating: 4.9,
    price: '₹1,499/session',
  },
  {
    id: 'trainer-2',
    name: 'Arjun Sethi',
    specialty: 'HIIT & Fat Loss',
    rating: 4.8,
    price: '₹1,199/session',
  },
  {
    id: 'trainer-3',
    name: 'Maya Iyer',
    specialty: 'Mobility & Recovery',
    rating: 4.95,
    price: '₹999/session',
  },
  {
    id: 'trainer-4',
    name: 'Dev Kapoor',
    specialty: 'Sports Conditioning',
    rating: 4.7,
    price: '₹1,299/session',
  },
];

export default function TrainerScreen({ navigation }) {
  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={typography.eyebrow}>Premium</Text>
            <Text style={styles.title}>Trainer Booking</Text>
            <Text style={styles.subtitle}>Choose a specialist and start with a session or quick chat.</Text>
          </View>
        </View>

        <View style={styles.list}>
          {TRAINERS.map((trainer) => (
            <GlassCard key={trainer.id}>
              <View style={styles.trainerHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(trainer.name)}</Text>
                </View>
                <View style={styles.trainerInfo}>
                  <Text style={styles.trainerName}>{trainer.name}</Text>
                  <Text style={styles.specialty}>{trainer.specialty}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <MetaTile label="Rating" value={trainer.rating.toFixed(1)} />
                <MetaTile label="Price" value={trainer.price} />
              </View>

              <View style={styles.actions}>
                <PrimaryButton title="Book Session" onPress={() => {}} />
                <PrimaryButton title="Chat" onPress={() => {}} variant="ghost" />
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </GlassBackground>
  );
}

function MetaTile({ label, value }) {
  return (
    <View style={styles.metaTile}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
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
  list: {
    gap: spacing.lg,
  },
  trainerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(147, 197, 253, 0.18)',
  },
  avatarText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  trainerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  trainerName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  specialty: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  metaTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: spacing.md,
  },
  metaLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
