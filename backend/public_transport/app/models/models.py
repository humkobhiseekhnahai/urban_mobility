from pydantic import BaseModel
from typing import List, Tuple

class BusStop(BaseModel):
    name: str
    location: Tuple[float, float]  # (latitude, longitude)
    passenger_count: int  # Estimated number of passengers
    is_interchange: bool = False  # True if it connects multiple routes

class Route(BaseModel):
    route_id: str
    stops: List[BusStop]
    frequency: int  # Buses per hour
    overlaps_with: List[str] = []  # Other routes sharing stops

class TrafficData(BaseModel):
    stop_name: str
    congestion_level: float  # e.g., 0 (low) to 1 (high)

class TransportInput(BaseModel):
    routes: List[Route]
    traffic_data: List[TrafficData]
    max_passenger_load: int  # Maximum capacity per bus

class TransshipmentNode(BaseModel):
    stop: str
    location: Tuple[float, float]
    action: str
