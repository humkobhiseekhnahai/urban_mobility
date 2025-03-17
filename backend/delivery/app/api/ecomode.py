import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial.distance import euclidean
from itertools import permutations
from app.models.models import DeliveryRequest

def tsp_solver(locations):
    """Solves the Traveling Salesman Problem (TSP) for a given set of locations."""
    if len(locations) <= 1:
        return locations  # No need to optimize a single location
    
    min_distance = float('inf')
    best_route = []

    for perm in permutations(locations):
        total_distance = sum(euclidean(perm[i][1], perm[i+1][1]) for i in range(len(perm)-1))
        if total_distance < min_distance:
            min_distance = total_distance
            best_route = perm

    return list(best_route)

def eco_friendly_route(request: DeliveryRequest):
    """Optimizes delivery routes with minimal trucks for cost efficiency."""
    locations = [(loc.id, (loc.lat, loc.lon), loc.load_weight) for loc in request.delivery_locations]
    
    total_weight = sum(weight for _, _, weight in locations)
    max_capacity = request.vehicle_capacity

    # ✅ If all deliveries fit in one truck, solve TSP directly
    if total_weight <= max_capacity:
        print(f"[Eco Mode] All deliveries fit in 1 truck. Solving TSP...")
        sorted_route = tsp_solver([(loc_id, coords) for loc_id, coords, _ in locations])
        return [[{"id": loc_id, "lat": coords[0], "lon": coords[1]} for loc_id, coords in sorted_route]]

    # ✅ Otherwise, determine minimum trucks needed
    min_trucks = max(1, int(np.ceil(total_weight / max_capacity)))
    num_clusters = min(min_trucks, len(locations))

    print(f"[Eco Mode] Total Weight: {total_weight}, Max Capacity: {max_capacity}, Min Trucks: {min_trucks}, Clusters: {num_clusters}")

    # ✅ Apply K-Means clustering to distribute locations
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10).fit([coords for _, coords, _ in locations])
    
    clusters = {i: [] for i in range(num_clusters)}
    for i, label in enumerate(kmeans.labels_):
        clusters[label].append((locations[i][0], locations[i][1]))

    optimized_routes = []
    for cluster in clusters.values():
        sorted_route = tsp_solver(cluster)
        optimized_routes.append([{ "id": loc_id, "lat": coords[0], "lon": coords[1]} for loc_id, coords in sorted_route])

    return optimized_routes