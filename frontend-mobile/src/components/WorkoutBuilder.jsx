import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';

function createExercise() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    name: '',
    sets: '3',
    reps: '10',
    restSeconds: '60',
  };
}

export default function WorkoutBuilder({ onChange }) {
  const [exercises, setExercises] = useState([createExercise()]);

  useEffect(() => {
    onChange?.(exercises);
  }, [exercises, onChange]);

  const updateExercise = (id, field, value) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise
      )
    );
  };

  const removeExercise = (id) => {
    setExercises((currentExercises) => {
      if (currentExercises.length === 1) {
        return currentExercises;
      }

      return currentExercises.filter((exercise) => exercise.id !== id);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Custom Workout Builder</Text>
        <Pressable
          onPress={() => setExercises((currentExercises) => [...currentExercises, createExercise()])}
          style={({ pressed }) => [styles.addButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </Pressable>
      </View>

      <View style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
              <Pressable onPress={() => removeExercise(exercise.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>

            <TextInput
              value={exercise.name}
              onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
              placeholder="Exercise name"
              placeholderTextColor="rgba(255, 255, 255, 0.32)"
              style={styles.nameInput}
            />

            <View style={styles.numberGrid}>
              <NumberField
                label="Sets"
                value={exercise.sets}
                onChangeText={(value) => updateExercise(exercise.id, 'sets', value)}
              />
              <NumberField
                label="Reps"
                value={exercise.reps}
                onChangeText={(value) => updateExercise(exercise.id, 'reps', value)}
              />
              <NumberField
                label="Rest"
                suffix="sec"
                value={exercise.restSeconds}
                onChangeText={(value) => updateExercise(exercise.id, 'restSeconds', value)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function NumberField({ label, value, onChangeText, suffix = '' }) {
  return (
    <View style={styles.numberField}>
      <Text style={styles.numberLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="rgba(255, 255, 255, 0.28)"
        style={styles.numberInput}
      />
      {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  addButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  exerciseList: {
    gap: spacing.md,
  },
  exerciseCard: {
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: spacing.md,
  },
  exerciseHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  removeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
  nameInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
    color: colors.text,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  numberGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  numberField: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  numberLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  numberInput: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: spacing.xs,
    padding: 0,
  },
  suffix: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
  },
});
