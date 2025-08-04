import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuthStore';
import { GradientButton } from '@/components/GradientButton';

export default function VerifyEmailScreen() {
  const [resendLoading, setResendLoading] = useState(false);
  const { user, sendVerificationEmail, signOut, error, clearError } = useAuth();

  const handleResendEmail = async () => {
    setResendLoading(true);
    await sendVerificationEmail();
    setResendLoading(false);
    
    if (!error) {
      Alert.alert('Email Sent', 'Verification email has been sent to your inbox.');
    }
  };

  const handleRefresh = async () => {
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Not Verified', 'Please check your email and click the verification link.');
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  React.useEffect(() => {
    if (user?.emailVerified) {
      router.replace('/(tabs)');
    }
  }, [user?.emailVerified]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={64} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.message}>
            We&apos;ve sent a verification email to:
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.instructions}>
            Please check your inbox and click the verification link to activate your account.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Check Verification Status"
            onPress={handleRefresh}
            style={styles.refreshButton}
            testID="refresh-button"
            icon={<RefreshCw size={20} color="white" />}
          />

          <TouchableOpacity
            onPress={handleResendEmail}
            style={styles.resendButton}
            disabled={resendLoading}
            testID="resend-button"
          >
            <Text style={styles.resendButtonText}>
              {resendLoading ? 'Sending...' : 'Resend Verification Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
            testID="signout-button"
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  refreshButton: {
    marginBottom: 16,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  resendButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  signOutButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
});