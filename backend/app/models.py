from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)
    role = Column(String(50), default="admin")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    condition = Column(String(100), nullable=False)
    status = Column(String(50), default="stable")
    lastVisit = Column(String(50))
    avatar = Column(String(10))

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    experience = Column(String(20), nullable=False)
    status = Column(String(50), default="available")
    patients = Column(Integer, default=0)
    nextAvailable = Column(String(50), default="-")
    avatar = Column(String(10))

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patientName = Column(String(100), nullable=False)
    time = Column(String(20), nullable=False)
    type = Column(String(50), default="in-person")
    reason = Column(String(200))
    avatar = Column(String(10))

class EmergencyOnlineContact(Base):
    __tablename__ = "emergency_online_contacts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)
    whatsapp = Column(String(20), nullable=False)
    online = Column(Integer, default=1)

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    patientId = Column(Integer, nullable=False)
    diagnosis = Column(String(200))
    prescription = Column(String(200))
    notes = Column(String(500))
    visitDate = Column(String(50))
    doctor = Column(String(100))

class Billing(Base):
    __tablename__ = "billing"
    id = Column(Integer, primary_key=True, index=True)
    patientId = Column(Integer, nullable=False)
    amount = Column(Numeric(10, 2))
    status = Column(String(50), default="pending")
    date = Column(String(50))
    description = Column(String(200))

class Analytics(Base):
    __tablename__ = "analytics"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(20))
    total_patients = Column(Integer, default=0)
    appointments = Column(Integer, default=0)
    critical_cases = Column(Integer, default=0)
    success_rate = Column(Numeric(5, 2), default=0.00)

class AIDetectionLog(Base):
    __tablename__ = "ai_detection_logs"
    id = Column(Integer, primary_key=True, index=True)
    symptoms = Column(String(1000), nullable=False)
    detected_disease = Column(String(200))
    severity = Column(String(50))
    recommendation = Column(String(1000))
    matched_doctor = Column(String(100))
    detectedAt = Column(DateTime, default=datetime.utcnow)