import json
import os
from typing import Dict, List, Optional

# Load bus routes from JSON file
def load_routes(filename: str) -> List[Dict]:
    """Loads bus routes from a JSON file."""
    absolute_path = os.path.join(os.path.dirname(__file__), "..", filename)
    absolute_path = os.path.abspath(absolute_path)

    try:
        with open(absolute_path, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"File '{filename}' not found.")
    except json.JSONDecodeError:
        raise ValueError(f"File '{filename}' is not a valid JSON.")

# Create a mapping of bus stops to routes
def build_stop_routes_map(routes: List[Dict]) -> Dict[str, List[str]]:
    """Maps bus stops to the routes they belong to."""
    stop_routes_map = {}
    for route in routes:
        for stop in route.get("map_json_content", []):
            stop_name = stop.get("busstop")
            if stop_name:
                route_no = str(route.get("route_no"))
                stop_routes_map.setdefault(stop_name, []).append(route_no)
    return stop_routes_map

# Find the shortest route with at most 2 transfers
import json
import os
from typing import Dict, List, Optional

# Load bus routes from JSON file
def load_routes(filename: str) -> List[Dict]:
    """Loads bus routes from a JSON file."""
    absolute_path = os.path.join(os.path.dirname(__file__), "..", filename)
    absolute_path = os.path.abspath(absolute_path)

    try:
        with open(absolute_path, "r") as file:
            data = json.load(file)

            # Debugging JSON structure
            print("DEBUG: First route data ->", json.dumps(data[0], indent=2))

            return data
    except FileNotFoundError:
        raise FileNotFoundError(f"File '{filename}' not found.")
    except json.JSONDecodeError:
        raise ValueError(f"File '{filename}' is not a valid JSON.")

# Create a mapping of bus stops to routes
def build_stop_routes_map(routes: List[Dict]) -> Dict[str, List[str]]:
    """Maps bus stops to the routes they belong to."""
    stop_routes_map = {}
    for route in routes:
        for stop in route.get("map_json_content", []):
            stop_name = stop.get("busstop")
            if stop_name:
                route_no = str(route.get("route_no"))
                stop_routes_map.setdefault(stop_name, []).append(route_no)
    return stop_routes_map

# Find the shortest route with at most 2 transfers
def find_optimized_route(route_no: str) -> Optional[Dict]:
    """Finds the shortest or optimal route after transshipment if necessary."""
    global routes, stop_routes_map

    # Ensure the route exists
    available_routes = {str(route["route_no"]) for route in routes}
    if route_no not in available_routes:
        return None

    # Get the original route
    route_data = next((r for r in routes if str(r["route_no"]) == route_no), None)
    if not route_data:
        return None

    original_stops = [
        {
            "busstop": stop["busstop"],
            "lat": stop["latlons"][0] if "latlons" in stop and stop["latlons"] else None,
            "lng": stop["latlons"][1] if "latlons" in stop and stop["latlons"] else None,
        }
        for stop in route_data["map_json_content"]
    ]

    # Identify potential transfer points (stops with multiple routes)
    transfer_points = {
        stop["busstop"]: stop_routes_map[stop["busstop"]]
        for stop in original_stops
        if stop["busstop"] in stop_routes_map and len(stop_routes_map[stop["busstop"]]) > 1
    }

    # If no valid transfer points, return the original route with lat/lng
    if not transfer_points:
        return {"optimized_route": {"route_no": route_no, "stops": original_stops}}

    # Select an **intermediate** transfer point
    total_stops = len(original_stops)
    min_index = int(0.3 * total_stops)  # 30% of the way into the route
    max_index = int(0.7 * total_stops)  # 70% of the way into the route

    valid_transfer_points = [
        stop for stop in transfer_points.keys()
        if min_index <= original_stops.index(next(s for s in original_stops if s["busstop"] == stop)) <= max_index
    ]

    if not valid_transfer_points:
        return {"optimized_route": {"route_no": route_no, "stops": original_stops}}

    # Choose the first valid intermediate transfer point
    transfer_point = valid_transfer_points[0]

    # Find an alternative route passing through the transfer point
    best_transfer_route = next(
        (r for r in transfer_points[transfer_point] if r != route_no), None
    )

    if not best_transfer_route:
        return {"optimized_route": {"route_no": route_no, "stops": original_stops}}

    # Get the second route
    transfer_route_data = next((r for r in routes if str(r["route_no"]) == best_transfer_route), None)
    if not transfer_route_data:
        return {"optimized_route": {"route_no": route_no, "stops": original_stops}}

    transfer_stops = [
        {
            "busstop": stop["busstop"],
            "lat": stop["latlons"][0] if "latlons" in stop and stop["latlons"] else None,
            "lng": stop["latlons"][1] if "latlons" in stop and stop["latlons"] else None,
        }
        for stop in transfer_route_data["map_json_content"]
    ]

    # Split route into two at the selected transfer point
    route_1_stops = original_stops[:original_stops.index(next(s for s in original_stops if s["busstop"] == transfer_point)) + 1]
    route_2_stops = transfer_stops[transfer_stops.index(next(s for s in transfer_stops if s["busstop"] == transfer_point)):] 

    return {
        "optimized_route": {
            "route_1": {
                "route_no": route_no,
                "stops": route_1_stops
            },
            "transfer_point": transfer_point,
            "transfer_route": best_transfer_route,
            "route_2": {
                "route_no": best_transfer_route,
                "stops": route_2_stops
            }
        }
    }

# Load routes and initialize mappings
routes = load_routes("data/busRoutes.json")
stop_routes_map = build_stop_routes_map(routes)
def get_routes_and_mappings():
    """Returns the routes and stop_routes_map."""
    return routes, stop_routes_map