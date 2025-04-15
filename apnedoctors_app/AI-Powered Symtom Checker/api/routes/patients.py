from fastapi import APIRouter, Depends

router = APIRouter()

@router.get("/profile")
async def get_patient_profile():
    return {"message": "Patient profile endpoint"}