from models.ai_models import BERTSymptomClassifier, DiagnosisModel, RiskAssessmentModel
from core.config import get_settings
from typing import List, Dict, Any
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.symptom_classifier = BERTSymptomClassifier(
            model_path=settings.MODEL_PATHS["symptom_classifier"]
        )
        self.diagnosis_model = DiagnosisModel(
            model_path=settings.MODEL_PATHS["diagnosis_model"]
        )
        self.risk_model = RiskAssessmentModel(
            model_path=settings.MODEL_PATHS["risk_assessment"]
        )

    async def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze text input for symptoms"""
        try:
            symptoms = await self.symptom_classifier.predict(text)
            return symptoms
        except Exception as e:
            logger.error(f"Text analysis failed: {str(e)}")
            raise

    async def get_diagnosis(self, symptoms: List[str]) -> Dict[str, Any]:
        """Generate diagnosis from symptoms"""
        try:
            diagnosis = await self.diagnosis_model.predict(symptoms)
            return diagnosis
        except Exception as e:
            logger.error(f"Diagnosis generation failed: {str(e)}")
            raise

    async def assess_risk(self, symptoms: List[str], patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess patient risk level"""
        try:
            risk_assessment = await self.risk_model.assess_risk(symptoms, patient_data)
            return risk_assessment
        except Exception as e:
            logger.error(f"Risk assessment failed: {str(e)}")
            raise