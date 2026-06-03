from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ai-detection", tags=["AI Disease Detection"])

class SymptomRequest(BaseModel):
    symptoms: str

class DetectionResponse(BaseModel):
    disease: str
    severity: str
    recommendation: str
    matched_doctor: str

@router.post("/detect", response_model=DetectionResponse)
def detect_disease(req: SymptomRequest, db: Session = Depends(get_db)):
    if not req.symptoms.strip():
        raise HTTPException(status_code=400, detail="Please enter some symptoms")

    symptoms_text = req.symptoms.lower()

    # Rule based logic mapping
    # 1. chest pain -> Cardiac Issue, critical (Cardiologist)
    if "chest pain" in symptoms_text:
        disease_name = "Cardiac Issue"
        severity = "critical"
        recommendation = "Seek emergency medical services (EMS) immediately. Rest and avoid physical strain."
        specialty = "Cardiologist"

    # 2. headache + fever -> Typhoid, moderate (General Practitioner)
    elif "headache" in symptoms_text and "fever" in symptoms_text:
        disease_name = "Typhoid"
        severity = "moderate"
        recommendation = "Consult a doctor for blood cultures. Drink clean boiled water and rest."
        specialty = "General Practitioner"

    # 3. fever + cough -> Influenza, mild (General Practitioner / Pediatrician)
    elif "fever" in symptoms_text and "cough" in symptoms_text:
        disease_name = "Influenza"
        severity = "mild"
        recommendation = "Get adequate sleep and stay hydrated. Over-the-counter flu meds can help."
        specialty = "General Practitioner"

    # 4. fatigue + thirst -> Diabetes, moderate (General Practitioner)
    elif "fatigue" in symptoms_text and "thirst" in symptoms_text:
        disease_name = "Diabetes"
        severity = "moderate"
        recommendation = "Check your fasting blood glucose. Limit carbohydrate and sugar intake."
        specialty = "General Practitioner"

    # 5. rash + itching -> Skin Condition, mild (Dermatologist)
    elif "rash" in symptoms_text or "itching" in symptoms_text:
        disease_name = "Skin Condition"
        severity = "mild"
        recommendation = "Apply a soothing calamine lotion. Keep the area clean and dry."
        specialty = "Dermatologist"

    # 6. stomach pain + vomiting -> Gastritis, moderate (General Practitioner)
    elif ("stomach pain" in symptoms_text or "stomach" in symptoms_text) and "vomiting" in symptoms_text:
        disease_name = "Gastritis"
        severity = "moderate"
        recommendation = "Eat bland meals and avoid spicy, greasy, or acidic foods. Take antacids."
        specialty = "General Practitioner"

    # Default fallback
    else:
        disease_name = "General Viral Syndrome"
        severity = "mild"
        recommendation = "Rest, drink plenty of fluids, and monitor symptoms. Consult a doctor if symptoms persist."
        specialty = "General Practitioner"

    # Query matching doctor from MySQL database
    doc = db.query(models.Doctor).filter(models.Doctor.specialty == specialty, models.Doctor.status == 'available').first()
    if not doc:
        doc = db.query(models.Doctor).filter(models.Doctor.specialty == specialty).first()
    if not doc:
        doc = db.query(models.Doctor).first()

    matched_doctor_name = f"{doc.name} ({doc.specialty})" if doc else "Dr. Sarah Anderson (Cardiologist)"

    # Save to ai_detection_logs table
    db_log = models.AIDetectionLog(
        symptoms=req.symptoms,
        detected_disease=disease_name,
        severity=severity,
        recommendation=recommendation,
        matched_doctor=matched_doctor_name
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return DetectionResponse(
        disease=disease_name,
        severity=severity,
        recommendation=recommendation,
        matched_doctor=matched_doctor_name
    )
