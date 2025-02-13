from fastapi import APIRouter
from app.models.models import TransportInput
from app.optimizer import optimize_transit

router = APIRouter()

@router.post("/optimize-transit")
def optimize(data: TransportInput):
    return optimize_transit(data)
