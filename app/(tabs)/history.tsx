import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList
} from "react-native";
import { useRouter } from "expo-router";
import { FileX } from "lucide-react-native";
import { colors } from "@/constants/colors";
import AnalysisHistoryItem from "@/components/AnalysisHistoryItem";
import { useAnalysisStore } from "@/hooks/useAnalysisStore";

export default function HistoryScreen() {
  const router = useRouter();
  const { history } = useAnalysisStore();

  const handleItemPress = (id: string) => {
    router.push(`/results/${id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FileX size={60} color={colors.neutral} />
      <Text style={styles.emptyTitle}>No Analysis History</Text>
      <Text style={styles.emptyText}>
        Your analysis history will appear here once you check some content.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        <Text style={styles.subtitle}>
          View and manage your previous content checks
        </Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnalysisHistoryItem item={item} onPress={handleItemPress} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
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
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 20,
  },
});