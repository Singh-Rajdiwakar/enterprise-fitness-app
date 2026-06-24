import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import WorkoutBuilder from '../components/WorkoutBuilder';
import WorkoutTimer from '../components/WorkoutTimer';
import { colors, radii, spacing, typography } from '../theme/theme';

const PREMADE_PLANS = [
  {
    id: 'push-pull-legs',
    title: 'Push-Pull-Legs',
    level: 'Intermediate',
    duration: '6 days',
    focus: 'Strength and hypertrophy',
  },
  {
    id: 'hiit',
    title: 'HIIT',
    level: 'All levels',
    duration: '25 min',
    focus: 'Conditioning',
  },
  {
    id: 'full-body',
    title: 'Full Body',
    level: 'Beginner',
    duration: '3 days',
    focus: 'Balanced training',
  },
  {
    id: 'mobility-core',
    title: 'Mobility Core',
    level: 'Recovery',
    duration: '20 min',
    focus: 'Mobility and stability',
  },
];

export default function WorkoutScreen({ navigation }) {
  const [selectedPlanId, setSelectedPlanId] = useState(PREMADE_PLANS[0].id);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [customExercises, setCustomExercises] = useState([]);

  const selectedPlan = useMemo(
    () => PREMADE_PLANS.find((plan) => plan.id === selectedPlanId) || PREMADE_PLANS[0],
    [selectedPlanId]
  );

  const timerSeconds = useMemo(() => {
    const firstExerciseRest = Number(customExercises[0]?.restSeconds);
    return Number.isFinite(firstExerciseRest) && firstExerciseRest > 0 ? firstExerciseRest : 60;
  }, [customExercises]);

  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={typography.eyebrow}>Workouts</Text>
            <Text style={styles.title}>Build your next session</Text>
            <Text style={styles.subtitle}>
              Select a proven plan or create a custom workout with sets, reps, and rest timing.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pre-made Plans</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.planScroller}
        >
          {PREMADE_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;

            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                style={({ pressed }) => [
                  styles.planCard,
                  isSelected ? styles.selectedPlanCard : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planMeta}>{plan.level}</Text>
                <Text style={styles.planDuration}>{plan.duration}</Text>
                <Text style={styles.planFocus}>{plan.focus}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <GlassCard style={styles.detailCard}>
          <Text style={styles.detailEyebrow}>Selected Plan</Text>
          <Text style={styles.detailTitle}>{selectedPlan.title}</Text>
          <Text style={styles.detailCopy}>
            {selectedPlan.focus} • {selectedPlan.level} • {selectedPlan.duration}
          </Text>
        </GlassCard>

        <View style={styles.actionBlock}>
          <PrimaryButton title="Start AI Workout" onPress={() => navigation.navigate('AICamera')} />
        </View>

        <View style={styles.actionBlock}>
          <PrimaryButton title="Create Custom Workout" onPress={() => setIsBuilderOpen(true)} />
        </View>

        <GlassCard style={styles.timerCard}>
          <WorkoutTimer initialSeconds={timerSeconds} />
        </GlassCard>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={isBuilderOpen}
        transparent
        onRequestClose={() => setIsBuilderOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <WorkoutBuilder onChange={setCustomExercises} />
              <View style={styles.modalActions}>
                <PrimaryButton title="Save Workout" onPress={() => setIsBuilderOpen(false)} />
                <PrimaryButton title="Close" onPress={() => setIsBuilderOpen(false)} variant="ghost" />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </GlassBackground>
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
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  planScroller: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  planCard: {
    width: 210,
    minHeight: 168,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: spacing.lg,
  },
  selectedPlanCard: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(37, 99, 235, 0.28)',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  planTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  planMeta: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  planDuration: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  planFocus: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  detailCard: {
    marginTop: spacing.lg,
  },
  detailEyebrow: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  detailTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  detailCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  actionBlock: {
    marginTop: spacing.lg,
  },
  timerCard: {
    marginTop: spacing.lg,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  modalCard: {
    maxHeight: '88%',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#020617',
    overflow: 'hidden',
  },
  modalContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalActions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
