import numpy as np
import random
from scipy.spatial.distance import euclidean
from app.models.models import DeliveryRequest
from app.api.routing import tsp_solver

def calculate_distance(route):
    """Calculate total route distance."""
    if len(route) < 2:
        return 0
    return sum(euclidean((route[i][0], route[i][1]), (route[i + 1][0], route[i + 1][1])) for i in range(len(route) - 1))

def create_initial_population(locations, num_vehicles, population_size=50):
    """Generate initial random population while distributing locations across vehicles."""
    random.shuffle(locations)
    split_routes = np.array_split(locations, num_vehicles)

    population = []
    for _ in range(population_size):
        individual = [list(route) for route in split_routes]  # Random vehicle assignments
        population.append(individual)
    
    return population

def crossover(parent1, parent2):
    """Improved crossover function for VRP."""
    num_vehicles = len(parent1)
    child = [[] for _ in range(num_vehicles)]

    for i in range(num_vehicles):
        if random.random() < 0.5:
            child[i] = parent1[i]
        else:
            child[i] = parent2[i]

    return child

def mutate(routes, mutation_rate=0.1):
    """Mutate by swapping two locations within a vehicle's route."""
    for route in routes:
        if len(route) > 1 and random.random() < mutation_rate:
            idx1, idx2 = random.sample(range(len(route)), 2)
            route[idx1], route[idx2] = route[idx2], route[idx1]
    return routes

def fitness_function(population):
    """Evaluate the fitness of each solution (minimize distance and balance load)."""
    fitness_scores = []
    for individual in population:
        route_distances = [calculate_distance(route) for route in individual]
        total_distance = sum(route_distances)
        std_dev = np.std(route_distances)  # Ensure balanced routes
        fitness_scores.append((total_distance + std_dev, individual))
    
    return sorted(fitness_scores, key=lambda x: x[0])

def genetic_algorithm(request: DeliveryRequest, generations=200, population_size=50):
    """Optimize delivery routes using Genetic Algorithm for VRP."""
    locations = [(loc.lat, loc.lon) for loc in request.delivery_locations]

    # ✅ If only one vehicle, directly solve TSP instead of GA
    if request.num_vehicles == 1:
        tsp_solution = tsp_solver([(i, (loc[0], loc[1])) for i, loc in enumerate(locations)])
        
        return [[{"id": request.delivery_locations[i].id, "lat": coord[0], "lon": coord[1]} for i, coord in tsp_solution]]

    # ✅ Edge Case: If more vehicles than locations
    num_vehicles = request.num_vehicles
    if len(locations) < num_vehicles:
        return [[{"id": loc.id, "lat": loc.lat, "lon": loc.lon}] for loc in request.delivery_locations]

    population = create_initial_population(locations, num_vehicles, population_size)
    
    for _ in range(generations):
        ranked_population = fitness_function(population)
        next_gen = [solution[1] for solution in ranked_population[:10]]  # Keep best solutions
        
        for _ in range(population_size - 10):
            parent1, parent2 = random.sample(next_gen, 2)
            child = crossover(parent1, parent2)
            child = mutate(child)
            next_gen.append(child)

        population = next_gen

    best_solution = population[0]

    # ✅ Fix: Ensure result format is correct
    optimized_routes = []
    for vehicle_route in best_solution:
        optimized_routes.append([{"id": request.delivery_locations[i].id, "lat": loc[0], "lon": loc[1]} for i, loc in enumerate(vehicle_route)])

    return optimized_routes
