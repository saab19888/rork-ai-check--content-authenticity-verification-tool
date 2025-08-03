import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity
} from "react-native";
import { Upload, X } from "lucide-react-native";
import { colors } from "@/constants/colors";
import * as DocumentPicker from "expo-document-picker";

type TextInputBoxProps = {
  value: string;
  onChangeText: (text: string) => void;
  onUpload?: (fileUri: string, fileName: string, fileType: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export default function TextInputBox({
  value,
  onChangeText,
  onUpload,
  placeholder = "Paste or type text to analyze...",
  minHeight = 200,
}: TextInputBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        console.log("Document picker was canceled");
        return;
      }
      
      const file = result.assets[0];
      console.log("Document picked:", file);
      
      if (file) {
        setFileName(file.name);
        if (onUpload) {
          onUpload(file.uri, file.name, file.mimeType || "");
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const clearFile = () => {
    setFileName(null);
    onChangeText("");
  };

  return (
    <View style={styles.container} testID="text-input-box">
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedContainer,
          { minHeight },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {fileName ? (
        <View style={styles.fileContainer}>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
          <TouchableOpacity onPress={clearFile}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : null}

      {onUpload && (
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Upload size={18} color={colors.primary} />
          <Text style={styles.uploadText}>Upload Document</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.supportedFormats}>
        Supported formats: PDF, DOCX, TXT
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.background,
  },
  focusedContainer: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary + "10",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  fileName: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  uploadText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  supportedFormats: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
});