from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import diagnosis, patients, telemedicine

# Initialize FastAPI app
app = FastAPI(
    title="AI-Powered Symptom Checker",
    description="Advanced medical symptom analysis and diagnosis system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    diagnosis.router,
    prefix="/api/v1/diagnosis",
    tags=["diagnosis"]
)

app.include_router(
    patients.router,
    prefix="/api/v1/patients",
    tags=["patients"]
)

app.include_router(
    telemedicine.router,
    prefix="/api/v1/telemedicine",
    tags=["telemedicine"]
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "app": "AI-Powered Symptom Checker",
        "version": "1.0.0",
        "status": "running"
    }