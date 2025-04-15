from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Medical history
    allergies = Column(JSON, default=list)
    medications = Column(JSON, default=list)
    chronic_conditions = Column(JSON, default=list)
    family_history = Column(JSON, default=list)
    
    # Vital statistics
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    blood_type = Column(String(5))
    
    # Relationships
    patient = relationship("Patient", back_populates="medical_records")
    diagnoses = relationship("Diagnosis", back_populates="medical_record")

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "allergies": self.allergies,
            "medications": self.medications,
            "chronic_conditions": self.chronic_conditions,
            "family_history": self.family_history,
            "height": self.height,
            "weight": self.weight,
            "blood_type": self.blood_type
        }