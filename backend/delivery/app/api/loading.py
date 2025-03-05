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

def optimize_loading(request: DeliveryRequest):
    """Assign loads to vehicles while respecting weight constraints."""
    load_weights = sorted(
        [{"id": i + 1, "lat": loc.lat, "lon": loc.lon, "address": loc.address, "weight": loc.load_weight} 
         for i, loc in enumerate(request.delivery_locations)], 
        key=lambda x: x["weight"], reverse=True  # Sort by heaviest first
    )

    bins = first_fit(load_weights, request.vehicle_capacity)

    return bins  # Returns vehicles with their assigned deliveries
