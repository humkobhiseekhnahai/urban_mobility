import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial.distance import euclidean
from itertools import permutations
from app.models.models import DeliveryRequest, DeliveryLocation

def tsp_solver(locations):
    min_distance = float('inf')
    best_route = []

    for perm in permutations(locations):
        total_distance = sum(euclidean(perm[i][1], perm[i+1][1]) for i in range(len(perm)-1))
        if total_distance < min_distance:
            min_distance = total_distance
            best_route = perm

    return list(best_route)

def optimize_route(request: DeliveryRequest):
    locations = [(loc.id, (loc.lat, loc.lon)) for loc in request.delivery_locations]  # Store IDs with coordinates
    num_clusters = min(request.num_vehicles, len(locations))

    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10).fit([coords for _, coords in locations])
    clusters = {i: [] for i in range(num_clusters)}

    for i, label in enumerate(kmeans.labels_):
        clusters[label].append(locations[i])  # Store (ID, (lat, lon)) in clusters

    optimized_routes = []
    for cluster in clusters.values():
        sorted_route = tsp_solver(cluster)
        optimized_routes.append([{"id": loc_id, "lat": coords[0], "lon": coords[1]} for loc_id, coords in sorted_route])

    return optimized_routes
