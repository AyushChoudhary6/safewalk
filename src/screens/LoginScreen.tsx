/**
 * LoginScreen
 * User authentication screen with login and sign-up modes
 */

import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PrimaryButton,
  TextButton,
} from '../components';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';
import FirebaseService from '../services/firebaseService';

interface LoginScreenProps {
  onLogin?: () => void;
  onSignUp?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSignUp,
}) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthentication = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await FirebaseService.register(email, password);
        Alert.alert('Success', 'Account created successfully!');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        await FirebaseService.login(email, password);
        if (onLogin) onLogin();
      }
    } catch (error: any) {
      Alert.alert(
        isSignUp ? 'Sign Up Failed' : 'Login Failed',
        error.message || 'An error occurred during authentication'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Placeholder Google login logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (onLogin) onLogin();
    } catch (error: any) {
      Alert.alert('Google Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.card]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: `${COLORS.primary}15`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="shield-check"
                size={50}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.title}>
              {isSignUp ? 'Create an Account' : 'Welcome to SafeWalk'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Sign up to start your safe journey' : 'Login to continue your safe journey'}
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, SHADOWS.md]}>
            {/* Email Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={COLORS.text.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="yours@example.com"
                  placeholderTextColor={COLORS.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={COLORS.text.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={COLORS.text.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field - Only for Sign Up */}
            {isSignUp && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color={COLORS.text.secondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.text.tertiary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={COLORS.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Forgot Password Link - Only for Login */}
            {!isSignUp && (
              <TextButton
                title="Forgot password?"
                onPress={() => {}}
                textStyle={styles.forgotLink}
              />
            )}

            {/* Authentication Button */}
            <PrimaryButton
              title={isSignUp ? 'Sign Up' : 'Continue'}
              onPress={handleAuthentication}
              loading={loading}
              style={styles.button}
            />

            {/* Divider */}
            {!isSignUp && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Login */}
                <TouchableOpacity
                  style={[styles.googleButton, SHADOWS.sm]}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                >
                  <AntDesign
                    name="google"
                    size={20}
                    color={COLORS.text.primary}
                  />
                  <Text style={styles.googleButtonText}>Login with Google</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Toggle Login/Sign Up */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TextButton
              title={isSignUp ? 'Log in' : 'Sign up for free'}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              textStyle={styles.signUpLink}
            />
          </View>

          {/* Terms and Privacy */}
          <View style={styles.legal}>
            <Text style={styles.legalText}>
              By continuing, you agree to our{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text> and{' '}
              <Text style={styles.legalLink}>Terms of Service</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.base,
    height: 48,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  button: {
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.base,
    gap: SPACING.md,
    backgroundColor: COLORS.card,
  },
  googleButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  footerText: {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  signUpLink: {
    textAlign: 'center',
  },
  legal: {
    paddingHorizontal: SPACING.base,
  },
  legalText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
