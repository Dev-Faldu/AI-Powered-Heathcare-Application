from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import date

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(10))
    phone_number = Column(String(20))
    address = Column(String(200))
    is_active = Column(Boolean, default=True)

    # Relationships
    medical_records = relationship("MedicalRecord", back_populates="patient")
    diagnoses = relationship("Diagnosis", back_populates="patient")

    @property
    def age(self):
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )