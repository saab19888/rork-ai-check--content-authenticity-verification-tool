import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Shield, 
  HelpCircle 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import GradientButton from "@/components/GradientButton";
import ChatGPTStatus from "@/components/ChatGPTStatus";
import { useAuth } from "@/hooks/useAuthStore";
import { useUserStore } from "@/hooks/useUserStore";

export default function AccountScreen() {
  const router = useRouter();
  const { user: authUser, signOut } = useAuth();
  const { user: profileUser } = useUserStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanName = (planId: string) => {
    switch (planId) {
      case "free-trial":
        return "Free Trial";
      case "basic":
        return "Basic Plan";
      case "premium":
        return "Premium Plan";
      case "enterprise":
        return "Enterprise Plan";
      default:
        return "Unknown Plan";
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {authUser && profileUser ? (
        <>
          <View style={styles.profileSection}>
            <View style={styles.profileInitials}>
              <Text style={styles.initialsText}>
                {(authUser.displayName || authUser.email || 'U').split(" ").map(n => n[0]).join("")}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{authUser.displayName || 'User'}</Text>
              <Text style={styles.profileEmail}>{authUser.email}</Text>
              {!authUser.emailVerified && (
                <Text style={styles.unverifiedText}>Email not verified</Text>
              )}
            </View>
          </View>

          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>Current Subscription</Text>
              <CreditCard size={20} color={colors.primary} />
            </View>
            <View style={styles.subscriptionDetails}>
              <Text style={styles.planName}>
                {getPlanName(profileUser.subscription.plan)}
              </Text>
              <Text style={styles.expiryDate}>
                Expires: {formatDate(profileUser.subscription.expiresAt)}
              </Text>
              <View style={styles.checksContainer}>
                <Text style={styles.checksLabel}>Checks Remaining:</Text>
                <Text style={styles.checksValue}>
                  {profileUser.subscription.checksRemaining < 0 
                    ? "Unlimited" 
                    : profileUser.subscription.checksRemaining}
                </Text>
              </View>
            </View>
            <GradientButton
              title="Manage Subscription"
              onPress={() => router.push("/subscription")}
              style={styles.subscriptionButton}
            />
          </View>

          <ChatGPTStatus />

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.text} />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notificationsEnabled ? colors.primary : colors.neutral}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert("Privacy Settings", "Privacy settings would be configured here.")}
            >
              <View style={styles.settingLeft}>
                <Shield size={20} color={colors.text} />
                <Text style={styles.settingText}>Privacy Settings</Text>
              </View>
              <ChevronRight size={20} color={colors.neutral} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert("Help & Support", "Contact us at support@aicheck.com")}
            >
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color={colors.text} />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color={colors.neutral} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>AI-Check v1.0.0</Text>
        </>
      ) : (
        <View style={styles.signInContainer}>
          <Text style={styles.signInTitle}>Loading...</Text>
          <Text style={styles.signInText}>
            Please wait while we load your account information.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileInitials: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  initialsText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unverifiedText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 2,
  },
  subscriptionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  subscriptionDetails: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  expiryDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  checksContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checksLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  checksValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  subscriptionButton: {
    width: "100%",
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: "500",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSecondary,
  },
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  signInText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  signInButton: {
    width: "80%",
  },
});