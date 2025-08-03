import React, { useEffect } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from "react-native-reanimated";
import { colors } from "@/constants/colors";

type ConfidenceScoreProps = {
  score: number;
  size?: number;
  style?: ViewStyle;
  showLabel?: boolean;
  classification: "human" | "ai" | "mixed";
};

export default function ConfidenceScore({
  score,
  size = 120,
  style,
  showLabel = true,
  classification
}: ConfidenceScoreProps) {
  const progress = useSharedValue(0);
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Calculate circumference for the progress circle

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [score, progress]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      strokeDashoffset: withTiming(circumference * (1 - progress.value), {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const getColor = () => {
    switch (classification) {
      case "human":
        return colors.humanWritten;
      case "ai":
        return colors.aiGenerated;
      case "mixed":
        return colors.mixed;
      default:
        return colors.neutral;
    }
  };

  const getLabel = () => {
    switch (classification) {
      case "human":
        return "Human Written";
      case "ai":
        return "AI Generated";
      case "mixed":
        return "Mixed Content";
      default:
        return "";
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]} testID="confidence-score">
      <View style={styles.svgContainer}>
        <Animated.View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressCircle,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>
          <View style={styles.progressForeground}>
            <Animated.View
              style={[
                styles.progressCircle,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: getColor(),
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                  transform: [{ rotate: "-90deg" }],
                  opacity: progress.value,
                },
                animatedCircleStyle,
              ]}
            />
          </View>
        </Animated.View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.scoreText}>{Math.round(score)}%</Text>
        {showLabel && (
          <Text style={[styles.labelText, { color: getColor() }]}>
            {getLabel()}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  progressContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  progressBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  progressForeground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  progressCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});