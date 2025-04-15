from pydantic import BaseSettings
from typing import Dict, Any, Optional
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Basic API settings
    PROJECT_NAME: str = "AI Symptom Checker"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # AI Model Configuration
    MODEL_PATHS: Dict[str, str] = {
        "symptom_classifier": "models/trained/symptom_classifier",
        "diagnosis_model": "models/trained/diagnosis_model",
        "risk_assessment": "models/trained/risk_assessment"
    }
    
    # Model parameters
    MODEL_PARAMS: Dict[str, Dict[str, Any]] = {
        "symptom_classifier": {
            "threshold": 0.75,
            "max_symptoms": 10,
            "min_confidence": 0.6
        },
        "diagnosis_model": {
            "confidence_threshold": 0.85,
            "max_diagnoses": 5,
            "include_probabilities": True
        }
    }
    
    # External API endpoints
    MAYO_CLINIC_API: Optional[str] = os.getenv("MAYO_CLINIC_API")
    NIH_API: Optional[str] = os.getenv("NIH_API")
    WHO_API: Optional[str] = os.getenv("WHO_API")
    
    # API Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Telemedicine settings
    VIDEO_CALL_PROVIDER: str = os.getenv("VIDEO_CALL_PROVIDER", "twilio")
    MAX_CONSULTATION_DURATION: int = 30  # minutes
    
    # File upload settings
    UPLOAD_DIR: Path = Path("uploads")
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png", "pdf"}
    
    # Logging configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        case_sensitive = True
        
        @classmethod
        def customise_sources(cls, init_settings, env_settings, file_secret_settings):
            return env_settings, init_settings, file_secret_settings

# Create global settings instance
settings = Settings()

def get_settings() -> Settings:
    """Dependency injection for settings"""
    return settings