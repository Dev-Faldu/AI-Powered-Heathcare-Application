import aiohttp
from core.config import get_settings
from typing import Dict, Any
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

class MedicalAPIService:
    def __init__(self):
        self.mayo_clinic_api = settings.MAYO_CLINIC_API
        self.nih_api = settings.NIH_API
        self.who_api = settings.WHO_API

    async def get_condition_info(self, condition: str) -> Dict[str, Any]:
        """Get detailed information about a medical condition"""
        try:
            async with aiohttp.ClientSession() as session:
                # Try Mayo Clinic API first
                async with session.get(
                    f"{self.mayo_clinic_api}/conditions/{condition}"
                ) as response:
                    if response.status == 200:
                        return await response.json()
                        
                # Fallback to NIH API
                async with session.get(
                    f"{self.nih_api}/conditions/{condition}"
                ) as response:
                    if response.status == 200:
                        return await response.json()
                        
            return {}  # Return empty if no data found
            
        except Exception as e:
            logger.error(f"Medical API request failed: {str(e)}")
            return {}