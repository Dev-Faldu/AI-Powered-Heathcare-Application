from fastapi import APIRouter, Depends
from typing import List, Dict
from core.ai_models.symptom_extractor import SymptomExtractor
from core.ai_models.disease_predictor import DiseasePredictor
from core.ai_models.medical_chatbot import MedicalChatbot

router = APIRouter()

@router.post("/diagnose")
async def create_diagnosis(
    text: str,
    patient_info: dict,
    symptom_extractor: SymptomExtractor = Depends(),
    disease_predictor: DiseasePredictor = Depends(),
    medical_chatbot: MedicalChatbot = Depends()
):
    # Extract symptoms
    symptoms = await symptom_extractor.extract_symptoms(text)
    
    # Get potential diagnoses
    diagnoses = await disease_predictor.predict_diseases(symptoms)
    
    # Get follow-up questions
    follow_up = await medical_chatbot.get_follow_up_question(
        symptoms,
        patient_info
    )
    
    return {
        "symptoms": symptoms,
        "potential_diagnoses": diagnoses,
        "follow_up_question": follow_up
    }