
import { DiagnosisResult, Symptom } from "@/services/DiagnosisService";

export interface MedicalAIModel {
  id: string;
  name: string;
  accuracy: number;
  type: string;
  specialization: string;
}

export interface QuizOption {
  id: string;
  text: string;
  value: 'yes' | 'no' | 'unsure' | string;
  relatedSymptom?: Symptom;
  nextQuestionId?: string;
  aiModelWeight?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'boolean' | 'scale' | 'branching';
  options: QuizOption[];
  aiModelId?: string;
  medicalContext?: string;
  followUp?: boolean;
  requiredForModels?: string[];
}

export interface QuizSymptomCheckerProps {
  className?: string;
  onDiagnosisComplete?: (result: DiagnosisResult) => void;
}

export interface AnalysisDetails {
  modelContributions: Array<{
    modelId: string;
    confidence: number;
    conditions: string[];
  }>;
}
