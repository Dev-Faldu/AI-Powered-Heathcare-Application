import { MedicalModel, Doctor, HealthcareFacility, Disease, Patient, DiagnosisReport } from '@/types/medical';

// Define interfaces for our system
export interface Symptom {
  id: string;
  name: string;
  description?: string;
  severity?: number;
  duration?: string;
}

export interface DiagnosisResult {
  conditions: {
    name: string;
    probability: number;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    specialistType: string;
  }[];
  confidenceScore: number;
  followUpQuestions: string[];
  recommendedTests: string[];
  suggestedSpecialists: string[];
}

export interface MedicalReport {
  patientInfo?: {
    id?: string;
    name?: string;
    age?: number;
    gender?: string;
  };
  symptoms: Symptom[];
  diagnosisResults: DiagnosisResult;
  timestamp: Date;
  reportId: string;
}

// Simulated AI models - in real production, these would connect to backend services
const medicalModels: MedicalModel[] = [
  { id: 'transformer-med-v1', name: 'Medical Transformer', accuracy: 0.92, type: 'transformer' },
  { id: 'gpt-med-v2', name: 'GPT Medical', accuracy: 0.89, type: 'llm' },
  { id: 'bert-symptoms-v1', name: 'BERT Symptom Analyzer', accuracy: 0.87, type: 'bert' },
  { id: 'med-decision-tree-v1', name: 'Medical Decision Tree', accuracy: 0.85, type: 'decision-tree' },
];

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'user-doc-1',
    name: 'Dr. Sarah Chen',
    specialty: 'General Practitioner',
    licenseNumber: 'MD12345',
    profileImage: 'https://randomuser.me/api/portraits/women/5.jpg',
    experience: 12,
    rating: 4.8,
    facility: 'HealthFirst Medical Center',
    qualifications: ['MD', 'Board Certified in Family Medicine'],
    languages: ['English', 'Mandarin'],
    acceptingNewPatients: true,
    telemedicineAvailable: true,
    consultationFee: 150,
    nextAvailableSlot: '2023-08-12T10:00:00',
    availabilityStatus: 'online',
    totalEarnings: 25000,
    isOnline: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'doc-2',
    userId: 'user-doc-2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Pulmonologist',
    licenseNumber: 'MD67890',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    experience: 15,
    rating: 4.9,
    facility: 'Respiratory Care Clinic',
    qualifications: ['MD', 'Pulmonary Disease Specialist'],
    languages: ['English', 'Spanish'],
    acceptingNewPatients: true,
    telemedicineAvailable: true,
    consultationFee: 200,
    nextAvailableSlot: '2023-08-14T14:30:00',
    availabilityStatus: 'online',
    totalEarnings: 32000,
    isOnline: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'doc-3',
    userId: 'user-doc-3',
    name: 'Dr. Emily Johnson',
    specialty: 'Allergist',
    licenseNumber: 'MD24680',
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    experience: 8,
    rating: 4.7,
    facility: 'Allergy & Asthma Associates',
    qualifications: ['MD', 'Board Certified in Allergy and Immunology'],
    languages: ['English'],
    acceptingNewPatients: true,
    telemedicineAvailable: false,
    consultationFee: 175,
    nextAvailableSlot: '2023-08-13T09:15:00',
    availabilityStatus: 'offline',
    totalEarnings: 18000,
    isOnline: false,
    lastActive: '2023-08-10T15:30:00'
  },
  {
    id: 'doc-4',
    userId: 'user-doc-4',
    name: 'Dr. James Wilson',
    specialty: 'Infectious Disease Specialist',
    licenseNumber: 'MD13579',
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    experience: 20,
    rating: 4.9,
    facility: 'Infectious Disease Center',
    qualifications: ['MD', 'PhD in Virology', 'Board Certified in Infectious Disease'],
    languages: ['English', 'French'],
    acceptingNewPatients: false,
    telemedicineAvailable: true,
    consultationFee: 225,
    nextAvailableSlot: '2023-08-18T11:00:00',
    availabilityStatus: 'busy',
    totalEarnings: 40000,
    isOnline: true,
    lastActive: new Date().toISOString()
  },
];

