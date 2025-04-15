from typing import Dict, Any
import uuid
from datetime import datetime
import json

def generate_id() -> str:
    """Generate unique identifier"""
    return str(uuid.uuid4())

def format_response(data: Dict[str, Any], status: str = "success") -> Dict[str, Any]:
    """Format API response"""
    return {
        "status": status,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }

def load_json_file(file_path: str) -> Dict[str, Any]:
    """Safely load JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        return {}

def format_error(message: str, code: int = 400) -> Dict[str, Any]:
    """Format error response"""
    return {
        "status": "error",
        "timestamp": datetime.utcnow().isoformat(),
        "error": {
            "code": code,
            "message": message
        }
    }