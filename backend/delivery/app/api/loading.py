from app.models.models import DeliveryRequest

def first_fit(weights, capacity):
    bins = []  # List of bins (vehicles)

    for weight in weights:
        placed = False

        # Try placing weight in an existing bin
        for bin in bins:
            if sum(bin) + weight <= capacity:
                bin.append(weight)
                placed = True
                break  # Stop once placed

        # If not placed, create a new bin
        if not placed:
            bins.append([weight])

    return bins

def optimize_loading(request: DeliveryRequest):
    load_weights = sorted([loc.load_weight for loc in request.delivery_locations], reverse=True)  # Sort for better packing
    bins = first_fit(load_weights, request.vehicle_capacity)

    return [{"bin": i + 1, "items": bin} for i, bin in enumerate(bins)]
