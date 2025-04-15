from .ai_service import AIService
from .medical_api_service import MedicalAPIService
from models.db_models import Diagnosis, Patient
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DiagnosisService:
    def __init__(self, db: Session):
        self.db = db
        self.ai_service = AIService()
        self.medical_api = MedicalAPIService()

    async def create_diagnosis(
        self, 
        patient_id: int, 
        symptoms_text: str
    ) -> Dict[str, Any]:
        """Create a new diagnosis for a patient"""
        try:
            # Get patient
            patient = self.db.query(Patient).filter(Patient.id == patient_id).first()
            if not patient:
                raise ValueError("Patient not found")

            # Analyze symptoms
            symptoms = await self.ai_service.analyze_text(symptoms_text)
            
            # Get diagnosis
            diagnosis_result = await self.ai_service.get_diagnosis(symptoms['symptoms'])
            
            # Get additional medical information
            medical_info = await self.medical_api.get_condition_info(
                diagnosis_result['diagnoses'][0]['condition']
            )
            
            # Create diagnosis record
            diagnosis = Diagnosis(
                patient_id=patient_id,
                symptoms=symptoms['symptoms'],
                diagnosis=diagnosis_result['diagnoses'],
                confidence_score=diagnosis_result['confidence_scores'][0],
                recommendations=medical_info.get('recommendations', [])
            )
            
            self.db.add(diagnosis)
            self.db.commit()
            self.db.refresh(diagnosis)
            
            return diagnosis.to_dict()
            
        except Exception as e:
            logger.error(f"Diagnosis creation failed: {str(e)}")
            self.db.rollback()
            raise