import React from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
};

export default function GradientButton({
  title,
  onPress,
  style,
  textStyle,
  isLoading = false,
  disabled = false,
  variant = "primary"
}: GradientButtonProps) {
  if (variant === "outline") {
    return (
      <TouchableOpacity
        style={[styles.button, styles.outlineButton, style]}
        onPress={onPress}
        disabled={disabled || isLoading}
        testID="gradient-button"
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={[styles.outlineText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  const gradientColors = 
    variant === "secondary" 
      ? [colors.secondary, colors.primaryDark] as const
      : [colors.gradient.start, colors.gradient.end] as const;

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      testID="gradient-button"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
    height: 50,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});