
// AI Models used in the system
export interface MedicalModel {
  id: string;
  name: string;
  accuracy: number;
  type: 'transformer' | 'llm' | 'bert' | 'decision-tree' | 'lstm';
}

// User base type with common properties
export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  userType: 'doctor' | 'patient';
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Disease information
export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  riskFactors: string[];
  specialistTypes: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

// Healthcare facility information
export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'specialist' | 'telemedicine';
  specialties: string[];
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  availableSlots?: {
    date: string;
    times: string[];
  }[];
}

// Doctor profile and availability information
export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  clinicHospitalName?: string;
  profileImage?: string;
  experience: number; // years
  rating: number; // out of 5
  languages: string[];
  acceptingNewPatients: boolean;
  telemedicineAvailable: boolean;
  consultationFee?: number;
  nextAvailableSlot?: string;
  isOnline?: boolean; // Indicates if the doctor is currently online and available
  lastActive?: string; // ISO timestamp of when the doctor was last active
  availabilityStatus: 'online' | 'offline' | 'busy';
  totalEarnings: number;
  facility?: string; // Name of healthcare facility
  qualifications?: string[]; // Medical qualifications
}

// Appointment/Consultation information
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  facilityId?: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'in-person' | 'telemedicine';
  diagnosis?: string;
  notes?: string;
  diagnosisReportId?: string;
  consultationFee: number;
}

// Patient medical information
export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactInfo: {
    phone?: string;
    email?: string;
  };
  medicalHistory?: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    previousDiagnoses?: string[];
  };
  upcomingAppointment?: Appointment;
  aiGeneratedReport?: DiagnosisReport;
  waitingSince?: string; // ISO timestamp of when the patient joined the queue
}

// AI-generated diagnosis report
export interface DiagnosisReport {
  id: string;
  patientId: string;
  doctorId?: string;
  createdAt: string;
  symptoms: string[];
  possibleConditions: {
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendedTests?: string[];
  aiGeneratedNotes?: string;
  doctorAnnotations?: string;
  pdfLink?: string;
}

// Doctor's prescription for patient
export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  createdAt: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];
  instructions?: string;
  followUpDate?: string;
  prescriptionPdf?: string;
}

// Payment transaction information
export interface Payment {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
}

// Doctor earnings analytics
export interface DoctorEarnings {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
  consultationCount: number;
  averageRating: number;
  averageConsultationTime: number; // in minutes
}

// Data point for earnings chart
export interface EarningsDataPoint {
  date: string;
  amount: number;
  consultations: number;
}

// Database configuration for the system
export interface DatabaseConfig {
  primary: {
    type: 'postgresql';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
  };
  nosql: {
    type: 'mongodb';
    connectionString: string;
    database: string;
  };
  cache: {
    type: 'redis';
    host: string;
    port: number;
    password?: string;
  };
  security: {
    encryption: 'AES-256';
    ssl: boolean;
    authMethod: 'JWT' | 'OAuth2';
  };
  backup: {
    frequency: 'daily' | 'hourly';
    retention: number; // days
    storageProvider: 'AWS' | 'GCP' | 'Azure';
  };
}
