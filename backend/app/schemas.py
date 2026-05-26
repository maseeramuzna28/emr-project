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

class PatientOut(PatientCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class DoctorCreate(BaseModel):
    name: str
    specialty: str
    status: Optional[str] = "available"
    patients_today: Optional[int] = 0

class DoctorOut(DoctorCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    time: str
    type: Optional[str] = "in-person"
    reason: str

class AppointmentOut(AppointmentCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str