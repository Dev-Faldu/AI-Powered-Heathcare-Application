from fastapi import APIRouter
from .diagnosis import router as diagnosis_router
from .patients import router as patients_router
from .telemedicine import router as telemedicine_router
from .auth import router as auth_router

# Create main router
main_router = APIRouter()

# Include all route modules
main_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["authentication"]
)

main_router.include_router(
    diagnosis_router,
    prefix="/diagnosis",
    tags=["diagnosis"]
)

main_router.include_router(
    patients_router,
    prefix="/patients",
    tags=["patients"]
)

main_router.include_router(
    telemedicine_router,
    prefix="/telemedicine",
    tags=["telemedicine"]
)

# Export the main router
__all__ = ["main_router"]