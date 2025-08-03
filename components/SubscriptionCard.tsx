import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { SubscriptionPlan } from "@/types";
import GradientButton from "./GradientButton";

type SubscriptionCardProps = {
  plan: SubscriptionPlan;
  isYearly: boolean;
  onSelect: (planId: string) => void;
  isSelected: boolean;
};

export default function SubscriptionCard({
  plan,
  isYearly,
  onSelect,
  isSelected
}: SubscriptionCardProps) {
  const price = isYearly ? plan.yearlyPrice : plan.price;
  const isEnterprise = plan.id === "enterprise";
  const isFree = plan.id === "free-trial";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        plan.isFeatured && styles.featuredContainer
      ]}
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.8}
      testID={`subscription-card-${plan.id}`}
    >
      {plan.isFeatured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Popular</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          {isEnterprise ? (
            <Text style={styles.enterpriseText}>Contact Sales</Text>
          ) : (
            <>
              {!isFree && <Text style={styles.currency}>$</Text>}
              <Text style={styles.price}>
                {isFree ? "Free" : price?.toFixed(2)}
              </Text>
              {!isFree && (
                <Text style={styles.period}>
                  /{isYearly ? "year" : "month"}
                </Text>
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Check size={16} color={colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <GradientButton
        title={isSelected ? "Selected" : "Select Plan"}
        onPress={() => onSelect(plan.id)}
        style={styles.button}
        variant={isSelected ? "outline" : "primary"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  featuredContainer: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  featuredBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  header: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  currency: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  period: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 2,
    marginBottom: 4,
  },
  enterpriseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  button: {
    width: "100%",
  },
});