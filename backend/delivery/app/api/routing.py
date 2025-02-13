import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial.distance import euclidean
from itertools import permutations
from app.models.models import DeliveryRequest

def tsp_solver(locations):
    min_distance = float('inf')
    best_route = []
    
    for perm in permutations(locations):
        total_distance = sum(euclidean(perm[i], perm[i+1]) for i in range(len(perm)-1))
        if total_distance < min_distance:
            min_distance = total_distance
            best_route = perm
            
    return list(best_route)

def optimize_route(request: DeliveryRequest):
    locations = [(loc.lat, loc.lon) for loc in request.delivery_locations]
    num_clusters = min(request.num_vehicles, len(locations))
    
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10).fit(locations)
    clusters = {i: [] for i in range(num_clusters)}
    
    for i, label in enumerate(kmeans.labels_):
        clusters[label].append(locations[i])

    optimized_routes = []
    for cluster in clusters.values():
        optimized_routes.append([{"lat": lat, "lon": lon} for lat, lon in tsp_solver(cluster)])
    
    return optimized_routes
