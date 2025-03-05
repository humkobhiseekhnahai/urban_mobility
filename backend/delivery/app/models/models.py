from pydantic import BaseModel, Field
from typing import List, Dict
import uuid

class DeliveryLocation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))  # Auto-generate unique ID
    lat: float
    lon: float
    address: str
    priority: str
    load_weight: float

class RealTimeData(BaseModel):
    traffic: Dict[str, str]  # Change from `str` to `Dict[str, str]`
    road_closures: List[str]

class DeliveryRequest(BaseModel):
    starting_point: str
    delivery_locations: List[DeliveryLocation]
    num_vehicles: int
    vehicle_capacity: float
    real_time_data: RealTimeData

class DeliveryResponse(BaseModel):
    optimized_routes: List[List[Dict]]
    loading_plan: List[Dict]
