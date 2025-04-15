from typing import List, Dict, Any
import re
from datetime import datetime

class InputValidator:
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        pattern = r'^\+?1?\d{9,15}$'
        return bool(re.match(pattern, phone))

    @staticmethod
    def validate_date(date_str: str) -> bool:
        """Validate date format (YYYY-MM-DD)"""
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
            return True
        except ValueError:
            return False

    @staticmethod
    def validate_symptoms(symptoms: List[str]) -> bool:
        """Validate symptom input"""
        return all(isinstance(s, str) and len(s.strip()) > 0 for s in symptoms)

    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitize user input"""
        return re.sub(r'[<>&\'"]+', '', text)