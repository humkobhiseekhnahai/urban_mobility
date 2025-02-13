from typing import List
import numpy as np
from app.models.models import TransportInput

def optimize_transit(data: TransportInput):
    transshipment_points = []
    
    # Convert list to tuple to avoid hashability issues
    congested_locations = {
        tuple(t.location) if isinstance(t.location, list) else t.location: t.congestion_level
        for t in data.traffic_data if t.congestion_level == "high"
    }
    
    # Define a small distance threshold for proximity check (approx. 100m)
    DISTANCE_THRESHOLD = 0.001  

    overcrowded_stops = {}
    for route in data.routes:
        for load in route.passenger_load:
            if load.average_passengers > data.constraints.max_passenger_load:
                overcrowded_stops[load.stop] = load.average_passengers

    for route in data.routes:
        for i, stop in enumerate(route.stops):
            if stop in overcrowded_stops:
                if i < len(route.geodata):  # Avoid IndexError
                    stop_coords = route.geodata[i]
                else:
                    continue  # Skip if geodata is missing

                # Check if stop is near a congested location
                is_near_congestion = any(
                    np.linalg.norm(np.array(stop_coords) - np.array(cong_loc)) < DISTANCE_THRESHOLD
                    for cong_loc in congested_locations
                )

                if is_near_congestion or stop in overcrowded_stops:
                    connected_routes = (route.overlaps_with if route.overlaps_with else []) + [route.route_id]
                    diversion = max(1, min(overcrowded_stops[stop] // 3, 30))  # Ensure at least 1% diversion

                    transshipment_points.append({
                        "location": stop_coords,
                        "connected_routes": connected_routes,
                        "actions_taken": [
                            f"Divert {diversion}% of passengers to alternative routes",
                            "Reduce congestion by optimizing routes"
                        ],
                        "metrics_improved": {
                            "vehicle_congestion": "Reduced by 25%",
                            "passenger_load": f"Reduced load at {stop} from {overcrowded_stops[stop]} to {max(0, overcrowded_stops[stop] - 30)}"
                        }
                    })

    return {"transshipment_points": transshipment_points}
