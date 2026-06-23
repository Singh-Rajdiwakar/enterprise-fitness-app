import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { colors, spacing, typography } from '../theme/theme';

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || 'Login failed. Please check your credentials.';
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
      const response = await api.post('/users/login', { email, password });
      const token = response.data?.token;

      if (!token) {
        setErrorMessage('Login failed. No token was returned by the server.');
        return;
      }

      await login(token, { email });
      Alert.alert('Login Successful');
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
              placeholder="Enter your password"
              secureTextEntry
            />

            <Text style={styles.forgot}>Forgot Password?</Text>

            <PrimaryButton
              title={isSubmitting ? 'Loading...' : 'Login'}
              onPress={handleLogin}
              disabled={isSubmitting}
            />

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
  forgot: {
    alignSelf: 'flex-end',
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '700',
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
