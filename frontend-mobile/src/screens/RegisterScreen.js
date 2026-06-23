import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';
import { colors, spacing, typography } from '../theme/theme';

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.';
}

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/users/register', { name, email, password });
      Alert.alert('Registration Successful');
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <GlassCard>
            <View style={styles.header}>
              <Text style={typography.eyebrow}>Enterprise Fitness</Text>
              <Text style={typography.title}>Create Account</Text>
              <Text style={typography.subtitle}>
                Start tracking your progress with a smarter fitness dashboard.
              </Text>
            </View>

            <View style={styles.form}>
              <FormField
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                autoCapitalize="words"
              />
              <FormField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
              />
              <FormField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
              />
              <FormField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
              />

              <PrimaryButton
                title={isSubmitting ? 'Creating account...' : 'Register'}
                onPress={handleRegister}
                disabled={isSubmitting}
              />

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text style={styles.switchLink} onPress={() => navigation.navigate('Login')}>
                  Login here.
                </Text>
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  switchText: {
    color: colors.textDim,
    fontSize: 14,
    textAlign: 'center',
  },
  switchLink: {
    color: colors.accent,
    fontWeight: '800',
  },
});
