import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "@/types";
import { mockUserProfile } from "@/mocks/userProfile";

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateSubscription: (plan: string) => Promise<void>;
  decrementChecksRemaining: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        set({ user, isAuthenticated: true });
      } else {
        // For demo purposes, we'll use mock data
        // In a real app, this would be null until login
        set({ user: mockUserProfile, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
      set({ error: "Failed to load user data" });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate login success
      set({ user: mockUserProfile, isAuthenticated: true });
      await AsyncStorage.setItem("user", JSON.stringify(mockUserProfile));
    } catch (error) {
      console.error("Login failed:", error);
      set({ error: "Login failed. Please check your credentials." });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);
      set({ error: "Failed to log out" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profile: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true });
    try {
      const updatedUser = { ...user, ...profile };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error("Update profile failed:", error);
      set({ error: "Failed to update profile" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSubscription: async (plan: string) => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true });
    try {
      // Calculate new expiration date (1 month from now)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      // Determine checks based on plan
      let checksRemaining = 0;
      switch (plan) {
        case "free-trial":
          checksRemaining = 5;
          break;
        case "basic":
          checksRemaining = 50;
          break;
        case "premium":
          checksRemaining = 200;
          break;
        case "enterprise":
          checksRemaining = 999999; // Unlimited
          break;
      }

      const updatedUser = {
        ...user,
        subscription: {
          plan,
          expiresAt: expiresAt.toISOString(),
          checksRemaining,
        },
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error("Update subscription failed:", error);
      set({ error: "Failed to update subscription" });
    } finally {
      set({ isLoading: false });
    }
  },

  decrementChecksRemaining: async () => {
    const { user } = get();
    if (!user || !user.subscription) return;

    // Don't decrement if unlimited (enterprise plan)
    if (user.subscription.checksRemaining <= 0) return;

    try {
      const updatedUser = {
        ...user,
        subscription: {
          ...user.subscription,
          checksRemaining: user.subscription.checksRemaining - 1,
        },
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error("Failed to update checks remaining:", error);
    }
  },
}));