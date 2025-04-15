
import { MedicalAIModel } from "../symptom-checker/types";

export interface ParticipantData {
  id: string;
  name: string;
  role: 'doctor' | 'patient' | 'specialist' | 'assistant';
  specialization?: string;
  avatarUrl?: string;
  isConnected: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

export interface CallState {
  isConnected: boolean;
  isRecording: boolean;
  startTime?: Date;
  duration: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  encryptionEnabled: boolean;
  recordingConsent: boolean;
  transcriptionEnabled: boolean;
  translationEnabled: boolean;
  translationLanguage?: string;
  aiAnalysisEnabled: boolean;
  virtualBackgroundEnabled: boolean;
}

export interface MessageData {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  attachments?: {
    id: string;
    type: 'image' | 'document' | 'prescription';
    name: string;
    url: string;
    size?: number;
  }[];
  isAIGenerated?: boolean;
}

export interface VideoConsultationProps {
  className?: string;
  consultationId?: string;
  patientId?: string;
  doctorId?: string;
  scheduledTime?: Date;
  onEndCall?: () => void;
  aiModels?: MedicalAIModel[];
}

export interface AIAnalysis {
  transcript: string[];
  keyPoints: string[];
  suggestedDiagnosis?: string[];
  followUpRecommendations?: string[];
  medicationSuggestions?: string[];
  confidence: number;
}
