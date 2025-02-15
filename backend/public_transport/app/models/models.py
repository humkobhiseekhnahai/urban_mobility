from pydantic import BaseModel
from typing import List, Tuple

class PassengerLoad(BaseModel):
    stop: str
    average_passengers: int

class Route(BaseModel):
    route_id: str
    stops: List[str]
    passenger_load: List[PassengerLoad]
    overlaps_with: List[str]
    geodata: List[Tuple[float, float]]  # Latitude, Longitude

class TrafficData(BaseModel):
    road: str
    congestion_level: str
    location: Tuple[float, float]

class Constraints(BaseModel):
    max_vehicle_congestion: str  # Example: "30%"
    max_passenger_load: int

class TransportInput(BaseModel):
    routes: List[Route]
    traffic_data: List[TrafficData]
    constraints: Constraints
