import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import SubscriptionCard from "@/components/SubscriptionCard";
import GradientButton from "@/components/GradientButton";
import { subscriptionPlans } from "@/constants/subscriptionPlans";
import { useUserStore } from "@/hooks/useUserStore";

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user, updateSubscription } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState<string>(
    user?.subscription.plan || "free-trial"
  );
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      // In a real app, this would process payment and call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription in store
      await updateSubscription(selectedPlan);
      
      Alert.alert(
        "Subscription Updated",
        "Your subscription has been updated successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Subscription update failed:", error);
      Alert.alert(
        "Update Failed",
        "There was an error updating your subscription. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Subscription Plans",
          headerTitleStyle: {
            color: colors.text,
            fontWeight: "600",
          },
        }} 
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select the plan that best fits your needs
          </Text>
        </View>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              !isYearly && styles.selectedBillingOption,
            ]}
            onPress={() => setIsYearly(false)}
          >
            <Text
              style={[
                styles.billingText,
                !isYearly && styles.selectedBillingText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingOption,
              isYearly && styles.selectedBillingOption,
            ]}
            onPress={() => setIsYearly(true)}
          >
            <Text
              style={[
                styles.billingText,
                isYearly && styles.selectedBillingText,
              ]}
            >
              Yearly
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save 16%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {subscriptionPlans.map((plan) => (
          <SubscriptionCard
            key={plan.id}
            plan={plan}
            isYearly={isYearly}
            onSelect={handlePlanSelect}
            isSelected={selectedPlan === plan.id}
          />
        ))}

        <GradientButton
          title={isProcessing ? "Processing..." : "Confirm Subscription"}
          onPress={handleSubscribe}
          isLoading={isProcessing}
          style={styles.confirmButton}
        />

        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription at any time.
        </Text>
      </ScrollView>
    </>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  billingToggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    position: "relative",
  },
  selectedBillingOption: {
    backgroundColor: colors.primary,
  },
  billingText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  selectedBillingText: {
    color: "white",
  },
  saveBadge: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  saveText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});