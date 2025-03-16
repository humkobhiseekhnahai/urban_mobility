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
def find_optimized_route(route_no: str) -> Optional[Dict]:
    """Finds the shortest or optimal route after transshipment."""
    global routes, stop_routes_map

    # Ensure the route exists
    available_routes = {str(route["route_no"]) for route in routes}
    if route_no not in available_routes:
        return None

    # Get the original route
    route_data = next((r for r in routes if str(r["route_no"]) == route_no), None)
    if not route_data:
        return None

    original_stops = [stop["busstop"] for stop in route_data["map_json_content"]]

    # Find common transfer points
    transfer_points = {}
    for stop in original_stops:
        if stop in stop_routes_map and len(stop_routes_map[stop]) > 1:
            transfer_points[stop] = stop_routes_map[stop]

    # Find the best transfer route
    best_transfer = None
    for stop, routes_list in transfer_points.items():
        for transfer_route in routes_list:
            if transfer_route != route_no:
                best_transfer = transfer_route
                break
        if best_transfer:
            break

    # Get the second route
    if not best_transfer:
        return {"optimized_route": "No transfer route found"}

    transfer_route_data = next((r for r in routes if str(r["route_no"]) == best_transfer), None)
    if not transfer_route_data:
        return {"optimized_route": "Transfer route not found"}

    transfer_stops = [stop["busstop"] for stop in transfer_route_data["map_json_content"]]

    # Merge the routes at the transfer point
    transfer_point = next((stop for stop in original_stops if stop in transfer_stops), None)

    if not transfer_point:
        return {"optimized_route": "No valid transfer point found"}

    # Split original and transfer route at the transfer point
    route_1_stops = original_stops[:original_stops.index(transfer_point) + 1]
    route_2_stops = transfer_stops[transfer_stops.index(transfer_point):]

    return {
        "optimized_route": {
            "route_1": {
                "route_no": route_no,  # Return the input route number here
                "stops": route_1_stops
            },
            "transfer_point": transfer_point,
            "transfer_route": best_transfer,
            "route_2": route_2_stops
        }
    }

# Load routes and initialize mappings
routes = load_routes("data/busRoutes.json")
stop_routes_map = build_stop_routes_map(routes)
def get_routes_and_mappings():
    """Returns the routes and stop_routes_map."""
    return routes, stop_routes_map