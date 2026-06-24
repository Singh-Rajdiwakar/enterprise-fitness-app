import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme/theme';

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed. Please check your credentials.';
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
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
        <GlassCard>
          <View style={styles.header}>
            <Text style={typography.eyebrow}>Enterprise Fitness</Text>
            <Text style={typography.title}>Welcome Back</Text>
            <Text style={typography.subtitle}>Sign in to continue your fitness journey.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="rgba(255, 255, 255, 0.28)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="rgba(255, 255, 255, 0.28)"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.84}
              disabled={isSubmitting}
              onPress={handleLogin}
              style={[styles.loginButton, isSubmitting ? styles.disabledButton : null]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <Text style={styles.switchText}>
              New here?{' '}
              <Text style={styles.switchLink} onPress={() => navigation.navigate('Register')}>
                Create an account
              </Text>
            </Text>
          </View>
        </GlassCard>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.76)',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.18)',
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  loginButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.68,
  },
  loginButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
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
