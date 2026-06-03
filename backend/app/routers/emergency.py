from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import EmergencyOnlineContact
from ..schemas import EmergencyOnlineContactOut
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/emergency", tags=["Emergency Contacts"])

class AlertRequest(BaseModel):
    senderName: str
    phone: str
    message: str
    isCritical: bool = True

@router.get("/contacts", response_model=List[EmergencyOnlineContactOut])
def get_emergency_contacts(db: Session = Depends(get_db)):
    return db.query(EmergencyOnlineContact).all()

@router.post("/alerts")
def send_emergency_alert(req: AlertRequest):
    if not req.senderName or not req.phone or not req.message:
        raise HTTPException(status_code=400, detail="Missing required alert details")
    
    # In a real system, this would send an SMS or dispatch notification.
    # We will log it and return success.
    print(f"🚨 EMERGENCY ALERT RECEIVED from {req.senderName} ({req.phone}): {req.message} [Critical: {req.isCritical}]")
    
    return {
        "status": "success",
        "message": "Emergency alert dispatched! Medical responders have been notified."
    }
