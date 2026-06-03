from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, patients, doctors, appointments, ai_detection, emergency, medical_records, billing, analytics
from app.routers import doctors


Base.metadata.create_all(bind=engine)

app = FastAPI(title="EMR System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(ai_detection.router)
app.include_router(emergency.router)
app.include_router(medical_records.router)
app.include_router(billing.router)
app.include_router(analytics.router)
app.include_router(doctors.router)

@app.get("/")
def root():
    return {"message": "EMR System API is running!"}