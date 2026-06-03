from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    class Config:
        from_attributes = True

class PatientCreate(BaseModel):
    name: str
    age: int
    condition: str
    status: Optional[str] = "stable"
    lastVisit: Optional[str] = None
    avatar: Optional[str] = None

class PatientOut(PatientCreate):
    id: int
    class Config:
        from_attributes = True

class DoctorCreate(BaseModel):
    name: str
    specialty: str
    experience: str
    status: Optional[str] = "available"
    patients: Optional[int] = 0
    nextAvailable: Optional[str] = "-"
    avatar: Optional[str] = None

class DoctorOut(DoctorCreate):
    id: int
    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    patientName: str
    time: str
    type: Optional[str] = "in-person"
    reason: Optional[str] = None
    avatar: Optional[str] = None

class AppointmentOut(AppointmentCreate):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class EmergencyOnlineContactCreate(BaseModel):
    name: str
    role: str
    phone: str
    email: str
    whatsapp: str
    online: Optional[int] = 1

class EmergencyOnlineContactOut(EmergencyOnlineContactCreate):
    id: int
    class Config:
        from_attributes = True

class MedicalRecordCreate(BaseModel):
    patientId: int
    diagnosis: str
    prescription: str
    notes: Optional[str] = None
    visitDate: Optional[str] = "Just now"
    doctor: Optional[str] = None

class MedicalRecordOut(MedicalRecordCreate):
    id: int
    class Config:
        from_attributes = True

class BillingCreate(BaseModel):
    patientId: int
    amount: float
    status: Optional[str] = "pending"
    date: Optional[str] = "Today"
    description: Optional[str] = None

class BillingOut(BillingCreate):
    id: int
    class Config:
        from_attributes = True

class AnalyticsCreate(BaseModel):
    month: str
    total_patients: Optional[int] = 0
    appointments: Optional[int] = 0
    critical_cases: Optional[int] = 0
    success_rate: Optional[float] = 0.0

class AnalyticsOut(AnalyticsCreate):
    id: int
    class Config:
        from_attributes = True

class AIDetectionLogCreate(BaseModel):
    symptoms: str
    detected_disease: str
    severity: str
    recommendation: str
    matched_doctor: str

class AIDetectionLogOut(AIDetectionLogCreate):
    id: int
    detectedAt: datetime
    class Config:
        from_attributes = True