export interface VerificationResult {
    first_level_passed: boolean;
    candidate_details: {
      experience: number;
      certifications: string[];
      scores: {
        cosine_similarity: number;
        extracted_experience: number;
        extracted_certifications: string[];
      };
    };
    interview_details?: {
      candidate_id: string;
      interview_slot: string;
      medical_experts: string[];
    };
    reason?: string;
  }
  
  const API_URL = 'http://localhost:5000';
  
  export const verifyMedicalLicense = async (file: File): Promise<VerificationResult> => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
  
      const response = await fetch(`${API_URL}/upload_resume`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Verification request failed');
      }
  
      if (!data.first_level_passed && data.reason) {
        throw new Error(data.reason);
      }
  
      return data;
    } catch (error) {
      console.error('License verification error:', error);
      throw error;
    }
  };