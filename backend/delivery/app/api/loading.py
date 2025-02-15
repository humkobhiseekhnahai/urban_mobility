from app.models.models import DeliveryRequest

def first_fit(weights, capacity):
    bins = []  # List of bins (vehicles)

    for weight in weights:
        placed = False

        # Try placing weight in an existing bin
        for bin in bins:
            if sum(item["weight"] for item in bin["items"]) + weight["weight"] <= capacity:
                bin["items"].append(weight)
                placed = True
                break  # Stop once placed

        # If not placed, create a new bin
        if not placed:
            bins.append({"bin_id": len(bins) + 1, "items": [weight]})

    return bins

def optimize_loading(request: DeliveryRequest):
    # Assign numerical IDs to each load
    load_weights = sorted(
        [{"id": i + 1, "lat": loc.lat, "lon": loc.lon, "address": loc.address, "weight": loc.load_weight} 
         for i, loc in enumerate(request.delivery_locations)], 
        key=lambda x: x["weight"], reverse=True
    )

    bins = first_fit(load_weights, request.vehicle_capacity)

    return bins
