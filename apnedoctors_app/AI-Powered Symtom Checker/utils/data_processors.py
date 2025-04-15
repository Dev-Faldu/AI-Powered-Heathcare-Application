from typing import Dict, List, Any
import json
import numpy as np
from datetime import datetime

class DataProcessor:
    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize input text for processing"""
        return text.lower().strip()

    @staticmethod
    def process_symptoms(symptoms: List[str]) -> List[str]:
        """Process and clean symptom list"""
        return [s.lower().strip() for s in symptoms if s]

    @staticmethod
    def format_medical_record(record: Dict[str, Any]) -> Dict[str, Any]:
        """Format medical record for API response"""
        return {
            "id": record.get("id"),
            "patient_id": record.get("patient_id"),
            "created_at": record.get("created_at").isoformat(),
            "medical_history": {
                "allergies": record.get("allergies", []),
                "medications": record.get("medications", []),
                "conditions": record.get("chronic_conditions", [])
            }
        }

    @staticmethod
    def calculate_risk_score(factors: List[float]) -> float:
        """Calculate risk score from multiple factors"""
        if not factors:
            return 0.0
        return float(np.mean(factors))