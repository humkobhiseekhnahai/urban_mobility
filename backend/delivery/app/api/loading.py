from app.models.models import DeliveryRequest

def first_fit(weights, capacity):
    """Bin packing using First Fit Decreasing (FFD)."""
    bins = []  # Each bin represents a vehicle

    for weight in weights:
        placed = False

        # Try placing in an existing bin (vehicle)
        for bin in bins:
            if sum(item["weight"] for item in bin["items"]) + weight["weight"] <= capacity:
                bin["items"].append(weight)
                placed = True
                break  # Stop once placed

        # If not placed, create a new bin (new vehicle)
        if not placed:
            bins.append({"bin_id": len(bins) + 1, "items": [weight]})

    return bins

def optimize_loading(request: DeliveryRequest, optimized_routes):
    """Assign loads to vehicles while respecting weight constraints and route clustering."""

    # Map each location to its respective route
    route_bins = []
    
    for route_idx, route in enumerate(optimized_routes):
        vehicle_load = []
        
        for loc in route:
            matching_location = next(
                (l for l in request.delivery_locations if l.lat == loc["lat"] and l.lon == loc["lon"]), None
            )
            
            if matching_location:
                vehicle_load.append({
                    "id": matching_location.id,
                    "lat": matching_location.lat,
                    "lon": matching_location.lon,
                    "address": matching_location.address,
                    "weight": matching_location.load_weight
                })
        
        if vehicle_load:
            route_bins.append({"bin_id": route_idx + 1, "items": vehicle_load})
    
    return route_bins