// Mock data for healthcare facilities
const mockFacilities: HealthcareFacility[] = [
  {
    id: 'fac-1',
    name: 'HealthFirst Medical Center',
    type: 'clinic',
    specialties: ['Family Medicine', 'Internal Medicine', 'Pediatrics'],
    location: {
      address: '123 Medical Way',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    contactInfo: {
      phone: '415-555-1234',
      email: 'info@healthfirst.med',
      website: 'https://healthfirst.med',
    },
  },
  {
    id: 'fac-2',
    name: 'Respiratory Care Clinic',
    type: 'specialist',
    specialties: ['Pulmonology', 'Respiratory Therapy', 'Sleep Medicine'],
    location: {
      address: '456 Breathing Blvd',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      coordinates: {
        latitude: 37.7833,
        longitude: -122.4167,
      },
    },
    contactInfo: {
      phone: '415-555-5678',
      email: 'appointments@respiratorycare.med',
      website: 'https://respiratorycare.med',
    },
  },
  {
    id: 'fac-3',
    name: 'Allergy & Asthma Associates',
    type: 'specialist',
    specialties: ['Allergy', 'Immunology', 'Asthma Management'],
    location: {
      address: '789 Allergen Ave',
      city: 'Oakland',
      state: 'CA',
      country: 'USA',
      coordinates: {
        latitude: 37.8044,
        longitude: -122.2711,
      },
    },
    contactInfo: {
      phone: '510-555-9012',
      email: 'contact@allergyasthma.med',
      website: 'https://allergyasthma.med',
    },
  },
  {
    id: 'fac-4',
    name: 'TeleMed Now',
    type: 'telemedicine',
    specialties: ['General Medicine', 'Urgent Care', 'Mental Health'],
    contactInfo: {
      phone: '800-555-3456',
      email: 'support@telemednow.med',
      website: 'https://telemednow.med',
    },
  },
];

class DiagnosisService {
  private selectedModel: MedicalModel;

  constructor(modelId?: string) {
    // Default to the most accurate model
    this.selectedModel = modelId 
      ? medicalModels.find(model => model.id === modelId) || medicalModels[0]
      : medicalModels[0];
  }

  async analyzeSymptoms(symptoms: Symptom[], patientData?: any): Promise<DiagnosisResult> {
    console.log(`Analyzing symptoms using ${this.selectedModel.name} model...`);
    
    // In a real system, this would call the backend AI service
    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result - in production this would come from the AI model
    const mockConditions = [
      {
        name: 'Common Cold',
        probability: 0.75 + Math.random() * 0.1,
        description: 'A viral infectious disease of the upper respiratory tract that primarily affects the nose.',
        urgency: 'low' as 'low' | 'medium' | 'high' | 'emergency',
        specialistType: 'General Practitioner'
      },
      {
        name: 'Seasonal Allergies',
        probability: 0.65 + Math.random() * 0.1,
        description: 'An allergic reaction to pollen from trees, grasses, or weeds.',
        urgency: 'low' as 'low' | 'medium' | 'high' | 'emergency',
        specialistType: 'Allergist'
      }
    ];
    
    // Add more serious conditions if certain symptoms are present
    if (symptoms.some(s => s.name.toLowerCase().includes('fever') || s.name.toLowerCase().includes('pain'))) {
      mockConditions.push({
        name: 'Influenza',
        probability: 0.55 + Math.random() * 0.2,
        description: 'A contagious respiratory illness caused by influenza viruses.',
        urgency: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
        specialistType: 'Infectious Disease Specialist'
      });
    }
    
    if (symptoms.some(s => s.name.toLowerCase().includes('breath') || s.name.toLowerCase().includes('chest'))) {
      mockConditions.push({
        name: 'Pneumonia',
        probability: 0.35 + Math.random() * 0.2,
        description: 'An infection that inflames the air sacs in one or both lungs.',
        urgency: 'high' as 'low' | 'medium' | 'high' | 'emergency',
        specialistType: 'Pulmonologist'
      });
    }
    
    // Sort by probability
    mockConditions.sort((a, b) => b.probability - a.probability);
    
    // Generate follow-up questions based on symptoms
    const followUpQuestions = this.generateFollowUpQuestions(symptoms);
    
    return {
      conditions: mockConditions,
      confidenceScore: 0.75 + Math.random() * 0.15,
      followUpQuestions,
      recommendedTests: ['Complete Blood Count', 'Chest X-Ray', 'Urinalysis'],
      suggestedSpecialists: [...new Set(mockConditions.map(c => c.specialistType))]
    };
  }
  
  private generateFollowUpQuestions(symptoms: Symptom[]): string[] {
    const questions = [
      "How long have you been experiencing these symptoms?",
      "Have you taken any medications to alleviate these symptoms?",
      "Do symptoms worsen at any particular time of day?",
      "Have you been in contact with anyone who has similar symptoms?"
    ];
    
    // Add symptom-specific questions
    if (symptoms.some(s => s.name.toLowerCase().includes('headache'))) {
      questions.push("Is your headache localized to a specific area?");
      questions.push("Does light or sound make your headache worse?");
    }
    
    if (symptoms.some(s => s.name.toLowerCase().includes('cough'))) {
      questions.push("Is your cough productive (producing phlegm)?");
      questions.push("What color is the phlegm if any?");
    }
    
    if (symptoms.some(s => s.name.toLowerCase().includes('fever'))) {
      questions.push("What is your temperature reading?");
      questions.push("Does the fever come and go, or is it persistent?");
    }
    
    return questions;
  }
  
  async generateMedicalReport(symptoms: Symptom[], diagnosisResult: DiagnosisResult): Promise<MedicalReport> {
    return {
      symptoms,
      diagnosisResults: diagnosisResult,
      timestamp: new Date(),
      reportId: `REP-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`
    };
  }
  
  getAvailableModels(): MedicalModel[] {
    return [...medicalModels];
  }
  
  setModel(modelId: string): void {
    const model = medicalModels.find(m => m.id === modelId);
    if (model) {
      this.selectedModel = model;
    } else {
      console.error(`Model with ID ${modelId} not found. Using default model.`);
    }
  }

  // New methods for doctor integrations
  async getRecommendedDoctors(specialistTypes: string[], location?: { lat: number, lng: number }): Promise<Doctor[]> {
    console.log(`Finding doctors with specialties: ${specialistTypes.join(', ')}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter doctors by requested specialties
    let recommendedDoctors = mockDoctors.filter(doctor => 
      specialistTypes.some(specialistType => 
        doctor.specialty.toLowerCase().includes(specialistType.toLowerCase())
      )
    );
    
    // If location is provided, sort by proximity (mock implementation)
    if (location) {
      recommendedDoctors = recommendedDoctors.sort(() => 0.5 - Math.random());
    } else {
      // Default sort by rating
      recommendedDoctors = recommendedDoctors.sort((a, b) => b.rating - a.rating);
    }
    
    return recommendedDoctors;
  }
  
  async getHealthcareFacilities(specialties: string[], type?: 'hospital' | 'clinic' | 'specialist' | 'telemedicine'): Promise<HealthcareFacility[]> {
    console.log(`Finding healthcare facilities for ${specialties.join(', ')}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter facilities by specialties and optionally by type
    let filteredFacilities = mockFacilities.filter(facility => 
      specialties.some(specialty => 
        facility.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      ) && 
      (type ? facility.type === type : true)
    );
    
    return filteredFacilities;
  }
  
  async bookAppointment(doctorId: string, patientId: string, date: string, time: string, type: 'in-person' | 'telemedicine'): Promise<{ success: boolean, appointmentId?: string, message: string }> {
    console.log(`Booking appointment with doctor ${doctorId} for patient ${patientId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if doctor exists
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      return {
        success: false,
        message: 'Doctor not found'
      };
    }
    
    // Check if doctor is accepting new patients
    if (!doctor.acceptingNewPatients) {
      return {
        success: false,
        message: 'This doctor is not accepting new patients at this time'
      };
    }
    
    // Check if telemedicine is requested but not available
    if (type === 'telemedicine' && !doctor.telemedicineAvailable) {
      return {
        success: false,
        message: 'This doctor does not offer telemedicine appointments'
      };
    }
    
    // In a real app, we would check availability and make a real booking
    return {
      success: true,
      appointmentId: `APT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      message: `Appointment successfully booked with ${doctor.name} on ${date} at ${time}`
    };
  }
}

export const diagnosisService = new DiagnosisService();
