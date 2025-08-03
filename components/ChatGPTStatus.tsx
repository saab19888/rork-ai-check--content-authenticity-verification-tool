import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { chatGPTService } from '@/services/chatgptService';

export default function ChatGPTStatus() {
  const isConfigured = chatGPTService.isConfigured();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {isConfigured ? (
            <CheckCircle size={20} color={colors.success} />
          ) : (
            <XCircle size={20} color={colors.error} />
          )}
        </View>
        <Text style={styles.title}>ChatGPT Integration</Text>
      </View>
      
      <Text style={styles.status}>
        Status: {isConfigured ? 'Connected' : 'Not Configured'}
      </Text>
      
      <View style={styles.infoContainer}>
        <Info size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          {isConfigured 
            ? 'Using ChatGPT for real-time AI content detection with detailed analysis.'
            : 'ChatGPT API key not found. Using mock analysis for demonstration purposes.'
          }
        </Text>
      </View>
      
      {!isConfigured && (
        <Text style={styles.configText}>
          To enable real ChatGPT analysis, set the EXPO_PUBLIC_CHATGPT_KEY environment variable.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  status: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 8,
  },
  configText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
});