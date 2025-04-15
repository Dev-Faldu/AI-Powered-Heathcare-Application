from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    symptoms = Column(JSON)  # List of symptoms
    diagnosis = Column(JSON)  # Diagnosis results
    confidence_score = Column(Float)
    risk_level = Column(String(20))
    recommendations = Column(JSON)  # List of recommendations
    notes = Column(String(500))

    # Relationships
    patient = relationship("Patient", back_populates="diagnoses")
    medical_record = relationship("MedicalRecord", back_populates="diagnoses")

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "timestamp": self.timestamp.isoformat(),
            "symptoms": self.symptoms,
            "diagnosis": self.diagnosis,
            "confidence_score": self.confidence_score,
            "risk_level": self.risk_level,
            "recommendations": self.recommendations,
            "notes": self.notes
        }