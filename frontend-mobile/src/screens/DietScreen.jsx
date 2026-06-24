import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import WaterTracker from '../components/WaterTracker';
import api from '../services/api';
import { colors, radii, spacing, typography } from '../theme/theme';

const MACRO_TARGETS = {
  calories: 2200,
  protein: 160,
  carbs: 260,
  fats: 70,
};

export default function DietScreen({ navigation }) {
  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    waterConsumedMl: 0,
  });
  const [meals, setMeals] = useState([]);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDietData = useCallback(async () => {
    setErrorMessage('');

    const [dashboardResult, dietResult] = await Promise.allSettled([
      api.get('/dashboard/daily'),
      api.get('/diet'),
    ]);

    if (dashboardResult.status === 'fulfilled') {
      setSummary((currentSummary) => ({
        ...currentSummary,
        calories: dashboardResult.value.data?.caloriesConsumed ?? 0,
        waterConsumedMl: dashboardResult.value.data?.waterConsumedMl ?? 0,
      }));
    }

    if (dietResult.status === 'fulfilled') {
      const logs = Array.isArray(dietResult.value.data) ? dietResult.value.data : [];
      const today = new Date().toISOString().slice(0, 10);
      const todayLog = logs.find((log) => log.date === today) || null;

      if (todayLog) {
        setSummary((currentSummary) => ({
          ...currentSummary,
          calories: todayLog.totalCalories ?? currentSummary.calories,
          protein: todayLog.protein ?? 0,
          carbs: todayLog.carbs ?? 0,
          fats: todayLog.fats ?? 0,
        }));

        setMeals([
          {
            id: todayLog.logId || todayLog.id || 'today-diet-log',
            name: 'Daily logged nutrition',
            calories: todayLog.totalCalories ?? 0,
            protein: todayLog.protein ?? 0,
            carbs: todayLog.carbs ?? 0,
            fats: todayLog.fats ?? 0,
          },
        ]);
      } else {
        setMeals([]);
      }
    }

    if (dashboardResult.status === 'rejected' || dietResult.status === 'rejected') {
      setErrorMessage('Failed to load some nutrition data.');
    }
  }, []);

  useEffect(() => {
    async function loadDietData() {
      setIsLoading(true);
      await fetchDietData();
      setIsLoading(false);
    }

    loadDietData();
  }, [fetchDietData]);

  const macroRows = useMemo(
    () => [
      { key: 'calories', label: 'Calories', value: summary.calories, target: MACRO_TARGETS.calories, unit: 'kcal' },
      { key: 'protein', label: 'Protein', value: summary.protein, target: MACRO_TARGETS.protein, unit: 'g' },
      { key: 'carbs', label: 'Carbs', value: summary.carbs, target: MACRO_TARGETS.carbs, unit: 'g' },
      { key: 'fats', label: 'Fats', value: summary.fats, target: MACRO_TARGETS.fats, unit: 'g' },
    ],
    [summary]
  );

  const handleAddMeal = async () => {
    const calories = Number(mealCalories) || 0;

    if (!mealName.trim()) {
      return;
    }

    const nextMeal = {
      id: `${Date.now()}`,
      name: mealName.trim(),
      calories,
      protein: 0,
      carbs: 0,
      fats: 0,
    };

    setMeals((currentMeals) => [nextMeal, ...currentMeals]);
    setSummary((currentSummary) => ({
      ...currentSummary,
      calories: currentSummary.calories + calories,
    }));
    setMealName('');
    setMealCalories('');
    setIsMealModalOpen(false);

    try {
      await api.post('/diet', {
        date: new Date().toISOString().slice(0, 10),
        totalCalories: calories,
        protein: 0,
        carbs: 0,
        fats: 0,
      });
    } catch (error) {
      setErrorMessage('Meal saved locally. Sync failed.');
    }
  };

  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={typography.eyebrow}>Nutrition</Text>
            <Text style={styles.title}>Diet Management</Text>
            <Text style={styles.subtitle}>Track macros, meals, and hydration from one focused view.</Text>
          </View>
        </View>

        {isLoading ? (
          <GlassCard>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Loading nutrition data...</Text>
          </GlassCard>
        ) : (
          <GlassCard>
            <Text style={styles.sectionTitle}>Macro Summary</Text>
            <View style={styles.macroList}>
              {macroRows.map((macro) => (
                <MacroProgress key={macro.key} {...macro} />
              ))}
            </View>
          </GlassCard>
        )}

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <View style={styles.actionBlock}>
          <PrimaryButton title="Log Meal" onPress={() => setIsMealModalOpen(true)} />
        </View>

        <GlassCard style={styles.sectionCard}>
          <WaterTracker initialAmountMl={summary.waterConsumedMl} />
        </GlassCard>

        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <View style={styles.mealList}>
            {meals.length === 0 ? (
              <Text style={styles.emptyText}>No meals logged yet.</Text>
            ) : (
              meals.map((meal) => (
                <View key={meal.id} style={styles.mealRow}>
                  <View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealMeta}>
                      P {meal.protein}g • C {meal.carbs}g • F {meal.fats}g
                    </Text>
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
              ))
            )}
          </View>
        </GlassCard>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={isMealModalOpen}
        transparent
        onRequestClose={() => setIsMealModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Meal</Text>
            <TextInput
              value={mealName}
              onChangeText={setMealName}
              placeholder="Meal name"
              placeholderTextColor="rgba(255, 255, 255, 0.32)"
              style={styles.input}
            />
            <TextInput
              value={mealCalories}
              onChangeText={setMealCalories}
              placeholder="Calories"
              placeholderTextColor="rgba(255, 255, 255, 0.32)"
              keyboardType="number-pad"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <PrimaryButton title="Save Meal" onPress={handleAddMeal} />
              <PrimaryButton title="Cancel" onPress={() => setIsMealModalOpen(false)} variant="ghost" />
            </View>
          </View>
        </View>
      </Modal>
    </GlassBackground>
  );
}

function MacroProgress({ label, value, target, unit }) {
  const progress = Math.min(value / target, 1);

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {value}/{target} {unit}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
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
  macroList: {
    gap: spacing.md,
  },
  macroRow: {
    gap: spacing.sm,
  },
  macroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  macroValue: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  actionBlock: {
    marginTop: spacing.lg,
  },
  sectionCard: {
    marginTop: spacing.lg,
  },
  mealList: {
    gap: spacing.md,
  },
  mealRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: spacing.md,
  },
  mealName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  mealMeta: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  mealCalories: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
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
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  modalCard: {
    gap: spacing.md,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#020617',
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
    color: colors.text,
    fontSize: 16,
    paddingVertical: spacing.md,
  },
  modalActions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
