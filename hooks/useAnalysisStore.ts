import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnalysisResult } from "@/types";
import { mockAnalysisResults } from "@/mocks/analysisResults";
import { chatGPTService } from "@/services/chatgptService";

interface AnalysisState {
  history: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  analyzeText: (text: string, title?: string) => Promise<AnalysisResult>;
  getAnalysisById: (id: string) => AnalysisResult | undefined;
  clearCurrentAnalysis: () => void;
  generateMockAnalysis: (text: string) => Promise<any>;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  history: [],
  currentAnalysis: null,
  isAnalyzing: false,
  error: null,

  initialize: async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("analysisHistory");
      if (storedHistory) {
        set({ history: JSON.parse(storedHistory) });
      } else {
        // For demo purposes, we'll use mock data
        set({ history: mockAnalysisResults });
        await AsyncStorage.setItem(
          "analysisHistory",
          JSON.stringify(mockAnalysisResults)
        );
      }
    } catch (error) {
      console.error("Failed to initialize analysis history:", error);
    }
  },

  analyzeText: async (text: string, title = "Untitled Document") => {
    set({ isAnalyzing: true, error: null });
    
    try {
      let analysisResult;
      
      // Check if ChatGPT service is configured
      if (chatGPTService.isConfigured()) {
        console.log('Using ChatGPT for analysis...');
        try {
          // Use ChatGPT for real analysis
          analysisResult = await chatGPTService.analyzeText(text);
          console.log('ChatGPT analysis completed:', analysisResult);
        } catch (chatGPTError) {
          console.error('ChatGPT analysis failed, falling back to mock:', chatGPTError);
          // Fall back to mock analysis if ChatGPT fails
          analysisResult = await get().generateMockAnalysis(text);
        }
      } else {
        console.log('ChatGPT not configured, using mock analysis...');
        // Fall back to mock analysis if no API key
        analysisResult = await get().generateMockAnalysis(text);
      }
      
      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        title,
        date: new Date().toISOString(),
        classification: analysisResult.classification,
        confidenceScore: analysisResult.confidenceScore,
        textLength: text.length,
        reasoning: analysisResult.reasoning,
        suspiciousSegments: analysisResult.suspiciousSegments
      };
      
      // Update state and storage
      const updatedHistory = [newAnalysis, ...get().history];
      await AsyncStorage.setItem("analysisHistory", JSON.stringify(updatedHistory));
      
      set({
        currentAnalysis: newAnalysis,
        history: updatedHistory,
        isAnalyzing: false
      });
      
      return newAnalysis;
    } catch (error) {
      console.error("Analysis failed:", error);
      set({ 
        error: "Failed to analyze text. Please try again.",
        isAnalyzing: false
      });
      throw error;
    }
  },

  getAnalysisById: (id: string) => {
    return get().history.find(item => item.id === id);
  },

  clearCurrentAnalysis: () => {
    set({ currentAnalysis: null });
  },

  // Helper method for mock analysis when ChatGPT is not available
  generateMockAnalysis: async (text: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random analysis result
    const classifications: Array<"human" | "ai" | "mixed"> = ["human", "ai", "mixed"];
    const randomClassification = classifications[Math.floor(Math.random() * classifications.length)];
    
    // Generate confidence score based on classification
    let confidenceScore: number;
    switch (randomClassification) {
      case "human":
        confidenceScore = 70 + Math.random() * 25;
        break;
      case "ai":
        confidenceScore = 75 + Math.random() * 20;
        break;
      case "mixed":
        confidenceScore = 60 + Math.random() * 30;
        break;
      default:
        confidenceScore = 50 + Math.random() * 40;
    }
    
    // Create suspicious segments if AI or mixed
    const suspiciousSegments = randomClassification !== "human" ? [
      {
        text: text.length > 100 
          ? text.substring(0, 100) + "..." 
          : text,
        startIndex: 0,
        endIndex: Math.min(100, text.length),
        score: 0.7 + Math.random() * 0.25
      }
    ] : [];
    
    return {
      classification: randomClassification,
      confidenceScore,
      reasoning: "Mock analysis - ChatGPT service not configured",
      suspiciousSegments
    };
  }
}));