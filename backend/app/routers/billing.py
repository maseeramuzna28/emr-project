from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Billing
from ..schemas import BillingCreate, BillingOut
from typing import List

router = APIRouter(prefix="/billing", tags=["Billing"])

@router.get("/", response_model=List[BillingOut])
def get_billing_records(db: Session = Depends(get_db)):
    return db.query(Billing).all()

@router.post("/", response_model=BillingOut)
def create_billing_record(record: BillingCreate, db: Session = Depends(get_db)):
    db_record = Billing(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.put("/{record_id}", response_model=BillingOut)
def update_billing_record(record_id: int, record: BillingCreate, db: Session = Depends(get_db)):
    db_record = db.query(Billing).filter(Billing.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Billing record not found")
    
    db_record.patientId = record.patientId
    db_record.amount = record.amount
    db_record.status = record.status
    db_record.date = record.date
    db_record.description = record.description
    
    db.commit()
    db.refresh(db_record)
    return db_record

@router.delete("/{record_id}")
def delete_billing_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(Billing).filter(Billing.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Billing record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Billing record deleted"}
