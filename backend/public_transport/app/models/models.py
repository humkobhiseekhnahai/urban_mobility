from typing import List, Optional
from pydantic import BaseModel, validator
import re
import json
from app.api.optimizer import load_routes

try:
    routes_data = load_routes("data/busRoutes.json")
except FileNotFoundError:
    raise SystemExit("busRoutes.json not found. Application exiting.")
except json.JSONDecodeError:
    raise SystemExit("busRoutes.json is malformed. Application exiting.")

class TransitRequest(BaseModel):
    route_no: str
    departure_time: str

    @validator("departure_time")
    def validate_departure_time(cls, value):
        if not re.match(r"^\d{2}:\d{2}$", value):
            raise ValueError("Invalid departure time format. Use HH:MM")
        return value

    @validator("route_no")
    def validate_route_no(cls, value):
        valid_routes = {str(route["route_no"]) for route in routes_data}
        if value not in valid_routes:
            raise ValueError(f"Route number '{value}' not found in available routes: {valid_routes}")
        return value
class CreateCustomRouteRequest(BaseModel):
    start: str
    stop: str
    intermediate_points: List[str]  # Rename from `intermediate` to `intermediate_points`
    departure_time: str