from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Analytics
from ..schemas import AnalyticsOut
from typing import List

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/", response_model=List[AnalyticsOut])
def get_analytics(db: Session = Depends(get_db)):
    return db.query(Analytics).all()
