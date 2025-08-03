import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Share,
  Alert
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { 
  Download, 
  Share2, 
  AlertTriangle
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import ConfidenceScore from "@/components/ConfidenceScore";
import GradientButton from "@/components/GradientButton";
import { useAnalysisStore } from "@/hooks/useAnalysisStore";
import { AnalysisResult } from "@/types";

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getAnalysisById } = useAnalysisStore();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (id) {
      const analysisResult = getAnalysisById(id);
      if (analysisResult) {
        setResult(analysisResult);
      } else {
        Alert.alert("Error", "Analysis result not found");
        router.back();
      }
    }
  }, [id, getAnalysisById, router]);

  const handleShare = async () => {
    if (!result) return;

    try {
      const message = `
AI-Check Analysis Results:
Document: ${result.title}
Classification: ${result.classification === "human" ? "Human Written" : result.classification === "ai" ? "AI Generated" : "Mixed Content"}
Confidence Score: ${result.confidenceScore.toFixed(1)}%
Date: ${new Date(result.date).toLocaleDateString()}
      `;

      await Share.share({
        message,
        title: `AI-Check Results: ${result.title}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF report
    Alert.alert(
      "Download Report",
      "In a production app, this would download a detailed PDF report of the analysis."
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!result) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Analysis Results",
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
          <Text style={styles.title}>{result.title}</Text>
          <Text style={styles.date}>Analyzed on {formatDate(result.date)}</Text>
        </View>

        <View style={styles.resultCard}>
          <ConfidenceScore 
            score={result.confidenceScore} 
            classification={result.classification}
            size={150}
            style={styles.scoreContainer}
          />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Word Count</Text>
              <Text style={styles.statValue}>
                ~{Math.round(result.textLength / 5)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Character Count</Text>
              <Text style={styles.statValue}>{result.textLength}</Text>
            </View>
          </View>

          {result.suspiciousSegments && result.suspiciousSegments.length > 0 && (
            <View style={styles.suspiciousSection}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={18} color={colors.warning} />
                <Text style={styles.sectionTitle}>Suspicious Segments</Text>
              </View>
              
              {result.suspiciousSegments.map((segment, index) => (
                <View key={index} style={styles.suspiciousItem}>
                  <Text style={styles.suspiciousText}>&quot;{segment.text}&quot;</Text>
                  <View style={styles.suspiciousScore}>
                    <Text style={styles.suspiciousScoreText}>
                      {(segment.score * 100).toFixed(0)}% AI probability
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {result.reasoning && (
            <View style={styles.reasoningSection}>
              <Text style={styles.reasoningTitle}>Analysis Reasoning</Text>
              <Text style={styles.reasoningText}>{result.reasoning}</Text>
            </View>
          )}

          <View style={styles.recommendationSection}>
            <Text style={styles.recommendationTitle}>Recommendations</Text>
            {result.classification === "human" ? (
              <Text style={styles.recommendationText}>
                This content appears to be human-written with high confidence. No further action needed.
              </Text>
            ) : result.classification === "ai" ? (
              <Text style={styles.recommendationText}>
                This content shows strong indicators of AI generation. Consider reviewing and editing to add more human elements if needed for your use case.
              </Text>
            ) : (
              <Text style={styles.recommendationText}>
                This content contains a mix of human and AI-generated elements. Review the highlighted sections and consider revising for consistency.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Download size={20} color={colors.primary} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
        </View>

        <GradientButton
          title="Check Another Document"
          onPress={() => router.push("/")}
          style={styles.checkButton}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreContainer: {
    alignSelf: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  suspiciousSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  suspiciousItem: {
    backgroundColor: colors.warning + "10",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  suspiciousText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: "italic",
    marginBottom: 8,
  },
  suspiciousScore: {
    alignSelf: "flex-start",
    backgroundColor: colors.warning + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  suspiciousScoreText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: "500",
  },
  reasoningSection: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasoningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  recommendationSection: {
    backgroundColor: colors.primary + "10",
    borderRadius: 8,
    padding: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    padding: 12,
  },
  actionText: {
    color: colors.primary,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  checkButton: {
    marginBottom: 16,
  },
});