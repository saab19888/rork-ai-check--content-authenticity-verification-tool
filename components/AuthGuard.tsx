import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuthStore';
import { colors } from '@/constants/colors';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const segments = useSegments();

  React.useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';


    console.log('AuthGuard - User:', user?.email, 'Verified:', user?.emailVerified);
    console.log('AuthGuard - Segments:', segments);

    if (!user) {
      // User is not signed in
      if (!inAuthGroup) {
        console.log('Redirecting to login - no user');
        router.replace('/auth/login');
      }
    } else if (!user.emailVerified) {
      // User is signed in but email not verified
      if (segments[1] !== 'verify-email' && !inAuthGroup) {
        console.log('Redirecting to verify email - unverified user');
        router.replace('/auth/verify-email');
      }
    } else {
      // User is signed in and verified
      if (inAuthGroup) {
        console.log('Redirecting to tabs - verified user');
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});