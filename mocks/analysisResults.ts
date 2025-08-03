import { AnalysisResult } from "@/types";

export const mockAnalysisResults: AnalysisResult[] = [
  {
    id: "1",
    title: "Project Proposal",
    date: "2025-08-01",
    classification: "human",
    confidenceScore: 92,
    textLength: 2450,
    suspiciousSegments: [
      {
        text: "The implementation of this strategy will undoubtedly lead to significant improvements in overall performance metrics.",
        startIndex: 1200,
        endIndex: 1300,
        score: 0.65
      }
    ]
  },
  {
    id: "2",
    title: "Marketing Copy",
    date: "2025-07-28",
    classification: "ai",
    confidenceScore: 88,
    textLength: 1200,
    suspiciousSegments: [
      {
        text: "Our revolutionary product transforms the way you interact with technology, providing unparalleled efficiency and seamless integration.",
        startIndex: 100,
        endIndex: 200,
        score: 0.92
      },
      {
        text: "By leveraging cutting-edge algorithms and proprietary methodologies, we've created a solution that stands head and shoulders above the competition.",
        startIndex: 500,
        endIndex: 600,
        score: 0.89
      }
    ]
  },
  {
    id: "3",
    title: "Research Summary",
    date: "2025-07-25",
    classification: "mixed",
    confidenceScore: 76,
    textLength: 3200,
    suspiciousSegments: [
      {
        text: "The data conclusively demonstrates a correlation between the variables, with statistical significance at p<0.05 across all test conditions.",
        startIndex: 1500,
        endIndex: 1600,
        score: 0.78
      }
    ]
  }
];