import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import createContextHook from '@nkzw/create-context-hook';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  clearError: () => void;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }));
    });

    return unsubscribe;
  }, []);

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      clearError();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);
      console.log('Sign up successful, verification email sent');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      clearError();
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      clearError();
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (!state.user) throw new Error('No user logged in');
      setLoading(true);
      clearError();
      await sendEmailVerification(state.user);
      console.log('Verification email sent');
    } catch (error: any) {
      console.error('Send verification email error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const actions: AuthActions = {
    signIn,
    signUp,
    signOut: handleSignOut,
    resetPassword,
    sendVerificationEmail,
    clearError
  };

  return {
    ...state,
    ...actions
  };
});

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
}