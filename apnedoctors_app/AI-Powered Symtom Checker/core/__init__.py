from pathlib import Path
from typing import Dict, Any
import logging
from dotenv import load_dotenv
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class CoreConfig:
    """Core configuration and initialization"""
    
    # Base paths
    BASE_DIR = Path(__file__).parent.parent
    MODELS_DIR = BASE_DIR / "models" / "trained"
    
    # API configurations
    API_VERSION = "v1"
    API_PREFIX = f"/api/{API_VERSION}"
    
    # AI Model settings
    MODEL_SETTINGS = {
        "symptom_classifier": {
            "model_path": str(MODELS_DIR / "symptom_classifier"),
            "threshold": 0.75,
            "max_symptoms": 10
        },
        "diagnosis_model": {
            "model_path": str(MODELS_DIR / "diagnosis"),
            "confidence_threshold": 0.85
        }
    }
    
    # Medical API endpoints
    MEDICAL_APIS = {
        "mayo_clinic": os.getenv("MAYO_CLINIC_API"),
        "nih": os.getenv("NIH_API"),
        "who": os.getenv("WHO_API")
    }
    
    @classmethod
    def get_model_config(cls, model_name: str) -> Dict[str, Any]:
        """Get configuration for specific AI model"""
        return cls.MODEL_SETTINGS.get(model_name, {})
    
    @classmethod
    def initialize(cls) -> None:
        """Initialize core components"""
        try:
            # Create necessary directories
            cls.MODELS_DIR.mkdir(parents=True, exist_ok=True)
            
            # Verify environment variables
            required_vars = ["SECRET_KEY", "DATABASE_URL"]
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            
            if missing_vars:
                raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
            
            logger.info("Core initialization completed successfully")
            
        except Exception as e:
            logger.error(f"Core initialization failed: {str(e)}")
            raise

# Initialize core components
core_config = CoreConfig()