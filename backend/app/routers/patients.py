from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()

@router.post("/")
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    new_patient = models.Patient(
        name=patient.name,
        age=patient.age,
        condition=patient.condition,
        status=patient.status,
        lastVisit=patient.lastVisit,
        avatar=patient.avatar
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient:
        db.delete(patient)
        db.commit()
        return {"message": "Patient deleted"}
    return {"message": "Patient not found"}

@router.put("/{patient_id}")
def update_patient(patient_id: int, patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()

    if not db_patient:
        return {"message": "Patient not found"}

    db_patient.name = patient.name
    db_patient.age = patient.age
    db_patient.condition = patient.condition
    db_patient.status = patient.status
    db_patient.lastVisit = patient.lastVisit
    db_patient.avatar = patient.avatar

    db.commit()
    db.refresh(db_patient)

    return db_patient