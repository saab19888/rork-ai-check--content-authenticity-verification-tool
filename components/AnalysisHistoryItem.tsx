import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FileText, ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { AnalysisResult } from "@/types";

type AnalysisHistoryItemProps = {
  item: AnalysisResult;
  onPress: (id: string) => void;
};

export default function AnalysisHistoryItem({ item, onPress }: AnalysisHistoryItemProps) {
  const getStatusColor = () => {
    switch (item.classification) {
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

  const getStatusText = () => {
    switch (item.classification) {
      case "human":
        return "Human";
      case "ai":
        return "AI";
      case "mixed":
        return "Mixed";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id)}
      testID={`analysis-history-item-${item.id}`}
    >
      <View style={styles.iconContainer}>
        <FileText size={24} color={colors.primary} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.wordCount}>
            {Math.round(item.textLength / 5)} words
          </Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor() }]}
          >
            {getStatusText()}
          </Text>
        </View>
        <ChevronRight size={20} color={colors.neutral} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dot: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 6,
  },
  wordCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});