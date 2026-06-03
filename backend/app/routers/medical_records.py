from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import MedicalRecord
from ..schemas import MedicalRecordCreate, MedicalRecordOut
from typing import List

router = APIRouter(prefix="/medical-records", tags=["Medical Records"])

@router.get("/", response_model=List[MedicalRecordOut])
def get_medical_records(db: Session = Depends(get_db)):
    return db.query(MedicalRecord).all()

@router.post("/", response_model=MedicalRecordOut)
def create_medical_record(record: MedicalRecordCreate, db: Session = Depends(get_db)):
    db_record = MedicalRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.put("/{record_id}", response_model=MedicalRecordOut)
def update_medical_record(record_id: int, record: MedicalRecordCreate, db: Session = Depends(get_db)):
    db_record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    db_record.patientId = record.patientId
    db_record.diagnosis = record.diagnosis
    db_record.prescription = record.prescription
    db_record.notes = record.notes
    db_record.visitDate = record.visitDate
    db_record.doctor = record.doctor
    
    db.commit()
    db.refresh(db_record)
    return db_record

@router.delete("/{record_id}")
def delete_medical_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Medical record deleted"}
