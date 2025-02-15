from pydantic import BaseModel
from typing import List, Dict

class DeliveryLocation(BaseModel):
    lat: float
    lon: float
    address: str
    priority: str
    load_weight: float

class RealTimeData(BaseModel):
    traffic: str
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
